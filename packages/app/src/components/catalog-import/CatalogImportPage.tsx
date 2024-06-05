import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  catalogImportApiRef,
  CatalogImportClient,
} from '@backstage/plugin-catalog-import';

export const rootRouteRef = createRouteRef({
  id: 'catalog-import',
});

/**
 * A plugin that helps the user in importing projects and YAML files into the
 * catalog.
 *
 * @public
 */
export const catalogImportPlugin = createPlugin({
  id: 'catalog-import',
  apis: [
    createApiFactory({
      api: catalogImportApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        scmAuthApi: scmAuthApiRef,
        identityApi: identityApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
        catalogApi: catalogApiRef,
        configApi: configApiRef,
      },
      factory: ({
        discoveryApi,
        scmAuthApi,
        identityApi,
        scmIntegrationsApi,
        catalogApi,
        configApi,
      }) =>
        new CatalogImportClient({
          discoveryApi,
          scmAuthApi,
          scmIntegrationsApi,
          identityApi,
          catalogApi,
          configApi,
        }),
    }),
  ],
  routes: {
    importPage: rootRouteRef,
  },
});

/**
 * The page for importing projects and YAML files into the catalog.
 *
 * @public
 */
export const CatalogImportPage = catalogImportPlugin.provide(
  createRoutableExtension({
    name: 'CatalogImportPage',
    component: () => import('./components/ImportPage').then(m => m.ImportPage),
    mountPoint: rootRouteRef,
  }),
);
