/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router.ts';

export const scaffolderModulePlatformApi = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'platform-api',
  register(reg) {
    reg.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
      },
      async init({ httpRouter, config, logger }) {
        httpRouter.use(
          // @ts-ignore
          await createRouter({ config, logger }),
        );
      },
    });
  },
});
