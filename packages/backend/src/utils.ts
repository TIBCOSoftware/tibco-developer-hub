/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { KeyvStore } from './cacheService.ts';

let cpUrlCache: { host: string; url: string; proxy: string } | undefined;

export async function deleteFromCache(accessToken: string) {
  if (accessToken) {
    const jwtFromCache = await KeyvStore.keyv.get(accessToken);
    if (jwtFromCache?.secondaryKey) {
      await KeyvStore.keyv.delete(jwtFromCache.secondaryKey);
    }
    await KeyvStore.keyv.delete(accessToken);
    await KeyvStore.keyv.delete(`${accessToken}-info`);
    await KeyvStore.keyvMemory.delete(accessToken);
  }
}

export function getTTL(expireAt: number): number {
  if (!expireAt) {
    return 0;
  }
  return new Date(expireAt * 1000).getTime() - new Date().getTime();
}

export function getCPUrl(): { host: string; url: string; proxy: string } {
  if (cpUrlCache) {
    return cpUrlCache;
  }
  const cpUrl = process.env.CP_URL;
  const cpDomain = process.env.CP_DOMAIN;
  if (!cpUrl || !cpDomain) {
    return { host: '', url: '', proxy: '' };
  }
  return { host: cpUrl, url: `https://${cpUrl}`, proxy: `http://${cpDomain}` };
}

export function getBearerTokenFromAuthorizationHeader(
  authorizationHeader: unknown,
): string | undefined {
  if (typeof authorizationHeader !== 'string') {
    return undefined;
  }
  const matches = authorizationHeader.match(/^Bearer[ ]+(\S+)$/i);
  return matches?.[1];
}
