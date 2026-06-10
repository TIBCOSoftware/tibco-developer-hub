---
name: create-template
description: Author a new Backstage scaffolder template for this TIBCO Developer Hub repo. Trigger when the user wants to create a new software template, add a scaffolder template, write a BWCE/Flogo/import-flow template, or scaffold a new entry under the templates/ folder. Gathers metadata + parameters + steps via AskUserQuestion, writes the Template entity YAML plus a starter `skeleton/` (with `catalog-info.yaml`) under `templates/<slug>/`, and registers the file under `catalog.locations` in `app-config.local.yaml` so it appears in the Software Templates picker after a backend restart.
---

# create-template

Create a new Backstage software template under `./templates/<slug>/` and wire it into the local catalog so it appears at `http://localhost:3000/create` after `yarn start`.

## Canonical reference

Always read at least one existing template fully before generating output — the project has TIBCO-specific tag conventions (`tibco`, `bwce`, `recommended`, `import-flow`, `devhub-marketplace`) and groups configured in `app-config.yaml` (`templateGroups`, `importFlowGroups`, `marketplaceGroups`). Don't invent new tags without checking.

Reference templates:
- `tibco-examples/bwce-bookstore-template/bwce-bookstore-template.yaml` — typical BWCE template with `fetch:template` + `publish:github` + `catalog:register`
- `tibco-examples/flogo-sample-template/` — Flogo variant
- `tibco-examples/template-to-create-template/` — minimal template-of-templates

The default location entry for new templates is **relative to `packages/backend/`** (that's the cwd of the backend process — see `node_modules/@backstage/cli/dist/modules/build/lib/runner/runBackend.cjs.js:81`). So `../../templates/<slug>/<slug>.yaml` resolves to `<repo-root>/templates/<slug>/<slug>.yaml`.

## Workflow

### 1. Gather inputs (AskUserQuestion, batched)

Ask in a single tool call where possible. Use multi-select for tags. Always offer "Other" via the built-in escape hatch.

- **Template slug** — kebab-case, e.g. `bwce-orders`, `flogo-webhook`. Used in folder name, file name, and `metadata.name`.
- **Title** — human-readable name shown in the picker (e.g. "BWCE - Orders").
- **Description** — one sentence shown under the title in the picker.
- **Type** — `service` / `bwce` / `flogo` / `website` / `library` / Other. Goes into `spec.type`.
- **Owner** — Backstage group ref (default `tibco-templates`). Goes into `spec.owner`.
- **Tags** (multi-select) — `tibco`, `bwce`, `flogo`, `recommended`, `import-flow`, `devhub-marketplace`, plus Other. **Important:** tag choices change *where* the template appears:
  - `import-flow` → only listed under `/import-flow` (filtered by `@internal/backstage-plugin-import-flow`)
  - `devhub-marketplace` → only listed under `/marketplace`
  - Anything else (incl. plain `tibco`/`bwce`/`recommended`) → shown under `/create`
  - The `devhub-internal` tag suppresses a template from `/import-flow` even if it also has `import-flow`.
- **Parameters** — which inputs should the user fill in? Default set: `name` (EntityNamePicker, required), `description`, `owner` (OwnerPicker, allowedKinds=Group), `repoUrl` (RepoUrlPicker, allowedHosts=github.com, required). Ask if they want to add any custom ones (string/number/enum), and for each: title, type, default, required-yes/no.
- **Publish target** — `publish:github` (default) / `publish:gitlab` / none (catalog-only). If `none`, skip the publish + register steps and emit only `fetch:template`.
- **Debug mode** — Always add a `debug` boolean parameter (default `false`) to the "Choose a location" page and guard any steps that have side-effects (publish, register, external API calls) with `if: ${{ not parameters.debug }}`. When `debug` is `true` those steps are skipped, making it safe to run the template in a test environment. The `if:` condition evaluates correctly in both live runs and dry-runs.
- **Skeleton content** — User-provided directory to copy / existing skeleton to reference / generate a minimal stub. If "minimal stub," skill generates `skeleton/catalog-info.yaml` plus a placeholder `README.md`. If "existing skeleton," ask for the source path and `cp -R` it into place.

### 2. Create the template folder

Path: `templates/<slug>/`. Create:

- `templates/<slug>/<slug>.yaml` — the `kind: Template` entity (the file referenced from `app-config.local.yaml`).
- `templates/<slug>/skeleton/` — the directory `fetch:template` reads from.
- `templates/<slug>/skeleton/catalog-info.yaml` — always include; this is what `catalog:register` ingests after publish.

Use `mkdir -p` for the directory tree. Don't `cp -R` from `tibco-examples/` blindly — those files are project history, not a clean template. Either copy a specific user-named source, or generate fresh content.

### 3. Generate the Template entity YAML

Use this skeleton, retargeting every field from gathered inputs:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: <slug>
  title: <Title>
  description: <Description>
  tags:
    - <tag-1>
    - <tag-2>
spec:
  owner: <owner-group>
  type: <type>

  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the component
          ui:field: EntityNamePicker
          ui:autofocus: true
        description:
          title: Description
          type: string
          description: A description for the component
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            allowedKinds:
              - Group
        # ... any user-defined extra params here
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
        debug:
          title: Debug mode
          type: boolean
          description: Enable to skip side-effect steps (publish, register) during testing
          default: false

  steps:
    - id: fetch
      name: Fetch Skeleton
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
          description: ${{ parameters.description }}
          destination: ${{ parameters.repoUrl | parseRepoUrl }}
          owner: ${{ parameters.owner }}

    - id: publish
      name: Publish
      if: ${{ not parameters.debug }}
      action: publish:github
      input:
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}

    - id: register
      name: Register
      if: ${{ not parameters.debug }}
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

  output:
    links:
      - title: Repository
        url: ${{ steps.publish.output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: ${{ steps.register.output.entityRef }}
```

Notes:
- Forward every user-defined extra parameter into `steps.fetch.input.values.<name>: ${{ parameters.<name> }}` so the skeleton template can substitute it.
- If user picked publish=none, drop the `publish` and `register` steps and the `output` block (or replace `output` with a single link to the local workspace, which the user generally won't need).
- For `import-flow` templates the convention is `spec.type: import-flow` and the catalog-info usually omits a publish step (the import flow handles ingestion differently — see `tibco-examples/import-flow/` if the user picks this).

### 4. Generate the skeleton

`templates/<slug>/skeleton/catalog-info.yaml` (always):

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{values.name | dump}}
  description: ${{values.description | dump}}
  annotations:
    github.com/project-slug: ${{values.destination.owner + "/" + values.destination.repo}}
    backstage.io/techdocs-ref: dir:.
spec:
  type: <type>
  lifecycle: development
  owner: ${{values.owner | dump}}
```

Drop the `github.com/project-slug` annotation if the publish step was removed.

`templates/<slug>/skeleton/README.md` (when generating a stub):

```markdown
# ${{values.name}}

${{values.description}}
```

If the user provided an existing skeleton path, `cp -R <source>/. templates/<slug>/skeleton/` and leave its contents alone. Don't auto-edit user-provided files — call out anything that looks like it needs templating (`${{values.*}}`) but let the user decide.

### 5. Register in `app-config.local.yaml`

Add an entry under `catalog.locations`. The path **must** be relative to `packages/backend/`, so always two levels up:

```yaml
catalog:
  locations:
    - type: file
      target: ../../templates/<slug>/<slug>.yaml
```

How to apply:
1. Read `app-config.local.yaml`.
2. Find the `catalog:` block (it always exists in this repo's local config).
3. If `locations:` is missing or `[]`, replace it with the two-line list entry.
4. If `locations:` already has entries, append. **Preserve existing entries verbatim, including commented-out ones** — many of the commented lines are valuable references the user toggles on/off.
5. Don't add the entry if a `target:` for the same path already exists (idempotent — re-running the skill on the same slug shouldn't duplicate).

Use the `Edit` tool with a unique `old_string` that anchors on adjacent existing content (e.g. the line right before `locations:` or the last existing entry).

### 6. Restart hint

Tell the user to restart the backend — `app-config.local.yaml` is read once at startup. The fastest path:

```sh
# find and kill the backend (it listens on :7007)
lsof -nP -iTCP:7007 -sTCP:LISTEN
kill <pid>
# from repo root:
yarn start
```

After restart, the template appears at `http://localhost:3000/create` (or `/import-flow` / `/marketplace` depending on tags). If it doesn't, check the backend log for catalog ingestion errors — common causes: malformed YAML, missing required `spec.owner`, or a tag that the page filters out.

### 7. Verify in browser (best-effort)

If port 3000 is listening, use playwright MCP tools to:
1. Navigate to `http://localhost:3000/create` (or `/import-flow`, `/marketplace` per tags).
2. Confirm the new template card appears with the right title + description.
3. Click into it and confirm the parameter form renders.
4. (Optional) Take a screenshot. **Don't** run the template through to publish — that creates a real GitHub repo.

If the dev server isn't running, skip and tell the user to verify after `yarn start`.

## Don't

- Don't write template files outside `templates/<slug>/` — keep each template self-contained.
- Don't `cp -R tibco-examples/<some>/` and rename; those folders are tracked content with their own history. Either generate fresh, or copy a directory the user explicitly named.
- Don't add absolute paths to `catalog.locations` — `target:` must stay relative to `packages/backend/` (`../../templates/...`). Absolute paths work locally but break the moment anyone else clones the repo.
- Don't remove or rewrite the commented-out `locations` entries already in `app-config.local.yaml` — they're a curated set of toggleable references.
- Don't tag a template `devhub-internal` unless the user asks; it hides the template from `/import-flow` listings (see `packages/app/src/App.tsx` where `import-flow` is filtered alongside `!devhub-internal`).
- Don't forget that `fetch:template` runs the skeleton through Nunjucks. Literal `${{ }}` or `{{ }}` in non-templated files (e.g. user-pasted code samples) needs `{% raw %}...{% endraw %}` fences or it'll fail at template time.
- Don't add `{% raw %}` fences around Flogo JSON files — Flogo's own expression syntax (`$activity[...]`, `$loop[...]`, `=coerce.toFloat64(...)`) does not conflict with Nunjucks `${{...}}` syntax. Plain `${{values.name}}` substitutions work correctly inside `.flogo` JSON files.
- Don't auto-restart `yarn start` yourself; ask the user to restart so they control their dev loop.