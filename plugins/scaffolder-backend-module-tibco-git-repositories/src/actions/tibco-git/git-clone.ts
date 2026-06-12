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
import {
  BitbucketCloudIntegration,
  BitbucketServerIntegration,
  DefaultAzureDevOpsCredentialsProvider,
  DefaultGithubCredentialsProvider,
  DefaultGitlabCredentialsProvider,
  GerritIntegration,
  GiteaIntegration,
  getBitbucketCloudRequestOptions,
  getBitbucketServerRequestOptions,
  getGerritRequestOptions,
  getGiteaRequestOptions,
  getHarnessRequestOptions,
  HarnessIntegration,
  ScmIntegration,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { examples } from './git-clone.examples.ts';

/**
 * Builds an HTTP Basic `Authorization` header value from a username/password
 * pair. Used for the providers that authenticate git over HTTPS via basic auth.
 */
const basicAuth = (username: string, password: string): string =>
  `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;

/**
 * Resolves the HTTP headers needed to authenticate a git clone over HTTPS for
 * whatever SCM provider the repository URL belongs to. The provider is detected
 * from the `integrations.*` configuration (by host), so any self-hosted instance
 * works as long as it is configured. The returned headers are injected into git
 * via `http.extraHeader`, which supports every auth scheme uniformly (Basic,
 * Bearer and custom headers such as Harness' `x-api-key`).
 *
 * An explicitly supplied `token` always takes precedence and is applied using
 * the convention expected by the matched provider.
 */
const resolveGitAuthHeaders = async (
  repoUrl: string,
  integration: ScmIntegration | undefined,
  integrations: ScmIntegrationRegistry,
  token?: string,
): Promise<Record<string, string>> => {
  switch (integration?.type) {
    case 'github': {
      const authToken =
        token ??
        (
          await DefaultGithubCredentialsProvider.fromIntegrations(
            integrations,
          ).getCredentials({ url: repoUrl })
        )?.token;
      return authToken
        ? { Authorization: basicAuth('x-access-token', authToken) }
        : {};
    }
    case 'gitlab': {
      const authToken =
        token ??
        (
          await DefaultGitlabCredentialsProvider.fromIntegrations(
            integrations,
          ).getCredentials({ url: repoUrl })
        )?.token;
      return authToken
        ? { Authorization: basicAuth('oauth2', authToken) }
        : {};
    }
    case 'azure': {
      if (token) {
        // Azure DevOps personal access token: any username, PAT as password.
        return { Authorization: basicAuth('pat', token) };
      }
      const credentials = await DefaultAzureDevOpsCredentialsProvider.fromIntegrations(
        integrations,
      ).getCredentials({ url: repoUrl });
      return credentials?.headers ?? {};
    }
    case 'bitbucketCloud': {
      if (token) {
        return { Authorization: basicAuth('x-token-auth', token) };
      }
      const { config } = integration as BitbucketCloudIntegration;
      return (await getBitbucketCloudRequestOptions(config)).headers ?? {};
    }
    case 'bitbucketServer': {
      if (token) {
        // Bitbucket Data Center HTTP access token uses bearer auth.
        return { Authorization: `Bearer ${token}` };
      }
      const { config } = integration as BitbucketServerIntegration;
      return getBitbucketServerRequestOptions(config).headers ?? {};
    }
    case 'gerrit': {
      const { config } = integration as GerritIntegration;
      return getGerritRequestOptions(config).headers ?? {};
    }
    case 'gitea': {
      const { config } = integration as GiteaIntegration;
      return getGiteaRequestOptions(config).headers ?? {};
    }
    case 'harness': {
      if (token) {
        return { 'x-api-key': token };
      }
      const { config } = integration as HarnessIntegration;
      return getHarnessRequestOptions(config).headers ?? {};
    }
    default:
      // Unknown / unconfigured host: honour an explicitly provided token using
      // the most widely accepted convention (token as the basic-auth username).
      return token ? { Authorization: basicAuth(token, '') } : {};
  }
};

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
        ctx.logger.info(`repoUrl: ${ctx.input.repoUrl}`);

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
            `No credentials available for git repository ${repoUrl}. Configure an integration for host '${repoUrlObj.host}' under 'integrations' or pass a token.`,
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

        const git = simpleGit();
        const options = ['--single-branch'];
        if (branch) {
          options.push('--branch');
          options.push(branch);
        }
        // Inject the auth as HTTP headers via `http.extraHeader` so the secret
        // never ends up in the clone URL and every auth scheme is supported
        // (Basic, Bearer, custom). Passing them with `--config` persists the
        // headers into the cloned repo's config, so a subsequent push/fetch
        // (e.g. the tibco:git:push action) reuses the same credentials.
        for (const [name, value] of Object.entries(authHeaders)) {
          options.push('--config', `http.extraHeader=${name}: ${value}`);
        }
        await git.clone(repoUrl, relativeWorkspacePath, options);
        ctx.logger.info(`Finished cloning ${repoUrl}`);
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
