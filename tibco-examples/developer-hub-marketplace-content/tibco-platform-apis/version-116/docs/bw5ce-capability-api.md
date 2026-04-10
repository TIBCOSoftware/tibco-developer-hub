# BW5 CE Capability API Changelog

Complete changelog for the TIBCO BusinessWorks 5 Container Edition (BW5 CE) Capability API. This API was first introduced in Platform version 1.10.

---

## Version 1.10 - Initial Release

The BW5 CE Capability API was introduced in Platform version 1.10, arriving with 51 endpoints and 63 schemas. Its structure closely mirrors the BWCE Capability API.

**Title:** TIBCO BusinessWorks(TM) 5 (Containers) Capability APIs

### Initial Endpoints (51)

#### Application Management

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/apps` | List all applications |
| `DELETE` | `/v1/dp/apps/{appId}` | Delete an Application |
| `PUT` | `/v1/dp/apps/{appId}` | Update Application configuration |
| `GET` | `/v1/dp/apps/{appId}/details` | Get an Application details |
| `GET` | `/v1/dp/apps/{appId}/instances` | Get Application instances |
| `PUT` | `/v1/dp/apps/{appId}/scale` | Scale an Application |
| `PUT` | `/v1/dp/apps/{appId}/servicemesh` | Enable or disable service mesh for an app |

#### Application Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/apps/{appId}/endpoints` | List Application endpoints |
| `DELETE` | `/v1/dp/apps/{appId}/endpoints/public` | Make an Application endpoint private |
| `POST` | `/v1/dp/apps/{appId}/endpoints/public` | Make an Application endpoint public |

#### Application Autoscaling

| Method | Path | Description |
|---|---|---|
| `DELETE` | `/v1/dp/apps/{appId}/autoscaling` | Remove autoscaling configuration |
| `PUT` | `/v1/dp/apps/{appId}/autoscaling` | Modify or Create autoscaling configuration |
| `DELETE` | `/v2/dp/apps/{appId}/autoscaling` | Remove autoscaling configuration (v2) |
| `PUT` | `/v2/dp/apps/{appId}/autoscaling` | Modify or Create autoscaling configuration (v2) |

#### Build Management

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/builds` | List all Application builds |
| `POST` | `/v1/dp/builds` | Create an Application build |
| `PUT` | `/v1/dp/builds` | Import an app build |
| `DELETE` | `/v1/dp/builds/{buildId}` | Delete an application build |
| `PUT` | `/v1/dp/builds/{buildId}` | Update an application build |
| `GET` | `/v1/dp/builds/{buildId}/apps` | List Application from Build Id |
| `GET` | `/v1/dp/builds/{buildId}/export` | Export an app build |
| `POST` | `/v1/dp/builds/{buildId}/rebuild` | Re-build an application |

#### Deployment

| Method | Path | Description |
|---|---|---|
| `POST` | `/v1/dp/deploy` | Deploy an application |
| `POST` | `/v2/dp/deploy/release` | Deploy an application Helm chart using values.yaml |

#### BW5 CE Versions

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/cp/bw5ceversions` | List BW5 Container Versions available on the control plane |
| `GET` | `/v1/dp/bw5ceversions` | List BW5 Container Versions provisioned on the dataplane |
| `DELETE` | `/v1/dp/bw5ceversions/{version}` | Delete BW5 Container from the dataplane |
| `POST` | `/v1/dp/bw5ceversions/{version}` | Provision BW5 Container on the dataplane |
| `DELETE` | `/v1/dp/bw5ceversions/{version}/baseimages/{baseimagetag}` | Delete BW5 Container Base image tag |
| `PUT` | `/v1/dp/bw5ceversions/{version}/tags` | Update BW5 Container Version tags |

#### Connectors & Supplements

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/cp/connectors` | List Connectors available on the control plane |
| `GET` | `/v1/dp/connectors` | List Connectors provisioned on the dataplane |
| `DELETE` | `/v1/dp/connectors/{connector}/{version}` | Delete Connector from the dataplane |
| `POST` | `/v1/dp/connectors/{connector}/{version}` | Provision Connector on the dataplane |
| `PUT` | `/v1/dp/connectors/{connector}/{version}/tags` | Update Connector tags |
| `GET` | `/v1/dp/supplements` | List Supplements provisioned |
| `DELETE` | `/v1/dp/supplements/{connector}` | Delete Connector supplement |
| `GET` | `/v1/dp/supplements/{connector}` | Export the Supplement |
| `POST` | `/v1/dp/supplements/{connector}` | Upload the Supplement |
| `PUT` | `/v1/dp/supplements/{connector}/tags` | Update Supplement tags |

#### Helm Release Management (v2)

| Method | Path | Description |
|---|---|---|
| `DELETE` | `/v2/dp/apps/{appId}/endpoints/public` | Make an Application endpoint private |
| `POST` | `/v2/dp/apps/{appId}/endpoints/public` | Make an Application endpoint public |
| `GET` | `/v2/dp/apps/{appId}/release/history` | Release history of an Application Chart Deployment |
| `PUT` | `/v2/dp/apps/{appId}/release/rollback` | Rollback an Application helm chart Release |
| `GET` | `/v2/dp/apps/{appId}/release/status` | Status of an Application Chart Deployment |
| `GET` | `/v2/dp/apps/{appId}/release/values` | Get helm chart values from BW5 Container app deployment |
| `PUT` | `/v2/dp/apps/{appId}/release/values` | Update helm chart values for BW5 Containers app chart |
| `PUT` | `/v2/dp/apps/{appId}/rename` | Rename an Application Chart Deployment |
| `PUT` | `/v2/dp/apps/{appId}/servicemesh` | Enable or disable service mesh for an app |
| `GET` | `/v2/dp/builds/{buildId}/values` | Generate values.yaml from an app Build |

#### Other

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/dp/namespaces` | List Namespaces from the dataplane |

### Initial Schemas (63)

Key schemas: `AppBuildRequest`, `AppBuildResponse`, `AppDeployRequest` (18 properties), `AppDetailsResponse` (24 properties), `AppEndpointsResponse`, `AppInfo` (11 properties), `AppInstancesResponse`, `AppListResponse`, `AppProperty`, `AppResponse`, `AppUpdateRequest`, `AutoscalingConfig`, `BaseImage`, `BuildContrib`, `BuildInfo` (6 properties), `BuildtypeCatalog` (5 properties), `CPBuildType`, `CPPlugin` (4 properties), `ConfigMapVolume`, `ConnectorCatalog` (5 properties), `ConnectorInfo`, `EgressNetworkPolicies` (6 properties), `EndpointInfo` (8 properties), `Error`, `HPACPUUtilization`, `HPAMemoryUtilization`, `HPAMetrics`, `IngressNetworkPolicies`, `IngressPortServicePathMapping`, `IngressTLSConfig`, `ListBuildResponse`, `ListBuildtypesResponse`, `ListConnectorResponse`, `ListSupplementResponse`, `MakePublicEndpointRequest` (6 properties), `NamespaceInfo`, `NetworkPolicies`, `PersistentVolumeClaim`, `PortMapping`, `ReleaseInfo` (11 properties), `ResourceLimitConfig`, `ResourceLimits`, `SecretVolume`, `ServiceInfo`, `SupplementCatalog` (7 properties), `Volume` (5 properties), `VolumeMount`, and others.

---

## Version 1.10 to 1.11

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.11 to 1.12

### Schema Changes

- **`EgressNetworkPolicies`**: Added `clusterEgress` (type: `string`)

---

## Version 1.12 to 1.13

### New Schemas (1)

- **`WsdlInfo`** - 2 properties: `resourceName`, `wsdlURL`

### Schema Changes

- **`EndpointInfo`**: Added `publicWsdlURLs` (type: `array` of `WsdlInfo`) - enables exposing WSDL URLs for BW5 web service endpoints

---

## Version 1.13 to 1.14

No significant changes. Minor cosmetic/formatting updates only.

---

## Version 1.14 to 1.15

### Schema Changes (3)

Gateway support added to endpoint and public endpoint schemas:

- **`AppDeployRequest`**: Removed `enableExecutionHistory` (was type: `boolean`)
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
- `POST /v2/dp/apps/{appId}/endpoints/public` - request body and description modified

---

## Version 1.15 to 1.16

### New Endpoints (1)

| Method | Path | Description |
|---|---|---|
| `PUT` | `/v1/dp/bw5ceversions/{version}/custombaseimage` | Add Custom BusinessWorks 5 (Containers) Base Image. The custom container image must be present on the Container Image Registry before invoking this API. |

### Schema Changes (3)

Connector catalog metadata enrichment and endpoint info update:

- **`CPPlugin`**:
    - Added `description` (type: `string`)
    - Added `displayVersion` (type: `string`)
    - Added `docLink` (type: `string`)
    - Added `endOfSupportDate` (type: `string`)
    - Added `releaseDate` (type: `string`)
    - Added `supportedBWVersions` (type: `string`)
- **`ConnectorCatalog`**:
    - Added `displayVersion` (type: `string`)
    - Added `endOfSupportDate` (type: `string`)
    - Added `releaseDate` (type: `string`)
    - Added `supportedBWVersions` (type: `string`)
    - Added `version` (type: `string`)
- **`EndpointInfo`**:
    - Removed `publicSwaggerURL` (was type: `string`)

### Modified Endpoints (2)

- `GET /v1/dp/apps/{appId}/details` - responses modified (array to single object for AppDetailsResponse)
- `GET /v1/dp/apps/{appId}/endpoints` - responses modified (array to single object for AppEndpointsResponse)
