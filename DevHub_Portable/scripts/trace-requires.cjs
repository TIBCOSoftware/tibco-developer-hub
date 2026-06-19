// Boot the bundled backend with Module._load instrumented to record every file
// resolved OUTSIDE the bundle (i.e. real require()s into node_modules). The
// recorded set is the minimal node_modules the sidecar must ship. Writes the
// list of touched node_modules package roots to /tmp/devhub-sidecar-pkgs.txt.
const Module = require('node:module');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..', '..');
const NM = path.join(ROOT, 'node_modules');
// Bundle to boot + where to write the package list are overridable for CI.
const BUNDLE = process.env.DEVHUB_TRACE_BUNDLE
  ? path.resolve(process.env.DEVHUB_TRACE_BUNDLE)
  : path.join(ROOT, 'DevHub_Portable', 'dist', 'bundled', 'index.js');
const OUT_LIST = process.env.DEVHUB_TRACE_OUT || '/tmp/devhub-sidecar-pkgs.txt';
const touched = new Set();

function record(resolved) {
  if (typeof resolved !== 'string') return;
  const idx = resolved.lastIndexOf('node_modules' + path.sep);
  if (idx === -1) return;
  // package root = node_modules/<name> or node_modules/@scope/<name>
  const after = resolved.slice(idx + ('node_modules' + path.sep).length);
  const parts = after.split(path.sep);
  const name = parts[0].startsWith('@') ? parts[0] + '/' + parts[1] : parts[0];
  touched.add(name);
}

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  const resolved = origResolve.call(this, request, parent, isMain, options);
  try { record(resolved); } catch {}
  return resolved;
};

function flush() {
  const list = [...touched].sort();
  fs.writeFileSync(OUT_LIST, list.join('\n') + '\n');
  process.stderr.write(`\n[trace] ${list.length} node_modules packages touched -> ${OUT_LIST}\n`);
}
process.on('exit', flush);

// In CI we can't rely on a clean shutdown signal: boot, let the app settle, then
// flush + exit. Set DEVHUB_TRACE_EXIT_MS=0 to disable (interactive tracing).
const exitMs = process.env.DEVHUB_TRACE_EXIT_MS ? Number(process.env.DEVHUB_TRACE_EXIT_MS) : 0;
if (exitMs > 0) {
  setTimeout(() => {
    flush();
    process.exit(0);
  }, exitMs).unref();
}

// Boot the bundle.
require(BUNDLE);
