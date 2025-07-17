/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

export const marketplacePlugin = createPlugin({
  id: 'marketplace',
  routes: {
    root: scaffolderPlugin.routes.root,
  },
});

export const MarketplacePage = marketplacePlugin.provide(
  createRoutableExtension({
    name: 'MarketplacePage',
    component: () =>
      import('./components/MarketplaceListPage').then(
        m => m.MarketplaceListPage,
      ),
    mountPoint: scaffolderPlugin.routes.root,
  }),
);
