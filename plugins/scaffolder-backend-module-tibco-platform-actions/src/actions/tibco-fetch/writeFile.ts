import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import fs from 'fs-extra';
import path from 'path';
import { writeFileExamples } from './writeFile.examples';

export const writeFileAction = createTemplateAction({
  id: 'tibco:file:write',
  description: 'Writes content to a file',
  examples: writeFileExamples,
  schema: {
    input: z =>
      z.object({
        filePath: z
          .string()
          .min(1)
          .describe('Path to the file to write, including file name'),
        content: z.string().describe('Content to write to the file'),
        encoding: z
          .string()
          .default('utf8')
          .describe('File encoding (default: utf8)'),
        overwrite: z
          .boolean()
          .optional()
          .describe('Overwrite existing file? Default: false'),
        createDirectories: z
          .boolean()
          .default(true)
          .describe("Create parent directories if they don't exist"),
      }),
    output: z =>
      z.object({
        filePath: z.string().describe('Path to the written file'),
        size: z.number().describe('Size of the written file in bytes'),
      }),
  },
  async handler(ctx) {
    const {
      filePath,
      content,
      encoding = 'utf8',
      overwrite = false,
      createDirectories = true,
    } = ctx.input;

    try {
      const basePath = ctx.workspacePath;
      const resolvedPath = resolveSafeChildPath(basePath, filePath);
      ctx.logger.info(`Writing file to workspace: ${filePath}`);

      if (createDirectories) {
        await fs.ensureDir(path.dirname(resolvedPath));
      }

      if (!overwrite && (await fs.pathExists(resolvedPath))) {
        throw new Error(
          `File ${resolvedPath} already exists and overwrite is false.`,
        );
      }

      await fs.writeFile(resolvedPath, content, {
        encoding: encoding as BufferEncoding,
      });
      const stats = await fs.stat(resolvedPath);
      ctx.logger.info(
        `Successfully wrote file: ${filePath} (${stats.size} bytes)`,
      );
      ctx.output('filePath', resolvedPath);
      ctx.output('size', stats.size);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      ctx.logger.error(`Failed to write file ${filePath}: ${errorMessage}`);
      throw new Error(`Failed to write file: ${errorMessage}`);
    }
  },
});
