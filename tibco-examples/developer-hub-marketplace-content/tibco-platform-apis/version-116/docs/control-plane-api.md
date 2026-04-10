# Control Plane API Changelog

Complete changelog for the TIBCO Platform Control Plane API from version 1.7 through 1.16.

---

## Version 1.7 to 1.8

This was the most significant transition, essentially a complete API redesign with a new URL structure standardized under `/cp/api/v1/`.

**Title changed:** `TIBCO Platform API - Direct` to `TIBCO Platform APIs`

**New Tags:** Apps, Capabilities, Data Planes, Resources

### New Endpoints (25)

| Method | Path | Description |
|---|---|---|
| `GET` | `/cp/api/v1/apps/{appId}` | Get app details by ID on a subscription |
| `GET` | `/cp/api/v1/capabilities/instances` | Get all capability instances details in a subscription |
| `POST` | `/cp/api/v1/data-planes/control-tower` | Register a control-tower data plane |
| `POST` | `/cp/api/v1/data-planes/k8s` | Register a k8s data plane |
| `GET` | `/cp/api/v1/data-planes/status` | Get Data Planes status |
| `DELETE` | `/cp/api/v1/data-planes/{dataPlaneId}` | Unregister a data plane |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}` | Get data plane details |
| `PUT` | `/cp/api/v1/data-planes/{dataPlaneId}` | Update data plane details (name, description, tags) |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/apps` | Get app details deployed on a data plane |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/capabilities-instances/status` | Get capabilities instances status |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/capabilities/instances` | Get all capability instances details in a data plane |
| `DELETE` | `/cp/api/v1/data-planes/{dataPlaneId}/capabilities/instances/{capabilityInstanceId}` | De-provision a capability instance |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/capabilities/instances/{capabilityInstanceId}` | Get capability instance details |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/capabilities/instances/{capabilityInstanceId}/status` | Get capability instance status |
| `POST` | `/cp/api/v1/data-planes/{dataPlaneId}/capabilities/{capabilityId}` | Provision a Capability |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/commands/{operation}` | Get Data Plane commands |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/resources/instances` | Get Data Plane Resource Instances |
| `DELETE` | `/cp/api/v1/data-planes/{dataPlaneId}/resources/instances/{resourceInstanceId}` | Delete Data Plane Resource Instance |
| `POST` | `/cp/api/v1/data-planes/{dataPlaneId}/resources/instances/{type}` | Create Data plane level resource instance |
| `GET` | `/cp/api/v1/data-planes/{dataPlaneId}/status` | Get Data Plane status |
| `GET` | `/cp/api/v1/resources/instances` | Get All Resource Instances |
| `DELETE` | `/cp/api/v1/resources/instances/{resourceInstanceId}` | Delete Resource Instance at subscription level |
| `GET` | `/cp/api/v1/resources/instances/{resourceInstanceId}` | Get Resource Instance details |
| `PUT` | `/cp/api/v1/resources/instances/{resourceInstanceId}` | Update resource instance |
| `POST` | `/cp/api/v1/resources/instances/{type}` | Create a subscription level resource instance |

### Removed Endpoints (16)

| Method | Path |
|---|---|
| `GET` | `/cp/api/v1/capability-instances` |
| `GET` | `/cp/api/v1/data-planes/{dp_id}` |
| `GET` | `/cp/api/v1/resource-instances` |
| `GET` | `/cp/v1/account/users` |
| `GET` | `/cp/v1/accounts/user/flat-permissions/{userEmail}` |
| `GET` | `/cp/v1/capabilities-metadata` |
| `POST` | `/cp/v1/data-planes` |
| `GET` | `/cp/v1/data-planes-status` |
| `DELETE` | `/cp/v1/data-planes/{DPId}` |
| `GET` | `/cp/v1/data-planes/{DPNamespace}/commands/delete` |
| `DELETE` | `/cp/v1/data-planes/{dpId}/capabilities/{capabilityInstanceId}` |
| `POST` | `/cp/v1/resource-instances` |
| `GET` | `/cp/v1/whoami` |
| `GET` | `/public/v1/oauth2/userinfo` |
| `GET` | `/tp-cp-ws/v1/data-planes/{dp_id}/app-details` |
| `GET` | `/tp-cp-ws/v1/resource-instances-details` |

### New Schemas (49)

Major new schemas introduced:

- **`AppDetails`** - 26 properties covering app metadata, capability info, and deployment details
- **`apiResponseDataPlaneDetails`** - 13 properties for data plane configuration
- **`registerControlTowerDataPlanePayload`** - 11 properties for registering control-tower data planes
- **`registerK8sDataPlanePayload`** - 11 properties for registering Kubernetes data planes
- **`tibcoHubCapabilityProvisionSchema`** - 6 properties for Developer Hub capability provisioning
- **`bwceCapabilityProvisionSchema`** - 6 properties for BWCE capability provisioning
- **`flogoCapabilityProvisionSchema`** - 4 properties for Flogo capability provisioning

Resource schemas: `resourceBWAgentSchema`, `resourceDatabaseConfigSchema`, `resourceHawkDomainSchema`, `resourceIngressControllerSchema`, `resourceMetricsServerExporterPrometheusSchema`, `resourceO11YV3Schema`, `resourceStorageClassSchema`

Observability schemas: `alertRuleSchema`, `elasticSearchSchema`, `kafkaSchema`, `otlpSchema`, `emailReceiverSchema`

### Removed Schemas (1)

- `Object`

### Modified Endpoints (4)

- `GET /cp/api/v1/apps` - summary, responses modified
- `GET /cp/api/v1/capabilities` - summary, responses, description modified
- `GET /cp/api/v1/data-planes` - summary, parameters, responses, description modified
- `GET /cp/api/v1/resources` - summary, responses, description modified

---

## Version 1.8 to 1.9

### Schema Changes

- **`bwceCapabilityProvisionSchema`**:
    - Added `auto-discovery-config` (type: `object`)
    - Added `auto-discovery-enabled` (type: `boolean`)

### Modified Endpoints (2)

- `POST /cp/api/v1/data-planes/{dataPlaneId}/capabilities/{capabilityId}` - request body modified
- `POST /cp/api/v1/data-planes/{dataPlaneId}/resources/instances/{type}` - request body modified

---

## Version 1.9 to 1.10

**Title changed:** `TIBCO Platform APIs` to `Control Plane APIs`

### New Endpoints (3)

| Method | Path | Description |
|---|---|---|
| `GET` | `/cp/api/v1/apps/{appId}/status` | Get app status from Monitoring |
| `POST` | `/cp/api/v1/data-planes/{dataPlaneId}/namespace` | Create and register a namespace |
| `PUT` | `/cp/api/v1/data-planes/{dataPlaneId}/resource-association` | Link resource instances to a Data Plane |

### New Schemas (6)

- **`activationServerSchema`** - 3 properties: description, name, url
- **`apiResponseAppStatus`** - 4 properties: id, instance, name, status
- **`apiResponseRegisterDataPlaneNamespace`** - 3 properties: context, response, status
- **`bw5ceCapabilityProvisionSchema`** - 4 properties for BW5 CE capability provisioning
- **`dataPlaneLinkResourcePayload`** - 3 properties: operation, resource-instance-id, resource-type
- **`registerDataPlaneNamespacePayload`** - 1 property: namespace

### Schema Changes

- **`alertRuleSchema`**: Added `severity` (type: `string`)
- **`apiResponseAppDetails`**: Added `status` (type: `string`)

### Modified Endpoints (7)

- `GET /cp/api/v1/apps` - parameters modified
- `GET /cp/api/v1/capabilities` - responses modified
- `GET /cp/api/v1/data-planes/{dataPlaneId}/apps` - parameters modified
- `POST /cp/api/v1/data-planes/{dataPlaneId}/capabilities/{capabilityId}` - parameters and request body modified
- `POST /cp/api/v1/data-planes/{dataPlaneId}/resources/instances/{type}` - parameters and request body modified
- `PUT /cp/api/v1/resources/instances/{resourceInstanceId}` - parameters and request body modified
- `POST /cp/api/v1/resources/instances/{type}` - parameters and request body modified

---

## Version 1.10 to 1.11

### New Endpoints (1)

| Method | Path | Description |
|---|---|---|
| `POST` | `/cp/api/v1/users-with-temp-passwords` | Add users to CP subscription |

**New Tags:** Users

### New Schemas (2)

- **`apiResponseAddUsersToSubscription`** - 3 properties: context, response, status
- **`userWithTempPasswordRequest`**

### Modified Endpoints (32)

All 32 existing endpoints received summary and description updates. This was a major documentation refresh across the entire API surface. Key changes:

- Summary text standardized across all endpoints
- Description text expanded with more detail
- Several endpoints received parameter modifications
- Data plane registration endpoints (`control-tower`, `k8s`) received response and request body updates
- Capability instance endpoints received parameter and response updates

---

## Version 1.11 to 1.12

### Schema Changes

- **`alertRuleSchema`**: Removed `enabled` field (was type: `boolean`)

### Modified Endpoints (1)

- `POST /cp/api/v1/data-planes/{dataPlaneId}/capabilities/{capabilityId}` - request body modified

---

## Version 1.12 to 1.13

### Modified Endpoints (2)

- `DELETE /cp/api/v1/data-planes/{dataPlaneId}/capabilities/instances/{capabilityInstanceId}` - parameters modified
- `GET /cp/api/v1/data-planes/{dataPlaneId}/commands/{operation}` - parameters modified

---

## Version 1.13 to 1.14

### Schema Changes

- **`bwceCapabilityProvisionSchema`**: Added `non-tokenized-properties-enabled` (type: `boolean`)

### Modified Endpoints (3)

- `POST /cp/api/v1/data-planes/{dataPlaneId}/capabilities/{capabilityId}` - request body modified
- `POST /cp/api/v1/data-planes/{dataPlaneId}/namespace` - summary changed, request body modified
- `POST /cp/api/v1/data-planes/{dataPlaneId}/resources/instances/{type}` - request body modified

---

## Version 1.14 to 1.15

### New Endpoints (2)

| Method | Path | Description |
|---|---|---|
| `POST` | `/idm/v1/oauth2/token` | OAuth2 Token endpoint |
| `POST` | `/idm/v1/oauth2/tokens/operations/revoke` | Revokes OAuth2 access-token |

**New Tags:** OAuth2

### New Schemas (5)

- **`AccessTokenResponse`** - 4 properties: access_token, expires_in, scope, token_type
- **`IdmError`** - 3 properties: contextAttributes, errorCode, errorMsg
- **`IdmMessage`** - 1 property: message
- **`OAuth2Client`** - 4 properties: client_id, client_secret, scope, token_endpoint_auth_method
- **`RevokeInitialAccessTokenRequest`** - 2 properties: comment, ids

### Schema Changes (6)

Gateway resource support added across all capability provisioning schemas:

- **`bw5ceCapabilityProvisionSchema`**: Added `gateway-resource-instance-id` (type: `string`)
- **`bwceCapabilityProvisionSchema`**: Added `gateway-resource-instance-id` (type: `string`)
- **`flogoCapabilityProvisionSchema`**: Added `gateway-resource-instance-id` (type: `string`)
- **`tibcoHubCapabilityProvisionSchema`**: Added `gateway-resource-instance-id` (type: `string`)

Data plane registration schemas updated:

- **`registerControlTowerDataPlanePayload`**: Added `connection-details` (type: `object`)
- **`registerK8sDataPlanePayload`**: Added `connection-details` (type: `object`)

### Modified Endpoints (1)

- `POST /cp/api/v1/data-planes/{dataPlaneId}/capabilities/{capabilityId}` - request body modified

---

## Version 1.15 to 1.16

No changes. Version bump only (1.15.0 to 1.16.0).
