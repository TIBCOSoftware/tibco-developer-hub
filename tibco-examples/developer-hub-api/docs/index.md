# Backstage Catalog API — changes from 1.41.1 to 1.51.0

Comparison of `backstage-api.yaml` (the spec shipped with Backstage 1.41.1) against
`backstage-151-api.yaml` (regenerated for Backstage 1.51.0).

## Summary

No operations, parameters, or schemas were **removed**. Every change is additive
except the OpenAPI dialect bump, which rewrites how nullable types are expressed.

| Area | Change |
| --- | --- |
| Spec dialect | `3.0.3` → `3.1.0` |
| Operations | 4 added (16 → 20) |
| Query parameters | 2 added |
| Schemas | 1 added, 2 modified |

## 1. OpenAPI dialect: 3.0.3 → 3.1.0

This is the only change that can break a consumer. OpenAPI 3.1 drops the 3.0
`nullable: true` keyword in favour of a real `"null"` type, so two schemas are
expressed differently even though their meaning is unchanged:

**`NullableEntity`** — was a plain object with `nullable` semantics, now an `anyOf`:

```yaml
# before (3.0.3)
NullableEntity:
  type: object
  properties: { ... }
  required: [metadata, kind, apiVersion]

# after (3.1.0)
NullableEntity:
  anyOf:
    - type: object
      properties: { ... }
      required: [metadata, kind, apiVersion]
    - type: "null"
```

**`AnalyzeLocationEntityField.value`** — same pattern via `oneOf`:

```yaml
# before             # after
type: string         oneOf:
nullable: true         - type: string
                       - type: "null"
```

Backstage's own API-docs plugin (swagger-ui-react) renders 3.1 fine. Any older
validator or codegen in the pipeline that only speaks 3.0 will need checking.

## 2. New operations

### `POST /entities/by-query` — `QueryEntitiesByPredicate`

Request-body twin of the existing `GET /entities/by-query`. Exists because complex
filters exceed practical URL length limits. Optional JSON body:

| Field | Type | Notes |
| --- | --- | --- |
| `cursor` | string | cursor pagination |
| `limit` | number | |
| `offset` | number | |
| `orderBy` | array of `{ field, order: asc\|desc }` | multi-field sorting |
| `fullTextFilter` | `{ term, fields[] }` | free-text search |
| `fields` | string[] | response field projection |
| `totalItems` | `include` \| `exclude` | skip the (expensive) count; defaults to `include` |
| `query` | `JsonObject` | structured filter predicate |

Returns `EntitiesQueryResponse`, same as the GET form.

### `POST /entity-facets` — `QueryEntityFacetsByPredicate`

Request-body twin of `GET /entity-facets`. Required body:

```yaml
facets: [string]     # required
query:  JsonObject   # optional structured filter predicate
```

Returns `EntityFacetsResponse`.

### `POST /locations/by-query` — `GetLocationsByQuery`

New paginated/filterable listing of locations, alongside the unpaginated
`GET /locations`. Optional body:

```yaml
cursor: string
limit:  number
query:  JsonObject
```

Returns the new `LocationsQueryResponse` schema (see below).

### `PUT /locations/{id}` — `UpdateLocation`

Locations were previously create/read/delete only; they can now be updated in
place. Takes a `LocationInput` body (required), returns `200` with the updated
`Location`.

## 3. New query parameters

### `totalItems` on `GET /entities/by-query`

New shared component `#/components/parameters/totalItems`:

```yaml
name: totalItems
in: query
schema: { type: string, enum: [include, exclude] }
```

Controls whether `totalItems` is computed in the response. Computing the total is
expensive on large catalogs; pass `exclude` when the caller only needs the page
(e.g. cursor-paginated UIs showing the count cosmetically). Defaults to `include`.
Upstream notes that further values, such as an approximate mode, may be added later.

### `onConflict` on `POST /locations`

```yaml
name: onConflict
in: query
schema: { type: string, enum: [refresh, reject] }
```

Behaviour when the location already exists. `reject` (the default, and the previous
hardcoded behaviour) returns `409`. `refresh` triggers a refresh of the existing
location entity and returns `201`. This makes location registration idempotent
without a read-then-write round trip.

## 4. Schema changes

### Added: `LocationsQueryResponse`

Response envelope for `POST /locations/by-query`:

```yaml
LocationsQueryResponse:
  type: object
  required: [items, totalItems, pageInfo]
  additionalProperties: false
  properties:
    items:      { type: array, items: { $ref: '#/components/schemas/Location' } }
    totalItems: { type: number }
    pageInfo:
      type: object
      properties:
        nextCursor: { type: string, description: cursor for the next batch }
```

### Modified: `Location` — new required property `entityRef`

```yaml
entityRef:
  type: string
  description: >-
    The entity ref of the corresponding Location kind entity,
    e.g. location:default/generated-<sha1hex>.
```

**This is the one change worth watching.** `entityRef` was added to `required`
(now `[target, type, id, entityRef]`). Any client that constructs a `Location`
object for validation against this schema — as opposed to only consuming responses
from the server — will fail validation until it supplies the field.

### Modified: `NullableEntity`

Restructured for the 3.1 dialect only — see section 1. Semantics unchanged.

## 5. Documentation-only changes

The `info.description` text was updated upstream and differs cosmetically:

- The note about the page being a work in progress is now a Docusaurus admonition
  (`:::note ... :::`) rather than a Markdown blockquote.
- The `identityApiRef` link moved from
  `backstage.io/docs/reference/core-plugin-api.identityapiref` to
  `backstage.io/api/stable/variables/_backstage_core-plugin-api.in...`.

## Unchanged

For the record, these were verified identical between the two specs:

- All 16 pre-existing operations, with the same `operationId`s and response codes.
- `GET /entities` parameters (`fields`, `limit`, `filter`, `offset`, `after`, `order`).
- `GET /entities/by-query` parameters other than the added `totalItems` — including
  `fullTextFilterTerm` and `fullTextFilterFields`, which were already present in 1.41.
- The other 22 schemas.
- `components.securitySchemes.JWT` (HTTP bearer).
