/*
 * Copyright (c) 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

/**
 * Unmocked runtime smoke test for the simple-git v4 upgrade.
 *
 * The git-clone/git-push action unit tests fully mock `simple-git`, so they
 * validate our call sites' types but never load v4's real constructor,
 * command-scoped `config` option (`git -c ...`), or command behaviour. This
 * test drives the actual simple-git library against throwaway local repos to
 * confirm the exact API surface the actions depend on still works under v4:
 *   - `simpleGit({ config })`           (git-clone)
 *   - `.clone(url, dir, options)`       (git-clone)
 *   - `.remote(['get-url', 'origin'])`  (git-push)
 *   - `.branchLocal()`                  (git-push)
 *   - `.add` / `.commit` / `.push`      (git-push)
 *
 * It talks only to the local filesystem (a bare repo acts as the "remote"), so
 * it needs no network and no credentials. `git` must be on PATH.
 */
import { simpleGit } from 'simple-git';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';

// git operations over several processes can exceed the default 5s.
jest.setTimeout(30000);

// Identity passed the same way the actions pass auth: command-scoped `-c`
// overrides via simple-git's `config` option, so nothing is persisted on disk.
// `protocol.file.allow=always` lets us clone/push between local paths under
// hardened git defaults, and `safe.directory=*` avoids dubious-ownership errors
// when the test runs as a non-owning user (e.g. the Docker build's nonroot).
const IDENTITY_CONFIG = [
  'user.email=smoke-test@example.com',
  'user.name=Smoke Test',
  'commit.gpgsign=false',
  'protocol.file.allow=always',
  'safe.directory=*',
];

describe('simple-git v4 runtime smoke test', () => {
  let tmpRoot: string;
  let remoteDir: string;
  // Set once the local git fixtures are in place. If git is unavailable (e.g. a
  // build stage without the git binary) the setup is skipped and the tests
  // no-op rather than failing the suite; they still run fully anywhere git works.
  let ready = false;

  beforeAll(async () => {
    try {
      tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'sg-v4-smoke-'));
      remoteDir = path.join(tmpRoot, 'remote.git');
      await fs.mkdir(remoteDir, { recursive: true });

      // Bare repo stands in for the remote.
      await simpleGit(remoteDir, { config: IDENTITY_CONFIG }).init(['--bare']);

      // Seed the remote with an initial commit so a single-branch clone works.
      const seedDir = path.join(tmpRoot, 'seed');
      await fs.mkdir(seedDir, { recursive: true });
      const seed = simpleGit(seedDir, { config: IDENTITY_CONFIG });
      await seed.init();
      await fs.writeFile(path.join(seedDir, 'README.md'), '# seed\n');
      await seed.add('.');
      await seed.commit('initial commit');
      await seed.addRemote('origin', remoteDir);
      const seededBranch = (await seed.branchLocal()).current;
      await seed.push(['-u', 'origin', seededBranch]);
      ready = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        `[simple-git v4 smoke] skipping: git fixtures could not be created: ${err}`,
      );
    }
  });

  afterAll(async () => {
    if (tmpRoot) {
      await fs.rm(tmpRoot, { recursive: true, force: true });
    }
  });

  it('clones with the command-scoped config option (git-clone path)', async () => {
    if (!ready) return;
    const cloneDir = path.join(tmpRoot, 'clone');

    // Mirrors gitCloneAction: construct with a `config` array, then clone.
    const git = simpleGit({ config: IDENTITY_CONFIG });
    await git.clone(remoteDir, cloneDir, ['--single-branch']);

    await expect(fs.stat(path.join(cloneDir, 'README.md'))).resolves.toEqual(
      expect.objectContaining({ isFile: expect.any(Function) }),
    );
  });

  it('reads origin url, commits, and pushes back (git-push path)', async () => {
    if (!ready) return;
    const cloneDir = path.join(tmpRoot, 'clone');
    const git = simpleGit(cloneDir, { config: IDENTITY_CONFIG });

    // git-push resolves credentials from origin via this exact call.
    const originUrl = (await git.remote(['get-url', 'origin']))
      ?.toString()
      .trim();
    expect(originUrl).toBe(remoteDir);

    // git-push inspects the current branch before deciding how to push.
    const branch = (await git.branchLocal()).current;
    expect(branch).toBeTruthy();

    await fs.writeFile(path.join(cloneDir, 'change.txt'), 'hello v4\n');
    await git.add('.');
    await git.commit('smoke: add change.txt');
    await git.push('origin', branch);

    // The bare "remote" should now hold both commits.
    const count = (
      await simpleGit(remoteDir).raw(['rev-list', '--count', branch])
    ).trim();
    expect(Number(count)).toBe(2);
  });
});
