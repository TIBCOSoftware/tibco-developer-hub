// Bundle the DevHub backend (packages/backend/src/index.ts) into a single CJS
// file with esbuild. Native modules and a small set of packages that load
// on-disk assets at runtime are kept external (resolved from a minimal sidecar
// node_modules at run time). See build-bundled.sh for how the sidecar is built.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..', '..');
// Output dir is overridable so build-bundled.sh can target dist/devhub-bundled-<target>/.
const OUT = process.env.DEVHUB_BUNDLE_OUT
  ? resolve(process.env.DEVHUB_BUNDLE_OUT)
  : resolve(ROOT, 'DevHub_Portable', 'dist', 'bundled');

// Native (.node) modules — cannot be bundled, must stay in node_modules.
const native = [
  'better-sqlite3',
  'isolated-vm',
  'keytar',
  'cpu-features',
  'ssh2',
  'fsevents',
  'brotli-wasm',
  '@swc/core',
  'node-gyp',
];

// Packages that load their own files at runtime via non-analyzable requires
// (`require(__dirname + '/x')`, `require.resolve('./asset')`). esbuild can't
// bundle these reliably, so keep them external and ship the (small) package in
// the sidecar node_modules. build-bundled.sh copies each of these.
const externalAssetPkgs = [
  'pg-format', // require(__dirname + '/reserved.js')
  'jsonpath', // require.resolve('../include/*.js') grammar files
];

// Optional DB drivers that knex lazily require()s for clients we don't use.
// The portable build only uses better-sqlite3 (+ optionally pg), so these are
// never loaded at runtime — mark them external so esbuild leaves the require in
// place instead of failing to resolve them.
const optionalDbDrivers = [
  'oracledb',
  'mysql',
  'mysql2',
  'tedious',
  'mssql',
  'sqlite3',
  'pg-native',
  'pg-query-stream',
  '@vscode/sqlite3',
  '@google-cloud/cloud-sql-connector',
];

const result = await build({
  entryPoints: [resolve(ROOT, 'packages/backend/src/index.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  outfile: resolve(OUT, 'index.js'),
  external: [...native, ...externalAssetPkgs, ...optionalDbDrivers],
  loader: { '.node': 'file' },
  logLevel: 'info',
  metafile: true,
  legalComments: 'none',
  // Backstage packages occasionally read import.meta.url; keep it defined.
  define: {},
});

const fs = await import('node:fs');
fs.writeFileSync(resolve(OUT, 'meta.json'), JSON.stringify(result.metafile));
console.log('\nBundle written to', resolve(OUT, 'index.js'));
