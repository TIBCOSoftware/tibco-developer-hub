import {
  createRouter,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { githubAuthProviderFactory } from './auth-providers/github';
import { oAuth2ProxyProviderFactory } from './auth-providers/oauth2Proxy';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // This replaces the default GitHub auth provider with a customized one.
      // The `signIn` option enables sign-in for this provider, using the
      // identity resolution logic that's provided in the `resolver` callback.
      //
      // There are other resolvers to choose from, and you can also create
      // your own, see the auth documentation for more details:
      //
      //   https://backstage.io/docs/auth/identity-resolver
      // TODO: we should clean up Github and Tibco Auth providers after feature complete
      github: githubAuthProviderFactory(env),
      oauth2Proxy: oAuth2ProxyProviderFactory(env),
    },
  });
}
