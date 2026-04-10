# Flogo Capability API Changelog

Complete changelog for the TIBCO Flogo Capability API from version 1.7 through 1.16.

---

## Version 1.7 to 1.8

### New Endpoints (1)

| Method | Path | Description |
|---|---|---|
| `GET` | `/v2/dp/apps/{appId}/release/history` | Release history of an Application Chart Deployment |

### Schema Changes

- **`AppResponse`**:
    - Added `deployedAppName` (type: `string`)
    - Added `userAppName` (type: `string`)

---

## Version 1.8 to 1.9

### Schema Changes

- **`AppDetailsResponse`**:
    - Added `buildAuthor` (type: `string`)
    - Added `buildName` (type: `string`)

---

## Version 1.9 to 1.10

### New Endpoints (2)

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/apps/{appId}/instances` | Get app instances |
| `GET` | `/v1/dp/builds/{buildId}/info` | Get detailed info about the build |

### New Schemas (2)

- **`AppInstancesResponse`** - 4 properties: `instanceName`, `namespace`, `podIP`, `status`
- **`BuildInfoForListBuilds`** - 8 properties: `buildId`, `connectorsUsed`, `createdBy`, `createdDate`, `flogoBaseVersion`, `name`, `nonDPBuild`, `tags`

### Schema Changes

Major restructuring of the `BuildInfo` schema:

- **`BuildInfo`**:
    - Added: `appDescription`, `appName`, `appType`, `appVersion`, `author`, `baseDeployment` (object), `buildName`, `contribMap`, `contribs` (array), `created` (integer), `dataPlaneId`, `enableServiceMesh` (boolean), `flogoApp` (object), `instanceId`, `portMappings` (array), `status` (object), `systemProperties` (array), `userContribs` (array)
    - Removed: `connectorsUsed` (array), `createdBy` (string), `createdDate` (integer), `flogoBaseVersion` (string), `name` (string)

The removed fields from `BuildInfo` were moved to the new `BuildInfoForListBuilds` schema, indicating a separation of concerns between detailed build info and list views.

---

## Version 1.10 to 1.11

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.11 to 1.12

### New Endpoints (1)

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/namespaces` | List Namespaces from the dataplane |

### New Schemas (1)

- **`NamespaceInfo`** - 1 property: `namespace`

---

## Version 1.12 to 1.13

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.13 to 1.14

### New Endpoints (1)

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/builds/{buildId}/status` | Get build status |

### Modified Endpoints (1)

- `POST /v1/dp/builds` - responses modified

---

## Version 1.14 to 1.15

### Schema Changes (3)

Gateway support and network policy updates:

- **`AppEndpointsResponse`**:
    - Added `gatewayControllerName` (type: `string`)
    - Added `gatewayName` (type: `string`)
    - Added `gatewayNamespace` (type: `string`)
    - Added `gatewaySectionName` (type: `string`)
    - Added `resourceInstanceName` (type: `string`)
- **`EgressNetworkPolicies`**:
    - Added `clusterEgress` (type: `string`)
    - Added `databaseEgress` (type: `string`)
    - Added `msgInfra` (type: `string`)
    - Added `proxyEgress` (type: `string`)
    - Added `userApps` (type: `string`)
- **`MakePublicEndpointRequest`**:
    - Added `gatewayControllerName` (type: `string`)
    - Added `gatewayHostName` (type: `string`)
    - Added `gatewayName` (type: `string`)
    - Added `gatewayNamespace` (type: `string`)
    - Added `gatewaySectionName` (type: `string`)
    - Added `resourceInstanceName` (type: `string`)

### Modified Endpoints (7)

- `GET /v1/dp/apps` - parameters modified
- `GET /v1/dp/apps/{appId}/endpoints` - summary and description changed
- `DELETE /v1/dp/apps/{appId}/endpoints/public` - summary and description changed
- `POST /v1/dp/apps/{appId}/endpoints/public` - summary, request body, and description modified
- `POST /v1/dp/builds` - parameters modified
- `DELETE /v2/dp/apps/{appId}/endpoints/public` - summary and description changed
- `POST /v2/dp/apps/{appId}/endpoints/public` - summary, request body, and description modified

---

## Version 1.15 to 1.16

### Modified Endpoints (1)

- `POST /v1/dp/builds` - request body modified: added optional `request` payload with the following structure:
    - `buildName` (type: `string`) - e.g., `"my-app-build"`
    - `dependencies` (type: `array`) - list of objects with `id`, `name`, and `version` fields
    - `tags` (type: `array`) - list of string tags
