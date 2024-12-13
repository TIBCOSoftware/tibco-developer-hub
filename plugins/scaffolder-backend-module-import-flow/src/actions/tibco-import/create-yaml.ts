import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { Entity } from '@backstage/catalog-model';
import { dump } from 'js-yaml';
import { promises } from 'fs';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';

export function createYamlAction() {
  return createTemplateAction<{
    sourcePath?: string;
    failOnError?: boolean;
    outputFile?: string;
    outputStructure: Entity;
  }>({
    id: 'tibco:create-yaml',
    description: 'Tibco Platform Create Yaml Action',
    schema: {
      input: z.object({
        failOnError: z.boolean().optional(),
        sourcePath: z.string().optional(),
        outputFile: z.string().optional(),
        outputStructure: z.record(z.union([z.string(), z.number(), z.any()]), {
          description: 'Output structure',
        }),
        /*     outputStructure: z.object({
          apiVersion: z.string(),
          kind: z.string(),
          metadata: z.object({
            name: z.string()
          })
        })*/
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
        const yamlData = dump(ctx.input.outputStructure);
        const filePath = resolveSafeChildPath(
          relativeWorkspacePath,
          outFileName,
        );
        await promises.writeFile(filePath, yamlData, 'utf8');
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
