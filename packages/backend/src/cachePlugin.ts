/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { KeyvStore } from './cacheService.ts';
import { Knex } from 'knex';

const PLUGIN_ID: string = 'tibcohubcache';

export default createBackendPlugin({
  pluginId: PLUGIN_ID,
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
        config: coreServices.rootConfig,
      },
      async init({ database, config }) {
        const enableAuthProviders = config.getOptionalStringArray(
          'auth.enableAuthProviders',
        );
        if (
          enableAuthProviders &&
          enableAuthProviders.includes('tibco-control-plane')
        ) {
          const knex: Knex = await database.getClient();
          const pluginDivisionMode: string =
            config.getOptionalString('backend.database.pluginDivisionMode') ||
            'database';
          KeyvStore.initialize(knex, pluginDivisionMode, PLUGIN_ID);
          await KeyvStore.keyv.clear();
        }
      },
    });
  },
});
