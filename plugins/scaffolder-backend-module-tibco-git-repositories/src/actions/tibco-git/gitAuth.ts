/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

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
} from '@backstage/integration';

/**
 * Builds an HTTP Basic `Authorization` header value from a username/password
 * pair. Used for the providers that authenticate git over HTTPS via basic auth.
 */
export const basicAuth = (username: string, password: string): string =>
  `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;

/**
 * Redacts any embedded credentials (the `user:password@` userinfo component)
 * from a URL so it is safe to log. Git remote URLs can carry secrets inline
 * (e.g. `https://user:token@host/repo.git`); logging them verbatim would leak
 * those secrets into task logs. Returns the URL with userinfo stripped, or a
 * best-effort masked string if the value does not parse as a URL.
 */
export const redactUrlUserinfo = (raw: string): string => {
  try {
    const url = new URL(raw);
    if (url.username || url.password) {
      url.username = '';
      url.password = '';
    }
    return url.toString();
  } catch {
    // Not a parseable URL (e.g. an scp-like `git@host:org/repo.git`); mask any
    // `//user:pass@` or leading `user@` userinfo segment defensively.
    return raw.replace(/\/\/[^/@]+@/, '//***@').replace(/^[^/@]+@/, '***@');
  }
};

/**
 * Resolves the HTTP headers needed to authenticate a git clone/push over HTTPS
 * for whatever SCM provider the repository URL belongs to. The provider is
 * detected from the `integrations.*` configuration (by host), so any self-hosted
 * instance works as long as it is configured. The returned headers are injected
 * into git via `http.extraHeader`, which supports every auth scheme uniformly
 * (Basic, Bearer and custom headers such as Harness' `x-api-key`).
 *
 * An explicitly supplied `token` always takes precedence and is applied using
 * the convention expected by the matched provider.
 */
export const resolveGitAuthHeaders = async (
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
      return authToken ? { Authorization: basicAuth('oauth2', authToken) } : {};
    }
    case 'azure': {
      if (token) {
        // Azure DevOps personal access token: any username, PAT as password.
        return { Authorization: basicAuth('pat', token) };
      }
      const credentials =
        await DefaultAzureDevOpsCredentialsProvider.fromIntegrations(
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

/**
 * Converts resolved auth headers into `git -c http.extraHeader=...` config
 * entries for simple-git's per-invocation `config` option.
 *
 * These are passed as command-scoped `-c` overrides (applied only to the git
 * process that runs), so — unlike `git clone --config` — the credential is
 * NEVER written into the repository's on-disk `.git/config`. This keeps the
 * backend's SCM service token out of the workspace, where a follow-on step
 * (e.g. a file-reading scaffolder action) could otherwise exfiltrate it.
 */
export const toExtraHeaderConfig = (
  headers: Record<string, string>,
): string[] =>
  Object.entries(headers).map(
    ([name, value]) => `http.extraHeader=${name}: ${value}`,
  );
