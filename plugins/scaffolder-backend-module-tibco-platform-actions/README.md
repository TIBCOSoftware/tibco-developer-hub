# scaffolder-backend-module-tibco-platform-actions

Custom scaffolder actions for the TIBCO Developer Hub.

## Overview

This Backstage backend module registers custom scaffolder template actions that
enable TIBCO-specific workflows: calling platform APIs with authentication,
fetching API definitions from the catalog, and writing files to the workspace.

## Registration

Add the module to `packages/backend/src/index.ts`:

```ts
backend.add(
  import('@internal/plugin-scaffolder-backend-module-tibco-platform-actions'),
);
```

---

## Actions

### `tibco:fetch-api-file`

Fetches an API definition from a Backstage catalog entity and writes it to a
file in the scaffolder workspace. Supports both `API` entities directly and
`Component` entities (resolved via their `providesApis` spec field).

#### Input

| Parameter          | Type     | Required | Default   | Description                                                                |
| ------------------ | -------- | -------- | --------- | -------------------------------------------------------------------------- |
| `name`             | `string` | ✅       | —         | Entity name (e.g. `my-api` or a full ref like `api:default/my-api`)        |
| `path`             | `string` | ✅       | —         | Workspace-relative path to write the definition to                         |
| `kind`             | `string` | ❌       | —         | Entity kind override (e.g. `API`, `Component`)                             |
| `namespace`        | `string` | ❌       | `default` | Entity namespace                                                           |
| `preferredApiType` | `string` | ❌       | —         | When a Component provides multiple APIs, prefer this type (e.g. `openapi`) |

#### Output

| Field          | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| `filePath`     | `string` | Absolute path to the written file    |
| `sourceEntity` | `string` | Stringified entity ref of the API    |
| `apiType`      | `string` | API type (e.g. `openapi`, `graphql`) |

#### Example

```yaml
steps:
  - id: fetch-api
    name: Fetch API Definition
    action: tibco:fetch-api-file
    input:
      name: my-rest-api
      path: api-definition.yaml

  - id: fetch-api-from-component
    name: Fetch OpenAPI from Component
    action: tibco:fetch-api-file
    input:
      name: my-service
      kind: Component
      path: openapi.yaml
      preferredApiType: openapi
```

---

### `tibco:call-platform-api`

Calls an external HTTP API with authentication. Supports JSON bodies, multipart
file uploads (`formData`), and URL-encoded payloads.

#### Base URL Resolution

The base URL is resolved in the following priority order:

| Priority | Source                           | Protocol used        |
| -------- | -------------------------------- | -------------------- |
| 1        | Input `baseUrl`                  | `https://` (default) |
| 2        | `CP_DOMAIN` environment variable | `http://` (internal) |
| 3        | `cpLink` from Backstage config   | `https://`           |

#### Authentication Token Resolution

| Priority | Source                                     |
| -------- | ------------------------------------------ |
| 1        | `cpToken` in action input                  |
| 2        | `cpToken` in template secrets              |
| 3        | `TIBCOPlatformToken` from Backstage config |

#### Input

| Parameter       | Type                             | Required | Default | Description                                                                |
| --------------- | -------------------------------- | -------- | ------- | -------------------------------------------------------------------------- |
| `endpoint`      | `string`                         | ✅       | —       | API endpoint path (e.g. `public/v1/dp/builds`)                             |
| `baseUrl`       | `string`                         | ❌       | config  | Base URL; falls back to `cpLink` config or `CP_DOMAIN` env var             |
| `method`        | `string`                         | ❌       | `GET`   | HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)                      |
| `body`          | `string \| object`               | ❌       | —       | Request body (JSON-serialised object or raw JSON string)                   |
| `filePath`      | `string`                         | ❌       | —       | Workspace-relative path to a file for `formData` upload or as request body |
| `fileMimeType`  | `string`                         | ❌       | auto    | MIME type of the file; auto-detected from extension when omitted           |
| `contentType`   | `json \| formData \| urlEncoded` | ❌       | `json`  | Request content type                                                       |
| `formFieldName` | `string`                         | ❌       | `file`  | Form field name used for the file when `contentType` is `formData`         |
| `headers`       | `object`                         | ❌       | —       | Additional HTTP headers                                                    |
| `requireAuth`   | `boolean`                        | ❌       | `true`  | Throw an error if no authentication token is found                         |
| `cpToken`       | `string`                         | ❌       | —       | Explicit auth token; takes priority over secrets and config                |

#### Output

| Field     | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `status`  | `number` | HTTP response status code           |
| `data`    | `any`    | Parsed JSON response body           |
| `headers` | `object` | Response headers                    |
| `baseUrl` | `string` | Resolved base URL used for the call |

#### Supported MIME Types (auto-detected from file extension)

`.zip`, `.gz`, `.tar`, `.tgz`, `.pdf`, `.txt`, `.csv`, `.html`, `.json`,
`.xml`, `.yaml`, `.yml`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.flogo`
→ `application/octet-stream` for unrecognised extensions.

#### Examples

```yaml
steps:
  # Simple GET
  - id: get-versions
    action: tibco:call-platform-api
    input:
      baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
      endpoint: public/v1/dp/flogoversions

  # POST JSON body
  - id: deploy
    action: tibco:call-platform-api
    input:
      baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
      endpoint: public/v1/dp/builds/${{ steps.build.output.data.buildId }}/deploy
      method: POST
      body:
        appName: ${{ parameters.app_name }}
        replicas: 1

  # Upload a ZIP file via formData
  - id: build
    action: tibco:call-platform-api
    input:
      baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
      endpoint: public/v1/dp/builds
      method: PUT
      filePath: build-output.zip
      contentType: formData
      formFieldName: buildZipFile
      headers:
        accept: application/json

  # Public endpoint (no auth required)
  - id: health-check
    action: tibco:call-platform-api
    input:
      baseUrl: https://api.example.com
      endpoint: health
      requireAuth: false
```

---

### `tibco:file:write`

Writes a string payload to a file in the scaffolder workspace.

#### Input

| Parameter           | Type      | Required | Default | Description                                |
| ------------------- | --------- | -------- | ------- | ------------------------------------------ |
| `filePath`          | `string`  | ✅       | —       | Workspace-relative path including filename |
| `content`           | `string`  | ✅       | —       | Content to write                           |
| `encoding`          | `string`  | ❌       | `utf8`  | File encoding                              |
| `overwrite`         | `boolean` | ❌       | `false` | Overwrite if file already exists           |
| `createDirectories` | `boolean` | ❌       | `true`  | Create parent directories automatically    |

#### Output

| Field      | Type     | Description                       |
| ---------- | -------- | --------------------------------- |
| `filePath` | `string` | Absolute path to the written file |
| `size`     | `number` | File size in bytes                |

#### Example

```yaml
steps:
  - id: write-config
    name: Write Config File
    action: tibco:file:write
    input:
      filePath: config/app.json
      content: ${{ parameters.app_config }}
      overwrite: true

  - id: build
    name: Upload and Build
    action: tibco:call-platform-api
    input:
      baseUrl: ${{ parameters.deploymentTarget.dataplaneUrl }}
      endpoint: public/v1/dp/builds
      method: PUT
      filePath: ${{ steps['write-config'].output.filePath }}
      contentType: formData
```

---

## Local Development Configuration

The following keys are read from Backstage configuration:

```yaml
# app-config.local.yaml
cpLink: 'https://cphost.cp1-my.localhost.dataplanes.pro'
TIBCOPlatformToken: '<your-bearer-token>'
```

| Key                  | Required | Description                                                      |
| -------------------- | -------- | ---------------------------------------------------------------- |
| `cpLink`             | Yes      | Default Control Plane base URL used by `tibco:call-platform-api` |
| `TIBCOPlatformToken` | Yes      | Static bearer token for local development                        |
