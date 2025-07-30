/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createBackend } from '@backstage/backend-defaults';
import proxy from 'express-http-proxy';
import { promises, existsSync } from 'fs';
import { DevHubConfig } from './config';
import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
// eslint-disable-next-line
import { transports } from 'winston';
import { join } from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import 'global-agent/bootstrap';
import { setGlobalDispatcher, EnvHttpProxyAgent } from 'undici';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { NextFunction, Request, Response, Router } from 'express';

setGlobalDispatcher(new EnvHttpProxyAgent());

const backend = createBackend();

backend.add(
  rootHttpRouterServiceFactory({
    configure: async ({ app, middleware, routes, logger }) => {
      if (process.env.NODE_ENV === 'development') {
        app.use(middleware.cors());
      }
      const router = Router();
      let CP_Url = process.env.CP_URL;
      if (CP_Url) {
        if (CP_Url.endsWith('/')) {
          CP_Url = CP_Url.slice(0, -1);
        }
        let CP_Url_copy = CP_Url;
        const pattern = /^((http|https|ftp):\/\/)/;
        if (!pattern.test(CP_Url)) {
          if (CP_Url.startsWith('/')) {
            CP_Url = CP_Url.slice(1);
          }
          CP_Url_copy = CP_Url;
          CP_Url = `https://${CP_Url}`;
        }
        const CP_CERTIFICATE_SECRET_PATH =
          process.env.CP_CERTIFICATE_SECRET_PATH;
        const ca: Buffer[] = [];
        if (CP_CERTIFICATE_SECRET_PATH) {
          if (existsSync(CP_CERTIFICATE_SECRET_PATH)) {
            try {
              const files = await promises.readdir(CP_CERTIFICATE_SECRET_PATH);
              for (const file of files) {
                if (file.endsWith('.pem')) {
                  try {
                    const fileName = join(CP_CERTIFICATE_SECRET_PATH, file);
                    const fileContent = await promises.readFile(fileName);
                    ca.push(fileContent);
                  } catch (err) {
                    logger.error(
                      `Error while reading PEM file ${file} in CP_CERTIFICATE_SECRET_PATH`,
                      err as Error,
                    );
                  }
                }
              }
              if (ca.length === 0) {
                logger.error('No PEM file found in CP_CERTIFICATE_SECRET_PATH');
              }
            } catch (err) {
              logger.error(
                'Error while reading files from CP_CERTIFICATE_SECRET_PATH',
                err as Error,
              );
            }
          } else {
            logger.error('CP_CERTIFICATE_SECRET_PATH does not exist');
          }
        }
        router.get(
          DevHubConfig.wellKnownApiPath,
          proxy(CP_Url, {
            proxyReqPathResolver: () => {
              return DevHubConfig.wellKnownApiPath;
            },
            // @ts-ignore
            proxyReqOptDecorator: proxyReqOpts => {
              proxyReqOpts.headers['x-cp-host'] = CP_Url_copy;
              if (ca.length > 0) {
                proxyReqOpts.ca = ca;
              }
              proxyReqOpts.method = 'GET';
              return proxyReqOpts;
            },
          }),
        );
      } else {
        logger.error(
          'CP_URL not found as an environmental variable, .well-known api is not registered',
        );
      }
      router.get('/health', (_request: Request, response: Response) => {
        response.send({ status: 'ok' });
      });
      // @ts-ignore
      app.use(router);
      const mw = (req: Request, _res: Response, next: NextFunction) => {
        if (!req.path.startsWith('/api/techdocs')) {
          req.headers.authorization = undefined;
        }
        next();
      };
      // @ts-ignore
      app.use('/', mw, routes);
      app.use(middleware.notFound());
      app.use(middleware.error());
    },
  }),
);

backend.add(
  createServiceFactory({
    service: coreServices.rootLogger,
    deps: {},
    async factory() {
      if (process.env.NODE_ENV === 'development') {
        return WinstonLogger.create({
          transports: [new transports.Console()],
        });
      }
      const transport: DailyRotateFile = new DailyRotateFile(
        DevHubConfig.logFileConfig,
      );
      return WinstonLogger.create({
        transports: [new transports.Console(), transport],
      });
    },
  }),
);

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

backend.add(
  import('@internal/backstage-plugin-scaffolder-backend-module-import-flow'),
);
backend.add(
  import('@internal/plugin-scaffolder-backend-module-tibco-git-repositories'),
);
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('./authModuleOauth2ProxyProvider'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));
backend.add(import('@internal/plugin-scaffolder-backend-module-metrics-api'));
backend.start();
