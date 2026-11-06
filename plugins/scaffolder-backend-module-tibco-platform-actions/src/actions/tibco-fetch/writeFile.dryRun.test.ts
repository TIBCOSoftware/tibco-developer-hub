/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { writeFileAction } from './writeFile';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

/**
 * Executor-level (integration-style) test for the scaffolder dry-run contract.
 *
 * Rather than standing up the full scaffolder + catalog + database backend and
 * posting to `/api/scaffolder/v2/dry-run`, this reproduces the scaffolder task
 * executor's documented dry-run dispatch and drives the REAL tibco:file:write
 * action through it. The executor logic below mirrors
 * `@backstage/plugin-scaffolder-node`'s behaviour (quoted in PLTDX-2668):
 *
 *   if (!action.supportsDryRun) {
 *     // step is skipped; fabricated example output is substituted
 *   } else {
 *     // action runs with ctx.isDryRun === true
 *   }
 *
 * The workspace directory the action writes into is exactly what the real
 * endpoint serialises into `directoryContents`, so asserting the file is present
 * on disk validates the same guarantee AC#2 requires.
 */

interface TestAction {
  supportsDryRun?: boolean;
  handler: (ctx: any) => Promise<void>;
  schema?: { output?: unknown };
}

/** Minimal stand-in for the scaffolder step context during a dry-run. */
function createDryRunContext(
  input: Record<string, unknown>,
  workspacePath: string,
) {
  return {
    input,
    workspacePath,
    isDryRun: true,
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

/**
 * Reproduces the scaffolder executor's dry-run decision: actions that opt in via
 * `supportsDryRun` are executed; the rest are skipped and produce only fabricated
 * example output (here, an empty object) — the misleading behaviour the ticket
 * fixes.
 */
async function runDryRunStep(
  action: TestAction,
  input: Record<string, unknown>,
  workspacePath: string,
): Promise<{ skipped: boolean }> {
  if (!action.supportsDryRun) {
    return { skipped: true };
  }
  const ctx = createDryRunContext(input, workspacePath);
  await action.handler(ctx as any);
  return { skipped: false };
}

/** Lists workspace files relative to root — the essence of `directoryContents`. */
async function listWorkspaceFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        out.push(path.relative(root, full).split(path.sep).join('/'));
      }
    }
  }
  await walk(root);
  return out;
}

describe('scaffolder dry-run executor contract (tibco:file:write)', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dryrun-exec-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('runs tibco:file:write during a dry-run so the file appears in directoryContents', async () => {
    const { skipped } = await runDryRunStep(
      writeFileAction as unknown as TestAction,
      { filePath: 'docs/index.md', content: '# hello', overwrite: true },
      tmpDir,
    );

    expect(skipped).toBe(false);

    const files = await listWorkspaceFiles(tmpDir);
    expect(files).toContain('docs/index.md');

    const written = await fs.readFile(
      path.join(tmpDir, 'docs', 'index.md'),
      'utf8',
    );
    expect(written).toBe('# hello');
  });

  it('skips an action that does not declare supportsDryRun (the bug PLTDX-2668 fixes)', async () => {
    // Same handler, but with the opt-in flag stripped: the executor must skip it,
    // leaving the workspace empty — exactly the misleading dry-run the fix avoids.
    const legacyAction: TestAction = {
      supportsDryRun: undefined,
      handler: (writeFileAction as unknown as TestAction).handler,
    };

    const { skipped } = await runDryRunStep(
      legacyAction,
      { filePath: 'docs/index.md', content: '# hello', overwrite: true },
      tmpDir,
    );

    expect(skipped).toBe(true);
    const files = await listWorkspaceFiles(tmpDir);
    expect(files).not.toContain('docs/index.md');
  });
});
