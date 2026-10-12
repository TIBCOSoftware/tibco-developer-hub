/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { simpleGit } from 'simple-git';
import {
  resolveSafeChildPath,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { existsSync, mkdirSync } from 'fs';
import { ScmIntegrations } from '@backstage/integration';
import {
  redactUrlUserinfo,
  resolveGitAuthHeaders,
  toExtraHeaderConfig,
} from './gitAuth.ts';
import { examples } from './git-clone.examples.ts';

export const gitCloneAction = (config: RootConfigService) => {
  return createTemplateAction({
    id: 'tibco:git:clone',
    description: 'Clones a git repository.',
    examples,
    schema: {
      input: {
        sourcePath: z =>
          z
            .string()
            .optional()
            .describe(
              'Source path relative to workspace, optional, path within the workspace that will be used as the repository root',
            ),
        failOnError: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Boolean flag to stop the task when there is an error, optional, default is false, when true task execution will be stopped in this step when there is an error',
            ),
        branch: z =>
          z.string().optional().describe('The name of the branch to clone'),
        repoUrl: z =>
          z.string().describe('The HTTPS repository web URL to clone'),
        token: z => z.string().optional().describe('Authentication token'),
      },
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
        ctx.logger.info(`repoUrl: ${redactUrlUserinfo(ctx.input.repoUrl)}`);

        const { repoUrl, token, branch } = ctx.input;
        const repoUrlObj = new URL(repoUrl);
        if (repoUrlObj.protocol !== 'https:') {
          throw new Error('Not a valid HTTPS repository web URL');
        }

        // Detect the integration that matches the repository URL based on the
        // hosts configured under `integrations.*` in app-config. This works for
        // any provider (GitHub, GitLab, Azure, Bitbucket, Gerrit, Gitea,
        // Harness, ...) and for self-hosted instances on any host.
        const integrations = ScmIntegrations.fromConfig(config);
        const integration = integrations.byUrl(repoUrl);
        if (integration) {
          ctx.logger.info(
            `Resolved integration type '${integration.type}' for host ${repoUrlObj.host}`,
          );
        }

        const authHeaders = await resolveGitAuthHeaders(
          repoUrl,
          integration,
          integrations,
          token,
        );
        if (Object.keys(authHeaders).length === 0) {
          throw new Error(
            `No credentials available for git repository ${redactUrlUserinfo(
              repoUrl,
            )}. Configure an integration for host '${
              repoUrlObj.host
            }' under 'integrations' or pass a token.`,
          );
        }

        const relativeWorkspacePath = resolveSafeChildPath(
          ctx.workspacePath,
          ctx.input.sourcePath || '',
        );
        if (!existsSync(relativeWorkspacePath)) {
          mkdirSync(relativeWorkspacePath, { recursive: true });
        }
        ctx.logger.info(`Final workspace path: ${relativeWorkspacePath}`);

        // Inject the auth as HTTP headers via `http.extraHeader` so the secret
        // never ends up in the clone URL and every auth scheme is supported
        // (Basic, Bearer, custom). The headers are passed as command-scoped
        // `git -c ...` overrides (simple-git's `config` option), NOT with
        // `git clone --config`, so the credential is never persisted into the
        // cloned repo's `.git/config` on disk. tibco:git:push re-resolves its
        // own credentials at push time instead of relying on persisted secrets.
        const git = simpleGit({ config: toExtraHeaderConfig(authHeaders) });
        const options = ['--single-branch'];
        if (branch) {
          options.push('--branch');
          options.push(branch);
        }
        await git.clone(repoUrl, relativeWorkspacePath, options);
        ctx.logger.info(`Finished cloning ${redactUrlUserinfo(repoUrl)}`);
      } catch (err) {
        ctx.logger.error(`Error while cloning the git repository`);
        ctx.logger.error(`${err}`);
        if (ctx.input.failOnError) {
          throw err;
        }
      }
    },
  });
};
