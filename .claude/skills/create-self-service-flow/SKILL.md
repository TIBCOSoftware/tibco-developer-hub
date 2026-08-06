---
name: create-self-service-flow
description: >
  Author a new TIBCO Developer Hub self service flow — a Backstage Template that drives
  the TIBCO Platform through its APIs instead of scaffolding a repository. Trigger when
  the user wants to create a self service flow, add a flow to the Self Service page,
  build & deploy an app to a Data Plane from the Developer Hub, provision a capability
  or connector, expose an app endpoint, or automate a Control Plane / Data Plane
  sequence from a form. Distinct from create-template (scaffolds a new repo) and
  create-import-flow (ingests an existing repo): self service flows use
  tibco:call-platform-api, tibco:file:write, tibco:fetch-api-file, and the platform-aware
  form fields CapabilitySelector / DataplaneSelector. Writes the Template entity YAML
  (plus an optional catalog skeleton) under templates/<slug>/ and registers it in
  app-config.local.yaml so it appears at /self-service-flow after a backend restart.
---

# create-self-service-flow

Create a new TIBCO Developer Hub self service flow under `./templates/<slug>/` and wire it
into the local catalog so it appears at `http://localhost:3000/self-service-flow` after `yarn start`.

## What makes a self service flow different

| Aspect | Regular template | Import flow | Self service flow |
|--------|-----------------|-------------|-------------------|
| Purpose | Create a new project from scratch | Analyse an existing repo and register it | Execute a sequence of actions on the TIBCO Platform |
| Acts on | GitHub | GitHub + catalog | Control Plane / Data Plane APIs (+ optionally GitHub and catalog) |
| Input | User-provided metadata | Repo URL + app name | Platform target (data plane / capability) + app details |
| Custom actions | Standard Backstage only | `tibco:git:clone`, `tibco:extract-parameters`, `tibco:create-yaml`, `tibco:git:push` | `tibco:call-platform-api`, `tibco:file:write`, `tibco:fetch-api-file`, `tibco:extract-parameters` |
| Custom form fields | — | — | `CapabilitySelector`, `DataplaneSelector` |
| `spec.type` | `service` / `website` / … | `integration` / `import-flow` | `self-service` (convention) |
| Required tag | — | `import-flow` | **`self-service`** |
| UI location | `/create` | `/import-flow` | `/self-service-flow` + home page card |

A self service flow is technically the same entity as a template — a
`scaffolder.backstage.io/v1beta3` `Template`. **The `self-service` tag is what makes it one.**
All the routing in `packages/app/src/App.tsx` (`CustomSelfServicePage`), the home page card, and
the `/create` exclusion filter on tags only — `spec.type` is never inspected:

- `metadata.tags` contains `self-service` → **required**. Without it the flow does not appear on
  the Self Service page. A flow also tagged `devhub-marketplace` is excluded from that page.
- `spec.type: self-service` → **convention, not a router**. Set it anyway: every TIBCO reference
  flow has it, and Backstage renders it as the type chip on the template card.

Everything from `create-template` still applies: the form is `spec.parameters`, the work is
`spec.steps`, and the Template Editor previews it. This skill covers what is *different*.

## Canonical references — read these BEFORE generating output

Always read at least one complete reference flow first. Do not write a flow from memory:

- `tibco-examples/developer-hub-marketplace-content/self-service-flows/build-deploy-flogo-app/self-service-build-deploy-flogo-app.yaml`
  — the canonical end-to-end flow: check capability → provision if missing → install connector
  if missing → build → deploy → expose endpoint → link → publish → register
- `tibco-examples/developer-hub-marketplace-content/self-service-flows/build-deploy-bw5ce-app/self-service-build-deploy-bw5ce-app.yaml`
  — the same pattern for a BW5CE `.ear` upload
- `tibco-examples/developer-hub-marketplace-content/self-service-flows/tibco-self-service-group.yaml`
  — the owner group
- `tibco-examples/self-service-flows/self-service-create-platform-resource.yaml` — a smaller,
  single-purpose flow (provision one platform resource). Read this one if the build-and-deploy
  flows are more machinery than the flow you are writing needs. Its owner group is the identical
  entity under `tibco-examples/self-service-flows/self-service-group.yaml`.

If those paths do not exist in the checkout, get the **Build & Deploy Flogo App** entry from the
Marketplace first — it installs the same flow.

Action schemas as installed in *this* Developer Hub: `http://localhost:3000/create/actions`.
Never guess an action's input schema — read it there or in the reference flow.

## The custom actions

### `tibco:call-platform-api`

The heart of every self service flow. Calls any TIBCO Platform API with authentication handled
for you. Handles JSON bodies, multipart form uploads, and URL-encoded data; MIME types are
detected from the file extension (`.zip`, `.json`, `.flogo`, `.ear`). Defaults to `GET`.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `endpoint` | string | Yes | Path to the API endpoint (no leading host) |
| `method` | string | No | HTTP verb, default `GET` |
| `body` | object | No | JSON payload |
| `filePath` | string | No | Workspace file to upload |
| `contentType` | string | No | `formData` for multipart uploads |
| `formFieldName` | string | No | Form field name for the uploaded file |
| `headers` | object | No | Extra request headers |
| `baseUrl` | string | No | Base URL override — pass the data plane URL for DP calls |
| `requireAuth` | boolean | No | Set `false` for unauthenticated endpoints (e.g. health) |

| Output | Type | Description |
|--------|------|-------------|
| `status` | number | HTTP response code |
| `data` | object | Parsed JSON response body |
| `baseUrl` | string | Fully resolved URL used for the call |
| `appBaseUrl` | string | Developer Hub base URL (useful for building catalog links) |
| `cpBrowserUrl` | string | Control Plane browser URL (useful for output links) |

**Key rule — Control Plane vs Data Plane.** Omit `baseUrl` to call the *Control Plane*
(`/tp-cp-ws/...` endpoints, `public/v1/cp/...`). Pass
`baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}` to call the selected *Data Plane*
(`public/v1/dp/...`). Getting this wrong is the single most common failure.

Base URL and token are resolved by tiers, so the same flow works locally and in production:

| Priority | Base URL source | Token source |
|----------|-----------------|--------------|
| 1 | `baseUrl` action input | `cpToken` action input |
| 2 | `CP_DOMAIN` env var (internal `http://`) | `cpToken` template secret |
| 3 | `cpLink` app config (`https://`) | `TIBCOPlatformToken` app config |

### `tibco:file:write`

Writes a string to a file in the scaffolder workspace. Two uses: (1) persist an API response so
`tibco:extract-parameters` can query it with JSONPath, (2) turn a textarea form field into an
uploadable file.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `filePath` | string | Yes | Target workspace path |
| `content` | string | Yes | String payload |
| `overwrite` | boolean | No | Replace an existing file |

Output: `filePath` and `size`. When writing an API response, pipe it through `dump`:
`content: ${{ steps['get-cp-flogo-versions'].output.data | dump }}`.

### `tibco:extract-parameters`

Reused from import flows, almost always with `type: json` against a file written by
`tibco:file:write`. Every extracted value is an **array** — reference `[0]`, and test presence
with `.length == 0`.

### `tibco:fetch-api-file`

Pulls an API definition out of the Developer Hub catalog into the workspace. Works on `API`
entities and resolves `Component` entities via `providesApis`.

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `name` | Yes | — | Entity identifier |
| `path` | Yes | — | Workspace destination |
| `kind` | No | — | Entity kind override |
| `namespace` | No | `default` | Entity namespace |
| `preferredApiType` | No | — | Preferred type when the entity provides several |

Output: `filePath`, `sourceEntity`, `apiType`.

## The custom form fields

| Extension | `ui:field` | Use when |
|-----------|-----------|----------|
| `CapabilitySelectorExtension` | `CapabilitySelector` | The flow deploys to a data plane and needs specific capabilities to be healthy |
| `DataplaneSelectorExtension` | `DataplaneSelector` | The flow only needs a data plane, with no capability requirement |

Prefer `CapabilitySelector` for anything that builds or deploys. It queries all data planes,
health-checks the required capability instances, shows only data planes where **all** required
capabilities are healthy, and auto-selects the first eligible one.

```yaml
    - title: Deployment Details
      required:
        - deploymentTarget
      properties:
        deploymentTarget:
          title: Select Deployment Target
          type: object
          ui:field: CapabilitySelector
          ui:options:
            requiredCapabilities:
              - FLOGO
```

The selected value is an object, not a string:

| Property | Description |
|----------|-------------|
| `dataplaneId` | Identifier of the chosen data plane |
| `capabilityId` | Capability instance targeted for the deployment |
| `dataplaneUrl` | Resolved base URL for `tibco:call-platform-api` |
| `dataplaneHost` | Hostname — use for ingress config when exposing endpoints |
| `dataplaneName` | Display name — use in output text |

With multiple `requiredCapabilities`, the first entry of type *PLATFORM* determines the
deployment URL; *INFRA* capabilities are used only for filtering.

Test a field in isolation in the **Custom Field Explorer** (Develop → ellipsis → Custom Field
Explorer) before wiring it in.

## Workflow

### 1. Gather inputs (single batched AskUserQuestion)

- **Flow slug** — kebab-case, conventionally prefixed `self-service-`, e.g.
  `self-service-build-deploy-flogo-app`. Used as folder name, file name, and `metadata.name`.
- **Title** — shown on the Self Service page card, e.g. `Build & Deploy Flogo App`.
- **Description** — one sentence under the title.
- **Goal** (single-select):
  - *Build & deploy an app* — upload artifact, build, deploy, expose endpoint (the canonical flow)
  - *Provision a capability / connector* — check and install on a data plane
  - *Import platform apps into the Hub* — query platform, register catalog entities
  - *Custom platform sequence* — user describes the API calls
- **Technology** (single-select, if build/deploy): `Flogo` · `BWCE` · `BW5CE` · `Other`
- **Deployment target field**: `CapabilitySelector` (default) or `DataplaneSelector`
- **Required capabilities** (multi-select, `CapabilitySelector` only): `FLOGO` · `BWCE` ·
  `BW5CE` · `EMS` · `PULSAR` · other (free text)
- **Publish & register?** — whether the flow ends by publishing a `catalog-info.yaml` to GitHub
  and registering the deployed app in the catalog (default: yes for build & deploy flows)
- **Extra tags** (multi-select, `self-service` + `tibco` always pre-ticked): `flogo` · `bwce` ·
  `bw5ce` · `deployment` · `developer-hub` · `recommended`
- **Owner** — Backstage group ref, default `group:default/tibco-self-service`

### 2. Create folder structure

```
templates/<slug>/
  <slug>.yaml                 # the Template entity
  skeleton-<tech>-app/        # only if publishing/registering a catalog entry
    catalog-info.yaml
    mkdocs.yml                # optional TechDocs
    docs/index.md             # optional TechDocs
```

No skeleton at all if the flow does not publish to GitHub.

### 3. Generate `<slug>.yaml`

#### Metadata — the tag is what matters

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: <slug>
  title: <Title>
  description: '<Description>'
  tags:
    - self-service        # required — this tag is what routes it to the Self Service page
    - tibco
    - <tech tags>
spec:
  owner: group:default/tibco-self-service
  type: self-service      # convention — shown as the type chip, not used for routing
```

#### Parameters — the canonical three pages

1. **App details** — name, filename, and a textarea for the artifact/config content
2. **Deployment details** — the `CapabilitySelector` / `DataplaneSelector` object
3. **Repository location** — `RepoUrlPicker`, only if the flow publishes and registers

```yaml
  parameters:
    - title: Provide <Tech> App Details
      required:
        - app_name
      properties:
        app_name:
          title: The name of the <Tech> App
          type: string
          description: Give your app a unique name
          default: 'my-app'
        filename:
          title: Filename
          type: string
          default: 'app.json'
          pattern: '^[a-zA-Z0-9._-]+$'
          ui:help: 'Filename for the app configuration (no path separators allowed)'
        content:
          title: <Tech> App Configuration
          type: string
          ui:widget: textarea
          ui:options:
            rows: 20
```

#### Steps — the check → provision → act pattern

Every platform-facing flow follows the same shape. Guard optional work with `if:` so the flow is
idempotent — never provision something that is already there.

```yaml
  steps:
    # 1. Check the data plane state
    - id: test_connection
      name: Check DP Flogo Versions
      action: tibco:call-platform-api
      input:
        baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
        endpoint: 'public/v1/dp/flogoversions'

    # 2. Provision only if missing — fetch from CP, save, extract, POST to DP
    - id: get-cp-flogo-versions
      name: Get CP Flogo Versions
      if: ${{ steps.test_connection.output.data.totalBuildtypes == 0 }}
      action: tibco:call-platform-api
      input:
        baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
        endpoint: 'public/v1/cp/flogoversions'

    - id: save-cp-flogo-versions
      name: Save CP Flogo Versions
      if: ${{ steps.test_connection.output.data.totalBuildtypes == 0 }}
      action: tibco:file:write
      input:
        filePath: flogo-versions.json
        content: ${{ steps['get-cp-flogo-versions'].output.data | dump }}
        overwrite: true

    - id: extract-latest-flogo-version
      name: Extract Latest Flogo Version
      if: ${{ steps.test_connection.output.data.totalBuildtypes == 0 }}
      action: tibco:extract-parameters
      input:
        extractParameters:
          latest_flogo_version:
            type: json
            filePath: flogo-versions.json
            jsonPath: '$[-1:].version'

    - id: provision-flogo-version
      name: Provision Flogo Version
      if: ${{ steps.test_connection.output.data.totalBuildtypes == 0 }}
      action: tibco:call-platform-api
      input:
        baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
        endpoint: 'public/v1/dp/flogoversions/${{ steps["extract-latest-flogo-version"].output.latest_flogo_version[0] }}'
        method: POST
```

Then write the artifact and build it as multipart form data:

```yaml
    - id: write-custom-file
      name: App Data File
      action: tibco:file:write
      input:
        filePath: ${{ parameters.filename }}
        content: ${{ parameters.content }}
        overwrite: true

    - id: build_app
      name: Building App
      action: tibco:call-platform-api
      input:
        baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
        endpoint: 'public/v1/dp/builds'
        method: POST
        filePath: ${{ steps['write-custom-file'].output.filePath }}
        contentType: 'formData'
        formFieldName: ${{ parameters.filename }}
        body:
          request:
            buildName: ${{ parameters.app_name + "-build" }}
        headers:
          'accept': 'application/json'

    - id: wait_for_build
      name: Wait for Build
      action: debug:wait
      input:
        seconds: 30

    - id: deploy_app
      name: Deploying App
      action: tibco:call-platform-api
      input:
        baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
        endpoint: 'public/v1/dp/builds/${{ steps.build_app.output.data.buildId }}/deploy'
        method: POST
        body:
          appId: ''
          buildId: ${{ steps.build_app.output.data.buildId }}
          eula: true
          appName: ${{ parameters.app_name }}
          replicas: 1
```

Exposing the endpoint uses `dataplaneHost` for ingress; linking the app back to the Developer Hub
is a Control Plane call (**no** `baseUrl`):

```yaml
    - id: link-deployed-app
      name: Link App
      action: tibco:call-platform-api
      input:
        endpoint: '/tp-cp-ws/v1/data-planes/${{ parameters.deploymentTarget.dataplaneId }}/capabilities/${{ parameters.deploymentTarget.capabilityId }}/apps'
        method: PUT
        body:
          appId: ${{ steps.deploy_app.output.data.appId }}
          appName: ${{ parameters.app_name }}
          appLinks:
            - linkName: ${{ parameters.app_name }}
              linkType: 'developer_hub'
              href: ${{ steps.test_connection.output.appBaseUrl + "/catalog/default/component/" + parameters.app_name }}
          eula: true
```

Finish with the standard `fetch:template` → `publish:github` → `catalog:register` trio if the
user asked for catalog registration.

Insert `debug:log` steps after build and deploy so IDs are visible in the task log — this is what
makes a failed run diagnosable.

#### Output — always include text plus links

```yaml
  output:
    text:
      - title: Your app has been built and deployed successfully!
        content: |
          **AppName:** ${{ parameters.app_name }}
          **DataPlane:** ${{ parameters.deploymentTarget.dataplaneName }}
          **AppId:** ${{ steps.deploy_app.output.data.appId }}
    links:
      - title: Repository
        icon: github
        url: ${{ steps.publish.output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: ${{ steps.registerItem.output.entityRef }}
      - title: Dataplane Details
        icon: catalog
        url: ${{ steps.test_connection.output.cpBrowserUrl + "/cp/app/data-plane?dp_id=" + parameters.deploymentTarget.dataplaneId }}
```

### 4. Ensure the owner group exists

`group:default/tibco-self-service` must resolve or `catalog:register` and ownership display will
fail. If it is not in the catalog, copy
`tibco-examples/developer-hub-marketplace-content/self-service-flows/tibco-self-service-group.yaml`
to `templates/<slug>/tibco-self-service-group.yaml` (`kind: Group`, `metadata.name:
tibco-self-service`, `spec.type: organization` — match the shipped entity, don't invent a
different type) and register it in `catalog.locations` too.

### 5. Verify local platform config

The flow cannot reach the Control Plane without these in `app-config.local.yaml`:

```yaml
cpLink: 'https://<your-control-plane-host>'
TIBCOPlatformToken: '<bearer token>'
```

Check both are present. If either is missing, tell the user — do not invent a value, and never
write a real token into a committed file.

### 6. Register in `app-config.local.yaml`

Append under `catalog.locations`, target relative to `packages/backend/`:

```yaml
catalog:
  locations:
    - type: file
      target: ../../templates/<slug>/<slug>.yaml
```

Read the file first, skip if an identical `target:` already exists, and preserve existing
entries — including commented-out ones — verbatim.

### 7. Restart hint

```sh
lsof -nP -iTCP:7007 -sTCP:LISTEN   # find the PID
kill <pid>
yarn start                         # from repo root
```

After restart the flow appears at `http://localhost:3000/self-service-flow`.

### 8. Verify in browser (best-effort)

If port 3000 is listening, use Playwright MCP tools to:

1. Navigate to `http://localhost:3000/self-service-flow`
2. Confirm the card appears with the right title and description
3. Click **Choose** and confirm the form renders — in particular that the `CapabilitySelector`
   populates with data planes rather than showing an error

If the dev server isn't running, skip and tell the user to verify after `yarn start`.

Then suggest the `test-self-service-flow` skill for an actual run.

## Don't

- Don't omit the `self-service` tag — it is the only thing that puts the flow on the Self Service
  page. `spec.type: self-service` alone does nothing; the routing code never reads it.
- Don't add `devhub-marketplace` to a flow you want on the Self Service page — that tag is
  explicitly excluded there.
- Don't pass `baseUrl` on Control Plane calls (`/tp-cp-ws/...`, `public/v1/cp/...`). Don't omit it
  on Data Plane calls (`public/v1/dp/...`). This is the most common bug in a new flow.
- Don't treat `deploymentTarget` as a string — it is an object; use
  `${{ parameters.deploymentTarget.dataplaneUrl }}`, never `${{ parameters.deploymentTarget }}`.
- Don't access `steps.<id>.output.<param>` from `tibco:extract-parameters` directly — it is always
  an array; use `[0]`, and test presence with `.length == 0`.
- Don't feed an API response into `tibco:file:write` without `| dump` — the object will stringify
  as `[object Object]` and JSONPath extraction silently returns nothing.
- Don't provision unconditionally. Every provisioning step needs an `if:` guard so re-running the
  flow on a ready data plane is a no-op.
- Don't chain build → deploy with no wait. The build is asynchronous; include `debug:wait` (~30s)
  or poll the build status before deploying.
- Don't use step IDs with hyphens in dot notation — `steps.get-cp-flogo-versions.output` parses as
  subtraction. Use bracket form: `steps['get-cp-flogo-versions'].output`.
- Don't add a `debug` boolean parameter as in `create-template`. Platform calls are not dry-run
  aware, so a debug guard gives false confidence — use `test-self-service-flow` instead.
- Don't hardcode a data plane URL, app ID, or Control Plane host. Take them from the selector
  field and from step outputs.
- Don't commit a real `TIBCOPlatformToken` — it belongs in gitignored `app-config.local.yaml`.
- Don't tag the flow `devhub-marketplace` unless it really is a marketplace entry, and don't tag
  it `devhub-internal` — that suppresses it from the Self Service page.
- Don't auto-restart `yarn start` yourself — the user controls their dev loop.

## Developer Hub 1.19 — MCP shortcuts

On 1.19 (see `MCP-TOOLS.md`):

- `scaffolder.list-scaffolder-actions` — confirm `tibco:call-platform-api` and friends are registered
  before writing steps against them.
- `scaffolder.dry-run-template` — structural validation of the flow without touching the platform.
- `catalog.query-catalog-entities` — verify the catalog entry a flow registers at the end.

**MCP does not cover the TIBCO Platform APIs.** Control Plane and Data Plane calls are plain HTTP
against the platform, exactly as on 1.18 — the MCP server fronts the Hub's own catalog and
scaffolder, nothing else. Everything else in this skill is unchanged from 1.18.
