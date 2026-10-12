/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
  type JWTVerifyGetKey,
} from 'jose';
import { getCPUrl } from './utils.ts';
import { DevHubConfig } from './config.ts';

/**
 * Upper bound on the number of secondary cache keys honoured per logout request.
 * Even for an authentically-signed token this caps the amount of cache work a
 * single request can trigger (defence-in-depth against an oversized array).
 */
export const MAX_SECONDARY_KEYS = 1000;

/** Resolved material needed to verify a back-channel logout token. */
export type LogoutVerifier = {
  /** JWKS key resolver bound to the IdP's signing keys. */
  keySet: JWTVerifyGetKey;
  /** Expected `iss` claim (the CP IdM's canonical issuer). */
  issuer: string;
};

let verifierPromise: Promise<LogoutVerifier> | undefined;

/**
 * Derives the region-level admin-plane issuer from the tenant OIDC issuer.
 *
 * The CP admin plane mints back-channel logout tokens for every tenant in a
 * region from a single `admin.<region>` host, whereas the OIDC discovery
 * document advertises the per-tenant issuer (`<tenant>.<region>`). They share
 * everything after the first host label, so we drop the tenant label and prefix
 * `admin.` — e.g. `https://ptdev.us-west.cp-dev-my.tcie.pro` yields
 * `https://admin.us-west.cp-dev-my.tcie.pro`.
 *
 * Returns `undefined` when no meaningful admin issuer can be derived (e.g. the
 * issuer host has no region portion, such as `localhost`), in which case only
 * the tenant issuer is accepted.
 */
export function deriveAdminIssuer(issuer: string): string | undefined {
  let url: URL;
  try {
    url = new URL(issuer);
  } catch {
    return undefined;
  }
  const labels = url.hostname.split('.');
  // Need at least a tenant label plus a region portion to strip and rebuild.
  if (labels.length < 2) {
    return undefined;
  }
  // Replace the tenant label with `admin`, preserving any port and path so a
  // discovered issuer that carries either (e.g. local/dev, or a path-based
  // issuer) still matches the `iss` in logout tokens.
  labels[0] = 'admin';
  url.hostname = labels.join('.');
  const path = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
  return `${url.origin}${path}`;
}

async function discoverLogoutVerifier(): Promise<LogoutVerifier> {
  const cpUrl = getCPUrl();
  if (!cpUrl.host || !cpUrl.proxy || !cpUrl.url) {
    throw new Error(
      'CP_URL or CP_DOMAIN not configured; cannot verify logout tokens',
    );
  }
  const res = await fetch(cpUrl.proxy + DevHubConfig.wellKnownApiPath, {
    method: 'GET',
    headers: { 'x-cp-host': cpUrl.host },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch OIDC discovery document: HTTP ${res.status}`,
    );
  }
  const metadata = (await res.json()) as {
    issuer?: string;
    jwks_uri?: string;
  };
  if (!metadata.issuer || !metadata.jwks_uri) {
    throw new Error('OIDC discovery document missing issuer or jwks_uri');
  }
  // Fail closed if the discovery document points `jwks_uri` at a different
  // origin than the expected CP host. Without this check a misconfigured or
  // compromised discovery document could make the backend fetch signing keys
  // (which then verify logout tokens) from an attacker-controlled host — a
  // trust bypass / SSRF. The rewrite below is a no-op for such a URL, so it
  // would otherwise be used verbatim.
  if (new URL(metadata.jwks_uri).origin !== new URL(cpUrl.url).origin) {
    throw new Error(
      `OIDC discovery jwks_uri origin does not match expected CP origin; refusing to fetch signing keys`,
    );
  }
  // The discovery document advertises the externally-reachable CP host; rewrite
  // the JWKS URL to the internal proxy exactly as authenticator.ts does for the
  // token/userinfo/jwks endpoints.
  const jwksUri = metadata.jwks_uri.replace(cpUrl.url, cpUrl.proxy);
  const keySet = createRemoteJWKSet(new URL(jwksUri), {
    headers: { 'x-cp-host': cpUrl.host },
  });
  return { keySet, issuer: metadata.issuer };
}

/**
 * Lazily discovers (and caches) the issuer + JWKS used to verify back-channel
 * logout tokens. A failed discovery is not cached so the next request retries.
 */
export function getLogoutVerifier(): Promise<LogoutVerifier> {
  if (!verifierPromise) {
    verifierPromise = discoverLogoutVerifier().catch(err => {
      verifierPromise = undefined;
      throw err;
    });
  }
  return verifierPromise;
}

/**
 * Cryptographically verifies a CP back-channel logout token's signature and
 * issuer, then returns the (bounded) list of secondary cache keys it authorises
 * for eviction. The previous implementation decoded the token WITHOUT verifying
 * its signature, letting any unauthenticated caller supply an arbitrary
 * `secondaryKeys` array and evict other users' cached sessions.
 *
 * The token's signature is always verified against the CP's JWKS (whose origin
 * is pinned during discovery). In addition to the tenant issuer, the region
 * admin-plane issuer is accepted, since the CP admin plane signs logout tokens
 * for the whole region with a key served by that same trusted JWKS — see
 * {@link deriveAdminIssuer}. This does not widen the trust anchor, only the set
 * of legitimate `iss` strings.
 *
 * @throws if the signature is invalid, the issuer does not match, or the token
 * is otherwise malformed — callers should treat any throw as a 401.
 */
export async function verifyLogoutToken(
  logoutToken: string,
  verifier: LogoutVerifier,
): Promise<string[]> {
  const adminIssuer = deriveAdminIssuer(verifier.issuer);
  const acceptedIssuers =
    adminIssuer && adminIssuer !== verifier.issuer
      ? [verifier.issuer, adminIssuer]
      : [verifier.issuer];
  const { payload } = await jwtVerify(logoutToken, verifier.keySet, {
    issuer: acceptedIssuers,
  });
  const secondaryKeys = (payload as JWTPayload & { secondaryKeys?: unknown })
    .secondaryKeys;
  if (!Array.isArray(secondaryKeys)) {
    return [];
  }
  return secondaryKeys
    .filter((key): key is string => typeof key === 'string')
    .slice(0, MAX_SECONDARY_KEYS);
}
