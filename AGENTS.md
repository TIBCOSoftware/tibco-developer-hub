# AGENTS.md

Project documentation for AI coding agents (Codex, Copilot, Cursor, Devin, etc.).
Claude Code users: see `CLAUDE.md`, which imports this file and adds Claude-specific extras.

## Which Developer Hub this targets

**Developer Hub 1.19 — Backstage 1.51.0, MCP server enabled.** Catalog and scaffolder access goes
through `@backstage/plugin-mcp-actions-backend` at `http://localhost:7007/api/mcp-actions/v1`
(`tibco.mcpActions.enabled: true`; it ships `false`). `MCP-TOOLS.md` is the shared reference — the
endpoint, the eleven tools, the predicate query syntax and the gotchas. Every workflow below keeps a
REST fallback so the set still works with MCP off. For Developer Hub 1.18 (Backstage 1.41.1), use the
`developer-hub-118` set.

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

- `@internal/backstage-plugin-scaffolder-backend-module-import-flow` — scaffolder actions for the Import Flow feature (`tibco:git:clone`, `tibco:extract-parameters`, `tibco:create-yaml`)
- `@internal/plugin-scaffolder-backend-module-tibco-git-repositories` — git-repo scaffolder actions (`tibco:git:push`)
- `@internal/plugin-scaffolder-backend-module-tibco-platform-actions` — additional TIBCO Platform actions
- `@internal/plugin-scaffolder-backend-module-metrics-api` — metrics-API scaffolder action
- `@internal/plugin-scaffolder-backend-module-platform-api` — the core TIBCO Platform actions (`tibco:call-platform-api`, `tibco:fetch-api-file`, `tibco:file:write`, …) that self service flows are built on

(1.18 wired in only the last two of these; if you are cross-checking against a 1.18 checkout, expect a shorter list.) `http://localhost:3000/create/actions` is the authoritative list for a running instance.

Local backend services (sibling files in `packages/backend/src/`): `rootLoggerService`, `rootHttpRouterService`, `cachePlugin` / `cacheService`, `addEssentialLocation` (auto-registers catalog locations on startup and on a scheduler — see `essentialLocations` config), `authModuleOidcProvider` + `idmJwtMiddleware` + `authenticator` (TIBCO Control Plane OIDC SSO). HTTP traffic is routed through `undici`'s `EnvHttpProxyAgent` for corporate proxy support.

**Frontend (`packages/app/src/App.tsx`)** — Backstage `createApp` with a TIBCO-branded theme (`themes/tibcoThemeLight`). The sign-in component switches dynamically based on `auth.enableAuthProviders` (`tibco-control-plane`, `github`, `guest`, `oauth2Proxy`). Custom pages wrap Backstage's `ScaffolderPage` to filter templates by tag:

- `/import-flow` — templates tagged `import-flow` (excluding `devhub-internal`), uses `CustomTemplatePage` from `@internal/backstage-plugin-custom-template-flow` (directory `plugins/custom-template-flow/`)
- `/marketplace` — templates tagged `devhub-marketplace`, uses `MarketplacePage` from `@internal/plugin-marketplace`
- `/create` — wrapped scaffolder page in `packages/app/src/components/scaffolder/CustomScaffolderComponent.tsx`
- `/self-service-flow` — templates tagged `self-service` (excluding `devhub-marketplace`), via `CustomSelfServicePage` in `App.tsx`; also surfaced by the home page Self Service Flows card, and excluded from `/create`
- `/integration-topology` — `@internal/plugin-integration-topology`

Tag-based grouping for these three pages is configured via `templateGroups`, `importFlowGroups`, and `marketplaceGroups` in `app-config.yaml`.

**In-repo plugins (`plugins/`)** — directory → package name:

*Frontend (`backstage.role: frontend-plugin`)*

| Directory | Package | Notes |
|---|---|---|
| `custom-template-flow` | `@internal/backstage-plugin-custom-template-flow` | provides `CustomTemplatePage`, used by `/import-flow` |
| `integration-topology` | `@internal/plugin-integration-topology` | |
| `marketplace` | `@internal/plugin-marketplace` | |
| `tibco-platform-custom-form-fields` | `@internal/plugin-tibco-platform-custom-form-fields` | provides `CapabilitySelector` and `DataplaneSelector`, the platform-aware scaffolder form fields self service flows use |
| `tibco-platform-plugin` | `@internal/plugin-tibco-platform-plugin` | |

*Backend (`backstage.role: backend-plugin-module`)* — all five are wired into `index.ts`:

| Directory | Package |
|---|---|
| `scaffolder-backend-module-import-flow` | `@internal/backstage-plugin-scaffolder-backend-module-import-flow` |
| `scaffolder-backend-module-metrics-api` | `@internal/plugin-scaffolder-backend-module-metrics-api` |
| `scaffolder-backend-module-platform-api` | `@internal/plugin-scaffolder-backend-module-platform-api` |
| `scaffolder-backend-module-tibco-git-repositories` | `@internal/plugin-scaffolder-backend-module-tibco-git-repositories` |
| `scaffolder-backend-module-tibco-platform-actions` | `@internal/plugin-scaffolder-backend-module-tibco-platform-actions` |

`scaffolder-backend-module-trigger-jenkins-job` also lives under `plugins/`, but its `backstage.role` is `backend-plugin` (not a module) and it is not wired in — example/optional.

Cross-package imports use `workspace:^` and reference `@internal/*` names.

**Catalog seeds (`tibco-examples/`)** — YAML entity files for the example BWCE/Flogo/marketplace/import-flow content. `tibco-essentials.yaml` is the location auto-registered by `addEssentialLocation` when `essentialLocations` is configured.

## TypeScript / ESM notes

The root `tsconfig.json` extends `@backstage/cli/config/tsconfig.json` and globs `packages/*/src`, `plugins/*/src`, plus their `dev/`, `config.d.ts`, and `migrations/` folders. Most local imports in backend code use the `.ts` extension (e.g. `import('./rootLoggerService.ts')`) — follow that style when adding new local imports in `packages/backend/src/`. It is not universal (`import('./addEssentialLocation')` has no extension), so don't treat a missing extension as a bug to fix.

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

### create-self-service-flow

Author a new self service flow — a Template that executes a series of actions on the **TIBCO Platform** via its APIs, rather than scaffolding a repo (`create-template`) or ingesting one (`create-import-flow`). Typical uses: build & deploy an app to a Data Plane, provision a capability or connector, expose an endpoint, import platform apps into the Hub.

A flow is recognised as self service by the **`self-service` tag** — that is the only thing the routing reads. It then appears at `/self-service-flow` and on the home page Self Service Flows card, and is excluded from `/create`. Set `spec.type: self-service` too by convention (it renders as the type chip), but it does not affect routing.

It uses TIBCO custom actions — `tibco:call-platform-api` (the core action), `tibco:file:write`, `tibco:fetch-api-file`, `tibco:extract-parameters` — plus the platform-aware form fields `CapabilitySelector` and `DataplaneSelector`, which query live Control Plane data while the user fills in the form.

1. Read a reference flow first: `tibco-examples/developer-hub-marketplace-content/self-service-flows/build-deploy-flogo-app/` (build → deploy → expose → link → register) or the BW5CE variant alongside it. If the folder is not in your checkout, install the **Build & Deploy Flogo App** Marketplace entry — it ships the same flow
2. Gather: slug (conventionally `self-service-<name>`), title, description, goal, technology, required capabilities, whether the flow publishes and registers a catalog entry, owner (default `group:default/tibco-self-service`)
3. Create `templates/<slug>/<slug>.yaml` with the `self-service` tag (and `spec.type: self-service` by convention); add a `skeleton-<tech>-app/` only if publishing to GitHub
4. Follow the **check → provision-if-missing → act** step pattern, guarding every provisioning step with `if:` so re-runs are idempotent
5. Control Plane calls omit `baseUrl`; Data Plane calls must pass `baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}`
6. Ensure `cpLink` and `TIBCOPlatformToken` are set in `app-config.local.yaml`; register in `catalog.locations` and restart the backend

### create-theme

Add a new Backstage theme (or replace the default TIBCO one) with an optional custom logo.

1. Gather: theme name (slug), light/dark/both, primary brand color, font family, logo source (URL / local path / none), sidebar subtitle text
2. Read `packages/app/src/themes/tibcoThemeLight.ts` — the repo's only theme and the structural template (`createUnifiedTheme` + `createBaseThemeOptions` from `@backstage/theme`). No dark theme ships; derive one from the light file if the user wants it
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

### test-self-service-flow

Two-phase test for a self service flow. Heavier than the other test skills: Phase 2 consumes real Data Plane resources, so it is a deployment, not a rehearsal.

**Phase 1 — dry-run (structure validation)**: same mechanics as `test-template`. Validates YAML, the parameter schema, and skeleton rendering. All TIBCO platform actions (`tibco:call-platform-api`, `tibco:file:write`, `tibco:extract-parameters`, `tibco:fetch-api-file`) fail here — they are not dry-run-aware, and this is expected.

**Phase 2 — live run + verification**:
1. Summarise the blast radius first (every API call, CP vs DP, resources created), then get explicit user confirmation
2. Assemble the `deploymentTarget` object by hand from `GET /tp-cp-ws/v1/data-planes` — the `CapabilitySelector` is a frontend field and never runs over the API
3. `POST /api/scaffolder/v2/tasks`, then poll `GET /api/scaffolder/v2/tasks/{id}` with a long timeout (600s+); read `/events` for the `buildId` and `appId` logged by the flow
4. Verify against the **platform** APIs that the build exists, the app is running, and the endpoint is public — a `completed` task only means every call returned 2xx
5. Verify against the **catalog** API that the entity was registered, retrying for refresh lag
6. Report what the run left behind (app, repo, catalog entity) and offer cleanup — never delete without asking

### reuse-or-build

Answer *"do I need to build a new service, or can I re-use an existing one, to get `<information>`?"* from the **live** catalog — real contracts and definitions, not guesswork.

Like `impact-analysis`, this reads the **live catalog through the MCP server** — `catalog.query-catalog-entities` at `http://localhost:7007/api/mcp-actions/v1` (see `MCP-TOOLS.md`), with the **catalog REST API** at `http://localhost:7007/api/catalog` as the fallback when MCP is off. Both allow anonymous access in local guest mode.

1. Pin down the information need: the concrete **fields** required, the **shape** (event-driven vs request/response), and the **consumer** team/component (ask via `AskUserQuestion` if ambiguous)
2. Search for candidates: keyword search (`GET /entities/by-query?fullTextFilter[term]=…`), a full scan of `kind=api` (`GET /entities?filter=kind=api`), plus `kind=component` and `kind=resource`
3. Field-level match: batch-fetch candidates with `spec.definition` (`POST /entities/by-refs` with a `fields` projection), parse each XSD / JSON Schema / OpenAPI, and build a candidate × field coverage matrix — a match requires the fields to be present in the definition, not just the name
4. Classify into the cheapest tier that satisfies the need — ✅ **Reuse as-is** · 🟡 **Extend existing** (name the entity and recommend `/impact-analysis` on it) · 🔴 **Build new** — accounting for transport (topic vs queue), contract openness, and cross-team consumers
5. Write a decision report under `reports/` (verdict box, coverage matrix, two color-coded topology diagrams, cost/risk comparison, next steps, and a provenance snapshot)

### impact-analysis

Produce a change-impact ("blast radius") analysis for a catalog entity — answer *"what breaks if I change `<entity>`?"* from the **live** catalog graph, not guesswork.

Read the catalog through the **MCP server** — `catalog.get-catalog-entity` and `catalog.query-catalog-entities` at `http://localhost:7007/api/mcp-actions/v1` (see `MCP-TOOLS.md`), falling back to the **catalog REST API** at `http://localhost:7007/api/catalog` when MCP is off. Anonymous access in local guest mode (no token needed; pass `Authorization: Bearer <Backstage identity token>` only if auth is enforced).

1. Resolve the subject entity: `GET /entities/by-name/{kind}/default/{name}` — record kind, `spec.type`, `spec.lifecycle`, `spec.owner`, `spec.system`, and the full `relations` array
2. Traverse the graph breadth-first: collect neighbour refs from `relations`, dedupe, and batch-fetch with `POST /entities/by-refs` (`{"entityRefs":[…]}`); stop at ~2–3 hops or the system boundary
3. Classify each neighbour into impact tiers (🔴 direct/breaks · 🟠 conditional/review · 🟢 not impacted) based on relation direction and contract semantics; flag cross-team ripples via `ownedBy`
4. Write a report plus three color-coded integration-topology Mermaid diagrams under `impact_analysis/`, with a per-entity action list and a notify-by-team list

### data-lineage

Answer *"where does this data come from, and where does it end up?"* for a message contract or a single field — provenance, audit, and governance, from the **live** catalog rather than tribal knowledge. Same catalog as `reuse-or-build` (where can I *get* it?) and `impact-analysis` (what *breaks*?), different question.

Same access rules: the **MCP server** at `http://localhost:7007/api/mcp-actions/v1`, falling back to the **catalog REST API** at `http://localhost:7007/api/catalog`, anonymous in local guest mode. The skill ships a helper, `.claude/skills/data-lineage/lineage.py`, which does the directed traversal and the dual-format (JSON Schema + XSD) field extraction over a one-off entity dump.

1. Pin down the **subject** (a contract `api:default/<name>`, or one field), the **direction** (upstream provenance / downstream reach / both) and the **boundary** (usually `spec.system`)
2. Build the **directed** flow graph — the direction is already in the relations: `providesApi` = the component writes, `consumesApi` = it reads, so every hop is `API --consumed by--> Component --provides--> API`. Split `dependsOn` into transport (`topic`/`queue`/`message-broker` — an edge label, never a node) and systems of record (where lineage genuinely starts and ends)
3. Walk the hops and classify each field crossing: 🟢 **carried** · 🔵 **renamed** (a convention flip, i.e. a mapping risk) · 🟡 **derived** (inferred, unverifiable from the catalog) · 🔵 **originates** · ⚪ **dropped**. Read the definitions rather than trusting name matches — a field can survive by name and change meaning
4. Record the governance findings: team hand-offs, JSON↔XSD convention flips, transformation blind spots, which systems of record ultimately see the field, and where a topic widens exposure beyond the registered consumers
5. Write the report under `reports/` (summary box, confidence legend, rendered SVG flow + field-propagation diagrams, hop table, origins & sinks, findings, open questions per 🟡 hop, and a provenance snapshot)

The honest limit, stated in every report: the catalog proves *that* a component consumes A and provides B, never *how* a field in B was computed — that mapping lives inside the BW6/Flogo process.

### api-version-diff

Compare two versions of an API specification and publish the differences as **TechDocs that live next to the API entity** — the documentation half of API versioning. Different question again from the three catalog skills: those read the catalog graph, this one reads the contracts themselves.

The skill ships a helper, `.claude/skills/api-version-diff/apidiff.mjs` (Node, no dependencies of its own; YAML support comes from the `yaml`/`js-yaml` already in the checkout's `node_modules`, so run it from the repo root). It exits **1** on a breaking change and **0** otherwise, so the same command is both a documentation generator and a CI gate.

1. Resolve the two specs — two frozen files (`version-118/…-118.json` vs `version-119/…-119.json`), two catalog entities read via `spec.definition`, or two git refs of one file
2. Run `node .claude/skills/api-version-diff/apidiff.mjs <old> <new> --from 1.18 --to 1.19` — it diffs operations, parameters, request bodies, response codes, shared components, schemas, properties, enums and security schemes, classifying each finding 🔴 breaking / 🟢 additive / 🔵 note (single-branch `anyOf` null wrappers are unwrapped, so an OpenAPI 3.0 → 3.1 dialect bump does not report a whole schema as deleted)
3. Verify and enrich every finding against the specs — pair removals with additions so renames read as renames, state *who* a 🔴 actually breaks (constructing a payload vs merely consuming one), and run `/impact-analysis` on the API entity to name the affected components and teams
4. Write the changelog into the new version's folder, newest transition first, and wire it into that folder's `mkdocs.yaml` nav; a breaking transition gets its own migration page linked from `metadata.links`
5. Apply the succession metadata in the same change — previous version to `lifecycle: deprecated`, plus `superseded-by` and `sunset-date` annotations

The helper reports *what* changed, never *why*. The rationale, the migration steps and the consumer impact are the parts the skill (and the human reviewing it) still has to write — never ship the raw tool output as the changelog.
