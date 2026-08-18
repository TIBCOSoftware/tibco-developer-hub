/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { isMcpServerApiEntity } from '@backstage/catalog-model/alpha';
import { McpRemote, introspectServer } from './service/McpIntrospector.ts';

export interface RouterOptions {
  config: Config;
  logger: LoggerService;
  httpAuth: HttpAuthService;
  catalog: CatalogService;
}

/**
 * Resolves the token used to authenticate against the target MCP server.
 * Priority:
 *   1. `x-mcp-token` request header — supplied by the user in the browser
 *   2. static `mcpIntrospection.token` from config - local dev fallback
 *
 * Note: the caller's own session cookie (`cp-token`) is intentionally NOT
 * forwarded to the external MCP server; credentials must be provided explicitly.
 */
function resolveMcpToken(
  req: express.Request,
  config: Config,
): string | undefined {
  const headerToken = req.header('x-mcp-token');
  if (headerToken) {
    return headerToken;
  }
  return config.getOptionalString('mcpIntrospection.token');
}

/**
 * Resolves the arbitrary auth headers to forward to the target MCP server (e.g.
 * `X-API-Key` for non-bearer servers). These are supplied by the user in the
 * Capabilities tab as a JSON object encoded in the `x-mcp-headers` request
 * header — mirroring the `headers` input of the `tibco:mcp:introspect` scaffolder
 * action. Only string-valued entries are kept; a malformed value is ignored.
 */
function resolveMcpHeaders(
  req: express.Request,
  logger: LoggerService,
): Record<string, string> | undefined {
  const raw = req.header('x-mcp-headers');
  if (!raw) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const headers: Record<string, string> = {};
      for (const [name, value] of Object.entries(parsed)) {
        if (typeof value === 'string') {
          headers[name] = value;
        }
      }
      return Object.keys(headers).length > 0 ? headers : undefined;
    }
  } catch {
    logger.warn(
      '[mcp-introspection] Ignoring malformed "x-mcp-headers" request header (expected a JSON object).',
    );
  }
  return undefined;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger, httpAuth, catalog } = options;
  const router = Router();

  /**
   * GET /capabilities?entityRef=api:default/example-mcp-server[&remoteIndex=N]
   *
   * Looks the entity up in the catalog, verifies it is an MCP server, then
   * connects to its `spec.remotes` at runtime and returns the tools, resources
   * and prompts it exposes along with server info and advertised capabilities.
   * Accessible at: /api/mcp-introspection/capabilities
   */
  router.get('/capabilities', async (req, res) => {
    const entityRef = req.query.entityRef as string | undefined;
    if (!entityRef) {
      res.status(400).json({
        error: 'Bad Request',
        message: '"entityRef" query parameter is required.',
      });
      return;
    }

    let remoteIndex: number | undefined;
    if (req.query.remoteIndex !== undefined) {
      remoteIndex = Number(req.query.remoteIndex);
      if (!Number.isInteger(remoteIndex) || remoteIndex < 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: '"remoteIndex" must be a non-negative integer.',
        });
        return;
      }
    }

    const credentials = await httpAuth.credentials(req);
    const entity = await catalog.getEntityByRef(entityRef, { credentials });

    if (!entity) {
      res.status(404).json({
        error: 'Not Found',
        message: `Entity "${entityRef}" was not found in the catalog.`,
      });
      return;
    }

    if (!isMcpServerApiEntity(entity as any)) {
      res.status(400).json({
        error: 'Bad Request',
        message: `Entity "${entityRef}" is not an MCP server (expected kind: API, spec.type: mcp-server).`,
      });
      return;
    }

    const remotes = (entity.spec?.remotes as McpRemote[] | undefined) ?? [];
    const token = resolveMcpToken(req, config);
    const headers = resolveMcpHeaders(req, logger);
    // Base URL for resolving relative remote URLs (e.g.
    // `/tibco/hub/api/mcp-actions/v1`) for MCP servers hosted by the Hub itself.
    const baseUrl = config.getOptionalString('backend.baseUrl');

    logger.info(
      `[mcp-introspection] Introspecting ${entityRef} (${remotes.length} remote(s))`,
    );

    try {
      const result = await introspectServer(remotes, {
        token,
        headers,
        baseUrl,
        remoteIndex,
        logger,
      });
      res.json({ entityRef, ...result });
    } catch (err) {
      logger.warn(
        `[mcp-introspection] Introspection failed for ${entityRef}: ${
          (err as Error).message
        }`,
      );
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Unable to introspect MCP server "${entityRef}".`,
        detail: (err as Error).message,
      });
    }
  });

  return router;
}
