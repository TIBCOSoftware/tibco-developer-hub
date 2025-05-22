/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { simpleGit } from 'simple-git';
import {
  resolveSafeChildPath,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { existsSync, mkdirSync } from 'fs';
import {
  DefaultGithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { examples } from './git-clone.examples.ts';

export function gitCloneAction(config: RootConfigService) {
  return createTemplateAction<{
    sourcePath?: string;
    failOnError?: boolean;
    branch?: string;
    repoUrl: string;
    token?: string;
  }>({
    id: 'tibco:git:clone',
    description: 'Clones a git repository.',
    examples,
    schema: {
      input: z.object({
        sourcePath: z
          .string()
          .optional()
          .describe(
            'Source path relative to workspace, optional, path within the workspace that will be used as the repository root',
          ),
        failOnError: z
          .boolean()
          .optional()
          .describe(
            'Boolean flag to stop the task when there is an error, optional, default is false, when true task execution will be stopped in this step when there is an error',
          ),
        branch: z
          .string()
          .optional()
          .describe('The name of the branch to clone'),
        repoUrl: z.string().describe('The HTTPS repository web URL to clone'),
        token: z.string().optional().describe('Authentication token'),
      }),
    },
    async handler(ctx) {
      try {
        ctx.logger.info(
          `Source path relative to workspace: ${ctx.input.sourcePath || ''}`,
        );
        ctx.logger.info(
          `Fail on error: ${ctx.input.failOnError ? 'True' : 'False'}`,
        );
        ctx.logger.info(`Branch: ${ctx.input.branch || ''}`);
        ctx.logger.info(`repoUrl: ${ctx.input.repoUrl}`);

        const { repoUrl, token, branch } = ctx.input;
        let authToken: string | undefined = token;
        if (!token) {
          const integrations = ScmIntegrations.fromConfig(config);
          const provider =
            DefaultGithubCredentialsProvider.fromIntegrations(integrations);
          const credentials = await provider.getCredentials({ url: repoUrl });
          if (credentials?.token) {
            authToken = credentials.token;
          }
        }
        if (!authToken) {
          throw new Error(
            `No token credentials provided for git repository ${repoUrl}`,
          );
        }
        const repoUrlObj = new URL(repoUrl);
        if (repoUrlObj.protocol !== 'https:') {
          throw new Error('Not a valid HTTPS repository web URL');
        }
        const relativeWorkspacePath = resolveSafeChildPath(
          ctx.workspacePath,
          ctx.input.sourcePath || '',
        );
        if (!existsSync(relativeWorkspacePath)) {
          mkdirSync(relativeWorkspacePath, { recursive: true });
        }
        ctx.logger.info(`Final workspace path: ${relativeWorkspacePath}`);
        const git = simpleGit();
        repoUrlObj.username = authToken;
        const cloneUrl = repoUrlObj.toString();
        const options = ['--single-branch'];
        if (branch) {
          options.push('--branch');
          options.push(branch);
        }
        await git.clone(cloneUrl, relativeWorkspacePath, options);
        ctx.logger.info(`Finished cloning ${repoUrl}`);
      } catch (err) {
        ctx.logger.error(`Error while cloning the git repository`);
        ctx.logger.error(err);
        if (ctx.input.failOnError) {
          throw err;
        }
      }
    },
  });
}
