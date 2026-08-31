/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { createRouter } from './router.ts';

/**
 * Backend plugin that introspects MCP servers at runtime. Exposes
 * `/api/mcp-introspection/capabilities` which resolves an MCP server API entity
 * from the catalog and lists the tools, resources and prompts its remotes expose.
 */
export const mcpIntrospectionPlugin = createBackendPlugin({
  pluginId: 'mcp-introspection',
  register(reg) {
    reg.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        catalog: catalogServiceRef,
      },
      async init({ httpRouter, config, logger, httpAuth, catalog }) {
        httpRouter.use(
          await createRouter({ config, logger, httpAuth, catalog }),
        );
      },
    });
  },
});
