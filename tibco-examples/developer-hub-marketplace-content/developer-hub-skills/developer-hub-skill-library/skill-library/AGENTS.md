# AGENTS.md

Project documentation for AI coding agents (Codex, Copilot, Cursor, Devin, etc.).
Claude Code users: see `CLAUDE.md`, which imports this file and adds Claude-specific extras.

## What this is

TIBCO® Developer Hub — a Backstage.io-based portal. This is a Yarn 4 (Berry) monorepo with workspaces under `packages/*` (the `app` frontend and `backend`) and `plugins/*` (in-repo Backstage plugins, all published under the `@internal/*` scope and consumed via `workspace:^`). Build tooling is the Backstage CLI (`backstage-cli`), not Webpack/Vite/Next directly. Node 22 or 24 is required; the package manager is pinned to `yarn@4.4.1`.

## Common commands

Run from the repo root unless noted. `yarn start` runs both packages concurrently via the Backstage CLI.

- `yarn install` — install workspace dependencies
- `yarn start` — start backend (`:7007`) and frontend (`:3000`) together; opens `http://localhost:3000/tibco/hub`
- `yarn build:backend` / `yarn build:all` — build a single workspace / the whole repo
- `yarn build-image` — produce a backend docker image via `backstage-cli`
- `yarn tsc` / `yarn tsc:full` — incremental / full type-check across the repo
- `yarn lint` (since `origin/main`) / `yarn lint:all` — lint changed / all packages
- `yarn fix` — `backstage-cli repo fix` (auto-fix Backstage-specific repo issues)
- `yarn prettier:check` / `yarn prettier:write`
- `yarn test` — Jest across all workspaces; `yarn test:all` is the CI variant (coverage, sonar, `--runInBand`, 30s timeout)
- `yarn test:e2e` — Playwright; auto-starts `yarn start` locally and discovers projects from each package's `e2e-tests/` folder (see `playwright.config.ts`)

Per-package tasks (run from inside `packages/<name>` or `plugins/<name>`): `yarn start | build | test | lint | clean`. The Backstage CLI wraps Jest, so to run a single test use the underlying flag, e.g. `yarn workspace backend test --testNamePattern 'addEssentialLocation'` or `yarn workspace @internal/plugin-marketplace test path/to/file.test.ts`.

Scaffold a new plugin via `yarn new` from the repo root.

## Configuration layering

Backstage loads app-config files in order; later files override earlier ones.

- `app-config.yaml` — base, committed
- `app-config.production.yaml` — used in the docker image (`CMD` passes `--config app-config.production.yaml`)
- `app-config.local.yaml` — gitignored; copy from `app-config.template-local.yaml` for local dev. **Required** for `yarn start` to pick up local secrets / DB connection
- `.env.yarn` — gitignored env file consumed by `yarn start`; copy from `.env.yarn-local`. Common vars: `POSTGRES_*`, `GITHUB_TOKEN`, `DOC_URL`, `AUTH_*_CLIENT_ID/SECRET`

TIBCO-specific extensions to the config schema (build version banner, secondary control planes, essential locations auto-registered on startup, walkthrough cards, template/import-flow/marketplace group filters, `cpLink`) are documented in `docs/app-config-extensions.md` and typed in `packages/app/config.d.ts`. The app's `configSchema` field tells the Backstage CLI to load this file.

## Database

Postgres is required. A `docker compose` setup in `docker/` is the default for local dev (`docker compose up -d` from `docker/`); it also exposes Adminer on `:8080`. Override `backend.database.connection` in `app-config.local.yaml` to point at a different instance.

## Architecture

**Backend (`packages/backend/src/index.ts`)** — uses Backstage's `createBackend()` "new backend system." Plugins are registered via `backend.add(import('...'))`. The in-repo backend modules wired in are:

- `@internal/backstage-plugin-scaffolder-backend-module-import-flow` — scaffolder actions for the Import Flow feature
- `@internal/plugin-scaffolder-backend-module-tibco-git-repositories` — git-repo scaffolder actions
- `@internal/plugin-scaffolder-backend-module-metrics-api` — metrics-API scaffolder action

Local backend services (sibling files in `packages/backend/src/`): `rootLoggerService`, `rootHttpRouterService`, `cachePlugin` / `cacheService`, `addEssentialLocation` (auto-registers catalog locations on startup and on a scheduler — see `essentialLocations` config), `authModuleOidcProvider` + `idmJwtMiddleware` + `authenticator` (TIBCO Control Plane OIDC SSO). HTTP traffic is routed through `undici`'s `EnvHttpProxyAgent` for corporate proxy support.

**Frontend (`packages/app/src/App.tsx`)** — Backstage `createApp` with a TIBCO-branded theme (`themes/tibcoThemeLight`). The sign-in component switches dynamically based on `auth.enableAuthProviders` (`tibco-control-plane`, `github`, `guest`, `oauth2Proxy`). Custom pages wrap Backstage's `ScaffolderPage` to filter templates by tag:

- `/import-flow` — templates tagged `import-flow` (excluding `devhub-internal`), uses `TemplateListPage` from `@internal/backstage-plugin-import-flow`
- `/marketplace` — templates tagged `devhub-marketplace`, uses `MarketplacePage` from `@internal/plugin-marketplace`
- `/create` — wrapped `CustomScaffolderPage` in `components/scaffolder/`
- `/integration-topology` — `@internal/plugin-integration-topology`

Tag-based grouping for these three pages is configured via `templateGroups`, `importFlowGroups`, and `marketplaceGroups` in `app-config.yaml`.

**In-repo plugins (`plugins/`):**
- Frontend plugins: `import-flow`, `marketplace`, `integration-topology`, `tibco-platform-plugin`
- Backend modules: `scaffolder-backend-module-import-flow`, `scaffolder-backend-module-metrics-api`, `scaffolder-backend-module-tibco-git-repositories`, `scaffolder-backend-module-trigger-jenkins-job` (not currently wired into the backend's `index.ts` — example/optional)

Each plugin has its own `package.json` with `backstage.role` set to `frontend-plugin` / `backend-plugin-module`; cross-package imports use `workspace:^` and reference `@internal/*` names.

**Catalog seeds (`tibco-examples/`)** — YAML entity files for the example BWCE/Flogo/marketplace/import-flow content. `tibco-essentials.yaml` is the location auto-registered by `addEssentialLocation` when `essentialLocations` is configured.

## TypeScript / ESM notes

The root `tsconfig.json` extends `@backstage/cli/config/tsconfig.json` and globs `packages/*/src`, `plugins/*/src`, plus their `dev/`, `config.d.ts`, and `migrations/` folders. Imports in backend code use the `.ts` extension (e.g. `import('./rootLoggerService.ts')`) — preserve that style when adding new local imports in `packages/backend/src/`.

## Docker build

The repo `Dockerfile` is a 4-stage Alpine build: dependency skeleton → install + `yarn test:all` + `yarn tsc` + backend build → production node_modules → final runtime image (also installs `mkdocs-techdocs-core` for TechDocs). The runtime entrypoint is `node packages/backend --config app-config.production.yaml` under `tini`. `NODE_OPTIONS=--no-node-snapshot` is set both in the image and in the root `yarn start` script — required for the Scaffolder's `isolated-vm` usage.

## Workflows

Reusable workflows for common tasks in this repo. Full step-by-step runbooks live in `.claude/skills/<name>/SKILL.md` (Claude Code agents execute these automatically; other agents can read them as reference).

### setup-dev-hub

Bootstrap a fresh local dev environment from a clean checkout.

1. Verify prerequisites: Node 22 or 24, Yarn 4.4.1 (`corepack enable` if missing), C++ toolchain + Python 3 (needed to compile `isolated-vm` and `better-sqlite3` from source)
2. Choose database: **in-memory SQLite** (no Docker, data wiped on restart — recommended for local dev) or **Docker Postgres** (persistent, matches production — run `docker compose up -d` from `docker/`)
3. Create config files from templates:
   - `cp app-config.template-local.yaml app-config.local.yaml`
   - `cp .env.yarn-local .env.yarn`
   - For in-memory DB, set `backend.database.client: better-sqlite3` and `connection: ':memory:'` in `app-config.local.yaml`
4. Optionally set `GITHUB_TOKEN` in `.env.yarn`
5. Run `yarn install` (compiles native modules — takes a few minutes on first run)
6. Run `yarn start` — backend starts on `:7007`, frontend on `:3000`; app opens at `http://localhost:3000/tibco/hub`

### create-template

Author a new Backstage scaffolder template under `templates/<slug>/`.

1. Gather: slug (kebab-case), title, description, type, owner, tags, parameters, publish target (`publish:github` / none)
2. Read an existing reference template first — check `tibco-examples/bwce-bookstore-template/` for tag and structure conventions
3. Create `templates/<slug>/<slug>.yaml` (the `kind: Template` entity) and `templates/<slug>/skeleton/` (files `fetch:template` copies to the new repo)
4. Always include a `debug` boolean parameter (default `false`) and guard publish/register steps with `if: ${{ not parameters.debug }}` to enable safe dry-run testing
5. Register the template by adding its path to `catalog.locations` in `app-config.local.yaml`; restart the backend for it to appear at `/create`

Tags control where the template appears: `import-flow` → `/import-flow`; `devhub-marketplace` → `/marketplace`; anything else → `/create`.

### create-import-flow

Author a new import flow template — ingests an existing source repository into the catalog rather than creating a new one from scratch.

Import flows follow a **clone → extract → generate → register** pattern using TIBCO custom scaffolder actions (`tibco:git:clone`, `tibco:extract-parameters`, `tibco:create-yaml`, `tibco:git:push`), unlike regular templates which use `fetch:template` + `publish:github`.

1. Choose complexity tier: **simple** (single Component entity, inline YAML — see `tibco-examples/import-flow-v2/`) or **advanced** (multiple entity types, Nunjucks skeletons — see `tibco-examples/advanced-import-flows/`)
2. Gather: slug, title, description, technology (BWCE / BW6 / BW5 / Flogo / EMS / Other), repo URL parameter name, entity types to register
3. Create `templates/<slug>/<slug>.yaml` with tag `import-flow`; optionally create `entity-skeletons-<tech>/` for Nunjucks templates
4. Register in `app-config.local.yaml`; restart backend for it to appear at `/import-flow`

### create-theme

Add a new Backstage theme (or replace the default TIBCO one) with an optional custom logo.

1. Gather: theme name (slug), light/dark/both, primary brand color, font family, logo source (URL / local path / none), sidebar subtitle text
2. Read `packages/app/src/themes/acmeThemeLight.ts` (or `acmeThemeDark.ts`) as the structural template — both use `createUnifiedTheme` + `createBaseThemeOptions` from `@backstage/theme`
3. Create `packages/app/src/themes/<slug>ThemeLight.ts` (and/or dark variant), defining all colors as named `const` tokens at the top
4. Register the theme in `packages/app/src/App.tsx` (add to the `themes` array in `createApp`)
5. Wire logo swap in `packages/app/src/components/Root/Root.tsx` if a custom logo is provided
6. Run `yarn tsc` to verify no type errors

### test-template

Dry-run a scaffolder template against the running backend to inspect rendered output without publishing to GitHub.

1. Ensure the backend is running on `:7007` (`yarn start`)
2. Read `templates/<slug>/<slug>.yaml` to discover required parameters; propose sensible dry-run defaults (use `debug: true` to skip publish/register steps)
3. Build the `directoryContents` payload — base64-encode every file in the template directory (the `<slug>.yaml` plus everything under `skeleton/`)
4. POST to `http://127.0.0.1:7007/api/scaffolder/v2/dry-run` with gzip encoding (skeleton can be ~1.5 MB)
5. Unpack the response and write rendered files to `template-workspace/dry-run-<N>/` for inspection

### test-import-flow

Two-phase end-to-end test for an import flow template.

**Phase 1 — dry-run (structure validation)**: same mechanics as `test-template` — validates YAML syntax and Nunjucks skeleton rendering. TIBCO custom actions (`tibco:git:clone`, etc.) will error during dry-run; this is expected and does not indicate a broken template.

**Phase 2 — live run + catalog verification**:
1. Provide a real GitHub repo URL as the import source
2. POST to `http://127.0.0.1:7007/api/scaffolder/v2/tasks` with real parameter values
3. Poll `GET /api/scaffolder/v2/tasks/{id}` until status is `completed` or `failed`
4. Query `GET /api/catalog/entities?filter=kind=Component,metadata.name=<name>` to confirm the imported entities were registered in the catalog

### impact-analysis

Produce a change-impact ("blast radius") analysis for a catalog entity — answer *"what breaks if I change `<entity>`?"* from the **live** catalog graph, not guesswork.

This Developer Hub is Backstage **1.41.1**, which has **no MCP server** — read the catalog through the **catalog REST API** at `http://localhost:7007/api/catalog` (spec: `marketplace-content/tibco-platform-apis/version-118/backstage-api-1.41.1.yaml`). Endpoints allow anonymous access in local guest mode (no token needed; pass `Authorization: Bearer <Backstage identity token>` only if auth is enforced).

1. Resolve the subject entity: `GET /entities/by-name/{kind}/default/{name}` — record kind, `spec.type`, `spec.lifecycle`, `spec.owner`, `spec.system`, and the full `relations` array
2. Traverse the graph breadth-first: collect neighbour refs from `relations`, dedupe, and batch-fetch with `POST /entities/by-refs` (`{"entityRefs":[…]}`); stop at ~2–3 hops or the system boundary
3. Classify each neighbour into impact tiers (🔴 direct/breaks · 🟠 conditional/review · 🟢 not impacted) based on relation direction and contract semantics; flag cross-team ripples via `ownedBy`
4. Write a report plus three color-coded integration-topology Mermaid diagrams under `impact_analysis/`, with a per-entity action list and a notify-by-team list
