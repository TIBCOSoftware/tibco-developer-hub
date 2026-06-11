/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { parse as parseYaml } from 'yaml';

export interface RouterOptions {
  config: Config;
  logger: LoggerService;
}

/**
 * Resolves cpLink.
 * Priority:
 *   1. process env variable
 *   2. static `cpLink` from Backstage config - Local dev fallback
 */
export function getCpDomain(config: Config): string | undefined {
  const cpDomain = process.env.CP_DOMAIN;
  if (cpDomain) {
    return cpDomain;
  }
  return config.getOptionalString('cpLink');
}

/**
 * Ensure cpLink is properly formatted
 */
const constructCpUrl = (link: string): string => {
  let outCpLink = link;
  const pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(outCpLink)) {
    if (outCpLink.startsWith('/')) {
      outCpLink = outCpLink.slice(1);
    }
    outCpLink = `http://${outCpLink}`;
  }
  return outCpLink;
};

/**
 * Resolves authentication token for a platform API request.
 * Priority:
 *   1. `cp-token` cookie
 *   2. static `TIBCOPlatformToken` from Backstage config - Local dev fallback
 *
 */
function resolveToken(
  req: express.Request,
  config: Config,
): string | undefined {
  const cookieToken = req.cookies?.['cp-token'] as string | undefined;
  if (cookieToken) {
    return cookieToken;
  }

  return config.getOptionalString('TIBCOPlatformToken');
}

interface DeploymentMetadata {
  fqdn: string;
  pathPrefix?: string;
}

/**
 * Extracts deployment metadata from a capability instance's concrete_recipe.
 *
 * Resolved fields:
 *  - **fqdn** — hostname for the dataplane
 *    1. `global.cp.resources.ingress.fqdn` from helmChartsCommon values
 *    2. `global.cp.resources.gatewayapi.gatewayHostOrDomainName` (fallback)
 *  - **pathPrefix** (optional) — deployment path from
 *    `global.cp.capability.pathPrefix` in helmChartsCommon values.
 *    When present the caller should prefer it over manually constructing
 *    the path from capability type and dataplane ID.
 *
 * Returns `undefined` when no FQDN can be determined.
 */
function extractDeploymentMetadata(
  recipe:
    | {
        helmChartsCommon?: {
          values?: Array<{ content: string }>;
        };
      }
    | undefined,
  logger: LoggerService,
  capabilityInstanceId: string,
): DeploymentMetadata | undefined {
  const valuesContent = recipe?.helmChartsCommon?.values?.[0]?.content;
  if (!valuesContent) {
    logger.warn(
      `[platform-api] No helmChartsCommon values found for cap=${capabilityInstanceId}`,
    );
    return undefined;
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = parseYaml(valuesContent) as Record<string, unknown>;
  } catch (parseErr) {
    logger.error(
      `[platform-api] Failed to parse helmChartsCommon YAML for cap=${capabilityInstanceId}`,
      parseErr as Error,
    );
    return undefined;
  }

  // Navigate to global.cp
  const cp = (
    parsed as {
      global?: {
        cp?: {
          capability?: {
            pathPrefix?: string;
          };
          resources?: {
            ingress?: {
              fqdn?: string;
              ingressClassName?: string;
              ingressController?: string;
            };
            gatewayapi?: {
              gatewayAPIControllerName?: string;
              gatewayName?: string;
              gatewayNamespace?: string;
              gatewayHostOrDomainName?: string;
              gatewaySectionName?: string;
            };
          };
        };
      };
    }
  )?.global?.cp;

  const resources = cp?.resources;
  const pathPrefix = cp?.capability?.pathPrefix;

  // Resolve FQDN
  let fqdn: string | undefined;

  // 1. Prefer explicit ingress fqdn
  if (resources?.ingress?.fqdn) {
    logger.info(
      `[platform-api] Resolved FQDN from ingress metadata: ${resources.ingress.fqdn}`,
    );
    fqdn = resources.ingress.fqdn;
  }

  // 2. Fallback: GATEWAYAPI resource – use gatewayHostOrDomainName
  if (!fqdn && resources?.gatewayapi?.gatewayHostOrDomainName) {
    logger.info(
      `[platform-api] Resolved FQDN from gatewayapi metadata: ${resources.gatewayapi.gatewayHostOrDomainName}`,
    );
    fqdn = resources.gatewayapi.gatewayHostOrDomainName;
  }

  if (!fqdn) {
    logger.warn(
      `[platform-api] helmChartsCommon for cap=${capabilityInstanceId} contains neither ingress fqdn nor gatewayapi gatewayHostOrDomainName`,
    );
    return undefined;
  }

  if (pathPrefix) {
    logger.info(
      `[platform-api] Resolved pathPrefix from helmChartsCommon: ${pathPrefix}`,
    );
  }

  return { fqdn, pathPrefix };
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger } = options;
  const router = Router();

  let cpLink = getCpDomain(config);

  if (!cpLink) {
    logger.warn(
      '[platform-api] "cpLink" is not configured — platform API calls will fail until it is set.',
    );
  } else {
    cpLink = constructCpUrl(cpLink);
    logger.info(`[platform-api] Using cpLink: ${cpLink}`);
  }

  /**
   * GET /platform/v1/data-planes
   * Fetches all available data-planes from the TIBCO Platform.
   * Accessible at: /api/scaffolder/platform/v1/data-planes
   * Returns dataplane list
   */
  router.get('/platform/v1/data-planes', async (req, res) => {
    if (!cpLink) {
      res.status(503).json({
        error: 'Service Unavailable',
        message:
          '"cpLink" is not configured. Set it in app-config to enable platform API calls.',
      });
      return;
    }

    const token = resolveToken(req, config);
    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message:
          'No authentication token available. Provide a TIBCOPlatformToken in config (local dev) or authenticate via the cpToken (production).',
      });
      return;
    }

    const platformUrl = `${cpLink.replace(/\/$/, '')}/cp/api/v1/data-planes`;

    logger.info(`[platform-api] Fetching data-planes from ${platformUrl}`);

    try {
      const platformResponse = await fetch(platformUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      });

      if (!platformResponse.ok) {
        const errorBody = await platformResponse.text();
        logger.error(
          `[platform-api] Platform API returned ${platformResponse.status}: ${errorBody}`,
        );
        res
          .status(platformResponse.status ? platformResponse.status : 500)
          .json({
            error: 'Internal Server Error',
            message: `Platform API returned ${platformResponse.status} ${platformResponse.statusText}`,
            statusCode: platformResponse.status,
          });
        return;
      }

      const data = await platformResponse.json();
      res.json(data);
    } catch (err) {
      logger.error('[platform-api] Failed to reach platform API', err as Error);
      res.status(500).json({
        error: 'Internal Server Error',
        message:
          'Unable to reach the TIBCO Platform API. Check cpLink configuration and network connectivity.',
      });
    }
  });

  /**
   * GET /platform/v1/data-planes-with-capabilities?requiredCapabilities=FLOGO,BWCE
   *
   * Combined endpoint that fetches all data-planes, their capabilities and
   * running status, filters by required capabilities with `capabilityStatus: "green"`,
   * and pre-resolves deployment URLs for the primary capability.
   *
   * The primary capability for deployment URL resolution is the first
   * PLATFORM-type capability in the requiredCapabilities list. If none are
   * PLATFORM type, the first capability in the list is used.
   */
  router.get('/platform/v1/data-planes-with-capabilities', async (req, res) => {
    if (!cpLink) {
      res.status(503).json({
        error: 'Service Unavailable',
        message:
          '"cpLink" is not configured. Set it in app-config to enable platform API calls.',
      });
      return;
    }

    const token = resolveToken(req, config);
    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token available.',
      });
      return;
    }

    const requiredParam = req.query.requiredCapabilities as string | undefined;
    if (!requiredParam) {
      res.status(400).json({
        error: 'Bad Request',
        message:
          '"requiredCapabilities" query parameter is required (comma-separated capability names).',
      });
      return;
    }

    const requiredCapabilities = requiredParam
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(Boolean);

    if (requiredCapabilities.length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: '"requiredCapabilities" must contain at least one value.',
      });
      return;
    }

    const cpBase = cpLink.replace(/\/$/, '');
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    };

    logger.info(
      `[platform-api] Fetching data-planes with capabilities: ${requiredCapabilities.join(
        ', ',
      )}`,
    );

    try {
      // 1. Fetch all data-planes
      const dpListRes = await fetch(`${cpBase}/cp/api/v1/data-planes`, {
        method: 'GET',
        headers: authHeaders,
      });

      if (!dpListRes.ok) {
        const errorBody = await dpListRes.text();
        logger.error(
          `[platform-api] Data-planes list API returned ${dpListRes.status}: ${errorBody}`,
        );
        res.status(dpListRes.status || 500).json({
          error: 'Internal Server Error',
          message: `Platform API returned ${dpListRes.status} ${dpListRes.statusText}`,
        });
        return;
      }

      const dpListData = (await dpListRes.json()) as {
        response?: Array<{ id: string; name: string }>;
      };
      const allDataplanes = dpListData?.response ?? [];

      if (allDataplanes.length === 0) {
        res.json({ dataplanes: [] });
        return;
      }

      // 2. For each dataplane, fetch detail + status in parallel
      const results = await Promise.allSettled(
        allDataplanes.map(async dp => {
          const [detailRes, statusRes] = await Promise.all([
            fetch(
              `${cpBase}/cp/api/v1/data-planes/${encodeURIComponent(dp.id)}`,
              { method: 'GET', headers: authHeaders },
            ),
            fetch(
              `${cpBase}/cp/api/v1/data-planes/${encodeURIComponent(
                dp.id,
              )}/capabilities-instances/status`,
              { method: 'GET', headers: authHeaders },
            ),
          ]);

          if (!detailRes.ok || !statusRes.ok) {
            throw new Error(
              `Failed to fetch detail/status for dp=${dp.id}: detail=${detailRes.status} status=${statusRes.status}`,
            );
          }

          const detailData = (await detailRes.json()) as {
            response?: {
              capabilities?: Array<{
                id: string;
                name: string;
                type: string;
              }>;
            };
          };

          const statusData = (await statusRes.json()) as {
            response?: Array<{
              capability: string;
              type: string;
              capabilityStatus: string;
            }>;
          };

          return { dp, detailData, statusData };
        }),
      );

      // 3. Filter & enrich
      const matchingDataplanes: Array<{
        id: string;
        name: string;
        capabilities: Array<{
          id: string;
          name: string;
          type: string;
          capabilityStatus: string;
        }>;
        deployment: {
          capabilityId: string;
          capabilityName: string;
          capabilityType: string;
          dataplaneUrl: string;
          dataplaneHost: string;
        };
      }> = [];

      for (const result of results) {
        if (result.status === 'rejected') {
          logger.warn(
            `[platform-api] Skipping dataplane due to error: ${result.reason}`,
          );
          continue;
        }

        const { dp, detailData, statusData } = result.value;
        const capabilities = detailData?.response?.capabilities ?? [];
        const statuses = statusData?.response ?? [];

        // Build a map of capability name → status info
        const statusMap = new Map<
          string,
          { capabilityStatus: string; type: string }
        >();
        for (const s of statuses) {
          statusMap.set(s.capability.toUpperCase(), {
            capabilityStatus: s.capabilityStatus,
            type: s.type,
          });
        }

        // Check all required capabilities are present and green
        const allGreen = requiredCapabilities.every(reqCap => {
          const statusEntry = statusMap.get(reqCap);
          return statusEntry && statusEntry.capabilityStatus === 'green';
        });

        if (!allGreen) continue;

        // Enrich capabilities with status
        const enrichedCaps = capabilities
          .filter(cap => requiredCapabilities.includes(cap.type.toUpperCase()))
          .map(cap => ({
            id: cap.id,
            name: cap.name,
            type: cap.type,
            capabilityStatus:
              statusMap.get(cap.type.toUpperCase())?.capabilityStatus ??
              'unknown',
          }));

        // Determine primary capability for deployment URL resolution
        // First match in requiredCapabilities order; fallback to first enriched cap
        let primaryCap: (typeof enrichedCaps)[number] | undefined;
        for (const reqName of requiredCapabilities) {
          primaryCap = enrichedCaps.find(c => c.type.toUpperCase() === reqName);
          if (primaryCap) break;
        }
        if (!primaryCap && enrichedCaps.length > 0) {
          primaryCap = enrichedCaps[0];
        }

        // Resolve deployment URL for the primary capability
        let dataplaneUrl = '';
        let dataplaneHost = '';

        if (primaryCap) {
          try {
            const capInstanceUrl = `${cpBase}/tp-cp-ws/v1/data-planes/${encodeURIComponent(
              dp.id,
            )}/capability-instances/${encodeURIComponent(primaryCap.id)}`;

            const capInstanceRes = await fetch(capInstanceUrl, {
              method: 'GET',
              headers: authHeaders,
            });

            if (capInstanceRes.ok) {
              const capInstanceData = (await capInstanceRes.json()) as {
                data?: Array<{
                  concrete_recipe?: {
                    helmChartsCommon?: {
                      values?: Array<{ content: string }>;
                    };
                  };
                }>;
              };

              const instanceEntry = capInstanceData?.data?.[0];
              if (instanceEntry) {
                const metadata = extractDeploymentMetadata(
                  instanceEntry.concrete_recipe,
                  logger,
                  primaryCap.id,
                );
                if (metadata) {
                  dataplaneHost = metadata.fqdn;
                  if (metadata.pathPrefix) {
                    // Use the authoritative pathPrefix from helm chart values
                    const normalizedPrefix = metadata.pathPrefix.replace(
                      /\/+$/,
                      '',
                    );
                    dataplaneUrl = `https://${metadata.fqdn}${normalizedPrefix}/`;
                  } else {
                    // Fallback: construct from capability type and dataplane ID
                    logger.info(
                      `[platform-api] pathPrefix not found for cap=${primaryCap.id}, falling back to manual URL construction`,
                    );
                    const capabilityType = primaryCap.type.toLowerCase();
                    dataplaneUrl = `https://${
                      metadata.fqdn
                    }/tibco/${capabilityType}/${encodeURIComponent(dp.id)}/`;
                  }
                }
              }
            } else {
              logger.warn(
                `[platform-api] Could not resolve deployment URL for dp=${dp.id} cap=${primaryCap.id}: ${capInstanceRes.status}`,
              );
            }
          } catch (resolveErr) {
            logger.warn(
              `[platform-api] Deployment URL resolution failed for dp=${dp.id}: ${resolveErr}`,
            );
          }
        }

        matchingDataplanes.push({
          id: dp.id,
          name: dp.name,
          capabilities: enrichedCaps,
          deployment: {
            capabilityId: primaryCap?.id ?? '',
            capabilityName: primaryCap?.name ?? '',
            capabilityType: primaryCap?.type ?? '',
            dataplaneUrl,
            dataplaneHost,
          },
        });
      }

      logger.info(
        `[platform-api] Found ${matchingDataplanes.length} dataplane(s) matching required capabilities`,
      );

      res.json({ dataplanes: matchingDataplanes });
    } catch (err) {
      logger.error(
        '[platform-api] Failed to fetch data-planes with capabilities',
        err as Error,
      );
      res.status(500).json({
        error: 'Internal Server Error',
        message:
          'Unable to reach the TIBCO Platform API. Check cpLink configuration and network connectivity.',
      });
    }
  });

  return router;
}
