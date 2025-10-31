/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { KeyvStore } from './cacheService.ts';

export default createBackendPlugin({
  pluginId: 'tibco_hub_cache',
  register(env) {
    env.registerInit({
      deps: {},
      async init() {
        KeyvStore.initialize();
        await KeyvStore.keyv.clear();
      },
    });
  },
});
