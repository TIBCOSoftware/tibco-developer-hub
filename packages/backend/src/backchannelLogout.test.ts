/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  SignJWT,
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  type JWK,
  type JWTVerifyGetKey,
  type KeyLike,
} from 'jose';
import {
  MAX_SECONDARY_KEYS,
  verifyLogoutToken,
  type LogoutVerifier,
} from './backchannelLogout';

const ISSUER = 'https://cp.example.com';
const AUDIENCE = 'client-123';
const BACKCHANNEL_LOGOUT_EVENT =
  'http://schemas.openid.net/event/backchannel-logout';
const ALG = 'RS256';

type TestKeys = {
  privateKey: KeyLike;
  publicJwk: JWK;
  keySet: JWTVerifyGetKey;
};

async function makeKeys(): Promise<TestKeys> {
  const { privateKey, publicKey } = await generateKeyPair(ALG);
  const publicJwk = await exportJWK(publicKey);
  const keySet = createLocalJWKSet({ keys: [publicJwk] });
  return { privateKey, publicJwk, keySet };
}

async function signToken(
  privateKey: KeyLike,
  payload: Record<string, unknown>,
  {
    issuer = ISSUER,
    audience = AUDIENCE,
    includeEvent = true,
    iat,
  }: {
    issuer?: string;
    audience?: string;
    includeEvent?: boolean;
    iat?: number;
  } = {},
): Promise<string> {
  const claims: Record<string, unknown> = { ...payload };
  // A genuine back-channel logout token carries the logout event; include it by
  // default so the happy-path tests exercise a realistic token.
  if (includeEvent && claims.events === undefined) {
    claims.events = { [BACKCHANNEL_LOGOUT_EVENT]: {} };
  }
  const builder = new SignJWT(claims)
    .setProtectedHeader({ alg: ALG })
    .setIssuer(issuer)
    .setIssuedAt(iat);
  if (audience !== undefined) {
    builder.setAudience(audience);
  }
  return builder.sign(privateKey);
}

describe('verifyLogoutToken', () => {
  let keys: TestKeys;
  let verifier: LogoutVerifier;

  beforeEach(async () => {
    keys = await makeKeys();
    verifier = { keySet: keys.keySet };
  });

  it('returns the secondaryKeys from a validly-signed token', async () => {
    const token = await signToken(keys.privateKey, {
      secondaryKeys: ['a', 'b', 'c'],
    });
    await expect(verifyLogoutToken(token, verifier)).resolves.toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('rejects a token signed by an untrusted key', async () => {
    const attacker = await makeKeys();
    const token = await signToken(attacker.privateKey, {
      secondaryKeys: ['victim-session'],
    });
    // Verified against the legitimate key set -> signature check fails.
    await expect(verifyLogoutToken(token, verifier)).rejects.toThrow();
  });

  it('accepts a validly-signed token regardless of its iss claim', async () => {
    // The signature (against the pinned CP JWKS) is the trust anchor; the iss
    // claim is intentionally not checked, so a token from the region admin-plane
    // host (a different iss than the per-tenant discovery issuer) is honoured.
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['x', 'y'] },
      { issuer: 'https://admin.us-west.cp-dev-my.tcie.pro' },
    );
    await expect(verifyLogoutToken(token, verifier)).resolves.toEqual([
      'x',
      'y',
    ]);
  });

  it('accepts a token addressed to the expected audience', async () => {
    const token = await signToken(keys.privateKey, {
      secondaryKeys: ['x'],
    });
    await expect(verifyLogoutToken(token, verifier, AUDIENCE)).resolves.toEqual(
      ['x'],
    );
  });

  it('rejects a token addressed to a different audience', async () => {
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['x'] },
      { audience: 'some-other-client' },
    );
    await expect(
      verifyLogoutToken(token, verifier, AUDIENCE),
    ).rejects.toThrow();
  });

  it('rejects a token without the back-channel-logout event claim', async () => {
    // A different CP-signed token type (e.g. an access/id token) would verify by
    // signature but must not be accepted as a logout token.
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['x'] },
      { includeEvent: false },
    );
    await expect(
      verifyLogoutToken(token, verifier, AUDIENCE),
    ).rejects.toThrow();
  });

  it('rejects a token whose back-channel-logout event value is not an object', async () => {
    const token = await signToken(keys.privateKey, {
      secondaryKeys: ['x'],
      events: { [BACKCHANNEL_LOGOUT_EVENT]: 'not-an-object' },
    });
    await expect(
      verifyLogoutToken(token, verifier, AUDIENCE),
    ).rejects.toThrow();
  });

  it('rejects a token older than the max allowed age (replay)', async () => {
    // iat one hour ago -> beyond the 10-minute maxTokenAge window.
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['x'] },
      { iat: Math.floor(Date.now() / 1000) - 3600 },
    );
    await expect(
      verifyLogoutToken(token, verifier, AUDIENCE),
    ).rejects.toThrow();
  });

  it('rejects a syntactically invalid token', async () => {
    await expect(verifyLogoutToken('not-a-jwt', verifier)).rejects.toThrow();
  });

  it('returns an empty list when secondaryKeys is missing', async () => {
    const token = await signToken(keys.privateKey, { sub: 'user-1' });
    await expect(verifyLogoutToken(token, verifier)).resolves.toEqual([]);
  });

  it('ignores non-string entries in secondaryKeys', async () => {
    const token = await signToken(keys.privateKey, {
      secondaryKeys: ['keep', 42, null, { nested: true }, 'also-keep'],
    });
    await expect(verifyLogoutToken(token, verifier)).resolves.toEqual([
      'keep',
      'also-keep',
    ]);
  });

  it('bounds the number of returned keys to MAX_SECONDARY_KEYS', async () => {
    const many = Array.from(
      { length: MAX_SECONDARY_KEYS + 50 },
      (_unused, i) => `k${i}`,
    );
    const token = await signToken(keys.privateKey, { secondaryKeys: many });
    const result = await verifyLogoutToken(token, verifier);
    expect(result).toHaveLength(MAX_SECONDARY_KEYS);
    expect(result[0]).toBe('k0');
  });
});
