/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { DatabaseMarketplaceStore } from './database/DatabaseMarketplaceStore.ts';
import { createRouter } from './router.ts';

export const scaffolderModuleMetricsApi = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'metrics-api',
  register(reg) {
    reg.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        database: coreServices.database,
      },
      async init({ httpRouter, database }) {
        const marketplaceStore = await DatabaseMarketplaceStore.create({
          database,
        });
        httpRouter.use(
          // @ts-ignore
          await createRouter({ marketplaceStore }),
        );
      },
    });
  },
});
