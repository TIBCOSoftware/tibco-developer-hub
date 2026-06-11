# scaffolder-backend-module-platform-api

The `platform-api` backend module for the `scaffolder` plugin.

## Overview

This module provides direct server-to-server access to TIBCO Platform APIs
(data-planes, capabilities, apps, etc.) **without** routing through the
Backstage proxy. It is designed as an extensible backend module where new
platform endpoints can be added as additional route handlers.

## Endpoints

| Method | Path                                         | Description                                                                                         |
| ------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| GET    | `/platform/v1/data-planes`                   | Lists all available data-planes                                                                     |
| GET    | `/platform/v1/data-planes-with-capabilities` | Filtered list of data-planes by required running capabilities, with pre-resolved deployment details |

All routes are mounted under the scaffolder plugin namespace, so the full
URL is `/api/scaffolder/platform/v1/…`.

## Authentication

| Environment | Token Source                                                              |
| ----------- | ------------------------------------------------------------------------- |
| Production  | `idmJwtMiddleware` injects the CIC token into `req.headers.authorization` |
| Local dev   | Falls back to `TIBCOPlatformToken` from `app-config.local.yaml`           |

## Configuration

The module reads the following keys from Backstage configuration:

- **`cpLink`** (required) — Base URL of the TIBCO Control Plane (e.g. `https://cphost.cp1-my.localhost.dataplanes.pro`).
- **`TIBCOPlatformToken`** (optional) — Static bearer token for local development.

## Getting Started

The module is registered in `packages/backend/src/index.ts`:

```ts
backend.add(import('@internal/plugin-scaffolder-backend-module-platform-api'));
```
