/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createPlugin } from '@backstage/core-plugin-api';

import { topologyGraphRouteRef } from './routes';

export const integrationTopologyPlugin = createPlugin({
  id: 'integration-topology',
  routes: {
    root: topologyGraphRouteRef,
  },
});
