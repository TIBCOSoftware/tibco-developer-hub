/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { dump } from 'js-yaml';
import { promises } from 'fs';
import { dirname } from 'path';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { examples } from './create-yaml.examples';

/**
 * Recursively un-escapes catalog placeholder keys so they can be emitted into
 * the generated YAML without being resolved when THIS template's YAML is itself
 * registered in the catalog.
 *
 * Backstage's catalog `PlaceholderProcessor` eagerly resolves keys like `$text`,
 * `$json`, `$yaml` in ANY entity it processes — including a scaffolder Template
 * entity, where such a key only appears inside a step's `outputStructure` and is
 * meant for the file the template GENERATES, not the template itself. Writing the
 * literal `$text` in template.yaml therefore makes registering the template fail
 * with a "Placeholder $text could not read location ..." 404.
 *
 * To avoid that, author the template with a doubled dollar (e.g. `$$text`), which
 * the catalog processor ignores; this action strips the leading `$` when writing
 * the file so the output gets a real `$text` placeholder.
 */
function unescapePlaceholderKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(unescapePlaceholderKeys);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const unescapedKey = key.startsWith('$$') ? key.slice(1) : key;
      out[unescapedKey] = unescapePlaceholderKeys(val);
    }
    return out;
  }
  return value;
}

export function createYamlAction() {
  return createTemplateAction({
    id: 'tibco:create-yaml',
    description:
      'Tibco platform create yaml action, refer to examples for outputStructure schema',
    examples,
    schema: {
      input: {
        failOnError: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Boolean flag to stop the task when there is an error, optional, default is false, when true task execution will be stopped in this step when there is an error',
            ),
        sourcePath: z =>
          z
            .string()
            .optional()
            .describe(
              'Source path relative to workspace, optional, path within the workspace that will be used as the repository root',
            ),
        outputFile: z =>
          z
            .string()
            .optional()
            .describe(
              'The name of the output yaml file, optional, default is catalog-info.yaml',
            ),
        outputStructure: z =>
          z
            .union([
              z.union([z.string(), z.number(), z.any()]),
              z.array(z.union([z.string(), z.number(), z.any()])),
            ])
            .describe('Output structure'),
      },
    },
    async handler(ctx) {
      ctx.logger.info(
        `Source path relative to workspace: ${ctx.input.sourcePath || ''}`,
      );
      ctx.logger.info(
        `Fail on error: ${ctx.input.failOnError ? 'True' : 'False'}`,
      );
      const outFileName = ctx.input.outputFile || 'catalog-info.yaml';
      ctx.logger.info(`Output File name: ${outFileName}`);
      ctx.logger.info(`Output Structure: `, ctx.input.outputStructure);
      const relativeWorkspacePath = resolveSafeChildPath(
        ctx.workspacePath,
        ctx.input.sourcePath || '',
      );
      ctx.logger.info(`Final workspace path: ${relativeWorkspacePath}`);
      try {
        const yamlData = [];
        if (Array.isArray(ctx.input.outputStructure)) {
          for (const str of ctx.input.outputStructure) {
            yamlData.push(dump(unescapePlaceholderKeys(str)));
          }
        } else {
          yamlData.push(
            dump(unescapePlaceholderKeys(ctx.input.outputStructure)),
          );
        }
        const filePath = resolveSafeChildPath(
          relativeWorkspacePath,
          outFileName,
        );
        const outYamlData = yamlData.join('\n---\n');
        // Ensure the target directory exists so nested output paths (e.g.
        // `mcp-servers/catalog-info.yaml`) work even in a fresh workspace where
        // the sub-folder has not been created yet.
        await promises.mkdir(dirname(filePath), { recursive: true });
        await promises.writeFile(filePath, outYamlData, 'utf8');
        ctx.logger.info(`Created Yaml file with name: ${outFileName}`);
      } catch (err) {
        ctx.logger.error(`Error while creating Yaml file`);
        ctx.logger.error(`${err}`);
        if (ctx.input.failOnError) {
          throw err;
        }
      }
    },
  });
}
