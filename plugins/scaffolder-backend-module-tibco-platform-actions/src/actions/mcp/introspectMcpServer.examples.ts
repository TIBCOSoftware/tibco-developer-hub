/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const introspectMcpServerExamples: TemplateExample[] = [
  {
    description: 'Introspect a public MCP server (no authentication)',
    example: yaml.stringify({
      steps: [
        {
          id: 'introspect',
          action: 'tibco:mcp:introspect',
          name: 'Discover MCP capabilities',
          input: {
            url: 'https://mcp.deepwiki.com/mcp',
          },
        },
      ],
    }),
  },
  {
    description: 'Introspect a private server with a Bearer token',
    example: yaml.stringify({
      steps: [
        {
          id: 'introspect',
          action: 'tibco:mcp:introspect',
          name: 'Discover MCP capabilities',
          input: {
            url: 'http://localhost:8790/mcp',
            token: '${{ secrets.mcpToken }}',
          },
        },
      ],
    }),
  },
  {
    description: 'Authenticate with a custom header (non-bearer server)',
    example: yaml.stringify({
      steps: [
        {
          id: 'introspect',
          action: 'tibco:mcp:introspect',
          name: 'Discover MCP capabilities',
          input: {
            url: 'https://mcp.example.com/mcp',
            headers: {
              'X-API-Key': '${{ secrets.apiKey }}',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Use the SSE transport and write the result to a file',
    example: yaml.stringify({
      steps: [
        {
          id: 'introspect',
          action: 'tibco:mcp:introspect',
          name: 'Discover MCP capabilities',
          input: {
            url: 'https://mcp.example.com/sse',
            transport: 'sse',
            resultPath: 'mcp/capabilities.json',
          },
        },
      ],
    }),
  },
  {
    description: 'Use the introspection outputs in later steps',
    example: yaml.stringify({
      steps: [
        {
          id: 'introspect',
          action: 'tibco:mcp:introspect',
          name: 'Discover MCP capabilities',
          input: {
            url: '${{ parameters.mcpUrl }}',
            token: '${{ secrets.mcpToken }}',
          },
        },
      ],
      output: {
        text: [
          {
            title: 'Discovered tools',
            content:
              '${{ steps.introspect.output.toolCount }} tools, ${{ steps.introspect.output.resourceCount }} resources, ${{ steps.introspect.output.promptCount }} prompts',
          },
        ],
      },
    }),
  },
];
