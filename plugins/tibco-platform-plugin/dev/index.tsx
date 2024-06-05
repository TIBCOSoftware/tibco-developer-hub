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
