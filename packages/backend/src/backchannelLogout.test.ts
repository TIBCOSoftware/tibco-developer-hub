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
  deriveAdminIssuer,
  verifyLogoutToken,
  type LogoutVerifier,
} from './backchannelLogout';

const ISSUER = 'https://cp.example.com';
// Region admin-plane issuer derived from ISSUER (drop first label, prefix admin.).
const ADMIN_ISSUER = 'https://admin.example.com';
const OTHER_ISSUER = 'https://evil.example.com';
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
  issuer = ISSUER,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuer(issuer)
    .setIssuedAt()
    .sign(privateKey);
}

describe('verifyLogoutToken', () => {
  let keys: TestKeys;
  let verifier: LogoutVerifier;

  beforeEach(async () => {
    keys = await makeKeys();
    verifier = { keySet: keys.keySet, issuer: ISSUER };
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

  it('accepts a validly-signed token from the region admin issuer', async () => {
    // The CP admin plane signs logout tokens with a key from the same trusted
    // JWKS but sets iss to the region admin host, not the tenant issuer.
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['x', 'y'] },
      ADMIN_ISSUER,
    );
    await expect(verifyLogoutToken(token, verifier)).resolves.toEqual([
      'x',
      'y',
    ]);
  });

  it('accepts an admin-issuer token when the tenant issuer carries a port', async () => {
    // Local/dev: discovered issuer has an explicit port; the derived admin
    // issuer must keep it so the logout token's iss still matches.
    const portVerifier: LogoutVerifier = {
      keySet: keys.keySet,
      issuer: 'https://ptdev.us-west.example.com:8443',
    };
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['z'] },
      'https://admin.us-west.example.com:8443',
    );
    await expect(verifyLogoutToken(token, portVerifier)).resolves.toEqual([
      'z',
    ]);
  });

  it('rejects a validly-signed token from the wrong issuer', async () => {
    const token = await signToken(
      keys.privateKey,
      { secondaryKeys: ['x'] },
      OTHER_ISSUER,
    );
    await expect(verifyLogoutToken(token, verifier)).rejects.toThrow();
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

describe('deriveAdminIssuer', () => {
  it('drops the tenant label and prefixes admin. for a region issuer', () => {
    expect(deriveAdminIssuer('https://ptdev.us-west.cp-dev-my.tcie.pro')).toBe(
      'https://admin.us-west.cp-dev-my.tcie.pro',
    );
  });

  it('preserves the scheme', () => {
    expect(deriveAdminIssuer('http://cp.example.com')).toBe(
      'http://admin.example.com',
    );
  });

  it('preserves an explicit port', () => {
    expect(deriveAdminIssuer('https://ptdev.us-west.example.com:8443')).toBe(
      'https://admin.us-west.example.com:8443',
    );
  });

  it('preserves a non-root path without adding a trailing slash', () => {
    expect(deriveAdminIssuer('https://ptdev.example.com/idm')).toBe(
      'https://admin.example.com/idm',
    );
    expect(deriveAdminIssuer('https://ptdev.example.com/')).toBe(
      'https://admin.example.com',
    );
  });

  it('returns undefined when the host has no region portion', () => {
    expect(deriveAdminIssuer('https://localhost')).toBeUndefined();
  });

  it('returns undefined for a non-URL issuer', () => {
    expect(deriveAdminIssuer('not-a-url')).toBeUndefined();
  });
});
