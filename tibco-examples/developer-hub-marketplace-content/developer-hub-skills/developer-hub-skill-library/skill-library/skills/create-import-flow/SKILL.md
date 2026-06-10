---
name: create-import-flow
description: >
  Author a new TIBCO Developer Hub import flow template. Trigger when the user wants to
  create an import flow, add a new import-flow template, build a BWCE/BW6/BW5/Flogo/EMS
  importer, or scaffold an entry that ingests existing source repositories into the
  Developer Hub catalog. Distinct from create-template: import flows follow the
  clone→extract→generate→register pattern and use TIBCO custom actions
  (tibco:git:clone, tibco:extract-parameters, tibco:create-yaml, tibco:git:push).
  Writes the Template entity YAML (and optional Nunjucks entity skeletons) under
  templates/<slug>/ and registers it in app-config.local.yaml so it appears at
  /import-flow after a backend restart.
---

# create-import-flow

Create a new TIBCO Developer Hub import flow under `./templates/<slug>/` and wire it
into the local catalog so it appears at `http://localhost:3000/import-flow` after `yarn start`.

## What makes an import flow different from a regular template

| Aspect | Regular template | Import flow |
|--------|-----------------|-------------|
| Purpose | Create new project from scratch | Analyse an existing repo and register it |
| Input | User-provided metadata | GitHub repo URL + app/project name |
| Metadata source | User fills in form | Extracted from source files (XML, JSON, regex) |
| Skeleton | `skeleton/` dir via `fetch:template` | `entity-skeletons-<tech>/` (advanced) or inline YAML (simple) |
| Steps | fetch → publish → register | clone → extract → generate → push → register |
| Custom actions | Standard Backstage only | `tibco:git:clone`, `tibco:extract-parameters`, `tibco:create-yaml`, `tibco:git:push` |
| `debug` parameter | Always added | Not used (no dry-run guard) |
| UI location | `/create` | `/import-flow` |

## Canonical references — read these BEFORE generating output

Always read at least one reference from each complexity tier first:

**Simple pattern** (one Component, inline YAML):
- `tibco-examples/import-flow-v2/import-flow-bwce-v2.yaml`
- `tibco-examples/import-flow-v2/import-flow-flogo-v2.yaml`

**Advanced pattern** (multiple entity types, Nunjucks skeletons):
- `tibco-examples/advanced-import-flows/import-flow-bw6.yaml`
- `tibco-examples/advanced-import-flows/entity-skeletons-bw6/component.yaml.njk`
- `tibco-examples/advanced-import-flows/entity-skeletons-bw6/system.yaml.njk`

**Config conventions**:
- `app-config.yaml` → `importFlowGroups` — check tag filters before inventing new tags

Reference docs: `resources/docs/import-flows/` (scraped official docs for v1.17.0)

## Workflow

### 1. Gather inputs (single batched AskUserQuestion)

Ask all of the following in as few tool calls as possible:

- **Template slug** — kebab-case identifier, e.g. `import-bwce-orders`, `import-flogo-payments`. Used as folder name, file name, and `metadata.name`.
- **Title** — human-readable name shown in the `/import-flow` picker.
- **Description** — one sentence shown under the title.
- **Technology** (single-select):
  - `BWCE / BW6 (BusinessWorks Container Edition)`
  - `BW5 (BusinessWorks 5)`
  - `Flogo`
  - `EMS Server`
  - `Custom`
- **Complexity** (single-select):
  - *Simple* — generates one `Component` entity inline using `tibco:create-yaml`. Use this when only a single entity type is needed **and** the generated entity does not need `$text`, `$yaml`, or `$json` references in any field.
  - *Advanced* — generates entities using Nunjucks `.njk` skeleton files and `fetch:template`. **Required** when: (a) multiple entity types are needed, or (b) any field in the generated entity needs a `$text`/`$yaml`/`$json` reference (e.g. `API` entities with `spec.definition.$text`). The `.njk` files are not processed by the Backstage `PlaceholderProcessor`, so `$text` inside them is safe.
- **Entity types** (multi-select, advanced only): `Component` · `System` · `API` · `Resource`
- **Extraction definitions** — What fields should be extracted from the source repo? For each:
  - Parameter name (snake_case, e.g. `bwce_project_name`)
  - Extraction type: `xml` / `json` / `file` / `workspace`
  - File path expression (may reference `parameters.application`)
  - Query: xPath (xml), jsonPath (json/xml), regex (file/workspace)
  
  Pre-fill sensible defaults based on technology:
  - BWCE/BW6: `bwce_project_name` via xml xPath `string(/projectDescription/name)` from `.application/.project`
  - Flogo: `flogo_project_name` via json jsonPath `$.name` from `<app>.flogo`
  - BW5: `bw5_project_name` via workspace scan
  - EMS: `ems_server_name` via file regex
- **Extra tags** (multi-select, always pre-ticked with `import-flow` + `tibco`):
  `bwce` · `flogo` · `bw5` · `ems` · `business-works-6` · `business-works-container-edition` · `developer-hub` · `recommended`
- **Owner** — Backstage group ref, default `group:default/tibco-imported`

### 2. Resolve spec.type

Use technology-specific types matching the examples, not generic `import-flow`:

| Technology | spec.type |
|-----------|-----------|
| BWCE / BW6 | `integration` |
| BW5 | `integration` |
| Flogo | `integration` |
| EMS Server | `messaging` |
| Simple (any) | `import-flow` |
| Custom | ask user or `import-flow` |

For the simple pattern, `spec.type: import-flow` is acceptable and matches `import-flow-bwce-v2.yaml`.

### 3. Create folder structure

**Simple**:
```
templates/<slug>/
  <slug>.yaml
```

**Advanced**:
```
templates/<slug>/
  <slug>.yaml
  entity-skeletons-<tech>/
    component.yaml.njk        # always
    system.yaml.njk           # if System selected
    apis.yaml.njk             # if API selected
    resources.yaml.njk        # if Resource selected
```

No `skeleton/` directory — import flows do not use the standard Backstage skeleton pattern.

### 4. Generate `<slug>.yaml` — the Template entity

Use the canonical 4-step pattern. Never invent a 5th action or restructure the flow.

#### Parameters block

Always include these two pages:

```yaml
parameters:
  - title: Repository Location
    required:
      - repoUrl
    properties:
      repoUrl:
        title: GitHub repository with existing <Technology> project
        type: string
        ui:field: RepoUrlPicker
        ui:options:
          allowedHosts:
            - github.com

  - title: Fill in some steps
    required:
      - application
      - owner
    properties:
      application:
        title: <Technology> Application
        type: string
        description: Name of the <Technology> application to import
      owner:
        title: Owner
        type: string
        description: Owner of the component in the catalog
        ui:field: OwnerPicker
        ui:options:
          allowedKinds:
            - Group
```

Add technology-specific extras in the second page based on what extraction needs:
- BW6/advanced: add `application_folder` (folder containing the app) and `system` (catalog system name)
- Others: add whatever additional path fragments the extraction filePath expressions need

#### Steps block

**Simple pattern** (`tibco:create-yaml`):

```yaml
steps:
  - id: clone
    name: Clone the Project
    action: tibco:git:clone
    input:
      failOnError: true
      repoUrl: ${{ "https://" + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" + (parameters.repoUrl | parseRepoUrl).repo }}

  - id: extract
    name: Extract Parameters
    action: tibco:extract-parameters
    input:
      failOnError: true
      extractParameters:
        <param_name>:
          type: <xml|json|file|workspace>
          filePath: ${{ parameters.application + "/..." }}
          xPath: string(/projectDescription/name)   # xml
          # jsonPath: $.name                         # json or xml alternative
          # regex: (pattern)                         # file or workspace

  - id: createYaml
    name: Create YAML
    action: tibco:create-yaml
    input:
      outputFile: ${{ parameters.application + "/" + parameters.application + "-<tech>-catalog-info.yaml" }}
      outputStructure:
        apiVersion: backstage.io/v1alpha1
        kind: Component
        metadata:
          name: ${{ steps.extract.output.<param_name>[0] }}
          description: ${{ steps.extract.output.<desc_param>[0] }}
          tags:
            - <tech-tag>
          annotations:
            github.com/project-slug: ${{ "https://" + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" + (parameters.repoUrl | parseRepoUrl).repo }}
        spec:
          type: <spec.type>
          lifecycle: production
          owner: ${{ parameters.owner }}

  - id: push
    name: Push Current Repo
    action: tibco:git:push
    input:
      failOnError: true

  - id: register
    name: Register
    action: catalog:register
    input:
      catalogInfoUrl: ${{ "https://" + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" + (parameters.repoUrl | parseRepoUrl).repo + "/blob/main/" + parameters.application + "/" + parameters.application + "-<tech>-catalog-info.yaml" }}
```

**Advanced pattern** (`fetch:template` + Nunjucks):

Replace the `createYaml` step with `fetchRS` (fetch resource skeleton) + `rename`:

```yaml
  - id: fetchRS
    name: Resource Skeleton
    action: fetch:template
    input:
      url: ./entity-skeletons-<tech>/
      targetPath: ${{ parameters.application_folder }}
      templateFileExtension: true
      values:
        repoUrl: ${{ parameters.repoUrl }}
        owner: ${{ parameters.owner }}
        application_folder: ${{ parameters.application_folder }}
        application: ${{ parameters.application }}
        <tech>_system: ${{ parameters.system }}
        <tech>_project_name: ${{ steps.extract.output.<param_name>[0] }}
        <tech>_project_description: ${{ steps.extract.output.<desc_param>[0] }}
        # add all extracted params that the .njk templates reference

  - id: rename
    name: Rename Descriptor Files
    action: fs:rename
    input:
      files:
        - from: ${{ parameters.application_folder + "/system.yaml" }}
          to: ${{ parameters.application_folder + "/system-" + parameters.application + ".yaml" }}
          overwrite: true
        - from: ${{ parameters.application_folder + "/component.yaml" }}
          to: ${{ parameters.application_folder + "/components-" + parameters.application + ".yaml" }}
          overwrite: true
        # add api.yaml → apis-<app>.yaml and resources.yaml → resources-<app>.yaml if applicable
```

And replace the single `register` step with one per entity type:

```yaml
  - id: registerSystem
    name: Register System
    action: catalog:register
    input:
      catalogInfoUrl: ${{ "https://" + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" + (parameters.repoUrl | parseRepoUrl).repo + "/blob/main/" + parameters.application_folder + "/system-" + parameters.application + ".yaml" }}

  - id: registerComponents
    name: Register Components
    action: catalog:register
    input:
      catalogInfoUrl: ${{ "https://" + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" + (parameters.repoUrl | parseRepoUrl).repo + "/blob/main/" + parameters.application_folder + "/components-" + parameters.application + ".yaml" }}
```

#### Output block

Simple:
```yaml
output:
  links:
    - title: Open in catalog
      icon: catalog
      entityRef: ${{ steps.register.output.entityRef }}
    - title: Repository (Pull Request)
      url: ${{ steps.push.output.remoteUrl }}
```

Advanced (one link per entity type + PR):
```yaml
output:
  links:
    - title: Open in catalog (System)
      icon: catalog
      entityRef: ${{ steps.registerSystem.output.entityRef }}
    - title: Open in catalog (Components)
      icon: catalog
      entityRef: ${{ steps.registerComponents.output.entityRef }}
    - title: Repository (Pull Request)
      url: ${{ steps.push.output.remoteUrl }}
```

### 5. Generate Nunjucks skeleton files (advanced only)

Use `tibco-examples/advanced-import-flows/entity-skeletons-bw6/*.njk` as the model.
Pattern rules:
- Use `${{ values.<param> }}` for value substitution (Nunjucks, not Jinja)
- Use `{%- if(values.field) %}...{%- endif %}` for optional sections
- Use `{%- for item in values.list %}...{%- endfor %}` for repeated entries
- Keep file names generic (`component.yaml.njk`, `system.yaml.njk`) — `fs:rename` handles the final names
- `apiVersion: backstage.io/v1alpha1` is always v1alpha1

`component.yaml.njk` minimum structure:
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.<tech>_project_name }}
{%- if(values.<tech>_project_description) %}
  description: ${{ values.<tech>_project_description }}
{%- endif %}
  tags:
    - <tech-tag>
spec:
  type: <spec.type>
  lifecycle: production
  owner: ${{ values.owner }}
{%- if(values.<tech>_system) %}
  system: ${{ values.<tech>_system }}
{%- endif %}
```

`system.yaml.njk` minimum structure:
```yaml
apiVersion: backstage.io/v1alpha1
kind: System
metadata:
  name: ${{ values.<tech>_system }}
spec:
  owner: ${{ values.owner }}
```

Generate `apis.yaml.njk` and `resources.yaml.njk` only when those entity types are selected.

### 6. Register in `app-config.local.yaml`

Append under `catalog.locations` with target relative to `packages/backend/`:

```yaml
catalog:
  locations:
    - type: file
      target: ../../templates/<slug>/<slug>.yaml
```

Apply identically to `create-template` step 5:
1. Read `app-config.local.yaml`
2. Find the `catalog:` block
3. Append entry — don't add if an identical `target:` already exists
4. Preserve existing entries including commented-out ones verbatim

### 7. Restart hint

Tell the user to restart the backend so the new catalog entry is picked up:

```sh
lsof -nP -iTCP:7007 -sTCP:LISTEN   # find the PID
kill <pid>
yarn start                           # from repo root
```

After restart, the import flow appears at `http://localhost:3000/import-flow`.

### 8. Verify in browser (best-effort)

If port 3000 is listening, use Playwright MCP tools to:
1. Navigate to `http://localhost:3000/import-flow`
2. Confirm the new template card appears with the correct title + description
3. Click into it and confirm the parameter form renders (repoUrl picker and application fields visible)

If the dev server isn't running, skip and tell the user to verify after `yarn start`.

## Don't

- Don't add a `debug` boolean parameter unless the user asks for it. If added, only guard `push` and `register` steps with `if: ${{ not parameters.debug }}` — `clone` and `extract` always run because they validate connectivity and file parsing, and their downstream steps depend on their output.
- Don't create a `skeleton/` directory — import flows use `entity-skeletons-<tech>/` (advanced) or no skeleton at all (simple).
- Don't use `publish:github` — import flows write back via `tibco:git:push`, not the Backstage publish action.
- Don't use `fetch:plain` instead of `tibco:git:clone` — the TIBCO clone action handles authentication and failOnError semantics that plain fetch does not.
- Don't forget `failOnError: true` on the clone and extract steps — this is the convention in all TIBCO import flow examples.
- Don't access `steps.extract.output.<param>` directly — it's always an array; use `steps.extract.output.<param>[0]`.
- Don't use `$text`, `$yaml`, or `$json` as keys inside `tibco:create-yaml`'s `outputStructure`. When the template YAML is registered as a catalog entity, Backstage's `PlaceholderProcessor` scans the entire document including nested `outputStructure` blocks and tries to resolve those placeholders — failing because the value is a Nunjucks expression, not a URL. Use the advanced pattern (`.njk` skeleton + `fetch:template`) instead; `.njk` files are never processed as catalog entities.
- Don't tag the template `devhub-internal` — that suppresses it from `/import-flow`.
- Don't reference `tibco-examples/` files in `catalog.locations` — those are project examples, not user-owned templates.
- Don't add absolute paths to `catalog.locations` — always relative to `packages/backend/` (`../../templates/...`).
- Don't auto-restart `yarn start` yourself — the user controls their dev loop.
