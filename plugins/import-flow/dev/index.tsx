import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { ImportFlowPage } from '../src';

createDevApp()
  .registerPlugin(scaffolderPlugin)
  .addPage({
    element: <ImportFlowPage />,
    title: 'Root Page',
    path: '/import-flow',
  })
  .render();
