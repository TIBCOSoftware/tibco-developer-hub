/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { gitPushAction } from './git-push';
import { ConfigReader } from '@backstage/config';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';

// Track whether any simple-git method that talks to a remote is invoked.
const gitMock = {
  cwd: jest.fn().mockResolvedValue(undefined),
  branchLocal: jest.fn().mockResolvedValue({ current: 'main' }),
  fetch: jest.fn().mockResolvedValue(undefined),
  checkout: jest.fn().mockResolvedValue(undefined),
  checkoutBranch: jest.fn().mockResolvedValue(undefined),
  add: jest.fn().mockResolvedValue(undefined),
  addConfig: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
  push: jest.fn().mockResolvedValue(undefined),
};

jest.mock('simple-git', () => ({
  simpleGit: jest.fn(() => gitMock),
}));

/** Creates a minimal scaffolder action context for testing. */
function createMockContext(
  input: Record<string, unknown>,
  workspacePath: string,
) {
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
    output: jest.fn(),
    logStream: { write: jest.fn() },
    createTemporaryDirectory: jest.fn(),
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    secrets: {},
  };
}

describe('tibco:git:push', () => {
  const config = new ConfigReader({});
  let tmpDir: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'git-push-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('has the correct action id', () => {
    expect(gitPushAction(config).id).toBe('tibco:git:push');
  });

  it('declares dry-run support', () => {
    expect(gitPushAction(config).supportsDryRun).toBe(true);
  });

  it('performs no git operation during a dry-run and logs the intent', async () => {
    const action = gitPushAction(config);
    const ctx = createMockContext(
      { branch: 'feature-x', commitMessage: 'my commit' },
      tmpDir,
    );
    (ctx as any).isDryRun = true;

    await action.handler(ctx as any);

    expect(gitMock.push).not.toHaveBeenCalled();
    expect(gitMock.commit).not.toHaveBeenCalled();
    expect(gitMock.add).not.toHaveBeenCalled();
    expect(gitMock.fetch).not.toHaveBeenCalled();
    expect(ctx.logger.info).toHaveBeenCalledWith(
      expect.stringContaining('[dry-run]'),
    );
    expect(ctx.logger.info).toHaveBeenCalledWith(
      expect.stringContaining('feature-x'),
    );
    expect(ctx.logger.info).toHaveBeenCalledWith(
      expect.stringContaining('my commit'),
    );
  });

  it('surfaces an invalid sourcePath during a dry-run when failOnError is set', async () => {
    const action = gitPushAction(config);
    const ctx = createMockContext(
      { sourcePath: 'does/not/exist', failOnError: true },
      tmpDir,
    );
    (ctx as any).isDryRun = true;

    await expect(action.handler(ctx as any)).rejects.toThrow(
      /Source path relative to workspace does not exist/,
    );
    expect(gitMock.push).not.toHaveBeenCalled();
  });
});
