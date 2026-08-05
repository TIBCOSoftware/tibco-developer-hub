---
name: setup-dev-hub
description: Bootstrap a fresh local TIBCO Developer Hub dev environment end-to-end. Trigger when the user wants to set up / initialize / bootstrap the project for the first time, get the app running locally, or onboard a new machine. Verifies prerequisites and versions (Node, Yarn, native build toolchain; Docker only if a Postgres DB is chosen), creates app-config.local.yaml and .env.yarn from their templates, lets the user pick an in-memory (better-sqlite3) or Docker Postgres database, optionally wires a GitHub PAT, then runs yarn install and starts the app, confirming the ports are listening.
---

# setup-dev-hub

Set up and launch a local TIBCO Developer Hub from a clean checkout, following the README's getting-started flow. The goal is a working `yarn start` with backend on `:7007` and frontend on `:3000` (→ `http://localhost:3000/tibco/hub`).

## Key facts

- **Repo root**: the repository checkout directory (e.g. `tibco-developer-hub`). Run everything from there.
- **Required versions** (from `package.json` + README): Node `22 || 24`, Yarn exactly `4.4.1` (pinned via `packageManager`), Docker with Compose **only if** the user picks the Postgres DB.
- **Native modules**: `yarn install` compiles `isolated-vm` and `better-sqlite3` from source via `node-gyp`, so a C++ toolchain + Python 3 must be present (see step 1). This is the most common reason a fresh install fails.
- **Config files** are gitignored, so it's safe to write secrets into them:
  - `app-config.local.yaml` ← copy of `app-config.template-local.yaml`
  - `.env.yarn` ← copy of `.env.yarn-local`
- **In-memory DB is first-class**: `packages/backend` depends on `better-sqlite3`, and `app-config.yaml` ships the commented `client: better-sqlite3` / `connection: ':memory:'` snippet. No Docker required for this path.
- **Sandbox**: writing under `.claude/` and binding/connecting to localhost ports are blocked by the default Bash sandbox. Retry those specific commands with `dangerouslyDisableSandbox: true`. The repo-root file writes (config files) go through the `.` allow-list and are fine in-sandbox.
- **Sandbox for yarn commands**: Both `yarn install` and `yarn start` **must** use `dangerouslyDisableSandbox: true`. The transitive dependency `iconv-lite@0.6.3` (via `whatwg-encoding`) ships `.idea/` IDE files inside its published npm package ZIP; Claude Code's sandbox blocks writes to `.idea` paths, causing `EPERM: operation not permitted` during Yarn's link step. This is a known false positive — not a real security concern.
- **Idempotency**: if `app-config.local.yaml` or `.env.yarn` already exist, do **not** clobber them — show the user what's there and ask before overwriting. The user may already have a working setup.

## Workflow

Track these as tasks (TaskCreate) since the flow is long: prereqs → DB choice → config files → auth policy → GitHub PAT → install → start → verify.

### 1. Verify prerequisites and versions

Run the checks in one batched Bash call. Don't fail fast on the first miss — collect everything, then report a single punch list.

```sh
node --version          # accept v22.x or v24.x; anything else is a blocker
yarn --version          # must be 4.4.1
which yarn corepack
# native build toolchain (macOS):
xcode-select -p         # Command Line Tools path; non-zero exit = not installed
python3 --version       # node-gyp needs Python 3
make --version | head -1
cc --version | head -1
```

Interpretation:
- **Node** wrong major → stop and tell the user to install Node 24.x (`nodejs.org`); offer `nvm install 24` if `nvm` is on PATH (it is, per the environment). Don't auto-switch their Node without saying so.
- **Yarn missing or wrong version** → the repo pins `yarn@4.4.1` via `packageManager`, so `corepack enable` is the fix: run `corepack enable` then re-check `yarn --version` from the repo root (Corepack reads `packageManager` and shims the right version). Don't `npm i -g yarn`.
- **Toolchain missing** (`xcode-select -p` errors) → tell the user to run `xcode-select --install` and re-run the skill; `yarn install` will otherwise fail compiling `isolated-vm`/`better-sqlite3`. On Linux the equivalent is `build-essential` + `python3` + `g++`.

Report the results compactly (✓ / ✗ per item) before moving on. Only the Node/Yarn/toolchain items are hard blockers; Docker is checked later and only if needed.

### 2. Choose the database (AskUserQuestion)

Single-select, **recommend in-memory**:

- **In-memory (sqlite)** — *(Recommended)* no Docker, fastest boot, data wiped on every restart. Good for trying the Hub or template/theme work.
- **Docker Postgres** — persistent, matches production. Needs Docker.

#### If in-memory

No Docker checks needed. In step 3 you'll override the `backend.database` block to:

```yaml
  database:
    client: better-sqlite3
    connection: ':memory:'
  cache:
    store: memory
```

(The `.env.yarn` `POSTGRES_*` values are then unused but harmless — still create the file per the README.)

#### If Docker Postgres

First confirm Docker is usable, then check whether a Postgres is **already** listening before starting another:

```sh
docker --version && docker compose version
docker info >/dev/null 2>&1 && echo "daemon up" || echo "daemon DOWN"
lsof -nP -iTCP:5432 -sTCP:LISTEN || echo "nothing on 5432"
docker ps --filter "publish=5432" --format '{{.Names}}  {{.Image}}'
```

- **Daemon down** → ask the user to start Docker Desktop, then continue.
- **Something already on `:5432`** → don't start a second instance. Tell the user what's there and reuse it; make sure `.env.yarn` host/port/user/password match it (the `docker-compose.yml` defaults are `localhost:5432`, user `postgres`, password `example`).
- **Nothing on `:5432`** → start the bundled DB:
  ```sh
  cd docker && docker compose up -d
  ```
  This also starts Adminer on `:8080`. (Use `docker compose up -d db` to skip Adminer.) Then poll until ready:
  ```sh
  until docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; do sleep 2; done
  ```
  Note: localhost/Docker socket calls need `dangerouslyDisableSandbox: true`.

### 3. Create the config files

Guard against overwriting (see Idempotency). When safe to proceed:

1. **`.env.yarn`** — copy `.env.yarn-local` verbatim. It defines `POSTGRES_HOST/PORT/USER/PASSWORD` matching the docker-compose defaults.
2. **`app-config.local.yaml`** — copy `app-config.template-local.yaml`, then:
   - **In-memory path**: replace the `backend.database` block (`client: pg` + `connection: {host,port,user,password}`) with the `better-sqlite3` / `:memory:` + `cache.store: memory` block shown in step 2. Use the Edit tool on the copied file.
   - **Postgres path**: leave the template's `pg` block as-is (it reads the `POSTGRES_*` env vars from `.env.yarn`).

Use `cp` for the copy, then the Edit tool for any edits — don't hand-write the whole YAML from scratch, the templates carry support links, catalog rules, `essentialLocations`, and auth defaults you want to preserve.

### 3b. Disable default auth policy? (AskUserQuestion)

Ask the user whether they want to disable Backstage's default auth policy. **Frame this clearly as a local-dev-only option.**

> "Do you want to disable the default backend auth policy? This lets you call the backend API directly (curl, Postman, browser) without a Bearer token — useful for local testing. **This is only safe for local development and must never be used in production.**"

- **Yes** → add `dangerouslyDisableDefaultAuthPolicy: true` under `backend.auth` in `app-config.local.yaml`:

  ```yaml
  backend:
    auth:
      dangerouslyDisableDefaultAuthPolicy: true
      externalAccess:
  ```

- **No** → leave the config as-is. Direct API calls will return 401 without a token, but the app and frontend work normally.

### 4. GitHub PAT (optional)

Ask whether the user wants to wire a GitHub Personal Access Token now. Templates and the import-flow feature need one to actually create/read repos; guest browsing works without it.

- **No token** → leave `integrations.github` commented in `app-config.local.yaml` and skip. The app still boots with guest auth.
- **Has a token** → have the user provide it. Then:
  - Append `GITHUB_TOKEN=<value>` to `.env.yarn`.
  - Uncomment the `integrations.github` block in `app-config.local.yaml` (host `github.com`, `token: ${GITHUB_TOKEN}`).
  - **Never** echo the token back in chat, and never commit it. `.env.yarn` and `app-config.local.yaml` are gitignored — verify with `git check-ignore .env.yarn app-config.local.yaml` if unsure.

### 5. Install dependencies

From the repo root, **always with `dangerouslyDisableSandbox: true`** (see Key Facts — iconv-lite ships `.idea` files):

```sh
yarn install
```

This is slow (native module compilation). Run it with `run_in_background: true` and wait for the completion notification rather than polling. If it fails on `isolated-vm`/`better-sqlite3`/`node-gyp`, the cause is almost always a missing toolchain from step 1 — surface the actual compiler error and point back there; don't retry blindly.

If it fails with `EPERM: operation not permitted` on a `.idea/` path, it's the sandbox — make sure `dangerouslyDisableSandbox: true` is set and retry after deleting `node_modules`.

### 6. Start the app

**Always with `dangerouslyDisableSandbox: true`** (same reason as install):

```sh
NODE_OPTIONS=--no-node-snapshot yarn start
```

(`yarn start` already sets `--no-node-snapshot`; it's required for the scaffolder's `isolated-vm`.) This is long-running — start it with `run_in_background: true`. Don't wait on it to "finish"; it stays up.

### 7. Verify (port check only)

Poll until both ports answer, then report. Localhost calls need `dangerouslyDisableSandbox: true`.

**Important**: the catalog API returns 401 by default unless `dangerouslyDisableDefaultAuthPolicy: true` was set in step 3b. Use a plain HTTP response check (any response = port is up) rather than `-f` which fails on 4xx:

```sh
until curl -s -o /dev/null -w "%{http_code}" http://localhost:7007 | grep -qE '^[0-9]' \
   && curl -s -o /dev/null http://localhost:3000; do sleep 3; done
echo "backend :7007 and frontend :3000 are up"
```

Give the backend a minute or two on first boot (it runs DB migrations / catalog ingestion). If the ports never come up, read the backend output from the background `yarn start` task for the failure (common ones: DB connection refused → Docker DB not running; config schema error → check the edited `app-config.local.yaml`).

When both respond, tell the user the app is ready at **http://localhost:3000/tibco/hub** and note the chosen DB mode (and, for Docker, that Adminer is on `:8080`). Leave `yarn start` running.

## Don't

- Don't `npm i -g yarn` or change the pinned Yarn version — use Corepack so `yarn@4.4.1` is honored.
- Don't overwrite an existing `app-config.local.yaml` / `.env.yarn` without asking — it may be the user's working config with real secrets.
- Don't auto-switch the user's Node version silently; tell them what you're doing.
- Don't start a second Postgres if one is already on `:5432` — reuse it.
- Don't print or commit the GitHub token.
- Don't block on `yarn install` / `yarn start` synchronously — run them in the background and react to completion / port readiness.
- Don't try to start `yarn start` yourself if the user already has it running (a process already on `:3000`/`:7007`) — just verify and report.
