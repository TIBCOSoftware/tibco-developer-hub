/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { KeyvStore } from './cacheService.ts';

export default createBackendPlugin({
  pluginId: 'tibco_hub_cache',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
      },
      async init({ config }) {
        const enableAuthProviders = config.getOptionalStringArray(
          'auth.enableAuthProviders',
        );
        if (
          enableAuthProviders &&
          enableAuthProviders.includes('tibco-control-plane')
        ) {
          KeyvStore.initialize();
          await KeyvStore.keyv.clear();
        }
      },
    });
  },
});
