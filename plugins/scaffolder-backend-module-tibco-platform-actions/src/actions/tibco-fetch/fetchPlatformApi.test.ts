/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  fetchPlatformApiAction,
  getCpBaseUrl,
  getCpBrowserUrl,
} from './fetchPlatformApi';
import { ConfigReader } from '@backstage/config';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

function createMockContext(
  input: Record<string, unknown>,
  workspacePath: string,
  secrets?: Record<string, string>,
) {
  const outputs: Record<string, unknown> = {};
  return {
    input,
    workspacePath,
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn().mockReturnThis(),
    },
    output: jest.fn((key: string, val: unknown) => {
      outputs[key] = val;
    }),
    outputs,
    logStream: { write: jest.fn() },
    createTemporaryDirectory: jest.fn(),
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn().mockResolvedValue({}),
    secrets: secrets ?? {},
  };
}

describe('getCpBaseUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CP_DOMAIN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns http URL from CP_DOMAIN env variable', () => {
    process.env.CP_DOMAIN = 'internal.cluster';
    const config = new ConfigReader({});
    expect(getCpBaseUrl(config)).toBe('http://internal.cluster');
  });

  it('strips leading slash from CP_DOMAIN', () => {
    process.env.CP_DOMAIN = '/internal.cluster';
    const config = new ConfigReader({});
    expect(getCpBaseUrl(config)).toBe('http://internal.cluster');
  });

  it('falls back to cpLink with https', () => {
    const config = new ConfigReader({ cpLink: 'cp.example.com' });
    expect(getCpBaseUrl(config)).toBe('https://cp.example.com');
  });

  it('preserves existing protocol in cpLink', () => {
    const config = new ConfigReader({
      cpLink: 'https://cp.example.com',
    });
    expect(getCpBaseUrl(config)).toBe('https://cp.example.com');
  });

  it('returns undefined when no source is available', () => {
    const config = new ConfigReader({});
    expect(getCpBaseUrl(config)).toBeUndefined();
  });
});

describe('getCpBrowserUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CP_URL;
    delete process.env.CP_DOMAIN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns cpLink with https when cpLink is configured', () => {
    const config = new ConfigReader({
      cpLink: 'https://cphost.cp1-my.localhost.dataplanes.pro',
    });
    expect(getCpBrowserUrl(config)).toBe(
      'https://cphost.cp1-my.localhost.dataplanes.pro',
    );
  });

  it('adds https to cpLink without protocol', () => {
    const config = new ConfigReader({ cpLink: 'cp.example.com' });
    expect(getCpBrowserUrl(config)).toBe('https://cp.example.com');
  });

  it('falls back to CP_URL env var when cpLink is not set', () => {
    process.env.CP_URL = 'cp.production.tibco.com';
    const config = new ConfigReader({});
    expect(getCpBrowserUrl(config)).toBe('https://cp.production.tibco.com');
  });

  it('prefers cpLink over CP_URL', () => {
    process.env.CP_URL = 'cp.production.tibco.com';
    const config = new ConfigReader({ cpLink: 'https://cp.local.test' });
    expect(getCpBrowserUrl(config)).toBe('https://cp.local.test');
  });

  it('returns empty string when neither cpLink nor CP_URL is set', () => {
    const config = new ConfigReader({});
    expect(getCpBrowserUrl(config)).toBe('');
  });
});

describe('tibco:call-platform-api', () => {
  const originalEnv = process.env;
  let tmpDir: string;

  beforeEach(async () => {
    process.env = { ...originalEnv };
    delete process.env.CP_DOMAIN;
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fetch-platform-test-'));
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('has the correct action id', () => {
    const config = new ConfigReader({});
    const action = fetchPlatformApiAction(config);
    expect(action.id).toBe('tibco:call-platform-api');
  });

  it('throws when no baseUrl and no cpLink configured', async () => {
    const config = new ConfigReader({});
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/test', requireAuth: false },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(/No baseUrl/i);
  });

  it('throws when auth required but no token available', async () => {
    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      cpLink: 'https://cp.test',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/test', requireAuth: true },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(
      /Authentication required/i,
    );
  });

  it('makes a successful GET request and outputs results', async () => {
    const responseData = { items: [1, 2, 3] };
    const mockHeaders = new Headers({ 'x-custom': 'val' });
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => responseData,
      headers: mockHeaders,
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok-abc',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/resources', method: 'GET' },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.status).toBe(200);
    expect(ctx.outputs.data).toEqual(responseData);
  });

  it('outputs appBaseUrl from config with trailing slash stripped', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'https://devhub.example.com/tibco/hub/' },
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/test', method: 'GET' },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.appBaseUrl).toBe('https://devhub.example.com/tibco/hub');
  });

  it('outputs cpBrowserUrl from cpLink in local dev', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      cpLink: 'https://cphost.cp1-my.localhost.dataplanes.pro',
      TIBCOPlatformToken: 'tok',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/test', method: 'GET' },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.cpBrowserUrl).toBe(
      'https://cphost.cp1-my.localhost.dataplanes.pro',
    );
  });

  it('outputs cpBrowserUrl from CP_URL env in production', async () => {
    process.env.CP_DOMAIN = 'internal.cluster';
    process.env.CP_URL = 'cp.production.tibco.com';
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'https://devhub.acme.com/tibco/hub' },
      TIBCOPlatformToken: 'tok',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/test', method: 'GET' },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.appBaseUrl).toBe('https://devhub.acme.com/tibco/hub');
    expect(ctx.outputs.cpBrowserUrl).toBe('https://cp.production.tibco.com');
    expect(ctx.outputs.cpUrl).toBe('http://internal.cluster');
  });

  it('outputs empty cpBrowserUrl when neither cpLink nor CP_URL is set', async () => {
    process.env.CP_DOMAIN = 'internal.cluster';
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:7007/tibco/hub' },
      TIBCOPlatformToken: 'tok',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/test', method: 'GET' },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.cpBrowserUrl).toBe('');
  });

  it('sends POST request with JSON body', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 'new-1' }),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      TIBCOPlatformToken: 'tok',
    });
    process.env.CP_DOMAIN = 'internal.cluster';
    const action = fetchPlatformApiAction(config);

    const body = { name: 'resource-1' };
    const ctx = createMockContext(
      { endpoint: '/api/v1/resources', method: 'POST', body },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/resources'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(ctx.outputs.status).toBe(201);
  });

  it('throws on non-ok response', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'server error' }),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      { endpoint: '/api/v1/fail', method: 'GET' },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(
      /API call failed/i,
    );
  });

  it('skips auth header when requireAuth is false', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
    });
    process.env.CP_DOMAIN = 'internal.cluster';
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      {
        endpoint: '/health',
        method: 'GET',
        requireAuth: false,
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    const calledHeaders = fetchSpy.mock.calls[0][1]?.headers as Record<
      string,
      string
    >;
    expect(calledHeaders.authorization).toBeUndefined();
  });

  it('reads JSON body from a file when filePath is provided', async () => {
    const jsonContent = JSON.stringify({ key: 'value' });
    await fs.writeFile(path.join(tmpDir, 'body.json'), jsonContent);

    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      TIBCOPlatformToken: 'tok',
    });
    process.env.CP_DOMAIN = 'internal.cluster';
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      {
        endpoint: '/api/v1/import',
        method: 'POST',
        filePath: 'body.json',
        contentType: 'json',
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.status).toBe(200);
  });

  it('uses explicit baseUrl over config', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      cpLink: 'https://should-not-be-used.com',
      TIBCOPlatformToken: 'tok',
    });
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      {
        baseUrl: 'https://custom.host',
        endpoint: '/api/test',
        method: 'GET',
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('custom.host'),
      expect.anything(),
    );
  });

  it('uses cpToken from input over secrets and config', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers(),
    } as Response);

    const config = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000' },
      TIBCOPlatformToken: 'config-token',
    });
    process.env.CP_DOMAIN = 'internal.cluster';
    const action = fetchPlatformApiAction(config);

    const ctx = createMockContext(
      {
        endpoint: '/api/v1/test',
        method: 'GET',
        cpToken: 'input-token',
      },
      tmpDir,
      { cpToken: 'secret-token' },
    );
    await action.handler(ctx as any);

    const calledHeaders = fetchSpy.mock.calls[0][1]?.headers as Record<
      string,
      string
    >;
    expect(calledHeaders.authorization).toBe('Bearer input-token');
  });
});
