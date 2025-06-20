/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const tibcoPlatformPlugin = createPlugin({
  id: 'tibco-platform-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const PlatformApplicationDeploymentsPage = tibcoPlatformPlugin.provide(
  createRoutableExtension({
    name: 'PlatformApplicationDeploymentsPage',
    component: () =>
      import('./components/ApplicationDeploymentsPage').then(
        m => m.ApplicationDeploymentsPage,
      ),
    mountPoint: rootRouteRef,
  }),
);

/** @public */
export const PlatformApplicationDeploymentsCard = tibcoPlatformPlugin.provide(
  createComponentExtension({
    name: 'PlatformApplicationDeploymentsCard',
    component: {
      lazy: () =>
        import('./components/ApplicationDeploymentsCard').then(
          m => m.ApplicationDeploymentsCard,
        ),
    },
  }),
);

/** @public */
export const PlatformApplicationDeploymentsError = tibcoPlatformPlugin.provide(
  createComponentExtension({
    name: 'PlatformApplicationDeploymentsError',
    component: {
      lazy: () =>
        import('./components/ApplicationDeploymentsCard').then(
          m => m.ApplicationDeploymentsError,
        ),
    },
  }),
);
