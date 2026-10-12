/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { ExtractParametersAction } from './extract-parameters';
import { promises as fs } from 'fs';
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
  };
}

describe('tibco:extract-parameters', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'extract-params-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('has the correct action id', () => {
    const action = ExtractParametersAction();
    expect(action.id).toBe('tibco:extract-parameters');
  });

  it('extracts matches from a file using a string regex', async () => {
    await fs.writeFile(path.join(tmpDir, 'app.txt'), 'version: 1.2.3');
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: true,
        extractParameters: {
          version: {
            type: 'file',
            filePath: 'app.txt',
            regex: '/\\d+\\.\\d+\\.\\d+/',
          },
        },
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.version).toEqual(['1.2.3']);
  });

  it('extracts global matches from a file using a regex object with flags', async () => {
    await fs.writeFile(path.join(tmpDir, 'nums.txt'), 'a1b2c3');
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: true,
        extractParameters: {
          digits: {
            type: 'file',
            filePath: 'nums.txt',
            regex: { regexPattern: '\\d', regexFlags: 'g' },
          },
        },
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.digits).toEqual(['1', '2', '3']);
  });

  it('matches workspace paths against a regex', async () => {
    await fs.writeFile(path.join(tmpDir, 'keep.txt'), 'x');
    await fs.writeFile(path.join(tmpDir, 'skip.log'), 'x');
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: true,
        extractParameters: {
          txtFiles: {
            type: 'workspace',
            glob: '**/*',
            regex: '/\\.txt$/',
          },
        },
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    expect(ctx.outputs.txtFiles).toEqual(['keep.txt']);
  });

  it('aborts a catastrophic-backtracking (ReDoS) pattern instead of hanging', async () => {
    // (a+)+$ against a run of "a" ending in a non-match is exponential.
    await fs.writeFile(path.join(tmpDir, 'evil.txt'), `${'a'.repeat(50)}!`);
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: true,
        extractParameters: {
          boom: {
            type: 'file',
            filePath: 'evil.txt',
            regex: { regexPattern: '(a+)+$' },
          },
        },
      },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(
      /timed out|ReDoS/i,
    );
  }, 15000);

  it('continues past a ReDoS timeout when failOnError is false', async () => {
    await fs.writeFile(path.join(tmpDir, 'evil.txt'), `${'a'.repeat(50)}!`);
    await fs.writeFile(path.join(tmpDir, 'ok.txt'), 'hello-world');
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: false,
        extractParameters: {
          boom: {
            type: 'file',
            filePath: 'evil.txt',
            regex: { regexPattern: '(a+)+$' },
          },
          greeting: {
            type: 'file',
            filePath: 'ok.txt',
            regex: '/hello/',
          },
        },
      },
      tmpDir,
    );
    await action.handler(ctx as any);

    // The pathological param is skipped; the well-behaved one still resolves.
    expect(ctx.outputs.boom).toBeUndefined();
    expect(ctx.outputs.greeting).toEqual(['hello']);
  }, 15000);

  it('rejects an over-long regex pattern before evaluating it', async () => {
    await fs.writeFile(path.join(tmpDir, 'app.txt'), 'content');
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: true,
        extractParameters: {
          huge: {
            type: 'file',
            filePath: 'app.txt',
            regex: { regexPattern: 'a'.repeat(1001) },
          },
        },
      },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(
      /pattern too long/i,
    );
  });

  it('refuses to read git internals (.git)', async () => {
    await fs.mkdir(path.join(tmpDir, '.git'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, '.git', 'config'),
      '[http]\n  extraHeader = Authorization: Bearer secret',
    );
    const action = ExtractParametersAction();

    const ctx = createMockContext(
      {
        failOnError: true,
        extractParameters: {
          leak: {
            type: 'file',
            filePath: '.git/config',
            regex: '/Bearer .*/',
          },
        },
      },
      tmpDir,
    );

    await expect(action.handler(ctx as any)).rejects.toThrow(/git internals/i);
  });
});
