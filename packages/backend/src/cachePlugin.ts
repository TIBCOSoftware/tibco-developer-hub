/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { KeyvStore } from './cacheService.ts';
import { Knex } from 'knex';

const PLUGIN_ID: string = 'tibco_hub_cache';

export default createBackendPlugin({
  pluginId: 'tibco_hub_cache',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
      },
      async init({ database }) {
        const knex: Knex = await database.getClient();
        KeyvStore.initialize(knex, PLUGIN_ID);
        await KeyvStore.keyv.clear();
      },
    });
  },
});
