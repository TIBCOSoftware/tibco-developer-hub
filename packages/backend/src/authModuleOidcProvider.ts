/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from './authenticator.ts';

export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'tibco-control-plane',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ providers, config }) {
        const enableAuthProviders = config.getOptionalStringArray(
          'auth.enableAuthProviders',
        );
        if (
          enableAuthProviders &&
          enableAuthProviders.includes('tibco-control-plane')
        ) {
          providers.registerProvider({
            providerId: 'tibco-control-plane',
            factory: createOAuthProviderFactory({
              authenticator: oidcAuthenticator(config),
              async signInResolver(info, ctx) {
                const sub = info.result.fullProfile.userinfo.sub;
                if (!sub) {
                  throw new Error('Subject (sub) not found in OIDC response');
                }
                // CP IdM issues `sub` as a plain lowercase UUID, which is
                // already a valid, stable and unique Backstage entity name, so
                // it is used directly as the identity anchor.
                const userRef = stringifyEntityRef({
                  kind: 'User',
                  name: sub,
                  namespace: DEFAULT_NAMESPACE,
                });
                return ctx.issueToken({
                  claims: {
                    sub: userRef,
                    ent: [userRef],
                  },
                });
              },
            }),
          });
        }
      },
    });
  },
});
