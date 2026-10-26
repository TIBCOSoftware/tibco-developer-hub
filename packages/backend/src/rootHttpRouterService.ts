/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import express, { Request, Response, Router } from 'express';
import { getCPUrl } from './utils.ts';
import { DevHubConfig } from './config.ts';
import { idmJwtMiddlewareFunction } from './idmJwtMiddleware.ts';
import { KeyvStore } from './cacheService.ts';
import cookieParser from 'cookie-parser';
import { decodeJwt } from 'jose';
import { getLogoutVerifier, verifyLogoutToken } from './backchannelLogout.ts';

/**
 * Make an untrusted value safe to interpolate into a log line: coerce to a
 * string, strip control characters (so a CRLF in an attacker-supplied header or
 * JWT claim cannot forge extra log lines) and cap the length (so an oversized
 * value cannot amplify log volume).
 */
function sanitizeForLog(value: unknown, maxLength = 200): string {
  if (value === undefined || value === null) {
    return 'n/a';
  }
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, maxLength);
}

export default rootHttpRouterServiceFactory({
  configure: async ({ app, middleware, routes, logger, config }) => {
    if (process.env.NODE_ENV === 'development') {
      app.use(middleware.cors());
    }

    const router = Router();
    // Read as a raw value and coerce ourselves: getOptionalBoolean throws on
    // any string other than the exact literals 'true'/'false', which crashes
    // backend startup when an env-based config override (e.g.
    // APP_CONFIG_tibco_mcpActions_enabled) supplies something like 'True' or ''.
    // The documented contract (config.d.ts) is a boolean, so only the boolean
    // `true` and the supported env literal 'true' enable the route; everything
    // else (absent, malformed, or any other value) fails closed to disabled.
    const rawMcpEnabled = config.getOptional('tibco.mcpActions.enabled');
    const mcpActionsEnabled =
      rawMcpEnabled === true || rawMcpEnabled === 'true';
    if (!mcpActionsEnabled) {
      router.use(
        '/api/mcp-actions',
        (_request: Request, response: Response) => {
          response.status(404).json({ error: 'MCP actions is disabled' });
        },
      );
    }

    const cpUrl = getCPUrl();
    if (cpUrl.host && cpUrl.proxy) {
      router.get(
        DevHubConfig.wellKnownApiPath,
        async (_request: Request, response: Response) => {
          logger.info('Well-known endpoint registered');
          const param: any = {
            method: 'GET',
            headers: {
              'x-cp-host': cpUrl.host,
            },
          };
          try {
            const res = await fetch(
              cpUrl.proxy + DevHubConfig.wellKnownApiPath,
              param,
            );
            if (!res.ok) {
              const errorBody = await res.text();
              logger.error(
                `Invalid response in in well-known endpoint, HTTP error! status: ${res.status} - ${errorBody}`,
              );
              response.status(res.status).send(errorBody);
            }
            const data: any = await res.json();
            response.json(data);
          } catch (err) {
            logger.error('Error in well-known endpoint:', err as Error);
            response
              .status(500)
              .send(`Internal Server Error: ${(err as Error).message}`);
          }
        },
      );
    } else {
      logger.error(
        'CP_URL or CP_DOMAIN not found as an environmental variable, .well-known api is not registered',
      );
    }
    router.get('/health', (_request: Request, response: Response) => {
      response.send({ status: 'ok' });
    });
    const enableAuthProviders = config.getOptionalStringArray(
      'auth.enableAuthProviders',
    );
    if (
      enableAuthProviders &&
      enableAuthProviders.includes('tibco-control-plane')
    ) {
      // Expected audience of a logout token = our OIDC client_id. Used to bind
      // the token to this client so another CP client's token cannot be
      // replayed against this endpoint. Read with getString (not optional) so a
      // missing client_id fails startup rather than silently disabling audience
      // validation — the route is only registered when this provider is enabled,
      // and that provider cannot function without a client_id anyway.
      const authEnvironment =
        config.getOptionalString('auth.environment') ?? 'production';
      const clientIdKey = `auth.providers.tibco-control-plane.${authEnvironment}.clientId`;
      const logoutAudience = config.getString(clientIdKey);
      // getString accepts an empty/whitespace value; reject it so a blank env
      // substitution cannot fail open (audience validation is skipped when the
      // expected audience is falsy).
      if (!logoutAudience.trim()) {
        throw new Error(
          `${clientIdKey} must not be empty; it is required to validate the back-channel logout token audience`,
        );
      }
      router.post(
        '/api/oidc/backchannel-logout',
        // OIDC Back-Channel Logout 1.0 requires the OP to POST the logout_token
        // as an application/x-www-form-urlencoded parameter. Parse that first,
        // and also accept JSON for compatibility with other callers/tests.
        // The payload is a single flat `logout_token` field, so `extended: false`
        // (classic querystring parsing, no nested `qs` objects) is sufficient,
        // and tight `limit`/`parameterLimit` bounds keep the attack surface small.
        express.urlencoded({
          extended: false,
          limit: '100kb',
          parameterLimit: 10,
        }),
        express.json(),
        async (request: Request, response: Response) => {
          try {
            // Log on receipt with request-source metadata so it is easy to tell
            // whether the call actually originated from CP (vs. an unexpected
            // caller). The token's claims are logged separately below.
            logger.info(
              `Received backchannel logout request (ip=${sanitizeForLog(
                request.ip,
              )}, x-forwarded-for=${sanitizeForLog(
                request.get('x-forwarded-for'),
              )}, user-agent=${sanitizeForLog(request.get('user-agent'))})`,
            );
            const logout_token = request.body?.logout_token;
            // With form-urlencoded bodies, a duplicated logout_token parameter
            // is parsed as an array. Anything that is not a non-empty string is
            // a malformed request; reject it before verification.
            if (typeof logout_token !== 'string' || logout_token.length === 0) {
              // Malformed client request (400), not a server fault — log at warn
              // so it doesn't inflate error-rate alerting.
              logger.warn('No valid logout_token found in payload');
              response
                .status(400)
                .send(`No valid logout_token found in payload`);
              return;
            }
            // Decode (WITHOUT verifying) only to log who the token claims to be
            // from — `iss` is the clearest signal for whether this is a genuine
            // CP admin-plane logout. The cryptographic trust check still happens
            // in verifyLogoutToken below; these claims must not be trusted.
            try {
              const claims = decodeJwt(logout_token);
              logger.info(
                `Backchannel logout token claims (unverified): iss=${sanitizeForLog(
                  claims.iss,
                )}, aud=${sanitizeForLog(claims.aud)}, jti=${sanitizeForLog(
                  claims.jti,
                )}`,
              );
            } catch {
              logger.warn(
                'Backchannel logout token could not be decoded for logging',
              );
            }
            // Resolve the verifier separately from verifying the token so that
            // backend-side failures (CP misconfiguration, OIDC discovery
            // outage, jwks_uri origin mismatch) are reported as 503 — a
            // retryable condition — rather than 401. Returning 401 here would
            // tell the IdP the token is bad, so it would not retry and the
            // session could be left un-evicted.
            let verifier: Awaited<ReturnType<typeof getLogoutVerifier>>;
            try {
              verifier = await getLogoutVerifier();
            } catch (discoveryErr) {
              logger.error(
                'Backchannel logout unavailable: could not resolve logout verifier',
                discoveryErr as Error,
              );
              response.status(503).send('Logout verification unavailable');
              return;
            }
            // Verify the token's signature, audience and logout-event claim
            // BEFORE acting on it. Without this any unauthenticated caller could
            // supply an arbitrary `secondaryKeys` array and evict other users'
            // cached sessions.
            let keys: string[];
            try {
              keys = await verifyLogoutToken(
                logout_token,
                verifier,
                logoutAudience,
              );
            } catch (verifyErr) {
              logger.error(
                'Rejected backchannel logout: token verification failed',
                verifyErr as Error,
              );
              response.status(401).send('Invalid logout_token');
              return;
            }
            for (const key of keys) {
              const token = await KeyvStore.keyv.get(key);
              if (token) {
                await KeyvStore.keyv.delete(token);
                await KeyvStore.keyv.delete(`${token}-info`);
                await KeyvStore.keyvMemory.delete(token);
              }
              await KeyvStore.keyv.delete(key);
            }
            response.send('OK');
          } catch (err) {
            logger.error('Error in backchannel logout:', err as Error);
            response
              .status(500)
              .send(`Internal Server Error: ${(err as Error).message}`);
          }
        },
      );
      app.use(cookieParser());
      // idmJwtMiddleware modifies req.body for scaffolder task creation (POST /v2/tasks),
      // so body must be pre-parsed for that path only.
      app.use('/api/scaffolder', express.json());
      // @ts-ignore
      app.use(idmJwtMiddlewareFunction(logger));
    }
    // @ts-ignore
    app.use(router);
    app.use(routes);
    app.use(middleware.notFound());
    app.use(middleware.error());
  },
});
