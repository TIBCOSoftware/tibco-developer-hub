/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createDevApp } from '@backstage/dev-utils';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { CustomTemplatePage } from '../src';

createDevApp()
  .registerPlugin(scaffolderPlugin)
  .addPage({
    element: <CustomTemplatePage />,
    title: 'import flow Page',
    path: '/import-flow',
  })
  .addPage({
    element: <CustomTemplatePage />,
    title: 'self service Page',
    path: '/self-service-flow',
  })
  .render();
