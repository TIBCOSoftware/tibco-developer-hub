/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

export const customTemplatePlugin = createPlugin({
  id: 'custom-template-flow',
  routes: {
    root: scaffolderPlugin.routes.root,
  },
});

export const CustomTemplatePage = customTemplatePlugin.provide(
  createRoutableExtension({
    name: 'CustomTemplatePage',
    component: () =>
      import('./components/TemplateListPage').then(m => m.TemplateListPage),
    mountPoint: scaffolderPlugin.routes.root,
  }),
);
