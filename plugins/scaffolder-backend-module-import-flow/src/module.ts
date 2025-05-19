/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  scaffolderActionsExtensionPoint,
  scaffolderTemplatingExtensionPoint,
} from '@backstage/plugin-scaffolder-node/alpha';
import {
  createYamlAction,
  customFilters,
  ExtractParametersAction,
} from './actions';

/**
 * A backend module that registers the action into the scaffolder
 */
export const scaffolderModule = createBackendModule({
  moduleId: 'tibco-import-flow',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        scaffolder: scaffolderTemplatingExtensionPoint,
      },
      async init({ scaffolderActions, scaffolder }) {
        scaffolderActions.addActions(
          createYamlAction(),
          ExtractParametersAction(),
        );
        scaffolder.addTemplateFilters(customFilters);
      },
    });
  },
});
