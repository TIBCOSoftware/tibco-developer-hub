import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  DEFAULT_NAMESPACE,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { oauth2ProxyAuthenticator } from '@backstage/plugin-auth-backend-module-oauth2-proxy-provider';
import {
  authProvidersExtensionPoint,
  createProxyAuthProviderFactory,
  AuthResolverCatalogUserQuery,
} from '@backstage/plugin-auth-node';
import jwtDecode from 'jwt-decode';

export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'oauth2ProxyProvider',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        providers: authProvidersExtensionPoint,
      },
      async init({ logger, config, providers }) {
        providers.registerProvider({
          providerId: 'oauth2Proxy',
          factory: createProxyAuthProviderFactory({
            authenticator: oauth2ProxyAuthenticator,
            async signInResolver({ result }, ctx) {
              let DEV_JWT_TOKEN: string | undefined;
              try {
                DEV_JWT_TOKEN = config
                  .getOptionalConfig('oauth2-jwt-token')
                  ?.getOptionalString('token');
              } catch (e) {
                logger.error(
                  'oauth2-jwt-token.token passed in app.config must be a string',
                  e as Error,
                );
              }

              let RESTRICT_NON_CATALOG_USER: boolean | undefined;
              try {
                RESTRICT_NON_CATALOG_USER = config
                  .getOptionalConfig('restrict-non-catalog-user')
                  ?.getOptionalBoolean('value');
              } catch (e) {
                logger.error(
                  'restrict-non-catalog-user.value passed in app.config must be a boolean',
                  e as Error,
                );
              }
              let token: string =
                result.getHeader('x-atmosphere-token')?.toString() || '';
              if (!token && DEV_JWT_TOKEN) {
                token = DEV_JWT_TOKEN;
              }
              if (!token) {
                throw new Error('Missing x-atmosphere-token in header');
              }
              let decoded: any;
              try {
                decoded = jwtDecode(token);
              } catch (error) {
                throw new Error('Unable to decode JWT token');
              }
              if (!(decoded && decoded.email)) {
                throw new Error('Invalid JWT token, missing email');
              }

              const userInfo: any = {};
              try {
                userInfo.uname = decoded.name;
                userInfo.userId = decoded.email.split('@')[0];
                userInfo.email = decoded.email;
              } catch (error) {
                throw new Error('Error in decoding or validating token');
              }
              const queryFilter: AuthResolverCatalogUserQuery = {
                filter: {
                  'spec.profile.email': `${userInfo.email}`,
                },
              };
              let catalogUser: { entity: Entity } | undefined;
              try {
                catalogUser = await ctx.findCatalogUser(queryFilter);
              } catch (e) {
                logger.error((e as Error).message);
                // user not found in catalog
              }
              if (catalogUser) {
                return ctx.signInWithCatalogUser(queryFilter);
              }

              // Allow entry to NON CATALOG USERS : Boolean
              // Control this behaviour inside app-config.

              if (RESTRICT_NON_CATALOG_USER) {
                throw new Error('unauthorized');
              }
              const userRef = stringifyEntityRef({
                kind: 'User',
                name: userInfo.userId,
                namespace: DEFAULT_NAMESPACE,
              });

              return ctx.issueToken({
                claims: {
                  sub: userRef, // The user's own identity
                  ent: [userRef], // A list of identities that the user claims ownership through
                },
              });
            },
            async profileTransform(result) {
              let DEV_JWT_TOKEN: string | undefined;
              try {
                DEV_JWT_TOKEN = config
                  .getOptionalConfig('oauth2-jwt-token')
                  ?.getOptionalString('token');
              } catch (e) {
                logger.error(
                  'oauth2-jwt-token.token passed in app.config must be a string',
                  e as Error,
                );
              }

              let token: string =
                result.getHeader('x-atmosphere-token')?.toString() || '';
              if (!token && DEV_JWT_TOKEN) {
                token = DEV_JWT_TOKEN;
              }
              if (!token) {
                throw new Error('Missing x-atmosphere-token in header');
              }
              let decoded: any;
              try {
                decoded = jwtDecode(token);
              } catch (error) {
                throw new Error('Unable to decode JWT token');
              }
              if (!(decoded && decoded.fn)) {
                throw new Error('Invalid JWT token, missing fn');
              }
              const displayName =
                decoded.fn + (decoded.ln ? ` ${decoded.ln}` : '');
              return {
                profile: {
                  displayName,
                },
              };
            },
          }),
        });
      },
    });
  },
});
