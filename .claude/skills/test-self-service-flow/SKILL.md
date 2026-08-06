---
name: test-self-service-flow
description: >
  Test a TIBCO Developer Hub self service flow in two phases: (1) dry-run structure
  validation via the scaffolder dry-run API — verifies YAML, parameter schema, and
  skeleton rendering without touching the TIBCO Platform; (2) a live scaffolder task
  run against a real Control Plane / Data Plane, polled to completion, then verified
  against the platform APIs (build, app, endpoint) and the Backstage catalog.
  Trigger when the user wants to test a self service flow, run a build & deploy flow
  end-to-end, check that an app was actually deployed to a data plane, debug a
  tibco:call-platform-api step, or confirm a newly created self service flow works.
---

# test-self-service-flow

Two-phase end-to-end test for TIBCO Developer Hub self service flows.

**Phase 1 (dry-run)**: validates template YAML, parameter schema, and any skeleton rendering via
`POST /api/scaffolder/v2/dry-run`. No platform calls succeed — that is expected.

**Phase 2 (live run + verification)**: submits a real scaffolder task, polls to completion, then
confirms the result against the **platform APIs** (was the app really built, deployed, and
exposed?) and the **catalog API** (was it registered?).

Phase 2 of a self service flow is heavier than for a template or import flow: it consumes real
Data Plane resources. Treat it as a deployment, not a test run.

## Key facts

- **Dry-run endpoint**: `POST http://127.0.0.1:7007/api/scaffolder/v2/dry-run`
- **MCP first (Developer Hub 1.19).** The scaffolder is exposed over MCP, so the whole
  submit-and-poll dance is three typed calls instead of hand-rolled HTTP:
  - `scaffolder.dry-run-template` — `{ templateYaml, values, files }` → `{ valid, errors, log, steps }`.
    Phase 1's structure check. Note it returns **no rendered files**; it is a validity gate, not a render.
  - `scaffolder.execute-template` — `{ templateRef, values, secrets }` → `{ taskId }`. The live run.
    **Side-effecting** — summarise what it will do and get the user's confirmation before calling it.
  - `scaffolder.get-scaffolder-task-logs` — `{ taskId, after? }` → `{ events: [{ id, createdAt, type, body }] }`.
    Poll with `after` set to the last event id you saw to tail the run.
  - `scaffolder.list-scaffolder-tasks` — recover a `taskId` you lost.
  - `catalog.query-catalog-entities` — the registration check at the end.
  See `MCP-TOOLS.md` for the endpoint and how to enable the server. **If MCP is off, use the REST
  endpoints below** — the phases, checks and verdicts are identical, only the transport changes.
- **Task submit endpoint**: `POST http://127.0.0.1:7007/api/scaffolder/v2/tasks`
- **Task status endpoint**: `GET http://127.0.0.1:7007/api/scaffolder/v2/tasks/{id}`
- **Task events (SSE)**: `GET http://127.0.0.1:7007/api/scaffolder/v2/tasks/{id}/events`
- **Catalog entity endpoint**: `GET http://127.0.0.1:7007/api/catalog/entities?filter=kind=<Kind>,metadata.name=<name>`
- **Sandbox**: all localhost calls require `dangerouslyDisableSandbox: true`
- **Not dry-run aware**: `tibco:call-platform-api`, `tibco:file:write`, `tibco:fetch-api-file`,
  and `tibco:extract-parameters` all attempt real execution and fail during dry-run. Expected.
- **`CapabilitySelector` is a frontend field.** The dry-run and task APIs receive whatever object
  you send — the health filtering never runs. You must supply a complete, correct
  `deploymentTarget` object by hand for Phase 2.
- **Timeouts**: a build & deploy flow takes minutes, not seconds. Poll for at least 600s.

- **Scratch files**: helper scripts, dumps and intermediate JSON go under
  `${TMPDIR:-/tmp}/devhub-skills/test-self-service-flow/` — `mkdir -p` it before the first write and remove it when the run
  finishes. Don't write straight into `/tmp`: concurrent runs collide there, and a
  published skill should not leave loose `.mjs` files in a shared directory.

## Workflow

### 1. Pick the self service flow

```sh
ls templates/
```

For each folder, read `<slug>.yaml` and select those carrying the **`self-service` tag** — that is
what the Self Service page filters on, so it is also the right selector here. (`spec.type:
self-service` is conventional but not required, so don't filter on it and miss a valid flow.)
One match → use it. Several → ask via `AskUserQuestion` (single-select).

If none exist, tell the user to create one first with the `create-self-service-flow` skill.

### 2. Read the flow and map what it will do

Before running anything, read `templates/<slug>/<slug>.yaml` and summarise for the user:

- every `tibco:call-platform-api` step, its `method`, its `endpoint`, and whether it targets the
  **Control Plane** (no `baseUrl`) or the **Data Plane** (`baseUrl` set)
- which steps are guarded by `if:` and under what condition they run
- whether the flow ends with `publish:github` + `catalog:register`
- the resources it creates: build, app, public endpoint, GitHub repo, catalog entity

This is the blast-radius summary the user needs before approving Phase 2.

### 3. Preflight

```sh
lsof -nP -iTCP:7007 -sTCP:LISTEN
```

Nothing listening → stop and tell the user to run `yarn start`. Don't start it yourself.

Check `packages/backend/src/rootHttpRouterService.ts` — the root `express.json()` limit must be
`'10mb'` (already set in this repo).

Check `app-config.local.yaml` for `cpLink` and `TIBCOPlatformToken`. Without both, every
`tibco:call-platform-api` step fails with an auth or connection error in Phase 2. Report which is
missing; never invent a token, and never print the token value back to the user.

### 4. Phase 1 — Dry-run (structure validation)

#### 4a. Gather dry-run values

Walk `spec.parameters[*].properties`. Propose safe defaults and confirm in one
`AskUserQuestion`:

- `app_name` / `flogo_app_name`: `dry-run-app`
- `filename`: keep the schema default (`app.json`, `app.ear`)
- `content`: a minimal placeholder string — real content is not needed for structure validation
- `deploymentTarget`: a stub object, since the selector does not run:
  ```json
  {
    "dataplaneId": "dp-test",
    "capabilityId": "cap-test",
    "dataplaneUrl": "https://dataplane.invalid",
    "dataplaneHost": "dataplane.invalid",
    "dataplaneName": "Test Data Plane"
  }
  ```
- `repoUrl` (if present): `github.com?owner=test&repo=test-app`

#### 4b. Run the dry-run

Write the script below to `${TMPDIR:-/tmp}/devhub-skills/test-self-service-flow/test-self-service-dry.mjs`, substituting `TEMPLATE_DIR`,
`OUTPUT_DIR`, and `VALUES`. Run with `dangerouslyDisableSandbox: true`.

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

Compute `OUTPUT_DIR` by scanning `template-workspace/` for the highest `dry-run-<N>` and
incrementing. The base path comes from `backend.workingDirectory` in `app-config.local.yaml`.

#### 4c. Surface the Phase 1 result

Report:

- HTTP 400 with jsonschema errors → the parameter schema rejected your values; fix and re-run.
  This is the main thing Phase 1 catches, and it catches it in seconds instead of minutes.
- HTTP 400 `Input template is not a template` → YAML parse or missing `apiVersion` / `kind` /
  `metadata.name` / `spec.steps`.
- Rendered skeleton files (if the flow has one) — proves `fetch:template` substitution works.
- Failures on `tibco:call-platform-api`, `tibco:file:write`, `tibco:extract-parameters`,
  `tibco:fetch-api-file` → **expected**, list them as such.
- Failures on any *other* step → a real problem worth fixing before Phase 2.

Key message after Phase 1:

> "The TIBCO platform actions are not dry-run aware and failed as expected. What is validated:
> the template structure, the parameter schema, and skeleton rendering. Phase 2 runs the flow for
> real against your Control Plane."

### 5. Phase 2 — Live run

Ask explicitly, and list the concrete resources from step 2:

> "Phase 2 will run this flow for real against your TIBCO Platform. It will: build and deploy an
> application on data plane `<name>`, expose a public endpoint, create a GitHub repository, and
> register an entity in the catalog. These consume real resources and are not automatically
> cleaned up. Continue?"

If the user declines, stop here.

#### 5a. Gather live values

The `CapabilitySelector` does not run over the API, so you must build `deploymentTarget` by hand.
Get the real values from the Control Plane rather than asking the user to guess:

```sh
curl -s -H "Authorization: Bearer $TIBCO_PLATFORM_TOKEN" \
  "$CP_LINK/tp-cp-ws/v1/data-planes" | head -c 2000
```

From the response take `dataplaneId`, the matching capability instance id (`capabilityId`), the
data plane URL (`dataplaneUrl`), and its host (`dataplaneHost`). Confirm the assembled object
with the user before submitting.

Also collect: the real app name, the real artifact `content` (a working Flogo app JSON or BW5CE
`.ear` — ask the user for a path and read it), and a real `repoUrl` the backend's GitHub token
can create.

#### 5b. Submit the task

Write `${TMPDIR:-/tmp}/devhub-skills/test-self-service-flow/run-self-service-flow.mjs` and run with `dangerouslyDisableSandbox: true`:

```js
const ENDPOINT = 'http://127.0.0.1:7007/api/scaffolder/v2/tasks';
const VALUES = { /* live values, including the full deploymentTarget object */ };

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ templateRef: 'template:default/<slug>', values: VALUES }),
});

if (!res.ok) { console.error(`HTTP ${res.status}: ${await res.text()}`); process.exit(1); }
const { id } = await res.json();
console.log(`Task ID: ${id}`);
```

#### 5c. Poll for completion — and stream the step log

Build & deploy flows run for minutes. Poll with a long timeout and report step transitions so the
user can see progress rather than a silent wait.

```js
const TASK_ID = '<id from 5b>';
const ENDPOINT = `http://127.0.0.1:7007/api/scaffolder/v2/tasks/${TASK_ID}`;
const TIMEOUT_MS = 600_000;   // build + deploy is slow
const POLL_INTERVAL_MS = 5_000;

const start = Date.now();
let lastStatus = '';

while (Date.now() - start < TIMEOUT_MS) {
  const task = await (await fetch(ENDPOINT)).json();
  if (task.status !== lastStatus) {
    console.log(`[${new Date().toISOString()}] Status: ${task.status}`);
    lastStatus = task.status;
  }
  if (task.status === 'completed') { console.log('Task completed.'); process.exit(0); }
  if (task.status === 'failed') {
    console.error('Task failed.');
    console.error(JSON.stringify(task, null, 2));
    process.exit(1);
  }
  await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
}
console.error('Timed out waiting for task completion.');
process.exit(1);
```

On failure, pull the events to find the failing step and the platform response body:

```sh
curl -s "http://127.0.0.1:7007/api/scaffolder/v2/tasks/<id>/events" | node -e "
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const text = Buffer.concat(chunks).toString();
  text.split('\n').filter(l => l.startsWith('data:')).forEach(l => {
    try { const e = JSON.parse(l.slice(5)); if (e.body) console.log(e.body.message); } catch {}
  });
});
"
```

The `debug:log` steps in the flow print the `buildId` and `appId` here — capture both, they are
the inputs to Phase 2 verification.

### 6. Verify against the platform

Task `completed` only means every step returned 2xx. Confirm the platform actually holds the
resources.

```sh
# The build exists
curl -s -H "Authorization: Bearer $TIBCO_PLATFORM_TOKEN" \
  "$DATAPLANE_URL/public/v1/dp/builds/$BUILD_ID"

# The app is deployed and running
curl -s -H "Authorization: Bearer $TIBCO_PLATFORM_TOKEN" \
  "$DATAPLANE_URL/public/v1/dp/apps/$APP_ID"

# The endpoint is public
curl -s -H "Authorization: Bearer $TIBCO_PLATFORM_TOKEN" \
  "$DATAPLANE_URL/public/v1/dp/apps/$APP_ID/endpoints"
```

Report app status, replica count, and the public endpoint URL. An app in a non-running state
(`Pending`, `CrashLoopBackOff`, `Failed`) after a `completed` task is the classic false positive:
the deploy API accepted the request, the container never came up.

### 7. Verify in the catalog

Only if the flow ends with `catalog:register`. Reuse the retry pattern — catalog refresh lags:

```js
const BASE = 'http://127.0.0.1:7007/api/catalog/entities';
const RETRIES = 3;
const RETRY_DELAY_MS = 5_000;

async function checkEntity(kind, name) {
  const url = `${BASE}?filter=kind=${kind},metadata.name=${name}`;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const items = await (await fetch(url)).json();
    if (Array.isArray(items) && items.length > 0) return items[0];
    if (attempt < RETRIES) await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
  }
  return null;
}

const entity = await checkEntity('Component', '<app_name>');
if (entity) {
  console.log('✓ Component registered:');
  console.log(`  name: ${entity.metadata.name}`);
  console.log(`  type: ${entity.spec?.type}`);
  console.log(`  owner: ${entity.spec?.owner}`);
  console.log(`  tags: ${entity.metadata.tags?.join(', ')}`);
} else {
  console.error('✗ Component not found in catalog after retries.');
  process.exit(1);
}
```

### 8. Report and offer cleanup

Summarise: task status · buildId · appId · app state · public endpoint URL · repository URL ·
catalog entity ref.

Then list what the run left behind and offer to remove it — do not delete anything without an
explicit yes:

```sh
# Delete the deployed app
curl -s -X DELETE -H "Authorization: Bearer $TIBCO_PLATFORM_TOKEN" \
  "$DATAPLANE_URL/public/v1/dp/apps/$APP_ID"
```

The GitHub repository and the catalog entity are also left behind; mention both. Deleting the
repo is the user's call.

## Common failure modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Phase 1 HTTP 413 | Root `express.json()` at default 100 KB | Bump to `'10mb'` in `rootHttpRouterService.ts` |
| Phase 1 HTTP 400 jsonschema errors | Values don't satisfy `spec.parameters` | Fix values — most often `deploymentTarget` sent as a string instead of an object |
| Phase 1 platform-action errors | Expected — not dry-run aware | Normal; see step 4c |
| Phase 2 fails on the first API call, 401/403 | `TIBCOPlatformToken` missing or expired | Refresh the token in `app-config.local.yaml` |
| Phase 2 fails, `ENOTFOUND` / connection refused | `cpLink` wrong, or a DP call missing `baseUrl` | CP calls omit `baseUrl`; DP calls must pass `parameters.deploymentTarget.dataplaneUrl` |
| Phase 2 404 on a `public/v1/dp/...` endpoint | Called against the Control Plane | Add `baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}` |
| Extraction step returns nothing | Response written without `\| dump`, or wrong JSONPath | Pipe `output.data \| dump` into `tibco:file:write`; test the JSONPath against the saved file |
| Deploy step 404s on `buildId` | Build not finished when deploy ran | Increase the `debug:wait` seconds or poll build status |
| Task completes but app never runs | Deploy accepted, container failed | Check app status via the platform API (step 6) and the app logs in the Control Plane |
| Provisioning step ran on an already-provisioned DP | Missing `if:` guard | Add the guard; see `create-self-service-flow` |
| `ECONNREFUSED 127.0.0.1:7007` | Backend not running | `yarn start` from repo root |
| Bash sandbox blocks localhost | Sandbox restriction | Use `dangerouslyDisableSandbox: true` |

## Don't

- Don't run Phase 2 without explicit user confirmation that names the resources it will create.
- Don't run Phase 2 against a production data plane unless the user says so in as many words.
- Don't skip Phase 1 — it catches schema errors in seconds that would otherwise surface minutes
  into a live run.
- Don't treat `status: completed` as proof of success. Verify the app state on the data plane.
- Don't print, log, or write the `TIBCOPlatformToken` into any file, script, or summary. Read it
  from config or the environment at call time.
- Don't run `yarn start` yourself if the backend is down — tell the user.
- Don't overwrite prior `dry-run-N` directories — auto-increment.
- Don't delete deployed apps, repos, or catalog entities without asking first.
- Don't retry a failed live run blindly — read the task events, identify the failing step, and fix
  the flow. Repeated runs leave orphaned builds and apps on the data plane.
- Don't use `dangerouslyDisableSandbox: true` for anything but localhost network calls and the
  file writes that require it.
