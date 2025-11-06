/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { integrationTopologyPlugin } from './plugin';
import { topologyGraphRouteRef } from './routes';

/**
 * A card that displays the directly related entities to the current entity.
 *
 * @public
 */
export const EntityIntegrationTopologyCard = integrationTopologyPlugin.provide(
  createComponentExtension({
    name: 'EntityIntegrationTopologyCard',
    component: {
      lazy: () =>
        import(
          './components/IntegrationTopologyCard/IntegrationTopologyCard'
        ).then(m => m.IntegrationTopologyCard),
    },
  }),
);

/**
 * A standalone page that can be added to your application providing a viewer
 * for your entities and their relations.
 *
 * @public
 */
export const IntegrationTopologyPage = integrationTopologyPlugin.provide(
  createRoutableExtension({
    name: 'IntegrationTopologyPage',
    component: () =>
      import('./components/IntegrationTopologyPage').then(
        m => m.IntegrationTopologyPage,
      ),
    mountPoint: topologyGraphRouteRef,
  }),
);
