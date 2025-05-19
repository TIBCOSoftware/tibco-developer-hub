/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createRoutableExtension } from '@backstage/core-plugin-api';

export const CustomScaffolderPage = scaffolderPlugin.provide(
  createRoutableExtension({
    name: 'CustomScaffolderPage',
    component: () =>
      import('./CustomScaffolderComponent.tsx').then(
        m => m.CustomScaffolderComponent,
      ),
    mountPoint: scaffolderPlugin.routes.root,
  }),
);
