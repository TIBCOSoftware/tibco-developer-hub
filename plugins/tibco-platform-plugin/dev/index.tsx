/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  tibcoPlatformPlugin,
  PlatformApplicationDeploymentsPage,
} from '../src';

createDevApp()
  .registerPlugin(tibcoPlatformPlugin)
  .addPage({
    element: <PlatformApplicationDeploymentsPage />,
    title: 'Root Page',
    path: '/tibco-platform-plugin',
  })
  .render();
