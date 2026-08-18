/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import './backstageGlobalProxy.ts';
import { createBackend } from '@backstage/backend-defaults';
import { provideStaticCatalogModel } from '@backstage/plugin-catalog-node/alpha';
import { mcpServerApiEntityModel } from '@backstage/catalog-model/alpha';

const backend = createBackend();

backend.add(import('./rootLoggerService.ts'));
backend.add(import('./rootHttpRouterService.ts'));

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

backend.add(
  import('@internal/backstage-plugin-scaffolder-backend-module-import-flow'),
);
backend.add(
  import('@internal/plugin-scaffolder-backend-module-tibco-git-repositories'),
);
backend.add(
  import('@internal/plugin-scaffolder-backend-module-tibco-platform-actions'),
);
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('./authModuleOidcProvider.ts'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
// Register the MCP server model layer so the catalog accepts API entities with
// `spec.type: mcp-server` (structured subtype carrying `spec.remotes`).
backend.add(provideStaticCatalogModel({ layers: [mcpServerApiEntityModel] }));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab'));
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab-org'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));
// notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

// mcp actions plugin
backend.add(import('@backstage/plugin-mcp-actions-backend'));
backend.add(import('@internal/plugin-scaffolder-backend-module-metrics-api'));
backend.add(import('@internal/plugin-scaffolder-backend-module-platform-api'));

// MCP introspection: live tools/resources/prompts for MCP server catalog entities
backend.add(import('@internal/plugin-mcp-introspection-backend'));
backend.add(import('./addEssentialLocation'));
backend.add(import('./cachePlugin.ts'));

backend.start();
