/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createTemplateAction,
  TemplateAction,
} from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { introspectRemote } from '@internal/plugin-mcp-introspection-backend';
import fs from 'fs-extra';
import path from 'path';
import { introspectMcpServerExamples } from './introspectMcpServer.examples';

/**
 * Scaffolder action that connects to an MCP server at the given URL and reports
 * the tools, resources and prompts it exposes (plus its serverInfo and advertised
 * capabilities). Authentication is optional: a Bearer `token` and/or arbitrary
 * `headers`. Reuses the live-introspection core from the `mcp-introspection`
 * backend plugin.
 *
 * The result is asserted to the broad `TemplateAction` type: the inferred type
 * would otherwise reference a non-portable nested `zod` (pulled in transitively
 * via the introspection plugin), which TypeScript refuses to emit (TS2742).
 */
export const introspectMcpServerAction = createTemplateAction({
  id: 'tibco:mcp:introspect',
  description:
    'Connects to an MCP server URL and outputs its tools, resources, prompts and server info.',
  examples: introspectMcpServerExamples,
  schema: {
    input: z =>
      z.object({
        url: z
          .string()
          .min(1)
          .describe('The MCP server endpoint URL (e.g. https://host/mcp).'),
        transport: z
          .enum(['streamable-http', 'sse'])
          .optional()
          .default('streamable-http')
          .describe('Transport type of the endpoint. Default: streamable-http'),
        token: z
          .string()
          .optional()
          .describe(
            'Bearer token sent as `Authorization: Bearer <token>`. Falls back to the `mcpToken` template secret when omitted.',
          ),
        headers: z
          .record(z.string())
          .optional()
          .describe(
            'Additional request headers (e.g. { "X-API-Key": "..." }) for non-bearer authentication.',
          ),
        resultPath: z
          .string()
          .optional()
          .describe(
            'Optional workspace-relative path to also write the full result as JSON.',
          ),
      }),
    output: z =>
      z.object({
        serverInfo: z
          .object({
            name: z.string().optional(),
            version: z.string().optional(),
          })
          .optional()
          .describe('The server name/version reported during initialize.'),
        capabilities: z
          .any()
          .describe('The raw capabilities the server advertised.'),
        tools: z
          .array(
            z
              .object({
                name: z.string(),
                description: z.string().optional(),
                inputSchema: z.any().optional(),
              })
              .passthrough(),
          )
          .describe('The tools the server exposes.'),
        resources: z
          .array(
            z
              .object({
                uri: z.string(),
                name: z.string().optional(),
                mimeType: z.string().optional(),
                description: z.string().optional(),
              })
              .passthrough(),
          )
          .describe('The resources the server exposes.'),
        prompts: z
          .array(
            z
              .object({
                name: z.string(),
                description: z.string().optional(),
                arguments: z.any().optional(),
              })
              .passthrough(),
          )
          .describe('The prompts the server exposes.'),
        toolCount: z.number().describe('Number of tools.'),
        resourceCount: z.number().describe('Number of resources.'),
        promptCount: z.number().describe('Number of prompts.'),
        errors: z
          .array(z.string())
          .describe(
            'Non-fatal per-list errors collected during introspection.',
          ),
        filePath: z
          .string()
          .optional()
          .describe(
            'Absolute path of the written result file, if resultPath was set.',
          ),
      }),
  },
  async handler(ctx) {
    const {
      url,
      transport = 'streamable-http',
      headers,
      resultPath,
    } = ctx.input;

    // Bearer token: explicit input first, then the `mcpToken` template secret.
    const token = ctx.input.token ?? ctx.secrets?.mcpToken;

    ctx.logger.info(
      `tibco:mcp:introspect — connecting to ${url} via ${transport}${
        token ? ' (bearer token)' : ''
      }${headers ? ` (+${Object.keys(headers).length} custom header(s))` : ''}`,
    );

    let result;
    try {
      result = await introspectRemote(
        { type: transport, url },
        { token, headers, logger: ctx.logger },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      ctx.logger.error(`tibco:mcp:introspect failed: ${message}`);
      throw new Error(`Failed to introspect MCP server ${url}: ${message}`);
    }

    ctx.logger.info(
      `tibco:mcp:introspect — ${result.serverInfo?.name ?? 'server'} exposes ` +
        `${result.tools.length} tool(s), ${result.resources.length} resource(s), ` +
        `${result.prompts.length} prompt(s)`,
    );

    if (resultPath) {
      const targetPath = resolveSafeChildPath(ctx.workspacePath, resultPath);
      await fs.ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, JSON.stringify(result, null, 2), 'utf8');
      ctx.logger.info(`Wrote introspection result to ${resultPath}`);
      ctx.output('filePath', targetPath);
    }

    ctx.output('serverInfo', result.serverInfo);
    ctx.output('capabilities', result.capabilities);
    ctx.output('tools', result.tools);
    ctx.output('resources', result.resources);
    ctx.output('prompts', result.prompts);
    ctx.output('toolCount', result.tools.length);
    ctx.output('resourceCount', result.resources.length);
    ctx.output('promptCount', result.prompts.length);
    ctx.output('errors', result.errors);
  },
}) as unknown as TemplateAction;
