# Catalog Data Snapshot — `car-order-system`

> Raw relationships read live from the TIBCO Developer Hub catalog via the catalog REST API
> (`GET /api/catalog/entities/by-name/…`) on 2026-06-01. This is the source data behind
> [`car-information-api-impact-analysis.md`](./car-information-api-impact-analysis.md).

## Entities and relations

### API: `car-information-api` *(subject of the analysis)*
- type: `openapi` · lifecycle: `production` · owner: `operational-department` · system: `car-order-system`
- relations:
  - `apiProvidedBy` → `component:default/car-information-provider`
  - `apiConsumedBy` → `component:default/car-order-ui`
  - `ownedBy` → `group:default/operational-department`
  - `partOf` → `system:default/car-order-system`

### Component: `car-information-provider`
- type: `service` · owner: `operational-department`
- providesApis: `[car-information-api]` · consumesApis: `[car-details-api]` · dependsOn: `[cars-promotional-materials]`
- relations: `providesApi → car-information-api`, `consumesApi → car-details-api`, `dependsOn → cars-promotional-materials`, `ownedBy → operational-department`, `partOf → car-order-system`

### Component: `car-order-ui`
- type: `service` · owner: `operational-department`
- consumesApis: `[car-discount-api, car-information-api]`
- relations: `consumesApi → car-information-api`, `consumesApi → car-discount-api`, `ownedBy → operational-department`, `partOf → car-order-system`

### Component: `db-adapter`
- type: `service` · owner: `operational-department`
- providesApis: `[car-details-api]` · dependsOn: `[cars-database]`
- relations: `providesApi → car-details-api`, `dependsOn → cars-database`, `ownedBy → operational-department`, `partOf → car-order-system`

### Component: `discount-calculator`
- type: `service` · owner: `finance-department`
- providesApis: `[car-discount-api]` · consumesApis: `[car-details-api]`
- relations: `providesApi → car-discount-api`, `consumesApi → car-details-api`, `ownedBy → finance-department`, `partOf → car-order-system`

### Component: `car-analyzer`
- type: `service` · owner: `finance-department`
- dependsOn: `[cars-database, cars-promotional-materials]`
- relations: `dependsOn → cars-database`, `dependsOn → cars-promotional-materials`, `ownedBy → finance-department`, `partOf → car-order-system`

### System: `car-order-system`
- owner: `group:CarImporter` · domain: `cars`
- hasPart: `car-information-api`, `car-analyzer`, `car-information-provider`, `car-order-ui`, `db-adapter`, `discount-calculator`

## Derived adjacency (who touches `car-information-api`)

| Entity | Relationship to `car-information-api` | Distance | Tier |
|--------|----------------------------------------|----------|------|
| `car-information-provider` | provides (implements) | 1 | 🔴 direct |
| `car-order-ui` | consumes (calls) | 1 | 🔴 direct |
| `car-details-api` | consumed by the provider | 2 | 🟠 conditional |
| `db-adapter` | provides `car-details-api` | 3 | 🟠 conditional |
| `cars-promotional-materials` | dependsOn of the provider | 2 | 🟠 conditional |
| `discount-calculator` | co-consumer of `car-details-api` | 3 | 🟠 conditional (cross-team) |
| `car-discount-api` | sibling API on the UI | — | 🟢 none |
| `car-analyzer` | no path | — | 🟢 none |
| `cars-database` | behind `db-adapter` only | — | 🟢 none |
