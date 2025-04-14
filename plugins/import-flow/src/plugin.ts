/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createRoutableExtension } from '@backstage/core-plugin-api';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

export const ImportFlowPage = scaffolderPlugin.provide(
  createRoutableExtension({
    name: 'ImportFlowPage',
    component: () =>
      import('./components/TemplateListPage').then(m => m.TemplateListPage),
    mountPoint: scaffolderPlugin.routes.root,
  }),
);
