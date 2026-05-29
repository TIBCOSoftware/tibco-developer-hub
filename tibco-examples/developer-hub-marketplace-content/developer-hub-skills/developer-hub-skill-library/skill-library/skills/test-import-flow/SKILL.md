---
name: test-import-flow
description: >
  Test an import flow template in two phases: (1) dry-run structure validation —
  same mechanics as test-template — to verify YAML syntax and Nunjucks skeleton
  rendering without any real GitHub activity; (2) live scaffolder task execution
  against a real GitHub repository, followed by Backstage catalog API verification
  that the imported entities were actually registered in the Developer Hub.
  Trigger when the user wants to test an import flow, verify catalog import,
  run an import flow end-to-end, check that components were registered after
  an import, or confirm a newly created import flow works correctly.
---

# test-import-flow

Two-phase end-to-end test for TIBCO Developer Hub import flow templates.

**Phase 1 (dry-run)**: Validates template YAML structure and Nunjucks skeleton rendering via `POST /api/scaffolder/v2/dry-run`. No real GitHub activity. Expected to show errors on TIBCO custom actions (they are not dry-run-aware) — this is normal.

**Phase 2 (live run + catalog verification)**: Submits a real scaffolder task via `POST /api/scaffolder/v2/tasks` against a user-provided live GitHub repo, polls until completion, then queries the Backstage catalog REST API to confirm the imported entities were registered.

## Key facts

- **Dry-run endpoint**: `POST http://127.0.0.1:7007/api/scaffolder/v2/dry-run`
- **Task submit endpoint**: `POST http://127.0.0.1:7007/api/scaffolder/v2/tasks`
- **Task status endpoint**: `GET http://127.0.0.1:7007/api/scaffolder/v2/tasks/{id}`
- **Catalog entity endpoint**: `GET http://127.0.0.1:7007/api/catalog/entities?filter=kind=<Kind>,metadata.name=<name>`
- **Sandbox**: All localhost calls require `dangerouslyDisableSandbox: true`
- **Import flows with dry-run**: `tibco:git:clone`, `tibco:extract-parameters`, and `tibco:git:push` are **not** dry-run-aware; they will attempt real execution and fail. This is expected and does not indicate a broken template.

## Workflow

### 1. Pick the import flow template

```sh
ls templates/
```

List all folders under `templates/`. For each, read the `<slug>.yaml` and check `metadata.tags` for `import-flow`. If only one import flow template exists, use it. If multiple, ask via `AskUserQuestion` (single-select).

If no import flow templates exist under `templates/`, tell the user to create one first with the `create-import-flow` skill.

### 2. Phase 1 — Dry-run (structure validation)

#### 2a. Introspect parameters and gather values

Read `templates/<slug>/<slug>.yaml`. Walk `spec.parameters[*].properties` and collect required/optional params. For import flows, typical params are: `repoUrl`, `application`, `owner`, plus tech-specific ones (`application_folder`, `system`).

Propose dry-run safe defaults and ask user to confirm in a single `AskUserQuestion`:
- `repoUrl`: `github.com?owner=test&repo=test-app` (fake — clone will fail, that's expected)
- `application`: `test-application`
- `application_folder`: `test-folder` (if present)
- `system`: `test-system` (if present)
- `owner`: `group:default/test`

Show the final values and confirm before posting.

#### 2b. Preflight

```sh
lsof -nP -iTCP:7007 -sTCP:LISTEN
```

If nothing is listening, stop and tell the user to run `yarn start`. Don't start it yourself.

Check `packages/backend/src/rootHttpRouterService.ts` — the root `express.json()` limit must be `'10mb'` (already set in this repo). If not, edit and wait for auto-restart.

#### 2c. Run the dry-run

Write the script below to `/tmp/test-import-flow-dry.mjs`, substituting `TEMPLATE_DIR`, `OUTPUT_DIR`, and `VALUES`. Run with `dangerouslyDisableSandbox: true`.

```js
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { parse } from '<repo>/node_modules/yaml/dist/index.js';

const TEMPLATE_DIR = '<repo>/templates/<slug>';
const TEMPLATE_YAML = `${TEMPLATE_DIR}/<slug>.yaml`;
const OUTPUT_DIR = '<repo>/template-workspace/dry-run-<N>';
const ENDPOINT = 'http://127.0.0.1:7007/api/scaffolder/v2/dry-run';
const VALUES = { /* dry-run values */ };

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

Compute `OUTPUT_DIR` by scanning `template-workspace/` for the highest existing `dry-run-<N>` and incrementing (first run = `dry-run-1`). The base path comes from `backend.workingDirectory` in `app-config.local.yaml`.

#### 2d. Surface the dry-run result

Report:
- File count and total size
- Rendered `.njk` skeleton files (if advanced flow) — these show that Nunjucks substitution works
- Steps that failed due to dry-run limitations — specifically list `tibco:git:clone`, `tibco:extract-parameters`, `tibco:git:push` as **expected failures** when present. If other steps failed, that may indicate a real problem.
- Confirm `spec.parameters` schema parsed correctly (HTTP 400 `Input template is not a template` = YAML parse/structure problem)

Key message to user after Phase 1:
> "Steps `clone`, `extract`, and `push` are not dry-run-aware and failed as expected. The template YAML structure and Nunjucks skeleton rendering are validated. Proceed to Phase 2 to run a full end-to-end test against a real repository."

### 3. Phase 2 — Live run + catalog verification

Ask the user explicitly before proceeding:

> "Phase 2 will submit a real scaffolder task. It will clone the GitHub repo you provide, extract metadata from source files, generate catalog YAML files, commit them back (creating a PR), and register entities in the catalog. Do you want to continue?"

If the user declines, stop here.

#### 3a. Gather live run values

Read the template schema again and ask the user for real values via `AskUserQuestion`:
- `repoUrl`: a **real** GitHub repo URL (`github.com?owner=<org>&repo=<repo-name>`) — the repo must exist and be accessible with the backend's GitHub token
- `application`: the real application/project folder name as it exists in the repo
- `application_folder` (if present): parent folder containing the app
- `system` (if present): catalog system name to associate with the import
- `owner`: catalog owner group, e.g. `group:default/my-team`

Explain to the user what the import flow will look for in the repo so they can provide a repo that matches the expected structure.

#### 3b. Submit the live scaffolder task

Write `/tmp/run-import-flow.mjs` and run with `dangerouslyDisableSandbox: true`:

```js
const ENDPOINT = 'http://127.0.0.1:7007/api/scaffolder/v2/tasks';
const VALUES = { /* live values from user */ };

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateRef: 'template:default/<slug>',
    values: VALUES,
  }),
});

if (!res.ok) {
  const err = await res.text();
  console.error(`HTTP ${res.status}: ${err}`);
  process.exit(1);
}

const { id } = await res.json();
console.log(`Task ID: ${id}`);
```

Save the task ID for polling.

#### 3c. Poll for task completion

Write `/tmp/poll-import-flow.mjs` and run with `dangerouslyDisableSandbox: true`:

```js
const TASK_ID = '<id from step 3b>';
const ENDPOINT = `http://127.0.0.1:7007/api/scaffolder/v2/tasks/${TASK_ID}`;
const TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 3_000;

const start = Date.now();
let lastStatus = '';

while (Date.now() - start < TIMEOUT_MS) {
  const res = await fetch(ENDPOINT);
  const task = await res.json();
  const status = task.status;

  if (status !== lastStatus) {
    console.log(`[${new Date().toISOString()}] Status: ${status}`);
    lastStatus = status;
  }

  if (status === 'completed') {
    console.log('Task completed successfully.');
    process.exit(0);
  }
  if (status === 'failed') {
    console.error('Task failed.');
    console.error(JSON.stringify(task, null, 2));
    process.exit(1);
  }

  await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
}

console.error('Timed out waiting for task completion.');
process.exit(1);
```

If the task fails, fetch the task events for details:

```sh
curl -s "http://127.0.0.1:7007/api/scaffolder/v2/tasks/<id>/events" | node -e "
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const text = Buffer.concat(chunks).toString();
  const lines = text.split('\n').filter(l => l.startsWith('data:'));
  lines.forEach(l => {
    try { const e = JSON.parse(l.slice(5)); if (e.body) console.log(e.body.message); } catch {}
  });
});
"
```

Report the failed step name and error message to the user with suggested fixes:

| Failure | Likely cause | Fix |
|---------|-------------|-----|
| `clone` step fails | Repo doesn't exist or backend GitHub token lacks access | Check `GITHUB_TOKEN` in `.env.yarn`; verify repo URL |
| `extract` step fails | File path expression resolves to a non-existent file | Verify `application` and `application_folder` match actual repo structure |
| `push` step fails | No write permissions on the repo | Check GitHub token has push/PR creation rights |
| `register` step fails | Generated file URL points to wrong branch or path | Check that the push succeeded and the file path in `catalogInfoUrl` is correct |

#### 3d. Catalog API verification

Once the task completes successfully, query the catalog for the registered entities.

Determine the expected entity name from the template's extraction output. Since this is a live run, the extracted name came from the actual source files. Check the task events or the generated YAML file path for the entity name.

Write `/tmp/verify-catalog.mjs` and run with `dangerouslyDisableSandbox: true`:

```js
const BASE = 'http://127.0.0.1:7007/api/catalog/entities';
const ENTITY_KINDS = ['Component', 'System', 'API', 'Resource']; // adjust per flow
const RETRIES = 3;
const RETRY_DELAY_MS = 5_000;

async function checkEntity(kind, name) {
  const url = `${BASE}?filter=kind=${kind},metadata.name=${name}`;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const res = await fetch(url);
    const items = await res.json();
    if (Array.isArray(items) && items.length > 0) {
      return items[0];
    }
    if (attempt < RETRIES) {
      console.log(`Entity ${kind}:${name} not found yet (attempt ${attempt}/${RETRIES}), retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  return null;
}

// Check for the primary Component entity (name comes from extracted param)
const entityName = '<extracted-name or parameter.application>';
const entity = await checkEntity('Component', entityName);

if (entity) {
  console.log('✓ Component registered successfully:');
  console.log(`  name: ${entity.metadata.name}`);
  console.log(`  type: ${entity.spec?.type}`);
  console.log(`  owner: ${entity.spec?.owner}`);
  console.log(`  tags: ${entity.metadata.tags?.join(', ')}`);
  const slug = entity.metadata.annotations?.['github.com/project-slug'];
  if (slug) console.log(`  github.com/project-slug: ${slug}`);
} else {
  console.error(`✗ Component ${entityName} not found in catalog after ${RETRIES} attempts.`);
  process.exit(1);
}

// For advanced flows, also check System entity
// const system = await checkEntity('System', parameters.system);
```

For advanced flows that register multiple entity types (System, API, Resource), run a check for each registered entity type.

Report to user:
- For each registered entity: `kind`, `metadata.name`, `spec.type`, `spec.owner`, `metadata.tags`, and the `github.com/project-slug` annotation
- Overall result: "✓ Import flow completed — N entities registered in the Developer Hub catalog"
- If any entity is missing: which catalog:register step to check in the task log, and the exact registration URL that step used

## Common failure modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Phase 1 HTTP 413 | Root `express.json()` at default 100 KB | Bump to `'10mb'` in `rootHttpRouterService.ts` |
| Phase 1 HTTP 400 "not a template" | YAML parse failed or missing required fields | Check `apiVersion`, `kind`, `metadata.name`, `spec.steps` |
| Phase 1 — clone/extract/push errors | Expected — not dry-run-aware | Normal; see step 2d |
| Phase 2 task `failed` at clone | Repo inaccessible | Check GitHub token and repo URL |
| Phase 2 task `failed` at extract | Wrong file path in extraction config | Verify app folder + file name against actual repo |
| Phase 2 catalog empty after task completes | Catalog refresh lag | Retry 3× with 5s delay (built into verify script) |
| Phase 2 catalog empty after retries | `catalog:register` URL points to wrong branch | Check task events for register step URL; confirm file was pushed to `main` |
| `ECONNREFUSED 127.0.0.1:7007` | Backend not running | `yarn start` from repo root |
| Bash sandbox blocks localhost | Sandbox restriction | Use `dangerouslyDisableSandbox: true` |

## Don't

- Don't run `yarn start` yourself if the backend is down — tell the user.
- Don't skip the user confirmation before Phase 2 — it creates real GitHub content.
- Don't try to verify the GitHub PR was created — success criterion is catalog entity presence only.
- Don't overwrite prior `dry-run-N` directories from Phase 1 — auto-increment.
- Don't hardcode the entity name for catalog verification — extract it from the task output or template parameters, since it comes from source file extraction.
- Don't stop at the first empty catalog response — retry 3 times with a 5-second delay to allow for catalog refresh latency.
- Don't use `dangerouslyDisableSandbox: true` for file reads or directory creation — only for localhost network calls and file writes that require it.
