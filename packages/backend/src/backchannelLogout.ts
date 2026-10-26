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
};

let verifierPromise: Promise<LogoutVerifier> | undefined;

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
  return { keySet };
}

/**
 * Lazily discovers (and caches) the JWKS used to verify back-channel logout
 * tokens. A failed discovery is not cached so the next request retries.
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
 * OIDC back-channel logout event URI. A genuine logout token carries this under
 * its `events` claim; access/id tokens the same JWKS could sign do not.
 */
const BACKCHANNEL_LOGOUT_EVENT =
  'http://schemas.openid.net/event/backchannel-logout';

/**
 * Max accepted age of a logout token, in seconds. Enforced via jose's
 * `maxTokenAge` against the `iat` claim to bound replay of a captured token
 * (and the repeated bounded cache work it would trigger). The CP delivers
 * logout tokens promptly server-to-server, so a short window is safe.
 */
const LOGOUT_TOKEN_MAX_AGE_SECONDS = 600;

/**
 * Clock-skew tolerance (seconds) applied to the `iat`/`maxTokenAge` check. These
 * tokens are verified immediately on receipt, so a small tolerance absorbs
 * ordinary clock drift between CP and this backend without meaningfully widening
 * the replay window.
 */
const LOGOUT_TOKEN_CLOCK_TOLERANCE_SECONDS = 60;

/**
 * Cryptographically verifies a CP back-channel logout token, then returns the
 * (bounded) list of secondary cache keys it authorises for eviction. The
 * previous implementation decoded the token WITHOUT verifying its signature,
 * letting any unauthenticated caller supply an arbitrary `secondaryKeys` array
 * and evict other users' cached sessions.
 *
 * Validation, in order:
 * 1. **Signature** against the CP's JWKS (origin pinned during discovery) — the
 *    trust anchor; only tokens genuinely signed by the CP are honoured.
 * 2. **Audience** (when `expectedAudience` is configured) must equal our OIDC
 *    `client_id`, so another CP client's token cannot be replayed here
 *    (cross-client token confusion).
 * 3. **Freshness** — `iat` is required and the token must be no older than
 *    {@link LOGOUT_TOKEN_MAX_AGE_SECONDS} (`maxTokenAge`), bounding replay of a
 *    captured token.
 * 4. **`events` claim** must carry the back-channel-logout event, so a
 *    different CP-signed token type (access/id token) is not accepted here.
 *
 * The `iss` claim is intentionally NOT checked — the CP mints logout tokens for
 * a whole region from an admin-plane host whose exact `iss` is not reliably
 * derivable from the per-tenant discovery issuer; the signature + audience +
 * freshness + event checks establish authenticity and purpose without it.
 *
 * @throws if the signature is invalid, the audience/freshness/event checks fail,
 * or the token is otherwise malformed — callers should treat any throw as a 401.
 */
export async function verifyLogoutToken(
  logoutToken: string,
  verifier: LogoutVerifier,
  expectedAudience?: string,
): Promise<string[]> {
  const { payload } = await jwtVerify(logoutToken, verifier.keySet, {
    maxTokenAge: LOGOUT_TOKEN_MAX_AGE_SECONDS,
    clockTolerance: LOGOUT_TOKEN_CLOCK_TOLERANCE_SECONDS,
    ...(expectedAudience ? { audience: expectedAudience } : {}),
  });
  const events = (payload as JWTPayload & { events?: unknown }).events;
  // Per OIDC Back-Channel Logout, `events` is a JSON object whose member for the
  // logout event is itself a JSON object ({}). Require the member's value to be a
  // (non-array) object, not merely present, so a malformed scalar value does not
  // pass the purpose check.
  const eventValue =
    typeof events === 'object' && events !== null
      ? (events as Record<string, unknown>)[BACKCHANNEL_LOGOUT_EVENT]
      : undefined;
  if (
    typeof eventValue !== 'object' ||
    eventValue === null ||
    Array.isArray(eventValue)
  ) {
    throw new Error(
      'Not a back-channel logout token (missing or malformed back-channel-logout event)',
    );
  }
  const secondaryKeys = (payload as JWTPayload & { secondaryKeys?: unknown })
    .secondaryKeys;
  if (!Array.isArray(secondaryKeys)) {
    return [];
  }
  return secondaryKeys
    .filter((key): key is string => typeof key === 'string')
    .slice(0, MAX_SECONDARY_KEYS);
}
