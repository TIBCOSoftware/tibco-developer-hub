import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  AuthResolverContext,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { Config } from '@backstage/config';

function isGuestAuthEnabled(config: Config): boolean {
  const enabledProviders =
    config.getOptionalStringArray('auth.enableAuthProviders') || [];
  return enabledProviders.includes('guest');
}

function issueGuestToken(ctx: AuthResolverContext) {
  const userRef = stringifyEntityRef({
    kind: 'User',
    name: '',
    namespace: DEFAULT_NAMESPACE,
  });
  return ctx.issueToken({
    claims: {
      sub: userRef,
      ent: [userRef],
    },
  });
}

async function checkUserInCatalog(ctx: AuthResolverContext, userId: string) {
  let isUserInCatalog: boolean;
  try {
    const catalogUser = await ctx.findCatalogUser({
      entityRef: { name: userId },
    });
    isUserInCatalog = !!catalogUser;
  } catch (e) {
    if (e instanceof Error && e.name === 'NotFoundError') {
      isUserInCatalog = false;
    } else {
      throw e;
    }
  }
  return isUserInCatalog;
}
export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'githubProvider',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        providers: authProvidersExtensionPoint,
      },
      async init({ config, providers }) {
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver({ result }, ctx) {
              if (
                isGuestAuthEnabled(config) &&
                result.fullProfile.id === 'guest'
              ) {
                return issueGuestToken(ctx);
              }

              const userId: string | undefined = result.fullProfile.username;
              if (!userId) {
                throw new Error(
                  `GitHub user profile does not contain a username`,
                );
              }

              // first we will try to link the user to their catalog entry if there's one
              const isUserInCatalog = await checkUserInCatalog(ctx, userId);
              if (isUserInCatalog) {
                return ctx.signInWithCatalogUser({
                  entityRef: { name: userId },
                });
              }

              // user not found in the catalog, will identify only through username
              const userRef = stringifyEntityRef({
                kind: 'User',
                name: userId,
                namespace: DEFAULT_NAMESPACE,
              });
              return ctx.issueToken({
                claims: {
                  sub: userRef, // The user's own identity
                  ent: [userRef], // A list of identities that the user claims ownership through
                },
              });
            },
          }),
        });
      },
    });
  },
});
