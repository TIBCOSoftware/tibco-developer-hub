import { createBackend } from '@backstage/backend-defaults';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import {coreServices, createBackendModule} from '@backstage/backend-plugin-api';
import {
  ExtractParametersAction,
  createYamlAction,
} from '@internal/backstage-plugin-scaffolder-backend-module-import-flow';
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { NextFunction, Request, Response, Router } from 'express';

import {callMftApi} from '@internal/backstage-plugin-scaffolder-backend-module-mft-actions-backend'

const backend = createBackend();

backend.add(
  rootHttpRouterServiceFactory({
    configure: async ({ app, middleware, routes }) => {
      if (process.env.NODE_ENV === 'development') {
        app.use(middleware.cors());
      }
      const router = Router();
      router.get('/health', (_request, response) => {
        response.send({ status: 'ok' });
      });
      app.use('/tibco/hub', router);
      const mw = (req: Request, _res: Response, next: NextFunction) => {
        if (!req.path.startsWith('/api/techdocs')) {
          req.headers.authorization = undefined;
        }
        next();
      };
      app.use('/tibco/hub', mw, routes);
      app.use('/', mw, routes);
      app.use(middleware.notFound());
      app.use(middleware.error());
    },
  }),
);

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, config }) {
        scaffolder.addActions(new (ExtractParametersAction as any)());
        scaffolder.addActions(new (createYamlAction as any)());
        scaffolder.addActions(new (callMftApi as any)(config));
      },
    });
  },
});
backend.add(scaffolderModuleCustomExtensions);
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('./authModuleOauth2ProxyProvider'));
backend.add(import('./authModuleGithubProvider'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend/alpha'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

// backend.add(import('backstage-plugin-scaffolder-backend-module-mft-actions-backend'));
backend.start();
