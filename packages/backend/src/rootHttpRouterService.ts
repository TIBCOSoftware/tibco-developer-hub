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
import { getLogoutVerifier, verifyLogoutToken } from './backchannelLogout.ts';

export default rootHttpRouterServiceFactory({
  configure: async ({ app, middleware, routes, logger, config }) => {
    if (process.env.NODE_ENV === 'development') {
      app.use(middleware.cors());
    }

    const router = Router();
    if (config.getOptionalBoolean('tibco.mcpActions.enabled') === false) {
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
            // Verify the token's signature and issuer BEFORE acting on it.
            // Without this any unauthenticated caller could supply an arbitrary
            // `secondaryKeys` array and evict other users' cached sessions.
            let keys: string[];
            try {
              keys = await verifyLogoutToken(logout_token, verifier);
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
