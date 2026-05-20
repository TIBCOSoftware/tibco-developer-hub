/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { writeFileAction } from './actions/tibco-fetch';
import { fetchApiFileAction } from './actions/tibco-fetch';
import { fetchPlatformApiAction } from './actions/tibco-fetch';

export const scaffolderModuleTibcoPlatformActions = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'tibco-platform-actions',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        catalog: catalogServiceRef,
        config: coreServices.rootConfig,
      },
      async init({ scaffolderActions, catalog, config }) {
        scaffolderActions.addActions(
          writeFileAction,
          fetchApiFileAction(catalog),
          fetchPlatformApiAction(config),
        );
      },
    });
  },
});
