---
name: api-version-diff
description: >
  Compare two versions of an API specification (OpenAPI/Swagger, JSON or YAML) and
  write the differences up as TIBCO Developer Hub TechDocs — a changelog page and,
  where the change warrants it, a migration guide — wired into the version's
  mkdocs.yaml nav and served from the API entity via backstage.io/techdocs-ref.
  Classifies every change as breaking or additive and names the consumer impact.
  Trigger when the user wants to diff two API versions, asks "what changed between
  v1 and v2 / 1.18 and 1.19", wants a changelog, release notes or a migration guide
  for an API, wants to know whether a new version is backwards compatible, or is
  publishing a new version of an API into the catalog.
---

# api-version-diff

Answer "what changed between these two versions of the API, and who does it hurt?" from the
**specifications themselves**, then publish the answer as documentation that lives next to the API
entity in the catalog.

The workflow: resolve the two specs → run the bundled differ → verify and enrich each finding →
write the TechDocs page(s) → wire the nav and the entity annotation.

This is the documentation half of API versioning. The conventions the documentation slots into —
version in the entity name, one frozen spec per version, per-version TechDocs — are covered by the
**API Versioning best practices** guide in the Developer Hub Marketplace; this skill implements
§3.9 ("version the documentation with the API") of it.

## Key facts

- **Bundled helper**: `.claude/skills/api-version-diff/apidiff.mjs`. Node, no install step, no
  dependencies of its own. It does the mechanical comparison — operations, parameters, request
  bodies, response codes, shared components, schemas, schema properties, enums, security schemes —
  and labels each finding 🔴 breaking / 🟢 additive / 🔵 note.
  ```sh
  node .claude/skills/api-version-diff/apidiff.mjs <old-spec> <new-spec> \
       [--json] [--out FILE] [--from LABEL] [--to LABEL] [--title TEXT]
  ```
  **Exit code 0 = no breaking changes, 1 = breaking changes, 2 = could not run** — so the same
  command is a CI gate ("fail the build if a breaking change lands without a major bump").
- **YAML support** comes from the `yaml` / `js-yaml` package in the checkout's `node_modules`.
  Run the helper from the **repository root** and it resolves them automatically. JSON specs need
  nothing. The system `python3` on macOS has no `pyyaml` — do not reach for Python here.
- **The helper reports *what*, never *why*.** It cannot tell you that a renamed field breaks the
  three components in the catalog that read it, or that a "breaking" required property only affects
  clients that *construct* the object rather than consume it. That judgement is the value this skill
  adds on top — never ship the raw tool output as the changelog.
- **Two known false-positive shapes**, both already handled but worth recognising if you diff by
  hand: an OpenAPI **3.0 → 3.1 dialect bump** re-spells `nullable: true` as an `anyOf` with
  `type: "null"` (the helper unwraps single-branch null wrappers, so properties are not reported as
  deleted), and `allOf` composition moves properties between the parent and its parts.
- **Where the docs go**: the version folder that holds the new spec, alongside `mkdocs.yaml` and
  `docs/`. Because `backstage.io/techdocs-ref: dir:.` is relative to the entity's own directory,
  each version serves its own documentation set — a reader on 1.18 gets 1.18's changelog.
- **Reference output**: the TIBCO Platform APIs content in this checkout —
  `tibco-examples/developer-hub-marketplace-content/tibco-platform-apis/version-<NNN>/docs/` — is a
  full-scale worked example: one changelog page per API, each with a per-transition section,
  endpoint tables and schema-change lists, plus an `index.md` carrying the count tables. Read the
  newest one before writing a new one.
- **The conventions these docs slot into** are in the *API Versioning Guide* Marketplace entry
  (TechDocs: `/docs/default/system/api-versioning-best-practices`). Read §3.9 if you are setting up
  per-version documentation for the first time.

- **Scratch files**: helper scripts, dumps and intermediate JSON go under
  `${TMPDIR:-/tmp}/devhub-skills/api-version-diff/` — `mkdir -p` it before the first write and remove it when the run
  finishes. Don't write straight into `/tmp`: concurrent runs collide there, and a
  published skill should not leave loose `.mjs` files in a shared directory.

## Workflow

### 1. Resolve the two specifications

Establish what is being compared. Ask via `AskUserQuestion` if it is ambiguous. Three sources:

- **Two files on disk** — the common case when versions are frozen per folder:
  `version-118/control-plane-api-118.json` vs `version-119/control-plane-api-119.json`.
- **Two catalog entities** — read `spec.definition` from the running Developer Hub, which is the
  ground truth for what the Hub actually serves. On 1.19, use MCP:
  ```jsonc
  // catalog.get-catalog-entity
  { "kind": "API", "namespace": "default", "name": "tibco-platform-api-118" }
  ```
  Write each entity's `spec.definition` to a file and diff the files. **`spec.definition` is large**,
  so if you are searching for the pair rather than fetching a known one, shortlist with
  `catalog.query-catalog-entities` *without* that field first, then fetch only the two you want.
  If MCP is off, the REST equivalent is
  `curl -s "$CATALOG/entities/by-name/api/default/<name>"` piped through
  `python3 -c "import json,sys; print(json.load(sys.stdin)['spec']['definition'])"`, with
  `dangerouslyDisableSandbox: true` on the curl.
- **Two git refs of one file** — when the spec tracks a branch rather than a frozen copy:
  `git show v1.9.4:openapi.yaml > ${TMPDIR:-/tmp}/devhub-skills/api-version-diff/old.yaml`. If this is how the versions are kept, say so in
  the report: it means the older version is only reproducible from git, which the best-practices
  guide advises against (§3.3).

Record for each: the file, `info.version`, the dialect (`openapi` / `swagger`), and the **label the
reader thinks in** — usually the release ("1.18"), not the spec's internal version. Those differ
more often than not, and both belong in the report.

### 2. Run the differ

```sh
node .claude/skills/api-version-diff/apidiff.mjs old.json new.json --from "1.18" --to "1.19"
node .claude/skills/api-version-diff/apidiff.mjs old.json new.json --json --out ${TMPDIR:-/tmp}/devhub-skills/api-version-diff/diff.json
```

Take the `--json` form when there are many findings — it is easier to group and count from.

Sanity-check the summary table before going further. Operation and schema counts that move by
hundreds, or a spec version that went *backwards*, usually mean the wrong pair of files.

### 3. Verify and enrich every finding

This is the step that makes the output worth reading. For each finding, open the spec and answer:

- **What is it for?** A new operation needs its purpose, its body/parameters and what it replaces or
  complements — read its `description`, `requestBody` and responses. "POST /entities/by-query added"
  is not documentation; "a request-body twin of the GET form, for filters that exceed practical URL
  length limits" is.
- **Who does it actually break?** Interrogate every 🔴. A new **required response** property breaks
  clients that *validate* or *construct* the object, not clients that merely read it — say which.
  A removed enum value only matters to callers that sent it. Downgrade to a note anything that
  cannot break a real consumer, and **say why you downgraded it**.
- **Is a 🟢 secretly load-bearing?** A new optional parameter that changes a default, or a new
  operation that supersedes an existing one, deserves prominence even though it is additive.
- **Is it a rename?** The differ sees a removed property and an added one; a human sees
  `code`/`message` → `errorCode`/`errorMsg`. Pair them up — an unpaired removal reads far more
  alarming than a rename.
- **Does the catalog know who is affected?** If the API is registered with `consumesApis` relations,
  run `/impact-analysis` on the API entity and fold the consumer list into the migration section.
  That turns "this is breaking" into "this breaks these three components, owned by these two teams".

Never assert a version-to-version claim you did not read out of a spec. If the two specs cannot
answer something (why a field was deprecated, when the old version sunsets), ask the user or leave
it out — do not infer it.

### 4. Write the documentation

Create `docs/<api-slug>-changelog.md` in the new version's folder (or extend the existing changelog
page with a new section at the top — **newest transition first**, so a reader lands on what just
changed). Structure per transition:

1. **Heading** — `## Version 1.18 → 1.19`, with the contract version underneath when it differs from
   the release version (`**Backstage version:** 1.41.1 → 1.51.0`).
2. **Verdict sentence** — is it backwards compatible or not, in one line, before any table.
3. **Summary table** — dialect, operation count, parameter count, schema count, each `from → to`.
4. **New endpoints** — a table of Method | Path | Operation ID | Description, then the request body
   or parameters of anything non-obvious.
5. **Removed endpoints** — the table, or an explicit "None". Never leave the reader guessing.
6. **New/changed parameters** — with enum values, defaults and *when to use them*.
7. **Schema changes** — new schemas with their shape; modified schemas with the exact field-level
   delta; renames shown as pairs.
8. **Notes** — dialect changes, cosmetic upstream edits, anything that affects tooling rather than
   the contract.
9. **Migration** — only when there is a 🔴: what a consumer must change, in what order.

If the transition has breaking changes and real consumers, write the migration guide as its **own
page** and link it from the API entity's `metadata.links` — a migration guide buried in a changelog
section gets missed.

Also update the version-set overview page (`docs/index.md`) if one exists: the per-version count
tables and the key-highlights list.

### 5. Wire it into the Hub

- Add the page(s) to `mkdocs.yaml` `nav:` in the same folder.
- Confirm the API entity carries `backstage.io/techdocs-ref: dir:.`; add it if missing.
- Confirm every nav entry resolves to a file that exists — a stale nav entry breaks the TechDocs
  build, not just the link.
- If this transition supersedes a version, apply the versioning practices in the same change:
  set the previous entity's `spec.lifecycle: deprecated`, and add `superseded-by` / `sunset-date`
  annotations plus a migration-guide link to it.

### 6. Report

Summarise for the user: the counts, the breaking findings in plain language with who they affect,
the files written, and anything you deliberately downgraded or could not determine from the specs.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `neither the "yaml" nor the "js-yaml" package could be resolved` | Run from outside the checkout | `cd` to the repository root, or convert the spec to JSON |
| Hundreds of findings on a "small" release | Wrong file pair, or one spec was regenerated by a different tool | Check the summary counts; compare `info.version` against the release |
| Every property of one schema reported removed | A dialect or `allOf` restructure the unwrapper did not catch | Read that schema in both specs before writing anything |
| Exit code 1 in CI on an intentional major bump | Working as designed | Gate on the major-version bump, not on the exit code alone |
| Operation counts differ from the vendor's release notes | The differ counts path × method; vendors often count paths | State which you used |

## Reference implementation

`tibco-examples/developer-hub-marketplace-content/tibco-platform-apis/version-<NNN>/docs/` — up to
five changelog pages (Control Plane, BWCE, BW5 CE, Flogo, Developer Hub) plus an overview `index.md`
with the per-version count tables. `developer-hub-api.md` is the closest model for a single
two-version transition; `control-plane-api.md` shows a long multi-transition history.

The same content is published as the *Platform APIs* Marketplace entries, so if this checkout is
older than the release you are documenting, install the newest one and read its TechDocs instead.
