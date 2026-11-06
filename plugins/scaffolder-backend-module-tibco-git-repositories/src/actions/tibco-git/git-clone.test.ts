/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { gitCloneAction } from './git-clone';
import { ConfigReader } from '@backstage/config';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';

// Track whether the clone actually runs.
const gitMock = {
  clone: jest.fn().mockResolvedValue(undefined),
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

describe('tibco:git:clone', () => {
  const config = new ConfigReader({});
  let tmpDir: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'git-clone-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('has the correct action id', () => {
    expect(gitCloneAction(config).id).toBe('tibco:git:clone');
  });

  it('declares dry-run support', () => {
    expect(gitCloneAction(config).supportsDryRun).toBe(true);
  });

  it('performs the clone during a dry-run (remote read, runs unchanged)', async () => {
    const action = gitCloneAction(config);
    const ctx = createMockContext(
      { repoUrl: 'https://github.com/org/repo', token: 'abc' },
      tmpDir,
    );
    (ctx as any).isDryRun = true;

    await action.handler(ctx as any);

    expect(gitMock.clone).toHaveBeenCalledTimes(1);
    expect(gitMock.clone).toHaveBeenCalledWith(
      'https://github.com/org/repo',
      expect.any(String),
      expect.any(Array),
    );
  });

  it('performs the clone during a normal (non-dry-run) run', async () => {
    const action = gitCloneAction(config);
    const ctx = createMockContext(
      { repoUrl: 'https://github.com/org/repo', token: 'abc' },
      tmpDir,
    );

    await action.handler(ctx as any);

    expect(gitMock.clone).toHaveBeenCalledTimes(1);
  });
});
