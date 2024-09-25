import { createRoutableExtension } from '@backstage/core-plugin-api';
import { catalogImportPlugin } from '@backstage/plugin-catalog-import';
/**
 * The page for importing projects and YAML files into the catalog.
 *
 * @public
 */
export const CatalogImportPage = catalogImportPlugin.provide(
  createRoutableExtension({
    name: 'CatalogImportPage',
    component: () => import('./components/ImportPage').then(m => m.ImportPage),
    mountPoint: catalogImportPlugin.routes.importPage,
  }),
);
