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
import { existsSync } from 'fs';
import { examples } from './git-push.examples.ts';

export function gitPushAction(config: RootConfigService) {
  return createTemplateAction<{
    sourcePath?: string;
    failOnError?: boolean;
    commitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    branch?: string;
  }>({
    id: 'tibco:git:push',
    description: 'Commits and push to a git repository.',
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
        commitMessage: z.string().optional().describe('Git commit message'),
        gitAuthorName: z.string().optional().describe('Default author name'),
        gitAuthorEmail: z.string().optional().describe('Default author email'),
        branch: z
          .string()
          .optional()
          .describe('The name of the branch to push'),
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
        ctx.logger.info(`Commit message: ${ctx.input.commitMessage || ''}`);
        ctx.logger.info(`Git author name: ${ctx.input.gitAuthorName || ''}`);
        ctx.logger.info(`Git author email: ${ctx.input.gitAuthorEmail || ''}`);
        ctx.logger.info(`Branch: ${ctx.input.branch || ''}`);
        const relativeWorkspacePath = resolveSafeChildPath(
          ctx.workspacePath,
          ctx.input.sourcePath || '',
        );
        if (!existsSync(relativeWorkspacePath)) {
          throw new Error('Source path relative to workspace do not exist');
        }
        ctx.logger.info(`Final workspace path: ${relativeWorkspacePath}`);
        const git = simpleGit();
        await git.cwd(relativeWorkspacePath);
        let pushToBranch = false;
        if (ctx.input.branch) {
          const currentBranch = await git.branchLocal();
          if (currentBranch?.current !== ctx.input.branch) {
            pushToBranch = true;
            let branchExist = false;
            try {
              await git.fetch(
                'origin',
                `${ctx.input.branch}:${ctx.input.branch}`,
              );
              branchExist = true;
            } catch (err) {
              ctx.logger.info(
                `Branch provided as ${ctx.input.branch} to push does not exist in remote, creating and pushing`,
              );
              // ignore this, means branch does not exist in remote
            }
            if (branchExist) {
              await git.checkout(ctx.input.branch);
            } else {
              await git.checkoutBranch(
                ctx.input.branch,
                currentBranch?.current,
              );
            }
          }
        }
        await git.add('.');
        const scafFolderConfig = config.getOptionalConfig(
          'scaffolder.defaultAuthor',
        );
        git.addConfig(
          'user.email',
          ctx.input.gitAuthorEmail ??
            scafFolderConfig?.getString('email') ??
            'test@test.com',
        );
        git.addConfig(
          'user.name',
          ctx.input.gitAuthorName ??
            scafFolderConfig?.getString('name') ??
            'TIBCO® Developer Hub',
        );
        await git.commit(
          ctx.input.commitMessage || 'Committed by TIBCO Developer Hub',
        );
        if (pushToBranch) {
          await git.push('origin', ctx.input.branch);
        } else {
          await git.push();
        }
        ctx.logger.info('Finished push to git repository');
      } catch (err) {
        ctx.logger.error('Error while pushing to the git repository');
        ctx.logger.error(err);
        if (ctx.input.failOnError) {
          throw err;
        }
      }
    },
  });
}
