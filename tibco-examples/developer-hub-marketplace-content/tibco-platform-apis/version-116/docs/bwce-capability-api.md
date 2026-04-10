# BWCE Capability API Changelog

Complete changelog for the TIBCO BusinessWorks Container Edition (BWCE) Capability API from version 1.7 through 1.16.

---

## Version 1.7 to 1.8

### New Endpoints (3)

| Method | Path | Description |
|---|---|---|
| `GET` | `/v2/bwce/apps/{appName}/instances` | Get Autodiscovered BWCE Application instances |
| `GET` | `/v2/bwce/apps/{appName}/release/status` | Status of Autodiscovered BWCE Application Chart Deployment |
| `GET` | `/v2/bwce/apps/{appName}/release/values` | Get helm chart values from Autodiscovered BWCE app deployment |

---

## Version 1.8 to 1.9

### New Endpoints (1)

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/supplements/{connector}` | Export the Supplement |

---

## Version 1.9 to 1.10

**Title changed:** `TIBCO BusinessWorks(TM) Container Edition Capability APIs` to `TIBCO BusinessWorks(TM) 6 (Containers) Capability APIs`

**Description changed:** Updated from "TIBCO BusinessWorks(TM) Container Edition" to "TIBCO BusinessWorks(TM) 6 (Containers)" terminology throughout.

### Modified Endpoints (17)

Major documentation refresh across the API, with summary and description updates reflecting the product rename:

- `GET /v1/cp/bwceversions` - summary and description changed
- `GET /v1/dp/apps` - description changed
- `POST /v1/dp/builds` - parameters and description modified
- `PUT /v1/dp/builds` - parameters modified
- `POST /v1/dp/builds/{buildId}/rebuild` - parameters and description modified
- `GET /v1/dp/bwceversions` - summary and description changed
- `DELETE /v1/dp/bwceversions/{version}` - summary, parameters, description modified
- `POST /v1/dp/bwceversions/{version}` - summary, parameters, description modified
- `DELETE /v1/dp/bwceversions/{version}/baseimages/{baseimagetag}` - summary, parameters, description modified
- `PUT /v1/dp/bwceversions/{version}/custombaseimage` - summary, parameters, request body, description modified
- `PUT /v1/dp/bwceversions/{version}/tags` - summary, parameters, request body, description modified
- `GET /v2/bwce/apps/{appName}/instances` - summary and description changed
- `GET /v2/bwce/apps/{appName}/release/status` - summary and description changed
- `GET /v2/bwce/apps/{appName}/release/values` - summary and description changed
- `GET /v2/dp/apps/{appId}/release/values` - summary and description changed
- `PUT /v2/dp/apps/{appId}/release/values` - summary and description changed
- `POST /v2/dp/deploy/release` - parameters modified

---

## Version 1.10 to 1.11

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.11 to 1.12

### Schema Changes

- **`EgressNetworkPolicies`**: Added `clusterEgress` (type: `string`)

---

## Version 1.12 to 1.13

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.13 to 1.14

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.14 to 1.15

### Schema Changes (2)

Gateway support added to endpoint and public endpoint schemas:

- **`AppEndpointsResponse`**:
    - Added `gatewayControllerName` (type: `string`)
    - Added `gatewayName` (type: `string`)
    - Added `gatewayNamespace` (type: `string`)
    - Added `gatewaySectionName` (type: `string`)
    - Added `resourceInstanceName` (type: `string`)
- **`MakePublicEndpointRequest`**:
    - Added `gatewayControllerName` (type: `string`)
    - Added `gatewayHostName` (type: `string`)
    - Added `gatewayName` (type: `string`)
    - Added `gatewayNamespace` (type: `string`)
    - Added `gatewaySectionName` (type: `string`)
    - Added `resourceInstanceName` (type: `string`)

### Modified Endpoints (5)

- `GET /v1/dp/apps/{appId}/endpoints` - description changed
- `DELETE /v1/dp/apps/{appId}/endpoints/public` - description changed
- `POST /v1/dp/apps/{appId}/endpoints/public` - request body and description modified
- `DELETE /v2/dp/apps/{appId}/endpoints/public` - description changed
- `POST /v2/dp/apps/{appId}/endpoints/public` - summary, request body, and description modified

---

## Version 1.15 to 1.16

### Schema Changes (3)

Connector catalog metadata enrichment:

- **`CPPlugin`**:
    - Added `description` (type: `string`)
    - Added `displayVersion` (type: `string`)
    - Added `docLink` (type: `string`)
    - Added `endOfSupportDate` (type: `string`)
    - Added `releaseDate` (type: `string`)
    - Added `supportedBWCEVersions` (type: `string`)
    - Added `supportedBWVersions` (type: `string`)
- **`ConnectorCatalog`**:
    - Added `displayVersion` (type: `string`)
    - Added `endOfSupportDate` (type: `string`)
    - Added `releaseDate` (type: `string`)
    - Added `supportedBWCEVersions` (type: `string`)
    - Added `supportedBWVersions` (type: `string`)
    - Added `version` (type: `string`)
- **`EndpointInfo`**:
    - Added `publicSwaggerJsonURL` (type: `string`)

### Modified Endpoints (2)

- `GET /v1/dp/apps/{appId}/details` - responses modified (array to single object for AppDetailsResponse)
- `GET /v1/dp/apps/{appId}/endpoints` - responses modified (array to single object for AppEndpointsResponse)
