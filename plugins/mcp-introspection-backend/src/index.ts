/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

/**
 * The mcp-introspection backend plugin. Introspects MCP servers at runtime,
 * listing their tools, resources and prompts.
 *
 * @packageDocumentation
 */

export { mcpIntrospectionPlugin as default } from './plugin';

export { introspectRemote, introspectServer } from './service/McpIntrospector';
export type {
  McpAuth,
  McpRemote,
  McpCapabilities,
  McpToolInfo,
  McpResourceInfo,
  McpPromptInfo,
} from './service/McpIntrospector';
