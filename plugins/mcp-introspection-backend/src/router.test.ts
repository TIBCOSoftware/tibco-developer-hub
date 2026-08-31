/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import express from 'express';
import request from 'supertest';
import { mockServices } from '@backstage/backend-test-utils';
import { createRouter } from './router.ts';
import * as introspector from './service/McpIntrospector.ts';

jest.mock('./service/McpIntrospector.ts', () => ({
  introspectServer: jest.fn(),
}));

const mcpEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'API',
  metadata: { name: 'example-mcp-server', namespace: 'default' },
  spec: {
    type: 'mcp-server',
    lifecycle: 'production',
    owner: 'group:default/mcp-admins',
    remotes: [{ type: 'streamable-http', url: 'https://mcp.example.com/mcp' }],
  },
};

const plainApiEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'API',
  metadata: { name: 'plain-api', namespace: 'default' },
  spec: { type: 'openapi', lifecycle: 'production', owner: 'guest' },
};

// The config payload type expected by rootConfig (a JsonObject), derived
// without importing @backstage/types so the plugin needs no extra dependency.
type RootConfigData = NonNullable<
  Parameters<typeof mockServices.rootConfig>[0]
>['data'];

function buildApp(entity: unknown, configData?: RootConfigData) {
  const catalog = {
    getEntityByRef: jest.fn().mockResolvedValue(entity),
  } as any;

  return createRouter({
    config: mockServices.rootConfig({ data: configData ?? {} }),
    logger: mockServices.logger.mock(),
    httpAuth: mockServices.httpAuth(),
    catalog,
  }).then(router => {
    const app = express();
    app.use(router);
    return app;
  });
}

describe('mcp-introspection router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when entityRef is missing', async () => {
    const app = await buildApp(mcpEntity);
    const res = await request(app).get('/capabilities');
    expect(res.status).toBe(400);
  });

  it('returns 404 when the entity is not found', async () => {
    const app = await buildApp(undefined);
    const res = await request(app).get(
      '/capabilities?entityRef=api:default/missing',
    );
    expect(res.status).toBe(404);
  });

  it('returns 400 when the entity is not an MCP server', async () => {
    const app = await buildApp(plainApiEntity);
    const res = await request(app).get(
      '/capabilities?entityRef=api:default/plain-api',
    );
    expect(res.status).toBe(400);
  });

  it('returns the introspected capabilities for an MCP server', async () => {
    (introspector.introspectServer as jest.Mock).mockResolvedValue({
      remote: { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
      serverInfo: { name: 'demo', version: '1.0.0' },
      capabilities: { tools: {} },
      tools: [{ name: 'search', description: 'Search things' }],
      resources: [],
      prompts: [],
      errors: [],
    });

    const app = await buildApp(mcpEntity);
    const res = await request(app)
      .get('/capabilities?entityRef=api:default/example-mcp-server')
      .set('x-mcp-token', 'user-supplied-token');

    expect(res.status).toBe(200);
    expect(res.body.entityRef).toBe('api:default/example-mcp-server');
    expect(res.body.serverInfo).toEqual({ name: 'demo', version: '1.0.0' });
    expect(res.body.tools).toHaveLength(1);
    expect(res.body.tools[0].name).toBe('search');

    // The user-supplied token from the browser is forwarded to the MCP server.
    expect(introspector.introspectServer).toHaveBeenCalledWith(
      mcpEntity.spec.remotes,
      expect.objectContaining({ token: 'user-supplied-token' }),
    );
  });

  it('forwards custom auth headers from x-mcp-headers to the MCP server', async () => {
    (introspector.introspectServer as jest.Mock).mockResolvedValue({
      remote: { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
      serverInfo: { name: 'demo', version: '1.0.0' },
      capabilities: {},
      tools: [],
      resources: [],
      prompts: [],
      errors: [],
    });

    const app = await buildApp(mcpEntity);
    const res = await request(app)
      .get('/capabilities?entityRef=api:default/example-mcp-server')
      .set('x-mcp-token', 'user-supplied-token')
      .set('x-mcp-headers', JSON.stringify({ 'X-API-Key': 'k-123' }));

    expect(res.status).toBe(200);
    expect(introspector.introspectServer).toHaveBeenCalledWith(
      mcpEntity.spec.remotes,
      expect.objectContaining({
        token: 'user-supplied-token',
        headers: { 'X-API-Key': 'k-123' },
      }),
    );
  });

  it('ignores a malformed x-mcp-headers value', async () => {
    (introspector.introspectServer as jest.Mock).mockResolvedValue({
      remote: { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
      serverInfo: {},
      capabilities: {},
      tools: [],
      resources: [],
      prompts: [],
      errors: [],
    });

    const app = await buildApp(mcpEntity);
    const res = await request(app)
      .get('/capabilities?entityRef=api:default/example-mcp-server')
      .set('x-mcp-headers', 'not-json');

    expect(res.status).toBe(200);
    expect(introspector.introspectServer).toHaveBeenCalledWith(
      mcpEntity.spec.remotes,
      expect.objectContaining({ headers: undefined }),
    );
  });

  it('forwards backend.baseUrl so relative remote URLs can be resolved', async () => {
    (introspector.introspectServer as jest.Mock).mockResolvedValue({
      remote: { type: 'streamable-http', url: '/tibco/hub/api/mcp-actions/v1' },
      serverInfo: {},
      capabilities: {},
      tools: [],
      resources: [],
      prompts: [],
      errors: [],
    });

    const app = await buildApp(mcpEntity, {
      backend: { baseUrl: 'http://localhost:7007/tibco/hub' },
    });
    const res = await request(app).get(
      '/capabilities?entityRef=api:default/example-mcp-server',
    );

    expect(res.status).toBe(200);
    expect(introspector.introspectServer).toHaveBeenCalledWith(
      mcpEntity.spec.remotes,
      expect.objectContaining({
        baseUrl: 'http://localhost:7007/tibco/hub',
      }),
    );
  });

  it('returns 502 when introspection fails to connect', async () => {
    (introspector.introspectServer as jest.Mock).mockRejectedValue(
      new Error('Unable to connect to any MCP remote.'),
    );

    const app = await buildApp(mcpEntity);
    const res = await request(app).get(
      '/capabilities?entityRef=api:default/example-mcp-server',
    );

    expect(res.status).toBe(502);
    expect(res.body.detail).toContain('Unable to connect');
  });
});
