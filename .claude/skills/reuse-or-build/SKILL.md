---
name: reuse-or-build
description: >
  Answer "do I need to build a new service, or can I re-use an existing one, to
  get specific information?" for the TIBCO Developer Hub. Searches the live
  catalog (catalog REST API) for existing APIs, message contracts, components,
  and resources that already carry the requested data, performs a field-level
  match against their definitions, classifies candidates into Reuse / Extend /
  Build tiers, and writes a decision report with color-coded topology diagrams
  under reports/. Trigger when the user asks whether a capability or data already
  exists, "where can I get X from", "is there already a service/message for X",
  build-vs-buy/reuse questions, or before scaffolding a new component.
---

# reuse-or-build

Answer *"do I need to build a new service or can I re-use an existing one to get `<information>`?"*
using the **live catalog** — real contracts and definitions, not guesses.
The workflow: pin down the information need → search the catalog for candidate providers →
field-match the need against each candidate's `spec.definition` → classify into
✅ Reuse / 🟡 Extend / 🔴 Build → write a decision report with color-coded topology diagrams.

## Key facts

- **Data source**: the **MCP server** of the running Developer Hub. This is Developer Hub **1.19**
  (Backstage **1.51.0**), which exposes the catalog through `@backstage/plugin-mcp-actions-backend`
  at `http://localhost:7007/api/mcp-actions/v1`. The backend must be running (`yarn start`) and
  `tibco.mcpActions.enabled` must be `true` — see `MCP-TOOLS.md` in this skill set.
- **Tools this skill uses**:
  - `catalog.query-catalog-entities` with `fullTextFilter` — keyword search for candidates:
    `{ "fullTextFilter": { "term": "<term>", "fields": ["metadata.name", "metadata.title"] } }`
  - `catalog.query-catalog-entities` with a predicate — the full scan of a kind (catalogs are
    small; a full scan beats a missed candidate):
    `{ "query": { "kind": "API" }, "fields": ["kind", "metadata.name", "spec.type", "spec.system"] }`
  - the same tool with `fields: ["spec.definition"]` — pull the contracts of the shortlist. **The
    definition is not returned unless you name it**, and it is large, so shortlist first.
  - `catalog.get-catalog-entity` with `{ kind, namespace, name }` — one candidate in full.
- **If MCP is unavailable**, the REST equivalents are `GET /entities/by-query?fullTextFilter[term]=`,
  `GET /entities?filter=kind=api`, `POST /entities/by-refs` with a `fields` projection, and
  `GET /entities/by-name/{kind}/{namespace}/{name}` against `http://localhost:7007/api/catalog`.
- **Auth**: these endpoints allow anonymous access (`security: - {}`), so in local guest-mode dev
  **no token is needed** — try a call first. Only if catalog auth is enforced, pass
  `Authorization: Bearer <Backstage identity token>` on a 401/403. All localhost curls need
  `dangerouslyDisableSandbox: true`. The report's provenance section must state which endpoint was
  used for each query.
- **The evidence lives in `spec.definition`.** API entities carry the actual contract (XSD for
  `ems-message` XML contracts, JSON Schema for events, OpenAPI for REST). A candidate only counts
  as a match if the *fields* the user needs are actually present in its definition — never match
  on the entity name or description alone.
- **Transport matters for messages** (`spec.type: ems-message`):
  - **topic** (`resource` of type `topic`, `t.*`) — broadcast; a new consumer can subscribe
    without touching the producer → cheap reuse.
  - **queue** (`resource` of type `queue`, `q.*`) — point-to-point; messages are *consumed*.
    Adding a second consumer competes with the existing one → reuse usually means asking the
    platform team for a bridge/topic or a browser, not just subscribing. Flag this.
- **Closed contracts resist extension**: JSON Schema with `additionalProperties: false`, or an
  XSD `xsd:sequence` (position-sensitive; new elements must be `minOccurs="0"` and still break
  strict old-schema validators). An "extend" recommendation on such a contract must mention the
  versioning cost — and if the contract has cross-team consumers (`apiConsumedBy` owned by another
  team), recommend running `/impact-analysis` on it before committing.

### Catalog REST calls

```sh
CATALOG="http://localhost:7007/api/catalog"
# Only if catalog auth is enforced (not in local guest mode):
# AUTH=(-H "Authorization: Bearer ${BACKSTAGE_TOKEN}")

# 1. Keyword search across the catalog
curl -s "$CATALOG/entities/by-query?fullTextFilter%5Bterm%5D=shipment" | python3 -m json.tool

# 2. Full scan of one kind (small catalogs — beats a missed candidate)
curl -s "$CATALOG/entities?filter=kind=api" | python3 -m json.tool

# 3. Batch-fetch candidates with only the fields you need (definitions + relations)
curl -s -X POST "$CATALOG/entities/by-refs" -H "Content-Type: application/json" \
  -d '{"entityRefs":["api:default/foo","api:default/bar"],
       "fields":["kind","metadata.name","metadata.description","spec.type","spec.owner","spec.lifecycle","spec.definition","relations"]}' \
  | python3 -m json.tool

# 4. Fetch one entity in full
curl -s "$CATALOG/entities/by-name/api/default/foo" | python3 -m json.tool
```

A missing entity yields HTTP 404; `by-refs` returns an `items` array aligned to the `entityRefs`
you sent (nulls for refs not found). If `by-query`'s `fullTextFilter` isn't available on a given
deployment, fall back to a full-scan (call 2) and filter names/descriptions/tags yourself.

## Workflow

### 1. Pin down the information need

Before searching, extract from the user's question (ask via `AskUserQuestion` if ambiguous):

- **The fields**: the concrete data items needed (e.g. "carrier + tracking number per delivery").
- **The shape**: event-driven (be notified when X happens) vs request/response (look X up on demand).
  A topic subscription satisfies the former; only a request/response API (or a queryable store)
  satisfies the latter — an event stream alone may force a "build a cache" recommendation.
- **The consumer**: which team/component will consume it (drives the ownership section).

### 2. Search for candidates

Cast a wide net, then narrow:

1. Keyword search (`fullTextFilter`) with 2–4 terms from the information need, including synonyms
   (e.g. "shipment", "dispatch", "delivery", "DESADV").
2. List **all** `kind=api` entities in the relevant system (`/entities?filter=kind=api`) and scan
   names/descriptions/tags — catalogs are small enough that a full scan beats a missed candidate.
3. Include `kind=component` (a service may expose the data without a registered API entity) and
   `kind=resource` (the system of record — e.g. a `sap-system` — is the fallback source when no
   contract exists).

### 3. Field-level match

Batch-fetch every candidate **with `spec.definition`** (`POST /entities/by-refs` with a `fields`
projection) and check each needed field:

- Parse XSD / JSON Schema / OpenAPI and mark each needed field **present / partial (derivable or
  differently-grained) / absent**.
- Build a coverage matrix: candidates × needed fields. This table is the heart of the report —
  a candidate with 4/5 fields and one additive gap usually beats a new service.
- For each candidate also record: transport (topic vs queue vs REST), producer
  (`apiProvidedBy`), owner, lifecycle, existing consumers (`apiConsumedBy`), and contract
  openness (extensible vs closed).

### 4. Classify

| Tier | Meaning | Typical evidence |
|------|---------|------------------|
| ✅ **Reuse as-is** | All needed fields present; access path is non-invasive | Fields in definition + topic subscription or callable API |
| 🟡 **Extend existing** | Most fields present; gaps are additive to an existing contract or producer | Missing field exists in the producer's upstream source (e.g. SAP); contract owner is reachable |
| 🔴 **Build new** | No candidate carries the data, or extension breaks a closed cross-team contract, or the shape mismatches (need request/response, only events exist) | Empty coverage row; queue-only transport with a competing consumer; `additionalProperties: false` + foreign consumers |

The verdict is the **cheapest tier that satisfies the need** — but state the runner-up and why it
lost. When the verdict is 🟡 Extend, name the entity to extend and recommend `/impact-analysis`
on it as the follow-up.

### 5. Write the report

Default output: `reports/reuse-<slug>.md` (create `reports/` if missing; honour an explicit path
from the user). Sections:

1. **Header** — the information need (fields + shape), requesting team, date, data source.
2. **Verdict box** — one of ✅ REUSE / 🟡 EXTEND / 🔴 BUILD, the chosen entity/path, 2–3 sentence
   rationale. Lead with this; the reader wants the answer first.
3. **Coverage matrix** — candidates × needed fields (present ✅ / partial 🟡 / absent ✖️), plus
   transport, owner, lifecycle columns.
4. **Diagrams** (section 6) — color-coded topology.
5. **Per-candidate detail** — why each candidate landed in its tier; for the winner, the concrete
   integration steps (subscribe to which topic, call which endpoint, register which relation).
6. **Cost & risk comparison** — reuse vs extend vs build: teams involved, contracts touched,
   time-to-data, coupling introduced.
7. **Next steps** — checklist: catalog registrations to add (`consumesApi` relation for the new
   consumer!), teams to contact, `/impact-analysis` follow-up if extending.
8. **Provenance** — companion `reports/reuse-<slug>-data-snapshot.md` with the raw entities,
   definitions, and REST queries used. Every claim must trace to fetched data.

### 6. Color-coded topology diagrams (Mermaid)

Produce **two** diagrams as `flowchart LR`, both sharing the `classDef` block below so colors stay
consistent with `/impact-analysis`:

1. **Candidate map** — the information need as the focal node; every candidate with its transport
   resource and producer; tint each by tier.
2. **Chosen path** — only the winning integration: source → producer → contract → transport → new
   consumer, with the one dashed edge marking anything that must be added.

```
classDef need   fill:#ff4d4f,stroke:#a8071a,color:#ffffff,stroke-width:3px;
classDef reuse  fill:#d9f7be,stroke:#389e0d,color:#000000,stroke-width:2px;
classDef extend fill:#ffe7ba,stroke:#d46b08,color:#000000,stroke-width:1px,stroke-dasharray:5 3;
classDef build  fill:#ffccc7,stroke:#cf1322,color:#000000,stroke-width:2px;
classDef ctx    fill:#f0f0f0,stroke:#8c8c8c,color:#000000;
```

Mermaid renders inline in the IDE preview and on GitHub, so embed the fenced ```mermaid``` sources
directly in the report. **Mermaid gotchas**: use safe node IDs (alphanumeric/underscore), put the
display name in a quoted label, and use `<br/>` for multiline labels. If the report is destined for
a TechDocs page, Mermaid only renders when the `Mermaid` TechDocs addon is wired in
`packages/app/src/App.tsx`; otherwise convert the diagrams to ASCII + tables for the docs copy.

### 7. Offer image export (optional)

Mermaid renders in the IDE preview and on GitHub. Offer to also render standalone PNG/SVG via
`npx @mermaid-js/mermaid-cli` if the user wants them (e.g. to embed in a slide deck).

## Reference implementation

The sibling skill `../impact-analysis/SKILL.md` documents the same catalog access patterns in more
depth. Its worked example — the Skill Library TechDocs page
`/docs/default/system/developer-hub-skill-library/car-information-api-impact-analysis`, available
once the Marketplace entry is installed — shows the expected report quality, provenance discipline
and diagram style. Match it.
