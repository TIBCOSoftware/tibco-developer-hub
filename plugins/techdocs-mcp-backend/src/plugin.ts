/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { registerGetEntityDocsAction } from './actions/getEntityDocs.ts';

/**
 * Registers TechDocs-related MCP actions.
 *
 * The MCP server (`@backstage/plugin-mcp-actions-backend`) exposes every action
 * registered here as an MCP tool, provided this plugin's id (`techdocs-mcp`) is
 * listed under `backend.actions.pluginSources` in app-config.
 */
export const techdocsMcpPlugin = createBackendPlugin({
  pluginId: 'techdocs-mcp',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
        logger: coreServices.logger,
      },
      async init({ actionsRegistry, discovery, auth, logger }) {
        registerGetEntityDocsAction({
          actionsRegistry,
          discovery,
          auth,
          logger,
        });
      },
    });
  },
});
