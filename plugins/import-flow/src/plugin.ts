/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

export const ImportFlowPlugin = createPlugin({
  id: 'import-flow-plugin',
  routes: {
    root: scaffolderPlugin.routes.root,
  },
});

export const ImportFlowPage = scaffolderPlugin.provide(
  createRoutableExtension({
    name: 'ImportFlowPage',
    component: () =>
      import('./components/TemplateListPage').then(m => m.TemplateListPage),
    mountPoint: scaffolderPlugin.routes.root,
  }),
);
