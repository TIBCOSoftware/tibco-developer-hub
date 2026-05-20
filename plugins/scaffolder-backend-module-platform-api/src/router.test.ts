/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import express from 'express';
import request from 'supertest';
import { createRouter, getCpDomain } from './router';
import { ConfigReader, JsonObject } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';

function createMockLogger(): jest.Mocked<LoggerService> {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    child: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<LoggerService>;
}

async function createTestApp(configData: JsonObject = {}) {
  const config = new ConfigReader(configData);
  const logger = createMockLogger();
  const router = await createRouter({ config, logger });

  const app = express();
  app.use((req, _res, next) => {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
      for (const part of cookieHeader.split(';')) {
        const [k, ...v] = part.trim().split('=');
        req.cookies[k] = v.join('=');
      }
    }
    next();
  });
  app.use(router);

  return { app, logger };
}

describe('getCpDomain', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CP_DOMAIN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns CP_DOMAIN env variable when set', () => {
    process.env.CP_DOMAIN = 'my-cluster.example.com';
    const config = new ConfigReader({});
    expect(getCpDomain(config)).toBe('my-cluster.example.com');
  });

  it('falls back to cpLink config when env is unset', () => {
    const config = new ConfigReader({ cpLink: 'https://cp.example.com' });
    expect(getCpDomain(config)).toBe('https://cp.example.com');
  });

  it('returns undefined when neither source is available', () => {
    const config = new ConfigReader({});
    expect(getCpDomain(config)).toBeUndefined();
  });
});

describe('GET /platform/v1/data-planes', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CP_DOMAIN;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 503 when cpLink is not configured', async () => {
    const { app } = await createTestApp({});
    const res = await request(app).get('/platform/v1/data-planes');
    expect(res.status).toBe(503);
    expect(res.body.error).toBe('Service Unavailable');
  });

  it('returns 401 when no auth token is available', async () => {
    const { app } = await createTestApp({ cpLink: 'https://cp.test' });
    const res = await request(app).get('/platform/v1/data-planes');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('proxies successful response from platform API', async () => {
    const payload = { status: 'ok', response: [{ id: 'dp1', name: 'DP 1' }] };

    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => payload,
    } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok-123',
    });
    const res = await request(app).get('/platform/v1/data-planes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(payload);
  });

  it('forwards platform API error status', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: async () => 'denied',
    } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app).get('/platform/v1/data-planes');
    expect(res.status).toBe(403);
    expect(res.body.statusCode).toBe(403);
  });

  it('returns 500 on network error', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app).get('/platform/v1/data-planes');
    expect(res.status).toBe(500);
  });

  it('uses cp-token cookie when available', async () => {
    const payload = { status: 'ok', response: [] };
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => payload,
    } as Response);

    const { app } = await createTestApp({ cpLink: 'https://cp.test' });
    const res = await request(app)
      .get('/platform/v1/data-planes')
      .set('Cookie', 'cp-token=cookie-val');

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer cookie-val',
        }),
      }),
    );
  });
});

describe('GET /platform/v1/data-planes-with-capabilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CP_DOMAIN;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 503 when cpLink is not configured', async () => {
    const { app } = await createTestApp({});
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });
    expect(res.status).toBe(503);
  });

  it('returns 401 when no token', async () => {
    const { app } = await createTestApp({ cpLink: 'https://cp.test' });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when requiredCapabilities param is missing', async () => {
    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app).get(
      '/platform/v1/data-planes-with-capabilities',
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  it('returns only dataplanes where all required capabilities are green', async () => {
    const valuesYaml = `
global:
  cp:
    capability:
      pathPrefix: /tibco/flogo/dp-1
    resources:
      ingress:
        fqdn: dp.example.com
`;
    // Mock: list dataplanes → detail → status → capability-instance
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [
            { id: 'dp-1', name: 'DP 1' },
            { id: 'dp-2', name: 'DP 2' },
          ],
        }),
      } as Response)
      // 2a. dp-1 detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-f1', name: 'FLOGO', type: 'FLOGO' }],
          },
        }),
      } as Response)
      // 2b. dp-1 status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3a. dp-2 detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-f2', name: 'FLOGO', type: 'FLOGO' }],
          },
        }),
      } as Response)
      // 3b. dp-2 status — FLOGO is red
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'red',
            },
          ],
        }),
      } as Response)
      // 4. dp-1 capability-instance for deployment URL
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-f1',
              capability_type: 'FLOGO',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    expect(res.body.dataplanes[0].id).toBe('dp-1');
    expect(res.body.dataplanes[0].capabilities[0].capabilityStatus).toBe(
      'green',
    );
    expect(res.body.dataplanes[0].deployment.capabilityName).toBe('FLOGO');
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://dp.example.com/tibco/flogo/dp-1/',
    );
    expect(res.body.dataplanes[0].deployment.dataplaneHost).toBe(
      'dp.example.com',
    );
  });

  it('returns empty array when no dataplanes match', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-1', name: 'DP 1' }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-b1', name: 'BWCE', type: 'BWCE' }],
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [
            {
              capability: 'BWCE',
              type: 'BWCE',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(0);
  });

  it('skips dataplanes whose detail/status fetch fails', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [
            { id: 'dp-1', name: 'DP 1' },
            { id: 'dp-2', name: 'DP 2' },
          ],
        }),
      } as Response)
      // dp-1 detail fails
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal',
      } as Response)
      // dp-1 status (returned but detail already failed)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: [] }),
      } as Response)
      // dp-2 detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-f2', name: 'FLOGO', type: 'FLOGO' }],
          },
        }),
      } as Response)
      // dp-2 status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // dp-2 capability-instance
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-f2',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [
                    {
                      content:
                        'global:\n  cp:\n    resources:\n      ingress:\n        fqdn: dp2.example.com\n',
                    },
                  ],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    // dp-1 was skipped, only dp-2 remains
    expect(res.body.dataplanes).toHaveLength(1);
    expect(res.body.dataplanes[0].id).toBe('dp-2');
  });

  it('returns empty array when no dataplanes exist', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: [] }),
    } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toEqual([]);
  });

  it('matches BWCE capability by type even when name differs', async () => {
    const valuesYaml = `
global:
  cp:
    capability:
      pathPrefix: /tibco/bwce/dp-1
    resources:
      ingress:
        fqdn: bwce-dp.example.com
`;
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-1', name: 'BWCE Dataplane' }],
        }),
      } as Response)
      // 2a. dp-1 detail — name is a display name, type is the identifier
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [
              {
                id: 'cap-b1',
                name: 'BusinessWorks Container Edition',
                type: 'BWCE',
              },
            ],
          },
        }),
      } as Response)
      // 2b. dp-1 status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'BWCE',
              type: 'BWCE',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3. dp-1 capability-instance for deployment URL
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-b1',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'BWCE' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    expect(res.body.dataplanes[0].capabilities).toHaveLength(1);
    expect(res.body.dataplanes[0].capabilities[0].type).toBe('BWCE');
    expect(res.body.dataplanes[0].capabilities[0].name).toBe(
      'BusinessWorks Container Edition',
    );
    expect(res.body.dataplanes[0].deployment.capabilityId).toBe('cap-b1');
    expect(res.body.dataplanes[0].deployment.capabilityType).toBe('BWCE');
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://bwce-dp.example.com/tibco/bwce/dp-1/',
    );
    expect(res.body.dataplanes[0].deployment.dataplaneHost).toBe(
      'bwce-dp.example.com',
    );
  });

  it('matches TIBCOHUB capability by type even when name differs', async () => {
    const valuesYaml = `
global:
  cp:
    capability:
      pathPrefix: /tibco/tibcohub/dp-hub
    resources:
      ingress:
        fqdn: hub-dp.example.com
`;
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-hub', name: 'Hub Dataplane' }],
        }),
      } as Response)
      // 2a. dp-hub detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [
              {
                id: 'cap-h1',
                name: 'TIBCO Hub',
                type: 'TIBCOHUB',
              },
            ],
          },
        }),
      } as Response)
      // 2b. dp-hub status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'TIBCOHUB',
              type: 'TIBCOHUB',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3. dp-hub capability-instance
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-h1',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'TIBCOHUB' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    expect(res.body.dataplanes[0].capabilities).toHaveLength(1);
    expect(res.body.dataplanes[0].capabilities[0].type).toBe('TIBCOHUB');
    expect(res.body.dataplanes[0].deployment.capabilityId).toBe('cap-h1');
    expect(res.body.dataplanes[0].deployment.capabilityType).toBe('TIBCOHUB');
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://hub-dp.example.com/tibco/tibcohub/dp-hub/',
    );
    expect(res.body.dataplanes[0].deployment.dataplaneHost).toBe(
      'hub-dp.example.com',
    );
  });

  it('returns multiple capabilities when requiredCapabilities includes more than one', async () => {
    const valuesYaml = `
global:
  cp:
    capability:
      pathPrefix: /tibco/flogo/dp-m
    resources:
      ingress:
        fqdn: multi-dp.example.com
`;
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-m', name: 'Multi-Cap DP' }],
        }),
      } as Response)
      // 2a. dp-m detail — has both FLOGO and BWCE
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [
              { id: 'cap-f1', name: 'FLOGO', type: 'FLOGO' },
              {
                id: 'cap-b1',
                name: 'BusinessWorks Container Edition',
                type: 'BWCE',
              },
            ],
          },
        }),
      } as Response)
      // 2b. dp-m status — both green
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'green',
            },
            {
              capability: 'BWCE',
              type: 'BWCE',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3. dp-m capability-instance for FLOGO (primary — first in requiredCapabilities)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-f1',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO,BWCE' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    expect(res.body.dataplanes[0].capabilities).toHaveLength(2);
    expect(
      res.body.dataplanes[0].capabilities.map((c: { type: string }) => c.type),
    ).toEqual(expect.arrayContaining(['FLOGO', 'BWCE']));
    // Primary capability is FLOGO (first in requiredCapabilities)
    expect(res.body.dataplanes[0].deployment.capabilityId).toBe('cap-f1');
    expect(res.body.dataplanes[0].deployment.capabilityType).toBe('FLOGO');
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://multi-dp.example.com/tibco/flogo/dp-m/',
    );
  });

  it('falls back to manual URL construction when pathPrefix is absent', async () => {
    const valuesYaml = `
global:
  cp:
    resources:
      ingress:
        fqdn: fallback-dp.example.com
`;
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-fb', name: 'Fallback DP' }],
        }),
      } as Response)
      // 2a. dp-fb detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-f1', name: 'FLOGO', type: 'FLOGO' }],
          },
        }),
      } as Response)
      // 2b. dp-fb status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3. dp-fb capability-instance — no pathPrefix in YAML
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-f1',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    // Without pathPrefix, URL is manually constructed from capability type + dataplane ID
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://fallback-dp.example.com/tibco/flogo/dp-fb/',
    );
    expect(res.body.dataplanes[0].deployment.dataplaneHost).toBe(
      'fallback-dp.example.com',
    );
  });

  it('uses pathPrefix from helmChartsCommon when available', async () => {
    const valuesYaml = `
global:
  cp:
    capability:
      pathPrefix: /tibco/flogo/d6t2jrtjr00c739s0n1g
    resources:
      ingress:
        fqdn: dp-prefix.example.com
`;
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-px', name: 'PathPrefix DP' }],
        }),
      } as Response)
      // 2a. dp-px detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-f1', name: 'FLOGO', type: 'FLOGO' }],
          },
        }),
      } as Response)
      // 2b. dp-px status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3. dp-px capability-instance — pathPrefix present
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-f1',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    // pathPrefix is used directly (not manually constructed from type+id)
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://dp-prefix.example.com/tibco/flogo/d6t2jrtjr00c739s0n1g/',
    );
    expect(res.body.dataplanes[0].deployment.dataplaneHost).toBe(
      'dp-prefix.example.com',
    );
  });

  it('normalizes pathPrefix with trailing slash to avoid double slashes', async () => {
    const valuesYaml = `
global:
  cp:
    capability:
      pathPrefix: /tibco/flogo/dp-trail/
    resources:
      ingress:
        fqdn: trail-dp.example.com
`;
    jest
      .spyOn(globalThis, 'fetch')
      // 1. list dataplanes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: [{ id: 'dp-trail', name: 'Trailing Slash DP' }],
        }),
      } as Response)
      // 2a. dp-trail detail
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: {
            capabilities: [{ id: 'cap-f1', name: 'FLOGO', type: 'FLOGO' }],
          },
        }),
      } as Response)
      // 2b. dp-trail status
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'success',
          response: [
            {
              capability: 'FLOGO',
              type: 'FLOGO',
              capabilityStatus: 'green',
            },
          ],
        }),
      } as Response)
      // 3. dp-trail capability-instance — pathPrefix has trailing slash
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              capability_instance_id: 'cap-f1',
              concrete_recipe: {
                helmChartsCommon: {
                  values: [{ content: valuesYaml }],
                },
              },
            },
          ],
        }),
      } as Response);

    const { app } = await createTestApp({
      cpLink: 'https://cp.test',
      TIBCOPlatformToken: 'tok',
    });
    const res = await request(app)
      .get('/platform/v1/data-planes-with-capabilities')
      .query({ requiredCapabilities: 'FLOGO' });

    expect(res.status).toBe(200);
    expect(res.body.dataplanes).toHaveLength(1);
    // Trailing slash is normalized — no double slash
    expect(res.body.dataplanes[0].deployment.dataplaneUrl).toBe(
      'https://trail-dp.example.com/tibco/flogo/dp-trail/',
    );
    expect(res.body.dataplanes[0].deployment.dataplaneHost).toBe(
      'trail-dp.example.com',
    );
  });
});
