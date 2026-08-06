# MCP tools — TIBCO Developer Hub 1.19

Developer Hub 1.19 (Backstage 1.51.0) ships `@backstage/plugin-mcp-actions-backend`, which exposes
the backend **Actions registry** as an MCP server. Every skill in this set prefers these tools over
hand-rolled REST calls: they are typed, they page for you, and they return the same data the Hub's
own UI reads.

This file is the shared reference. Individual skills name the specific tools they use.

## Endpoint

| | |
|---|---|
| Streamable HTTP | `http://localhost:7007/api/mcp-actions/v1` |
| SSE | `http://localhost:7007/api/mcp-actions/v1/sse` |
| Behind the platform | `/tibco/hub/api/mcp-actions/v1` |
| Server name | from `mcpActions.name` in `app-config.yaml` — TIBCO ships `TIBCO® Developer Hub` |

## Enabling it

**The MCP server is off by default.** `app-config.yaml` ships:

```yaml
tibco:
  mcpActions:
    enabled: false
```

Set it to `true` and restart the backend. Then register the server with your agent, e.g. for
Claude Code:

```sh
claude mcp add --transport http devhub http://localhost:7007/api/mcp-actions/v1
```

Confirm the tools are visible before relying on them. **If the server is not enabled, every skill in
this set still works** — each one carries a REST fallback for exactly this case. If you cannot enable
it, use the `developer-hub-118` skill set instead, which is REST-first throughout.

## The tools

Tool names are namespaced `<pluginId>.<action>` by default (`mcpActions.namespacedToolNames`,
default `true`). Drop the prefix if you have turned namespacing off.

### Catalog

| Tool | Use it for |
|---|---|
| `catalog.query-catalog-entities` | The workhorse. Predicate queries, field projection, sorting, full-text search, cursor pagination. |
| `catalog.get-catalog-entity` | One entity by `{ kind?, namespace?, name }` — `kind` and `namespace` are optional. |
| `catalog.get-catalog-model-description` | The catalog model as the server describes it — kinds, spec fields, relation names. Useful when you are unsure what to filter on. |
| `catalog.validate-entity` | Validate an entity before registering it. |
| `catalog.register-entity` | Register a location/entity. |
| `catalog.unregister-entity` | Remove one. Destructive — confirm with the user first. |

### Scaffolder

| Tool | Use it for |
|---|---|
| `scaffolder.dry-run-template` | `{ templateYaml, values, files: [{ path, content }] }` → `{ valid, message, … }`. Replaces the base64 + gzip POST to `/api/scaffolder/v2/dry-run`. |
| `scaffolder.execute-template` | `{ templateRef, values, secrets }` → `{ taskId }`. A real run. |
| `scaffolder.list-scaffolder-tasks` | Find a task you have lost the id for. |
| `scaffolder.get-scaffolder-task-logs` | `{ taskId, after? }` → `{ events: [{ id, taskId, createdAt, type, body }] }`. Poll with `after` to tail. |
| `scaffolder.list-scaffolder-actions` | Every action available to a template — the authoritative list of what you can write in `steps:`. |

## Query syntax

`catalog.query-catalog-entities` takes a **predicate** object, the same language as the
`POST /entities/by-query` endpoint added in Backstage 1.51. Dot-notation field paths:

```jsonc
{ "query": { "kind": "Component" } }
{ "query": { "kind": "Component", "spec.type": "service" } }

// value operators
{ "query": { "kind": { "$in": ["API", "Component"] } } }
{ "query": { "metadata.tags": { "$contains": "java" } } }
{ "query": { "metadata.name": { "$hasPrefix": "team-" } } }
{ "query": { "metadata.annotations.backstage.io/techdocs-ref": { "$exists": true } } }

// logical operators
{ "query": { "$all": [{ "kind": "Component" }, { "spec.lifecycle": "production" }] } }
{ "query": { "$any": [{ "spec.type": "service" }, { "spec.type": "website" }] } }
{ "query": { "$not": { "kind": "Group" } } }

// relations — everything owned by one group
{ "query": { "relations.ownedby": "group:default/team-alpha" } }
```

Other options, all optional:

```jsonc
{ "fields": ["kind", "metadata.name", "spec.owner"] }        // projection — use it, responses get big
{ "orderFields": { "field": "metadata.name", "order": "asc" } }
{ "fullTextFilter": { "term": "auth", "fields": ["metadata.name", "metadata.title"] } }
{ "limit": 20, "cursor": "<nextPageCursor from the previous response>" }
```

## Gotchas

- **Relation names in queries are lower-cased and unseparated** — `relations.ownedby`, not
  `relations.ownedBy`. The `relations` array on a *returned* entity keeps its normal camelCase
  (`ownedBy`, `apiConsumedBy`, …); only the query path is flattened.
- **Always pass `fields`** on a broad query. A full catalog dump with `spec.definition` on every API
  entity will bury the useful part of the response.
- **`spec.definition` is not returned unless you ask for it.** Skills that read API specifications
  (`api-version-diff`, `reuse-or-build`) must name it in `fields` explicitly.
- **Paginate.** `limit` plus the returned `nextPageCursor`; do not assume one call saw everything.
- **`catalog.unregister-entity` and `scaffolder.execute-template` have side effects.** Both carry
  destructive/non-idempotent hints. Summarise what will happen and get confirmation before calling
  them — the same rule the REST-based skills apply to a live task run.
- **MCP does not replace the platform APIs.** Self service flows talk to the TIBCO Control Plane;
  those calls are still plain HTTP against the platform, not MCP tools.
