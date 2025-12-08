import { createDevApp } from '@backstage/dev-utils';
import { integrationTopologyPlugin } from '../src/plugin';
import { IntegrationTopologyPage } from '../src';

createDevApp()
  .registerPlugin(integrationTopologyPlugin)
  .addPage({
    element: <IntegrationTopologyPage />,
    title: 'Root Page',
    path: '/integration-topology',
  })
  .render();
