import {
  DEFAULT_NAMESPACE,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  providers,
  AuthResolverCatalogUserQuery,
} from '@backstage/plugin-auth-backend';
import { PluginEnvironment } from '../../types';
import jwtDecode from 'jwt-decode';

export function oAuth2ProxyProviderFactory(env: PluginEnvironment) {
  return providers.oauth2Proxy.create({
    signIn: {
      async resolver({ result }, ctx) {
        let DEV_JWT_TOKEN: string | undefined;
        try {
          DEV_JWT_TOKEN = env.config
            .getOptionalConfig('oauth2-jwt-token')
            ?.getOptionalString('token');
        } catch (e) {
          env.logger.error(
            'oauth2-jwt-token.token passed in app.config must be a string',
          );
          env.logger.error(e);
        }

        let RESTRICT_NON_CATALOG_USER: boolean | undefined;
        try {
          RESTRICT_NON_CATALOG_USER = env.config
            .getOptionalConfig('restrict-non-catalog-user')
            ?.getOptionalBoolean('value');
        } catch (e) {
          env.logger.error(
            'restrict-non-catalog-user.value passed in app.config must be a boolean',
          );
          env.logger.error(e);
        }
        let token: string =
          result.getHeader('x-atmosphere-token')?.toString() || '';
        if (!token && DEV_JWT_TOKEN) {
          token = DEV_JWT_TOKEN;
        }
        if (!token) {
          throw new Error('Missing x-atmosphere-token in header');
        }
        if (typeof token !== 'string') {
          throw new Error(
            'Invalid x-atmosphere-token in header, x-atmosphere-token must be a string',
          );
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
          env.logger.error(e);
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
    },
    authHandler: async result => {
      let DEV_JWT_TOKEN: string | undefined;
      try {
        DEV_JWT_TOKEN = env.config
          .getOptionalConfig('oauth2-jwt-token')
          ?.getOptionalString('token');
      } catch (e) {
        env.logger.error(
          'oauth2-jwt-token.token passed in app.config must be a string',
        );
        env.logger.error(e);
      }

      let token: string =
        result.getHeader('x-atmosphere-token')?.toString() || '';
      if (!token && DEV_JWT_TOKEN) {
        token = DEV_JWT_TOKEN;
      }
      if (!token) {
        throw new Error('Missing x-atmosphere-token in header');
      }
      if (typeof token !== 'string') {
        throw new Error(
          'Invalid x-atmosphere-token in header, x-atmosphere-token must be a string',
        );
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
      const displayName = decoded.fn + (decoded.ln ? ` ${decoded.ln}` : '');
      return {
        profile: {
          displayName,
        },
      };
    },
  });
}
