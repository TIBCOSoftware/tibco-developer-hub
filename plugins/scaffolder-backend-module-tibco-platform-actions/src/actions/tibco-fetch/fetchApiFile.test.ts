/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { fetchApiFileAction } from './fetchApiFile';
import { CatalogService } from '@backstage/plugin-catalog-node';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

function createMockContext(
  input: Record<string, unknown>,
  workspacePath: string,
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
    secrets: {},
  };
}

describe('tibco:fetch-api-file', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fetch-api-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('has the correct action id', () => {
    const mockCatalog: Partial<CatalogService> = {
      getEntityByRef: jest.fn(),
    };
    const action = fetchApiFileAction(mockCatalog as CatalogService);
    expect(action.id).toBe('tibco:fetch-api-file');
  });

  it('writes API definition from a direct API entity', async () => {
    const apiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'my-api', namespace: 'default' },
      spec: {
        type: 'openapi',
        definition: '{"openapi":"3.0.0"}',
      },
    };

    const mockCatalog: Partial<CatalogService> = {
      getEntityByRef: jest.fn().mockResolvedValue(apiEntity),
    };
    const action = fetchApiFileAction(mockCatalog as CatalogService);

    const ctx = createMockContext(
      { kind: 'API', name: 'my-api', path: 'spec.json' },
      tmpDir,
    );
    await action.handler(ctx as any);

    const written = await fs.readFile(path.join(tmpDir, 'spec.json'), 'utf8');
    expect(written).toBe('{"openapi":"3.0.0"}');
    expect(ctx.outputs.apiType).toBe('openapi');
    expect(ctx.outputs.sourceEntity).toContain('my-api');
  });

  it('throws when entity is not found', async () => {
    const mockCatalog: Partial<CatalogService> = {
      getEntityByRef: jest.fn().mockResolvedValue(undefined),
    };
    const action = fetchApiFileAction(mockCatalog as CatalogService);

    const ctx = createMockContext(
      { kind: 'API', name: 'missing-api', path: 'out.json' },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(/not found/i);
  });

  it('resolves API from Component entity via providesApis', async () => {
    const componentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'my-service', namespace: 'default' },
      spec: { providesApis: ['my-api'] },
    };

    const apiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'my-api', namespace: 'default' },
      spec: {
        type: 'openapi',
        definition: 'openapi: "3.0.0"',
      },
    };

    const getEntityByRef = jest.fn();
    // First call: resolve the component
    getEntityByRef.mockResolvedValueOnce(componentEntity);
    // Second call: resolve the API
    getEntityByRef.mockResolvedValueOnce(apiEntity);

    const action = fetchApiFileAction({ getEntityByRef } as any);

    const ctx = createMockContext(
      { kind: 'Component', name: 'my-service', path: 'api.yaml' },
      tmpDir,
    );
    await action.handler(ctx as any);

    const written = await fs.readFile(path.join(tmpDir, 'api.yaml'), 'utf8');
    expect(written).toBe('openapi: "3.0.0"');
  });

  it('throws when Component provides no APIs', async () => {
    const componentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'bare-svc', namespace: 'default' },
      spec: { providesApis: [] },
    };

    const mockCatalog: Partial<CatalogService> = {
      getEntityByRef: jest.fn().mockResolvedValue(componentEntity),
    };
    const action = fetchApiFileAction(mockCatalog as CatalogService);

    const ctx = createMockContext(
      { kind: 'Component', name: 'bare-svc', path: 'x.yaml' },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(
      /does not provide any APIs/i,
    );
  });

  it('selects preferred API type when available', async () => {
    const componentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'multi-svc', namespace: 'default' },
      spec: { providesApis: ['graphql-api', 'rest-api'] },
    };

    const graphqlApi = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'graphql-api', namespace: 'default' },
      spec: { type: 'graphql', definition: 'type Query { hello: String }' },
    };

    const restApi = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'rest-api', namespace: 'default' },
      spec: { type: 'openapi', definition: '{"openapi":"3.0.0"}' },
    };

    const getEntityByRef = jest.fn();
    getEntityByRef.mockResolvedValueOnce(componentEntity);
    getEntityByRef.mockResolvedValueOnce(graphqlApi);
    getEntityByRef.mockResolvedValueOnce(restApi);

    const action = fetchApiFileAction({ getEntityByRef } as any);

    const ctx = createMockContext(
      {
        kind: 'Component',
        name: 'multi-svc',
        path: 'api.json',
        preferredApiType: 'openapi',
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    const written = await fs.readFile(path.join(tmpDir, 'api.json'), 'utf8');
    expect(written).toBe('{"openapi":"3.0.0"}');
    expect(ctx.outputs.apiType).toBe('openapi');
  });

  it('throws when resolved entity is not an API kind', async () => {
    const groupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'team-x', namespace: 'default' },
      spec: {},
    };

    const mockCatalog: Partial<CatalogService> = {
      getEntityByRef: jest.fn().mockResolvedValue(groupEntity),
    };
    const action = fetchApiFileAction(mockCatalog as CatalogService);

    const ctx = createMockContext(
      { kind: 'Group', name: 'team-x', path: 'out.yaml' },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(/not an API/i);
  });
});
