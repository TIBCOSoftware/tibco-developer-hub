---
name: impact-analysis
description: >
  Produce a detailed change-impact analysis for a TIBCO Developer Hub catalog
  entity (API, Component, Resource, System) by reading its real dependency graph
  from the running Developer Hub via the catalog REST API, classifying every
  related entity into impact tiers, and writing a report plus color-coded
  integration-topology Mermaid diagrams into the impact_analysis/ folder.
  Trigger when the user wants an impact analysis, a blast-radius assessment,
  "what breaks if I change X", a dependency/ripple analysis, who-consumes-this,
  or a coordination/ownership view before modifying a catalog entity.
---

# impact-analysis

Answer "what is affected if I change `<entity>`?" using the **live catalog graph**, not guesses.
The workflow: resolve the subject entity → traverse its relations from the catalog → classify
each neighbour into an impact tier → write a report + color-coded topology diagrams under
`impact_analysis/`.

## Key facts

- **Data source**: the Backstage **catalog REST API** of the running Developer Hub, base URL
  `http://localhost:7007/api/catalog` (or `/tibco/hub/api/catalog` behind the platform). The backend
  must be running (`yarn start`). This Developer Hub is Backstage **1.41.1** — there is **no MCP
  server**; use the REST endpoints below. Full spec:
  `marketplace-content/tibco-platform-apis/version-118/backstage-api-1.41.1.yaml`.
- **Endpoints you need** (all return entities whose `relations` array is the graph):
  - `GET /entities/by-name/{kind}/{namespace}/{name}` — fetch one entity with its relations
    (e.g. `/entities/by-name/api/default/car-information-api`). The kebab subject of the analysis.
  - `POST /entities/by-refs` with `{"entityRefs":[…],"fields":[…]}` — batch-fetch neighbours in one
    call during traversal (much faster than one GET per neighbour).
  - `GET /entities?filter=…` — query/search when you only have a partial selector.
- **Auth**: these endpoints allow anonymous access (`security: - {}`), so in local guest-mode dev **no
  token is needed**. Only if catalog auth is enforced, pass `Authorization: Bearer <Backstage identity
  token>`. All localhost curls need `dangerouslyDisableSandbox: true`.
- **The graph lives in `relations`** on each entity. Key relation types:
  `apiProvidedBy` / `apiConsumedBy`, `providesApi` / `consumesApi`, `dependsOn` / `dependencyOf`,
  `partOf` / `hasPart`, `ownedBy` / `ownerOf`, `subcomponentOf` / `hasSubcomponent`.
- **API entities are passive** — they only ever surface `apiProvidedBy` / `apiConsumedBy` / `ownedBy`
  / `partOf` (never `dependsOn`/`dependencyOf`). So to find what an API *depends on* (its source, its
  destination), look at the **components/resources that point at it**, not at the API's own relations.
- **When the report goes into TechDocs** (a system Docs page), remember Mermaid only renders if the
  `Mermaid` TechDocs addon is wired in `packages/app/src/App.tsx`; otherwise convert the diagrams to
  ASCII + tables for the docs copy (keep the Mermaid original under `impact_analysis/`).
- **Output**: write everything under `impact_analysis/` (create it). One main report
  (`<entity>-impact-analysis.md`) plus a raw-data provenance file (`catalog-data-snapshot.md`).

### Catalog REST calls

```sh
CATALOG="http://localhost:7007/api/catalog"
# Only if catalog auth is enforced (not in local guest mode):
# AUTH=(-H "Authorization: Bearer ${BACKSTAGE_TOKEN}")

# 1. Fetch the subject entity (with its relations)
curl -s "$CATALOG/entities/by-name/api/default/<entity-name>" | python3 -m json.tool

# 2. Batch-fetch neighbours in one call during traversal
curl -s -X POST "$CATALOG/entities/by-refs" -H "Content-Type: application/json" \
  -d '{"entityRefs":["component:default/foo","api:default/bar"]}' | python3 -m json.tool

# 3. Query when you only have a partial selector
curl -s "$CATALOG/entities?filter=kind=component,spec.system=car-order-system" | python3 -m json.tool
```

A missing entity yields HTTP 404; a successful call returns the entity JSON including `relations`.
`by-refs` returns an `items` array aligned to the `entityRefs` you sent (nulls for refs not found).

## Workflow

### 1. Preflight

- Confirm the backend is up: `lsof -iTCP:7007 -sTCP:LISTEN` (or just try a call).
- In local guest-mode dev **no token is needed** — try a call first. Only if you get a 401/403 does
  catalog auth require an `Authorization: Bearer <Backstage identity token>` header.

### 2. Resolve the subject entity

Get the kind + name of the entity to be changed (ask via `AskUserQuestion` if ambiguous).
Fetch it with `GET /entities/by-name/{kind}/default/{name}` and record: `kind`, `spec.type`, `spec.lifecycle`,
`spec.owner`, `spec.system`, and the full `relations` array. A `production` lifecycle raises the
risk bar for breaking changes.

### 3. Traverse the graph

Breadth-first from the subject. Collect the neighbour refs from its `relations`, dedupe, and fetch
them in one `POST /entities/by-refs` call so you have each one's `relations` and spec too. Repeat per
hop. Stop at ~2–3 hops or system boundary. Capture for each: kind, type,
owner, and which relations connect it back toward the subject. Save the raw findings — they become
`catalog-data-snapshot.md`.

### 4. Classify into impact tiers

Direction and contract semantics matter. General rules by subject kind:

- **Subject is an API**
  - `apiProvidedBy` (the implementing component) → 🔴 **Direct**: must implement any contract change.
  - `apiConsumedBy` (every caller) → 🔴 **Direct**: breaking changes break them.
  - The provider's **own** upstream (`consumesApi` / `dependsOn`) → 🟠 **Conditional**: impacted
    only if the new contract needs new data the provider must source.
- **Subject is a message contract** (`spec.type: ems-message` / event / asyncapi — an EMS topic/queue
  message modelled as an API):
  - **No `apiProvidedBy`? The producer is external.** Inbound messages (e.g. a SAP IDoc) often have
    **no internal provider** — the emitter is an external `Resource` (a `sap-system`/database) reached
    via a **consumer's `dependsOn`**. Treat that Resource as a 🔴 **Direct source** that must conform to
    the new schema, and note its owner — it is frequently a **different team** than the contract owner
    (a classic cross-team ripple).
  - **Trace the FIELD, not just the entity.** For a field-level change (e.g. tightening one element),
    follow only paths that actually carry that field. A consumer that re-publishes a *different*
    downstream message (its `providesApi`) only propagates the change if that downstream schema
    **contains the field** — inspect the definitions. If it doesn't (common), stop there and mark the
    downstream consumer 🟠 **Conditional** ("only if a currently-used value is dropped / behaviour
    branches on it"), not 🔴.
  - The message's EMS destination (`Resource`, linked via the queue's `dependencyOf`) is **transport**
    — 🟢 not impacted by a payload-field change.
- **Subject is a Component**
  - Consumers of APIs it provides, and `dependencyOf` / `hasSubcomponent` → 🔴 **Direct**.
  - APIs/resources it consumes or depends on → 🟠 **Conditional** (upstream context).
- **Subject is a Resource**
  - Components with `dependsOn` it → 🔴 **Direct**.
- **Anything with no path to the subject** → 🟢 **Not impacted** (state *why* — sibling flow, behind
  an unrelated component, etc.).
- **Cross-team ripple** → flag 🟠 when a 🟠 upstream entity is **also consumed by a different team's**
  component (extending it drags that team in). This is the most valuable non-obvious finding —
  always look for it.

Record `ownedBy` for every impacted entity → drives the coordination/notify list.

### 5. Write the report

Create `impact_analysis/<entity>-impact-analysis.md` with these sections:
1. **Header** — subject ref, system, domain, date, data source.
2. **Executive summary** — the blast radius in 2–3 sentences + a tier-count table. Lead with the
   sharpest insight (e.g. "all high-impact entities are owned by one team" or the cross-team ripple).
3. **Color legend** (see below) — used by every diagram and table.
4. **Three diagrams** (section 6 below).
5. **Detailed impact by entity** — per-entity: relationship, why it's in that tier, the concrete action.
6. **Risk assessment** — additive vs. breaking vs. needs-new-data, each with risk + radius.
7. **Recommendations & pre-merge checklist** — versioning, contract tests, keep-upstream-additive,
   update the OpenAPI/catalog YAML, deploy order; explicit **notify** list by team.
8. **Provenance** — link to `catalog-data-snapshot.md`.

Keep it grounded: every claim must trace to a real relation you fetched. Do not invent dependencies.

### 6. Color-coded topology diagrams (Mermaid)

Produce **three** diagrams, all sharing this exact legend and `classDef` block so colors are consistent:

| Color | Tier | classDef |
|-------|------|----------|
| 🔴 Red | Change / Direct | `change` (the subject), `high` (direct neighbours) |
| 🟠 Amber (dashed) | Conditional / transitive | `cond` |
| 🟢 Green | Not impacted | `safe` |
| 🔵 Blue | Owner / stakeholder | `owner` |

```
classDef change fill:#ff4d4f,stroke:#a8071a,color:#ffffff,stroke-width:3px;
classDef high   fill:#ffccc7,stroke:#cf1322,color:#000000,stroke-width:2px;
classDef cond   fill:#ffe7ba,stroke:#d46b08,color:#000000,stroke-width:1px,stroke-dasharray:5 3;
classDef safe   fill:#d9f7be,stroke:#389e0d,color:#000000;
classDef owner  fill:#bae0ff,stroke:#0958d9,color:#000000,stroke-width:2px;
```

1. **Blast-radius topology** — the whole (sub)system as a `flowchart LR`; one node per entity with
   `name<br/><i>kind · type</i>`; edges labelled `provides` / `consumes` / `dependsOn`; nodes tinted
   by tier. This is the "integration topology" view.
2. **Layered change-propagation** — `flowchart TD` with subgraphs `Tier 0 → Tier 1 (direct) →
   Tier 2 (conditional) → Not impacted`; dotted edges for conditional hops.
3. **Ownership & coordination** — teams as subgraphs; show which impacted entities each owns; a dotted
   edge for any cross-team co-consumer ripple.

**Mermaid gotchas**: use safe node IDs (alphanumeric/underscore, e.g. `comp_provider`) and put the
display name in the quoted label; multiline labels use `<br/>`.

### 7. Offer image export (optional)

Mermaid renders in the IDE preview and on GitHub. Offer to also render PNG/SVG via
`npx @mermaid-js/mermaid-cli` if the user wants standalone images.

## Reference implementation

`impact_analysis/car-information-api-impact-analysis.md` + `catalog-data-snapshot.md` are a complete
worked example (subject: `car-information-api` in `car-order-system`) — read them as the gold-standard
output before generating a new one.
