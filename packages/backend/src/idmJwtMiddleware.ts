/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthenticationError } from '@backstage/errors';
import {
  deleteFromCache,
  getBearerTokenFromAuthorizationHeader,
  getCPUrl,
  getTTL,
} from './utils.ts';
import { LoggerService } from '@backstage/backend-plugin-api';
import { DevHubConfig } from './config.ts';
import { KeyvStore } from './cacheService.ts';
import jwtDecode from 'jwt-decode';
import { fetch } from 'undici';

const cpUrl = getCPUrl();

const isTokenValid = (expiryTime: number): boolean => {
  return new Date(expiryTime * 1000).getTime() - new Date().getTime() > 0;
};

class HTTPResponseError extends Error {
  response: any;
  constructor(response: any) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}
export const getJwtFromToken = async (token: string): Promise<string> => {
  const jwtFromInMemCache = await KeyvStore.keyvMemory.get(token);
  let skip = false;
  if (jwtFromInMemCache) {
    if (
      jwtFromInMemCache.jwt &&
      jwtFromInMemCache.expiryTime &&
      isTokenValid(jwtFromInMemCache.expiryTime)
    ) {
      return jwtFromInMemCache.jwt;
    }
    await deleteFromCache(token);
    skip = true;
  }
  if (!skip) {
    const jwtFromCache = await KeyvStore.keyv.get(token);
    if (jwtFromCache) {
      if (
        jwtFromCache.jwt &&
        jwtFromCache.expiryTime &&
        isTokenValid(jwtFromCache.expiryTime)
      ) {
        const ttlCache = getTTL(jwtFromCache.expiryTime);
        await KeyvStore.keyvMemory.set(token, jwtFromCache, ttlCache);
        return jwtFromCache.jwt;
      }
      await deleteFromCache(token);
    }
  }

  if (!cpUrl.host || !cpUrl.proxy) {
    throw new AuthenticationError('CP_URL or CP_DOMAIN not provided');
  }
  const param: any = {
    method: 'POST',
    body: JSON.stringify({
      token: token,
      tenant_id: 'TSC',
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(cpUrl.proxy + DevHubConfig.idmJWTApiPath, param);

  if (!response.ok) {
    throw new HTTPResponseError(response);
  }
  const data: any = await response.json();
  if (!data || !data.jwt || !data.secondaryKey || !data.expiryTime) {
    throw new AuthenticationError('NO JWT found in IDM response');
  }
  const responseJwt = data.jwt;
  const ttl = getTTL(data.expiryTime);
  await KeyvStore.keyv.set(
    token,
    {
      jwt: responseJwt,
      secondaryKey: data.secondaryKey,
      expiryTime: data.expiryTime,
    },
    ttl,
  );
  await KeyvStore.keyvMemory.set(
    token,
    {
      jwt: responseJwt,
      secondaryKey: data.secondaryKey,
      expiryTime: data.expiryTime,
    },
    ttl,
  );
  await KeyvStore.keyv.set(data.secondaryKey, token, ttl);
  return responseJwt;
};

export const idmJwtMiddlewareFunction = (
  logger: LoggerService,
): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    let token =
      getBearerTokenFromAuthorizationHeader(req.get('X-TIBCO-OAUTH')) ||
      getBearerTokenFromAuthorizationHeader(req.get('authorization'));
    if (token) {
      const cicToken = token.match(/CIC~[0-9A-Za-z_-]{24}/);
      if (!cicToken) {
        try {
          const headerDecoded: { typ: string } = jwtDecode(token, {
            header: true,
          });
          // Below is to bypass plugin to plugin calls
          if (headerDecoded.typ === 'vnd.backstage.plugin') {
            return next();
          }
          const accessToken = req.cookies['cp-token'];
          if (!accessToken) {
            return next(
              new AuthenticationError('Access token not found in Cookie'),
            );
          }
          token = accessToken;
        } catch (error) {
          return next(new AuthenticationError('Unable to decode JWT token'));
        }
      }
      try {
        const responseJwt = await getJwtFromToken(token || '');
        if (responseJwt && cicToken) {
          req.headers.authorization = `Bearer ${responseJwt}`;
          return next();
        }
      } catch (error: any) {
        if (error instanceof AuthenticationError) {
          return next(error);
        }
        if (error instanceof HTTPResponseError) {
          const errorBody = await error.response.text();
          logger.error(`Error body: ${errorBody}`, error as Error);
          return next(new AuthenticationError('Invalid CIC token'));
        }
        logger.error('Error in getting JWT from IDM:', error as Error);
        return next(new AuthenticationError('Error in getting JWT from IDM'));
      }
    }
    return next();
  };
};
