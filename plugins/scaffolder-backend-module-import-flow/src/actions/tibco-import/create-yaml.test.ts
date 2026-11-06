/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createYamlAction } from './create-yaml';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

/** Creates a minimal scaffolder action context for testing. */
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
    getInitiatorCredentials: jest.fn(),
    secrets: {},
  };
}

describe('tibco:create-yaml', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'create-yaml-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('has the correct action id', () => {
    expect(createYamlAction().id).toBe('tibco:create-yaml');
  });

  it('declares dry-run support', () => {
    expect(createYamlAction().supportsDryRun).toBe(true);
  });

  it('writes the yaml during a dry-run (workspace-only, runs unchanged)', async () => {
    const action = createYamlAction();
    const ctx = createMockContext(
      {
        outputFile: 'catalog-info.yaml',
        outputStructure: { apiVersion: 'backstage.io/v1alpha1', kind: 'API' },
      },
      tmpDir,
    );
    (ctx as any).isDryRun = true;

    await action.handler(ctx as any);

    const written = await fs.readFile(
      path.join(tmpDir, 'catalog-info.yaml'),
      'utf8',
    );
    expect(written).toContain('apiVersion: backstage.io/v1alpha1');
    expect(written).toContain('kind: API');
  });

  it('writes the yaml during a normal (non-dry-run) run', async () => {
    const action = createYamlAction();
    const ctx = createMockContext(
      {
        outputFile: 'out.yaml',
        outputStructure: { kind: 'Component' },
      },
      tmpDir,
    );

    await action.handler(ctx as any);

    const written = await fs.readFile(path.join(tmpDir, 'out.yaml'), 'utf8');
    expect(written).toContain('kind: Component');
  });
});
