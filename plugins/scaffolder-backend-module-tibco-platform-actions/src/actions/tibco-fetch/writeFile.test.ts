/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { writeFileAction } from './writeFile';
import fs from 'fs-extra';
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

describe('tibco:file:write', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'write-file-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('has the correct action id', () => {
    expect(writeFileAction.id).toBe('tibco:file:write');
  });

  it('writes content to a new file', async () => {
    const ctx = createMockContext(
      { filePath: 'output.txt', content: 'hello world' },
      tmpDir,
    );

    await writeFileAction.handler(ctx as any);

    const written = await fs.readFile(path.join(tmpDir, 'output.txt'), 'utf8');
    expect(written).toBe('hello world');
    expect(ctx.output).toHaveBeenCalledWith(
      'filePath',
      expect.stringContaining('output.txt'),
    );
    expect(ctx.output).toHaveBeenCalledWith('size', expect.any(Number));
  });

  it('creates parent directories by default', async () => {
    const ctx = createMockContext(
      { filePath: 'sub/dir/file.txt', content: 'nested' },
      tmpDir,
    );

    await writeFileAction.handler(ctx as any);

    const written = await fs.readFile(
      path.join(tmpDir, 'sub', 'dir', 'file.txt'),
      'utf8',
    );
    expect(written).toBe('nested');
  });

  it('throws when file exists and overwrite is false', async () => {
    await fs.writeFile(path.join(tmpDir, 'existing.txt'), 'old');

    const ctx = createMockContext(
      {
        filePath: 'existing.txt',
        content: 'new',
        overwrite: false,
      },
      tmpDir,
    );

    await expect(writeFileAction.handler(ctx as any)).rejects.toThrow(
      /already exists/,
    );
  });

  it('overwrites existing file when overwrite is true', async () => {
    await fs.writeFile(path.join(tmpDir, 'existing.txt'), 'old');

    const ctx = createMockContext(
      {
        filePath: 'existing.txt',
        content: 'replaced',
        overwrite: true,
      },
      tmpDir,
    );

    await writeFileAction.handler(ctx as any);

    const written = await fs.readFile(
      path.join(tmpDir, 'existing.txt'),
      'utf8',
    );
    expect(written).toBe('replaced');
  });

  it('outputs the file size in bytes', async () => {
    const content = 'abcdefghij'; // 10 bytes
    const ctx = createMockContext({ filePath: 'sized.txt', content }, tmpDir);

    await writeFileAction.handler(ctx as any);

    expect(ctx.outputs.size).toBe(10);
  });
});
