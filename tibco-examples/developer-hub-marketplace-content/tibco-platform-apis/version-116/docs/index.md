# TIBCO Platform APIs 1.16 - Changelog

This document provides a comprehensive changelog of the TIBCO Platform APIs across all versions, from 1.7 through the current release 1.16. Use the navigation to view detailed changes for each individual API.

## API Overview

The TIBCO Platform exposes four main API categories:

- **Control Plane API (Platform)** - Core platform management: data planes, capabilities, resources, apps, and users
- **BWCE Capability API** - TIBCO BusinessWorks 6 (Containers) capability management on data planes
- **BW5 CE Capability API** - TIBCO BusinessWorks 5 (Containers) capability management (introduced in 1.10)
- **Flogo Capability API** - TIBCO Flogo capability management on data planes

## API Version Summary

| Platform Version | Control Plane | BWCE Capability | BW5 CE Capability | Flogo Capability |
|---|---|---|---|---|
| 1.7 | 1.0 | 1.7.0 | N/A | 1.7.0 |
| 1.8 | 1.0 | 1.8.0 | N/A | 1.8.0 |
| 1.9 | 1.0 | 1.9.0 | N/A | 1.9.0 |
| 1.10 | 1.10.0 | 1.10.0 | 1.10.0 | 1.10.0 |
| 1.11 | 1.11.0 | 1.11.0 | 1.11.0 | 1.11.0 |
| 1.12 | 1.12.0 | 1.12.0 | 1.12.0 | 1.12.0 |
| 1.13 | 1.13.0 | 1.13.0 | 1.13.0 | 1.13.0 |
| 1.14 | 1.14.0 | 1.14.0 | 1.14.0 | 1.14.0 |
| 1.15 | 1.15.0 | 1.15.0 | 1.15.0 | 1.15.0 |
| 1.16 | 1.16.0 | 1.16.0 | 1.16.0 | 1.16.0 |

## Endpoint Count per Version

| Platform Version | Control Plane | BWCE | BW5 CE | Flogo |
|---|---|---|---|---|
| 1.7 | 20 | 63 | N/A | 47 |
| 1.8 | 29 | 66 | N/A | 48 |
| 1.9 | 29 | 67 | N/A | 48 |
| 1.10 | 32 | 67 | 51 | 50 |
| 1.11 | 33 | 67 | 51 | 50 |
| 1.12 | 33 | 67 | 51 | 51 |
| 1.13 | 33 | 67 | 51 | 51 |
| 1.14 | 33 | 67 | 51 | 52 |
| 1.15 | 35 | 67 | 51 | 52 |
| 1.16 | 35 | 67 | 52 | 52 |

## Schema Count per Version

| Platform Version | Control Plane | BWCE | BW5 CE | Flogo |
|---|---|---|---|---|
| 1.7 | 1 | 63 | N/A | 42 |
| 1.8 | 49 | 63 | N/A | 42 |
| 1.9 | 49 | 63 | N/A | 42 |
| 1.10 | 55 | 63 | 63 | 44 |
| 1.11 | 57 | 63 | 63 | 44 |
| 1.12 | 57 | 63 | 63 | 45 |
| 1.13 | 57 | 63 | 64 | 45 |
| 1.14 | 57 | 63 | 64 | 45 |
| 1.15 | 62 | 63 | 64 | 45 |
| 1.16 | 62 | 63 | 64 | 45 |

## API First Appearance

| API | First Appeared In |
|---|---|
| Control Plane API | 1.7 (earliest version tracked) |
| BWCE Capability API | 1.7 (earliest version tracked) |
| BW5 CE Capability API | **1.10** |
| Flogo Capability API | 1.7 (earliest version tracked) |

## Key Highlights

- **Version 1.7 to 1.8** was the biggest transition for the Control Plane API, essentially a complete API redesign: 16 old endpoints removed, 25 new ones added, 49 new schemas introduced, and the URL structure was standardized under `/cp/api/v1/`.
- **Version 1.10** introduced the **BW5 CE Capability API** with 51 endpoints and 63 schemas, closely mirroring the BWCE API structure.
- **Version 1.15** was the second most significant release, introducing OAuth2 endpoints (`/idm/v1/oauth2/token` and revoke), gateway resource support across all capability provisioning schemas, and gateway-related schema fields across all three capability APIs.
- **Version 1.16** focused on connector catalog metadata fields (`displayVersion`, `endOfSupportDate`, `releaseDate`, etc.) in BWCE and BW5 CE APIs, and added a new custom base image endpoint for BW5 CE.
