/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import crypto from 'crypto';
import {
  custom,
  CustomHttpOptionsProvider,
  Issuer,
  ClientAuthMethod,
  TokenSet,
  UserinfoResponse,
  Strategy as OidcStrategy,
} from 'openid-client';
import {
  createOAuthAuthenticator,
  OAuthAuthenticatorResult,
  PassportDoneCallback,
  PassportHelpers,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthPrivateInfo,
} from '@backstage/plugin-auth-node';
import { durationToMilliseconds } from '@backstage/types';
import { readDurationFromConfig } from '@backstage/config';
import { Request } from 'express';
import { KeyvStore } from './cacheService.ts';
import { deleteFromCache, getCPUrl, getTTL } from './utils.ts';
import { RootConfigService } from '@backstage/backend-plugin-api';

const HTTP_OPTION_TIMEOUT = 10000;
const createHttpOptionsProvider =
  ({ timeout }: { timeout?: number }): CustomHttpOptionsProvider =>
  (_url, options) => {
    return {
      ...options,
      timeout: timeout ?? HTTP_OPTION_TIMEOUT,
    };
  };

/**
 * authentication result for the OIDC which includes the token set and user
 * profile response
 * @public
 */
export type OidcAuthResult = {
  tokenset: TokenSet;
  userinfo: UserinfoResponse;
};

const setCookieAccessToken = (
  config: RootConfigService,
  req: Request,
  tokenset: TokenSet,
  clear?: boolean,
) => {
  const origin = req.get('origin') || config.getString('app.baseUrl');
  const { hostname: domain, protocol } = new URL(origin);
  const secure = protocol === 'https:';
  if (clear) {
    req.res?.clearCookie('cp-token', {
      domain,
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/api',
    });
    return;
  }
  if (tokenset) {
    req.res?.cookie('cp-token', tokenset.access_token, {
      expires: tokenset.expires_at
        ? new Date(tokenset.expires_at * 1000)
        : undefined,
      domain,
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/',
    });
  }
};

/** @public */
export const oidcAuthenticator = (rootConfig: RootConfigService) =>
  createOAuthAuthenticator({
    defaultProfileTransform: async (
      input: OAuthAuthenticatorResult<OidcAuthResult>,
    ) => ({
      profile: {
        email: input.fullProfile.userinfo.email,
        picture: input.fullProfile.userinfo.picture,
        displayName: input.fullProfile.userinfo.name,
      },
    }),
    scopes: {
      persist: true,
      required: ['openid', 'profile', 'email'],
    },
    initialize({ callbackUrl, config }) {
      const clientId = config.getString('clientId');
      const clientSecret = config.getString('clientSecret');
      const metadataUrl = config.getString('metadataUrl');
      const customCallbackUrl = config.getOptionalString('callbackUrl');
      const tokenEndpointAuthMethod = config.getOptionalString(
        'tokenEndpointAuthMethod',
      ) as ClientAuthMethod;
      const tokenSignedResponseAlg = config.getOptionalString(
        'tokenSignedResponseAlg',
      );
      const initializedPrompt = config.getOptionalString('prompt');

      if (config.has('scope')) {
        throw new Error(
          'The oidc provider no longer supports the "scope" configuration option. Please use the "additionalScopes" option instead.',
        );
      }
      const cpUrl = getCPUrl();
      if (!cpUrl.url || !cpUrl.proxy) {
        throw new Error(
          'CP_URL or CP_DOMAIN not found as an environmental variable',
        );
      }

      const timeoutMilliseconds = config.has('timeout')
        ? durationToMilliseconds(
            readDurationFromConfig(config, { key: 'timeout' }),
          )
        : undefined;
      const httpOptionsProvider = createHttpOptionsProvider({
        timeout: timeoutMilliseconds,
      });
      Issuer[custom.http_options] = httpOptionsProvider;
      const promise = Issuer.discover(metadataUrl).then(async issuerOut => {
        const metaData: any = issuerOut.metadata;
        for (const prop of [
          'token_endpoint',
          'userinfo_endpoint',
          'jwks_uri',
          'registration_endpoint',
          'revocation_endpoint',
        ]) {
          metaData[prop] = metaData[prop].replace(cpUrl.url, cpUrl.proxy);
        }
        const issuer = new Issuer(metaData);
        issuer[custom.http_options] = httpOptionsProvider;
        issuer.Client[custom.http_options] = httpOptionsProvider;
        const client = new issuer.Client({
          access_type: 'offline', // this option must be passed to provider to receive a refresh token
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uris: [customCallbackUrl || callbackUrl],
          response_types: ['code'],
          token_endpoint_auth_method:
            tokenEndpointAuthMethod || 'client_secret_basic',
          id_token_signed_response_alg: tokenSignedResponseAlg || 'RS256',
        });
        client[custom.http_options] = httpOptionsProvider;

        const strategy = new OidcStrategy(
          {
            client,
            passReqToCallback: false,
          },
          (
            tokenset: TokenSet,
            userinfo: UserinfoResponse,
            done: PassportDoneCallback<
              OidcAuthResult,
              PassportOAuthPrivateInfo
            >,
          ) => {
            if (typeof done !== 'function') {
              throw new Error(
                'OIDC IdP must provide a userinfo_endpoint in the metadata response',
              );
            }

            done(
              undefined,
              { tokenset, userinfo },
              { refreshToken: tokenset.refresh_token },
            );
          },
        );

        const helper = PassportOAuthAuthenticatorHelper.from(strategy);
        return { helper, client, strategy };
      });

      return { initializedPrompt, promise };
    },

    async start(input, ctx) {
      const { initializedPrompt, promise } = ctx;
      const { helper } = await promise;
      const options: Record<string, string> = {
        scope: input.scope,
        state: input.state,
        nonce: crypto.randomBytes(16).toString('base64'),
      };
      const prompt = initializedPrompt || 'none';
      if (prompt !== 'auto') {
        options.prompt = prompt;
      }

      return helper.start(input, {
        ...options,
      });
    },

    async authenticate(
      input,
      ctx,
    ): Promise<OAuthAuthenticatorResult<OidcAuthResult>> {
      const { strategy } = await ctx.promise;
      const { result, privateInfo } =
        await PassportHelpers.executeFrameHandlerStrategy<
          OidcAuthResult,
          PassportOAuthPrivateInfo
        >(input.req, strategy);
      // @ts-ignore
      setCookieAccessToken(rootConfig, input.req, result.tokenset);

      const outResult = {
        fullProfile: result,
        session: {
          accessToken: result.tokenset.access_token!,
          tokenType: result.tokenset.token_type ?? 'bearer',
          scope: result.tokenset.scope!,
          expiresInSeconds: result.tokenset.expires_at,
          idToken: result.tokenset.id_token,
          refreshToken: privateInfo.refreshToken,
        },
      };
      const ttl = getTTL(result.tokenset.expires_at || 0);
      await KeyvStore.keyv.set(
        `${result.tokenset.access_token}-info`,
        outResult,
        ttl,
      );
      outResult.session.expiresInSeconds = ttl / 1000;
      return outResult;
    },

    async refresh(input, ctx) {
      const accessToken: string = input.req.cookies['cp-token'];
      if (accessToken) {
        const outResult = await KeyvStore.keyv.get(`${accessToken}-info`);
        if (outResult && outResult.session.expiresInSeconds) {
          const ttl = getTTL(outResult.session.expiresInSeconds || 0);
          if (ttl > 5 * 60 * 1000) {
            outResult.session.expiresInSeconds = ttl / 1000;
            return new Promise(async (resolve, _reject) => {
              resolve(outResult);
            });
          }
        }
      }
      const { client } = await ctx.promise;
      if (!input.refreshToken) {
        throw new Error('Refresh failed');
      }
      const tokenset = await client.refresh(input.refreshToken);
      if (!tokenset.access_token) {
        throw new Error('Refresh failed');
      }
      const userinfo = await client.userinfo(tokenset.access_token);

      return new Promise(async (resolve, reject) => {
        if (!tokenset.access_token) {
          reject(new Error('Refresh Failed'));
        }
        await deleteFromCache(accessToken);
        // @ts-ignore
        setCookieAccessToken(rootConfig, input.req, tokenset);
        const outResult = {
          fullProfile: { userinfo, tokenset },
          session: {
            accessToken: tokenset.access_token!,
            tokenType: tokenset.token_type ?? 'bearer',
            scope: tokenset.scope!,
            expiresInSeconds: tokenset.expires_at,
            idToken: tokenset.id_token,
            refreshToken: tokenset.refresh_token,
          },
        };
        const ttl = getTTL(tokenset.expires_at || 0);
        await KeyvStore.keyv.set(
          `${tokenset.access_token}-info`,
          outResult,
          ttl,
        );
        outResult.session.expiresInSeconds = ttl / 1000;
        resolve(outResult);
      });
    },

    async logout(input, ctx) {
      const { client } = await ctx.promise;
      const issuer = client.issuer;
      const accessToken: string = input.req.cookies['cp-token'];
      await deleteFromCache(accessToken);
      // @ts-ignore
      setCookieAccessToken(rootConfig, input.req, undefined, true);
      if (accessToken && issuer.revocation_endpoint) {
        await client.revoke(accessToken);
      }
    },
  });
