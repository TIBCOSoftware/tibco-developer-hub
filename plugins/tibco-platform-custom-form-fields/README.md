# tibco-platform-custom-form-fields

TIBCO Platform custom scaffolder field extensions for the Developer Hub.

## Overview

Provides custom form controls (scaffolder field extensions) that integrate with
the TIBCO Platform API backend (`scaffolder-backend-module-platform-api`) to
offer dynamic selectors for scaffolder templates.

## Field Extensions

| Extension Name                | `ui:field` Value     | Description                                                                                         |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `DataplaneSelectorExtension`  | `DataplaneSelector`  | Dropdown to select a TIBCO data-plane                                                               |
| `CapabilitySelectorExtension` | `CapabilitySelector` | Combined selector: filters dataplanes by required running capabilities and shows deployment details |

## Registration

In `packages/app/src/App.tsx`:

```tsx
import {
  DataplaneSelectorExtension,
  CapabilitySelectorExtension,
} from '@internal/plugin-tibco-platform-custom-form-fields';

<Route path="/create" element={<CustomScaffolderPage />}>
  <ScaffolderFieldExtensions>
    <DataplaneSelectorExtension />
    <CapabilitySelectorExtension />
  </ScaffolderFieldExtensions>
</Route>;
```

## CapabilitySelector — Combined Selector

The `CapabilitySelector` field extension combines dataplane selection,
capability filtering, and deployment details into a single form field. It:

1. Fetches all data-planes from the platform
2. Checks each data-plane's capability-instance status via the platform API
3. Filters to only dataplanes where **all** specified capabilities have `capabilityStatus: "green"`
4. Auto-selects the first matching dataplane
5. Pre-resolves and displays deployment URL and hostname (editable)

### YAML Configuration

```yaml
properties:
  deploymentTarget:
    title: Select Deployment Target
    type: object
    description: Select a data-plane with required capabilities
    ui:field: CapabilitySelector
    ui:options:
      requiredCapabilities:
        - FLOGO
        - BWCE # optional: add more capabilities to filter by
    properties:
      dataplaneId:
        type: string
      dataplaneName:
        type: string
      capabilityId:
        type: string
      capabilityName:
        type: string
      capabilityType:
        type: string
      dataplaneUrl:
        type: string
      dataplaneHost:
        type: string
```

### Emitted Value

The field emits an object with these properties:

| Property         | Type   | Description                                   |
| ---------------- | ------ | --------------------------------------------- |
| `dataplaneId`    | string | Selected data-plane ID                        |
| `dataplaneName`  | string | Selected data-plane display name              |
| `capabilityId`   | string | Primary capability instance ID for deployment |
| `capabilityName` | string | Primary capability name (e.g. `FLOGO`)        |
| `capabilityType` | string | Primary capability type (e.g. `PLATFORM`)     |
| `dataplaneUrl`   | string | Auto-resolved deployment base URL (editable)  |
| `dataplaneHost`  | string | Auto-resolved data-plane hostname (editable)  |

### Referencing in Template Steps

```yaml
steps:
  - id: deploy
    action: tibco:call-platform-api
    input:
      baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
      endpoint: 'public/v1/dp/builds'
```

### Primary Capability Selection

When multiple required capabilities are specified, the **first PLATFORM-type
capability** in the `requiredCapabilities` list is used for deployment URL
resolution. INFRA-type capabilities serve as filters only (the dataplane must
have them running, but they don't drive the deployment URL).

### Error States

| Condition                      | User Message                                                          |
| ------------------------------ | --------------------------------------------------------------------- |
| No matching dataplanes         | "No data-planes with the required capabilities (X, Y) are available." |
| API failure                    | Error message from the failed request                                 |
| Missing `requiredCapabilities` | "No required capabilities specified in template configuration."       |
