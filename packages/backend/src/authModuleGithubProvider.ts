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
import { Octokit } from 'octokit';
import { RequestError } from '@octokit/request-error';

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

async function validateUserOrgMembership({
  orgNames,
  accessToken,
}: {
  orgNames: string[];
  accessToken: string;
}): Promise<void> {
  const octokit = new Octokit({ auth: accessToken });
  try {
    // https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28#list-organization-memberships-for-the-authenticated-user
    const response = await octokit.request(`GET /user/memberships/orgs`, {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const orgNamesLowercase = orgNames.map(o => o.toLowerCase());
    const foundOrg = response.data.find(org => {
      const orgName = org.organization_url.substring(
        org.organization_url.lastIndexOf('/') + 1,
      );
      return orgNamesLowercase.includes(orgName.toLowerCase());
    });
    if (!foundOrg) {
      throw new Error('Could not find org');
    }
  } catch (e) {
    if (e instanceof RequestError && (e.status === 302 || e.status === 404)) {
      throw new Error(
        `Could not determine user membership to any allowed orgs".
            User didn't grant Github organization access or user doesn't belong to this org.`,
      );
    }
    throw new Error('Unknown error occurred on login');
  }
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

              const allowedOrgs = config.getOptionalStringArray(
                'auth.signIn.github.organizations',
              );
              if (allowedOrgs && allowedOrgs.length > 0) {
                await validateUserOrgMembership({
                  orgNames: allowedOrgs,
                  // @ts-ignore
                  accessToken: result.accessToken,
                });
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
