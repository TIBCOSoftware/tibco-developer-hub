// Build the minimal sidecar node_modules for the bundled single-file backend.
//
// The backend code lives in index.js (esbuild bundle). At runtime it only reaches
// into node_modules for: (a) native modules + their deps, (b) a couple of packages
// that load their own files via non-analyzable requires, and (c) @backstage backend
// plugins that resolvePackagePath() to read on-disk migrations/assets. The exact set
// is discovered by trace-requires.cjs; this script copies just those, trimming the
// @backstage packages to package.json + migrations/assets (their code is bundled).
//
// Usage: node build-sidecar.cjs <repoRoot> <sidecarDir> <pkgListFile> <hostTarget>
//   hostTarget e.g. darwin-arm64 — used to drop foreign isolated-vm prebuilds.
const fs = require('node:fs');
const path = require('node:path');

const [, , ROOT, SIDE, LIST, HOST_TARGET] = process.argv;
if (!ROOT || !SIDE || !LIST) {
  console.error('usage: build-sidecar.cjs <repoRoot> <sidecarDir> <pkgListFile> [hostTarget]');
  process.exit(1);
}
const NM = path.join(ROOT, 'node_modules');

fs.rmSync(SIDE, { recursive: true, force: true });
fs.mkdirSync(SIDE, { recursive: true });

const pkgs = fs
  .readFileSync(LIST, 'utf8')
  .split('\n')
  .map(s => s.trim())
  .filter(Boolean);

// @backstage backend plugins: keep only what's read from disk at runtime.
const STUB_KEEP = new Set(['package.json', 'migrations', 'assets', 'config.d.ts']);

function copyDir(src, dest, filter) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (filter && !filter(entry, src)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyDir(s, d);
    } else if (entry.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(s), d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

let stubbed = 0;
let whole = 0;
for (const pkg of pkgs) {
  const src = path.join(NM, pkg);
  if (!fs.existsSync(src)) {
    console.warn('  skip (missing):', pkg);
    continue;
  }
  const dest = path.join(SIDE, pkg);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.mkdirSync(dest, { recursive: true });
  if (pkg.startsWith('@backstage/')) {
    // stub: top-level entries in STUB_KEEP only (code is bundled)
    copyDir(src, dest, entry => STUB_KEEP.has(entry.name));
    stubbed++;
  } else {
    // native / leaf dep: copy whole, minus junk
    copyDir(src, dest, (entry, dir) => {
      if (dir === src && (entry.name === 'CHANGELOG.md' || entry.name === 'README.md')) return false;
      return true;
    });
    whole++;
  }
}

// keytar (external, used by some integrations even if not touched at boot)
const keytar = path.join(NM, 'keytar');
if (fs.existsSync(keytar) && !fs.existsSync(path.join(SIDE, 'keytar'))) {
  copyDir(keytar, path.join(SIDE, 'keytar'));
}

// frontend app package (served static dist).
const appDist = path.join(ROOT, 'packages/app/dist');
if (fs.existsSync(appDist)) {
  fs.mkdirSync(path.join(SIDE, 'app'), { recursive: true });
  copyDir(appDist, path.join(SIDE, 'app/dist'));
  fs.copyFileSync(path.join(ROOT, 'packages/app/package.json'), path.join(SIDE, 'app/package.json'));
}

// Drop foreign-platform isolated-vm prebuilds (we ship one target per bundle).
if (HOST_TARGET) {
  const pre = path.join(SIDE, 'isolated-vm/prebuilds');
  if (fs.existsSync(pre)) {
    for (const d of fs.readdirSync(pre)) {
      if (d !== HOST_TARGET) fs.rmSync(path.join(pre, d), { recursive: true, force: true });
    }
  }
}

console.log(`sidecar: ${stubbed} stubbed @backstage pkgs, ${whole} whole pkgs -> ${SIDE}`);
