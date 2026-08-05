---
name: test-template
description: Dry-run a Backstage scaffolder template against the running backend and write the rendered files into `template-workspace/dry-run-<N>/` for inspection. Trigger when the user wants to test a template, preview template output, dry-run a template, see what a template generates, or debug a `${{ values.* }}` substitution — without actually creating a GitHub repo. Picks the template from `templates/`, prompts for parameter values via AskUserQuestion, ensures the backend body limit is high enough, POSTs to `/api/scaffolder/v2/dry-run` (gzipped, since the skeleton can be MBs), and unpacks the response.
---

# test-template

Render a Backstage scaffolder template via the dry-run API and persist the result under `template-workspace/dry-run-<N>/`. Useful for inspecting `${{ values.* }}` substitutions, validating skeleton output, and iterating on a template without publishing to GitHub each time.

## Key facts

- **Endpoint**: `POST http://127.0.0.1:7007/api/scaffolder/v2/dry-run`
- **Body shape**: `{ template, values, secrets, directoryContents }` — the endpoint **does not accept** a `templateRef`. The UI resolves the ref client-side; this skill does the same by reading the template YAML and walking the template directory on disk.
- **`directoryContents`** is an array of `{ path, base64Content }` covering **the entire template directory** (including the `<slug>.yaml` and everything under `skeleton/`). Paths must be relative to the template root, and `skeleton/...` must be present because the template's `fetch:template` step uses `url: ./skeleton`.
- **Compression**: The skeleton for a typical BWCE template is ~1.5 MB. Send the body gzipped (`Content-Encoding: gzip`) — but note that `raw-body` enforces the size limit on the **decompressed** stream, so the root `express.json()` limit still applies (see preflight below).
- **Sandbox**: Bash localhost calls require `dangerouslyDisableSandbox: true`. Use it for both `lsof` checks and the `node /tmp/test-template.mjs` invocation.

## Workflow

### 1. Pick the template

```sh
ls <repo-root>/templates/
```

If there's only one folder under `templates/`, pick it. If there are multiple, ask with `AskUserQuestion` (single-select, one option per folder). Each folder must contain a `<slug>.yaml` and a `skeleton/` directory.

### 2. Introspect parameters and gather values

Read `templates/<slug>/<slug>.yaml`. Walk `spec.parameters[*].properties` and `spec.parameters[*].required` to figure out what the template expects. Common params seen in this repo: `name` (EntityNamePicker, required), `description`, `owner` (OwnerPicker → expects `group:default/<slug>` format), `repoUrl` (RepoUrlPicker → `github.com?owner=<x>&repo=<y>`), plus template-specific scalars like `db_port`.

For each required param, propose a sensible default and ask the user via a single batched `AskUserQuestion`. Defaults that work well for dry-run (no real publish happens):

- `name`: `dry-run-<short-timestamp>` (e.g. `dry-run-1730473521`)
- `description`: `Dry-run test`
- `owner`: `group:default/test`
- `repoUrl`: `github.com?owner=test&repo=<name>` (build from the chosen name)
- `debug`: `true` — if the template has a `debug` boolean parameter (the standard pattern for skipping publish/register steps during testing), always set this to `true` in the dry-run values
- enum / numeric defaults: pull the `default:` from the param schema if present

Then show the final values blob back to the user as a single message and confirm before posting. If the user wants to skip prompting and use defaults, accept a one-shot invocation that fills everything (the `simplify`/automated path).

### 3. Preflight: backend reachable + body limit high enough

```sh
lsof -nP -iTCP:7007 -sTCP:LISTEN
```

If nothing is listening, stop and tell the user to `yarn start`. Don't try to start it yourself — the dev server is theirs to manage.

Check `packages/backend/src/rootHttpRouterService.ts`. The root JSON middleware runs **before** scaffolder's own 10 MB middleware, so its limit governs the upload. This project already has `router.use(express.json({ limit: '10mb' }))` at line 20 — leave it alone. If you ever see the default `router.use(express.json())` without a limit, edit it to add `{ limit: '10mb' }` and wait a few seconds for Backstage CLI's watcher to auto-restart the backend.

### 4. Compute next dry-run output directory

```sh
ls template-workspace/ | grep -E '^dry-run-[0-9]+$'
```

Find the highest `dry-run-<N>` integer, increment by 1. First run is `dry-run-1`. This keeps prior runs available for diffing.

The `template-workspace/` path is whatever `backend.workingDirectory` resolves to in `app-config.local.yaml` — read that config rather than hardcoding. In this repo it's set to `../../template-workspace` (relative to `packages/backend/`, so repo root + `/template-workspace`).

### 5. Run the dry-run

Write the canonical script below to `/tmp/test-template.mjs`, substituting `TEMPLATE_DIR`, `OUTPUT_DIR`, and `VALUES`. Then `node /tmp/test-template.mjs` with `dangerouslyDisableSandbox: true`.

```js
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { parse } from '<repo>/node_modules/yaml/dist/index.js';

const TEMPLATE_DIR = '<repo>/templates/<slug>';
const TEMPLATE_YAML = `${TEMPLATE_DIR}/<slug>.yaml`;
const OUTPUT_DIR = '<repo>/template-workspace/dry-run-<N>';
const ENDPOINT = 'http://127.0.0.1:7007/api/scaffolder/v2/dry-run';
const VALUES = { /* ... user values ... */ };

async function walk(dir, base = dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    if (name === '.git') continue;
    const full = join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await walk(full, base)));
    else out.push({ path: relative(base, full), base64Content: (await readFile(full)).toString('base64') });
  }
  return out;
}

const template = parse(await readFile(TEMPLATE_YAML, 'utf8'));
const directoryContents = await walk(TEMPLATE_DIR);
const body = JSON.stringify({ template, values: VALUES, secrets: {}, directoryContents });
const gzipped = gzipSync(body);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' },
  body: gzipped,
});
const text = await res.text();
if (!res.ok) { console.error(`HTTP ${res.status}: ${text}`); process.exit(1); }

const result = JSON.parse(text);
await mkdir(OUTPUT_DIR, { recursive: true });
for (const f of result.directoryContents ?? []) {
  const target = join(OUTPUT_DIR, f.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(f.base64Content, 'base64'), { mode: f.executable ? 0o755 : 0o644 });
}
await writeFile(join(OUTPUT_DIR, '_dry-run-log.json'), JSON.stringify(result.log ?? [], null, 2));
await writeFile(join(OUTPUT_DIR, '_dry-run-output.json'), JSON.stringify(result.output ?? {}, null, 2));
console.log(`Wrote ${result.directoryContents?.length ?? 0} files to ${OUTPUT_DIR}`);
```

### 6. Surface the result

After a successful run, read these from the output dir and summarize:

- File count + total size
- The rendered `catalog-info.yaml` (most useful sanity check that values substituted correctly)
- Any problems in `_dry-run-log.json` — log entries have shape `{ body: { message, stepId?, status? } }` (no top-level `level` field). Look for `status: 'skipped'` to confirm conditional steps (e.g. `debug` mode) behaved correctly, and scan `message` text for `error`/`warn` strings.
- The `_dry-run-output.json` if non-empty (template-defined links — usually a `Repository` URL and an `entityRef`, mocked in dry-run)

Keep the user-facing summary tight: path, file count, "values applied" confirmation from one templated file, plus any non-info log levels. Don't dump full file contents unless asked.

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `HTTP 413 PayloadTooLargeError`, `limit: 102400` | Root `express.json()` is at default 100 KB | Bump to `'10mb'` in `rootHttpRouterService.ts:20` (step 3) |
| `HTTP 500 ENOENT: ... /skeleton` | `directoryContents` paths don't include `skeleton/` prefix | Walk from the **template root**, not from inside `skeleton/` |
| `HTTP 400 Input template is not a template` | YAML parse failed or the template lacks required fields | `yaml.parse()` returned wrong shape — log it; check `apiVersion`, `kind`, `metadata.name`, `spec.steps` |
| `HTTP 400 { errors: [...jsonschema...] }` | `values` doesn't satisfy `spec.parameters[*]` schema | Inspect the schema and fix the value (e.g. `repoUrl` must match `github.com?owner=X&repo=Y` shape) |
| `ECONNREFUSED 127.0.0.1:7007` | Backend not running | `yarn start` from repo root |
| `Failed to connect to 127.0.0.1:7007` from sandbox | Bash sandbox blocks localhost | Run with `dangerouslyDisableSandbox: true` |
| Step in log says `Beginning step Publish` and the run errors | Publish action isn't dry-run-aware | Most built-in publishers (`publish:github`, `catalog:register`) are. Custom actions in `@internal/*` plugins may not be; check the action source for an `isDryRun` guard |

## Don't

- **Don't** run `yarn start` yourself if the backend is down — tell the user. Their dev loop, their call.
- **Don't** send a `templateRef`. The endpoint validates `template` as a full entity (`templateEntityV1beta3Validator.check`) and will reject anything else with HTTP 400.
- **Don't** upload only `skeleton/` contents. The template's `fetch:template` step looks for `./skeleton` relative to the dry-run content root, so the parent dir layout matters.
- **Don't** overwrite previous `dry-run-N` directories. Auto-increment so the user can diff runs (`diff -r dry-run-1 dry-run-2`).
- **Don't** ungzip the body manually before sending — `fetch` happily streams a `Buffer` and the `Content-Encoding: gzip` header tells the server to inflate. (`raw-body` decompresses against the size limit, which is why step 3 matters.)
- **Don't** chase the `_dry-run-output.json`'s `Repository` URL — it's a placeholder. No GitHub repo is created during dry-run.
- **Don't** add `dry-run-*/` to `.gitignore` automatically; the user may want to commit a known-good snapshot for golden-file diffing. Ask first.
