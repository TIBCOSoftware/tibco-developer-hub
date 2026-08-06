---
name: data-lineage
description: >
  Trace how a message or an individual data field flows through the TIBCO
  Developer Hub landscape — from the system of record that originates it,
  through every integration app and EMS destination that carries it, to the
  systems that finally consume it. Reads the live catalog (catalog REST API),
  builds a directed flow graph from providesApi/consumesApi, extracts fields
  from each contract's spec.definition (JSON Schema and XSD), classifies every
  field hop as carried / renamed / derived / originates / dropped, and writes a
  lineage report with rendered SVG diagrams under reports/. Trigger when the
  user asks where data comes from or goes, for a data-lineage or provenance or
  data-flow trace, "how does field X travel through the system", "which systems
  see this data", end-to-end message flow, data-governance / audit / GDPR
  reachability questions, or upstream-source vs downstream-consumer questions
  about a message contract.
---

# data-lineage

Answer *"where does this data come from, and where does it end up?"* from the **live catalog** —
real contracts, real directions, no guesses. The workflow: resolve the subject (a message contract
or a single field) → build the directed flow graph → extract fields from every contract on the
path → classify each field hop by confidence → write a lineage report with rendered SVGs.

Distinct from its two sibling skills — same catalog, different question:

| Skill | Question | Centre of gravity |
|---|---|---|
| `reuse-or-build` | Where can I **get** this data? | a decision, before you build |
| `impact-analysis` | What **breaks** if I change this? | a change, blast radius |
| **`data-lineage`** | Where does this data **come from / go to**? | provenance, audit, governance |

## Key facts

- **Data source**: the **MCP server** of the running Developer Hub. This is Developer Hub **1.19**
  (Backstage **1.51.0**), which exposes the catalog through `@backstage/plugin-mcp-actions-backend`
  at `http://localhost:7007/api/mcp-actions/v1`. The backend must be running (`yarn start`) and
  `tibco.mcpActions.enabled` must be `true` — see `MCP-TOOLS.md` in this skill set.
  Identical access rules to `.claude/skills/reuse-or-build/SKILL.md` — read that rather than
  duplicating it. In short: `catalog.query-catalog-entities` for a filtered scan (always with a
  `fields` projection, and naming `spec.definition` when you need the contracts), and
  `catalog.get-catalog-entity` for one entity in full. State which tools were used in the report's
  provenance section.
- **If MCP is unavailable**, fall back to the catalog REST API at
  `http://localhost:7007/api/catalog` — `GET /entities?filter=…`, `POST /entities/by-refs`,
  `GET /entities/by-name/{kind}/{ns}/{name}`. Anonymous in local guest mode; add
  `Authorization: Bearer <Backstage identity token>` only on a 401/403. Localhost curls need
  `dangerouslyDisableSandbox: true`.
- **`lineage.py` still applies.** It reads a one-off entity dump, so feed it the JSON from whichever
  transport you used — the helper does not care which produced it.

- **The graph is already directed — read the right half of each relation pair.** This is the whole
  trick, and what separates lineage from `impact-analysis`'s undirected walk:

  | Relation on a Component | Means | Direction |
  |---|---|---|
  | `providesApi` | the app **writes/publishes** that contract | data flows **out** |
  | `consumesApi` | the app **reads/subscribes** to it | data flows **in** |

  So a hop is always `API --consumed by--> Component --provides--> API`. Chaining that alternation
  is the lineage. The mirror relations (`apiProvidedBy` / `apiConsumedBy`) say the same thing from
  the contract's side — use whichever end you are standing on.

- **Sources and sinks are `Resource` entities, not APIs.** A component's `dependsOn` mixes two very
  different things and you must separate them:
  - `spec.type` in (`topic`, `queue`, `message-broker`) → **transport**. Not a lineage hop. Render
    it as an edge label or a lane; never as a node in the flow chain.
  - anything else (`sap-system`, database, …) → **system of record**. These are where lineage
    genuinely starts and ends. A component reading `sap-s4hana` and publishing a contract is an
    **origin**; one consuming a contract and writing to `sap-ariba` is a **sink**.

- **A contract with no `apiProvidedBy` is externally produced** — the data enters the landscape from
  outside (e.g. `sales-order-msg` arrives from SAP S/4HANA as an IDoc). Mark it as an ingress
  boundary, name the system of record from the *consumer's* `dependsOn`, and stop walking upstream.

- **`spec.definition` comes in two formats in this catalog** and both must be parsed:
  **JSON Schema** for native events and **XSD** for SAP IDoc contracts. They use different naming
  conventions (`materialNumber` vs `MaterialNumber` vs `Items.MaterialNumber`), so field matching
  must be normalised — and **every convention flip is itself a reportable mapping risk**, because
  it is where a hand-written transformation can silently drop or mistype a value.

- **The honest limit — contract-level, not implementation-level.** The catalog proves that a
  component consumes contract A and provides contract B. It does **not** prove how a field in B was
  computed from A; that mapping lives inside the BW6/Flogo process. So every field hop must be
  labelled with its confidence and the report must say so plainly. Never present an inferred
  transformation as a verified one.

### Field-hop confidence tiers

Used in every table and diagram. `lineage.py` emits exactly these labels.

| Tier | Meaning | Evidence |
|---|---|---|
| 🟢 **Carried** | Same field, same normalised name and type on both sides | Present in both `spec.definition`s |
| 🔵 **Renamed** | Carried, but the spelling/convention changed across the hop | Normalised match, raw spellings differ — flag as mapping risk |
| 🟡 **Derived** | Not carried verbatim; a plausible relative exists downstream | e.g. `quantity` → `availableQuantity`; transformation is **inferred**, inside the app |
| 🔵 **Originates** | Downstream has it, upstream does not — this component creates or enriches it | Field absent upstream; often sourced from the component's system of record |
| ⚪ **Dropped** | Upstream carries it, downstream does not | The path ends here for that field |

Raising 🟡/🔵 to *verified* requires reading the app's process files — only possible when the
component has a `backstage.io/source-location` annotation. Treat that as an optional deepening
step, and say in the report whether you did it.

### The helper — `lineage.py`

Ships with this skill. Handles the directed traversal and the dual-format field extraction so you
are not re-parsing XSD by hand each run. Dump the entities once, then query it.

```sh
SKILL=.claude/skills/data-lineage
# 1. dump the system's entities
curl -s "http://localhost:7007/api/catalog/entities?filter=spec.system=<system>\
&fields=kind,metadata.name,metadata.description,spec.type,spec.owner,spec.lifecycle,spec.definition,relations" \
  -o "$SCRATCH/hub.json"

python3 $SKILL/lineage.py graph  "$SCRATCH/hub.json"                    # reads/writes/SoR per app
python3 $SKILL/lineage.py fields "$SCRATCH/hub.json" --flat             # fields shared across contracts
python3 $SKILL/lineage.py trace  "$SCRATCH/hub.json" --field materialNumber
python3 $SKILL/lineage.py flow   "$SCRATCH/hub.json" --api api:default/inventory-update-msg \
                                                     --field materialNumber
python3 $SKILL/lineage.py path   "$SCRATCH/hub.json" --from api:default/sales-order-msg \
                                                     --to resource:default/sap-ariba
```

The tool is an accelerator, not the analysis. It cannot tell `derived` from coincidence, and it
knows nothing about business meaning — you still read the definitions and write the judgement.

## Workflow

### 1. Pin down the subject and the direction

Two modes; ask via `AskUserQuestion` if the request is ambiguous.

- **Message lineage** — subject is a contract (`api:default/<name>`). Produces the end-to-end flow
  of the whole payload.
- **Field lineage** — subject is one field (`materialNumber`, `PlannedGoodsIssueDate`). Produces
  the per-hop propagation of that single value, which is the version auditors actually want.

Also establish **direction** (upstream provenance / downstream reach / both — default both) and the
**boundary** (usually the `spec.system`; widen only if the user asks).

### 2. Build the directed flow graph

Dump the system's entities once, then `lineage.py graph`. For every Component record: what it
reads, what it writes, its systems of record, its owning team. Identify:

- **Origins** — components whose contracts have no internal producer upstream, or that read only
  from a system of record.
- **Sinks** — components whose output contract has no consumer, or that write to a system of record.
- **Fan-out points** — one contract with several consumers. These are where a single field starts
  travelling down divergent paths and where team boundaries usually get crossed.

### 3. Extract fields and walk the hops

`lineage.py fields --flat` gives the shared-field inventory; `flow --field` walks the hops applying
the confidence tiers. For each hop record: source contract, component, its system of record, owning
team, target contract, transport destination, field-in → field-out, tier.

Verify anything surprising by reading the actual `spec.definition` — the tool normalises names, so
a 🟢 Carried on two fields that merely *share a name* but differ in semantics or grain (e.g. a
`quantity` that is a delta upstream and a level downstream) is a false friend. Catching those is
the main thing you add over the script.

### 4. Note the governance findings

These are the non-obvious results, and the report is worth little without them:

- **Team hand-offs** — every point where the data crosses an `ownedBy` boundary. Count them; each
  is a place where a schema change needs a conversation.
- **Convention flips** — every 🔵 Renamed hop, especially JSON↔XSD boundaries.
- **Transformation blind spots** — every 🟡 Derived hop, i.e. where the catalog cannot tell you what
  happened to the value. List these explicitly as "unverifiable from the catalog".
- **Reachability** — for the field, which systems of record ultimately see it. This is the
  audit/GDPR answer: "does a value from SAP S/4HANA end up in SAP Ariba?"
- **Transport semantics** — a `topic` hop broadcasts (any new consumer can also see the field); a
  `queue` hop is point-to-point. A field crossing a topic has a wider potential exposure than the
  current consumer list suggests. Say so.

### 5. Write the report

Default output `reports/lineage-<slug>.md` (create `reports/` if missing; honour an explicit path).
Sections:

1. **Header** — subject, direction, system, date, data source/endpoints.
2. **Summary box** — the flow in one line (`A → B → C → D`), plus counts: hops, teams crossed,
   systems of record touched, unverifiable transformations. Reader wants the shape first.
3. **Confidence legend** — the tier table above.
4. **Diagrams** (§6) — rendered SVGs, never raw Mermaid fences.
5. **Hop table** — one row per hop: `#`, from-contract, via component (owner), to-contract,
   transport, field-in → field-out, tier, note. The heart of a field-lineage report.
6. **Origins & sinks** — where the data genuinely enters and leaves the landscape.
7. **Governance findings** — the §4 list, each with the concrete consequence.
8. **Open questions** — every 🟡 Derived hop as a question for the owning team, named.
9. **Provenance** — companion `reports/lineage-<slug>-data-snapshot.md` (or a shared one across a
   batch) with raw entities, definitions, and the queries used. Every claim traces to fetched data.

### 6. Diagrams — render to SVG, embed as images

Markdown viewers here do not render Mermaid fences — **always render SVGs** and embed with
`![...](images/<name>.svg)`. Produce two per report (three if teams matter to the question):

1. **End-to-end flow** (`flowchart LR`) — origin SoR → contracts and components alternating → sink
   SoR. Put the transport destination on the edge label (`t.inventory.updated`), never as a node.
   Tint by role: origin/sink vs contract vs component.
2. **Field propagation** (`flowchart LR` or `TD`) — the same spine, but each edge labelled with the
   field spelling on that hop, and nodes/edges tinted by confidence tier. This is the diagram that
   makes a renamed or derived hop obvious at a glance.
3. **Team hand-off** (optional, `flowchart LR` with subgraphs per team) — the chain grouped into
   owning teams, so every boundary crossing is visible.

Shared `classDef` block — confidence colours, consistent with the sibling skills:

```
classDef origin  fill:#bae0ff,stroke:#0958d9,color:#000000,stroke-width:2px;
classDef carried fill:#d9f7be,stroke:#389e0d,color:#000000,stroke-width:2px;
classDef renamed fill:#bae0ff,stroke:#0958d9,color:#000000,stroke-width:2px,stroke-dasharray:4 2;
classDef derived fill:#ffe7ba,stroke:#d46b08,color:#000000,stroke-width:1px,stroke-dasharray:5 3;
classDef dropped fill:#f0f0f0,stroke:#8c8c8c,color:#000000;
classDef sink    fill:#ffccc7,stroke:#cf1322,color:#000000,stroke-width:2px;
classDef comp    fill:#ffffff,stroke:#434343,color:#000000;
```

Rendering (`.mmd` sources to the scratchpad, SVGs to `reports/images/`):

```sh
cat > "$SCRATCH/puppeteer.json" <<'EOF'
{"executablePath": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "args": ["--headless=new"]}
EOF
npx -y @mermaid-js/mermaid-cli -i "$SCRATCH/<name>.mmd" -o reports/images/<name>.svg \
  -b transparent -p "$SCRATCH/puppeteer.json"
```

Run `npx` with `dangerouslyDisableSandbox: true` (the sandbox blocks the npm cache). If Chrome is
missing at that path, check `ls /Applications | grep -i chrom` and
`~/Library/Caches/ms-playwright/chromium*` before downloading one. Mermaid gotchas: safe node IDs
(alphanumeric/underscore), display names in quoted labels, `<br/>` for multiline, and **quote any
label containing a dot** (`"t.inventory.updated"`) or the parser will choke.

## Follow-ups to offer

- A 🟡 Derived hop on a field the user cares about → offer to read the component's source
  (`backstage.io/source-location`) and verify the mapping.
- The user is about to change a contract on the path → `/impact-analysis` on that contract.
- The user was looking for where to *get* the field rather than where it goes → `/reuse-or-build`.

## Reference implementation

The Skill Library ships complete worked examples over a `sap-integration-hub` catalog. With the
Marketplace entry installed, read them as TechDocs in the Hub at
`/docs/default/system/developer-hub-skill-library/lineage-index` and the reports it links
(`lineage-materialnumber`, `lineage-inventory-update-msg`, `lineage-quantity`,
`lineage-planned-gi-date`), plus `.../lineage-data-snapshot`. The sources are `docs/*.md` in the
Skill Library Marketplace entry — they are **not** in this checkout next to the skill —
read them for the expected depth, tier discipline, and diagram style before generating a new one.
