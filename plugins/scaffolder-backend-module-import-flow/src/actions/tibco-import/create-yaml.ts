/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { Entity } from '@backstage/catalog-model';
import { dump } from 'js-yaml';
import { promises } from 'fs';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { examples } from './create-yaml.examples';

export function createYamlAction() {
  return createTemplateAction<{
    sourcePath?: string;
    failOnError?: boolean;
    outputFile?: string;
    outputStructure: Entity | Entity[];
  }>({
    id: 'tibco:create-yaml',
    description:
      'Tibco platform create yaml action, refer to examples for outputStructure schema',
    examples,
    schema: {
      input: z.object({
        failOnError: z
          .boolean()
          .optional()
          .describe(
            'Boolean flag to stop the task when there is an error, optional, default is false, when true task execution will be stopped in this step when there is an error',
          ),
        sourcePath: z
          .string()
          .optional()
          .describe(
            'Source path relative to workspace, optional, path within the workspace that will be used as the repository root',
          ),
        outputFile: z
          .string()
          .optional()
          .describe(
            'The name of the output yaml file, optional, default is catalog-info.yaml',
          ),
        outputStructure: z
          .union([
            z.union([z.string(), z.number(), z.any()]),
            z.array(z.union([z.string(), z.number(), z.any()])),
          ])
          .describe('Output structure'),
      }),
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
            yamlData.push(dump(str));
          }
        } else {
          yamlData.push(dump(ctx.input.outputStructure));
        }
        const filePath = resolveSafeChildPath(
          relativeWorkspacePath,
          outFileName,
        );
        const outYamlData = yamlData.join('\n---\n');
        await promises.writeFile(filePath, outYamlData, 'utf8');
        ctx.logger.info(`Created Yaml file with name: ${outFileName}`);
      } catch (err) {
        ctx.logger.error(`Error while creating Yaml file`);
        ctx.logger.error(err);
        if (ctx.input.failOnError) {
          throw err;
        }
      }
    },
  });
}
