# Smart Routing

A configurable, database-driven document router for TIBCO integrations. Smart Routing reads a SQL Server catalog at runtime to decide where each incoming document should go, applies a per-route JOLT JSON-to-JSON transformation, and dispatches the result to one or more downstream systems with per-system timeout and retry settings.

Contributed by **Federico Preiato** to the TIBCO Hackathon. Source repository: <https://github.com/FPreiato2024/TIBCO-SmartRouting>.

---

## What it does

You publish a document of a given **DocumentType** (e.g. `PurchaseOrder`, `Delivery`) into the routing application. Smart Routing then:

1. Looks up matching rows in `SmartRouting.Documents` for that DocumentType.
2. For each enabled target system, applies the configured JOLT spec to reshape the payload.
3. Resolves the target host/port/protocol/credentials from `SmartRouting.SystemInfo`.
4. Dispatches the transformed document to the target endpoint with the per-route timeout and retry policy.

The `SmartRouting.SourceSystem` table optionally lets you pre-normalize incoming payloads before the route-specific transformation runs &mdash; useful when the same DocumentType arrives in different shapes from different upstream systems.

Adding a new system or new document route is a database insert &mdash; no integration code changes required.

---

## Database schema

The `Database-Configuration/` folder ships two SQL scripts (SQL Server T-SQL):

- **`SmartRouting.sql`** &mdash; creates the `SmartRouting` schema, a dedicated `SmartUser` login, and the three tables below.
- **`data-example.sql`** &mdash; seeds the catalog with sample routes covering `PurchaseOrder` and `Delivery` document types against the public `jsonplaceholder.typicode.com` API.

### `SmartRouting.SystemInfo`

Connection details for every downstream system:

| Column | Notes |
|---|---|
| `SystemName` | Logical name referenced by `Documents.SystemName` |
| `Protocol`, `Hostname`, `Port` | HTTP/HTTPS/FTP target |
| `Timeout`, `Retry` | System-wide defaults (overridable per route) |
| `Username`, `Password` | Optional basic-auth credentials |

### `SmartRouting.Documents`

One row per (DocumentType, SystemName) routing rule:

| Column | Notes |
|---|---|
| `DocumentType` | Logical document class (e.g. `PurchaseOrder`) |
| `SystemName` | FK-style reference into `SystemInfo` |
| `Endpoint` | URL path appended to the system's base URL |
| `JoltSpecification` | JOLT spec applied to the inbound document before sending |
| `Timeout`, `Retry` | Route-level overrides |
| `Enabled` | Toggle a route on/off without deleting the row |

### `SmartRouting.SourceSystem`

Optional pre-normalization rules:

| Column | Notes |
|---|---|
| `DocumentType`, `SystemName` | Identifies the upstream source |
| `JoltSpecification` | Normalizes the source's payload into the canonical document shape |
| `Enabled` | Toggle the source on/off |

---

## Getting started

1. Create a SQL Server (or Azure SQL) database for the routing catalog.
2. Run `database-configuration/SmartRouting.sql` to create the schema, login, and tables.
3. Run `database-configuration/data-example.sql` to seed example routes (or write your own).
4. Clone the integration source from the [TIBCO-SmartRouting GitHub repo](https://github.com/FPreiato2024/TIBCO-SmartRouting), point its database connection at your catalog, and build/deploy.

The shipped example seeds two SAP-style `PurchaseOrder` routes and one disabled `Delivery` route &mdash; flipping `Enabled` from `0` to `1` brings the disabled route online without redeploying the application.

---

## Reference assets

| Asset | Purpose |
|---|---|
| `database-configuration/SmartRouting.sql` | Schema + user + tables |
| `database-configuration/data-example.sql` | Sample routing data |
| `SmartRouting-Presentation.pdf` | Hackathon presentation slides |

For the integration source (TIBCO project), see the upstream GitHub repo linked above.
