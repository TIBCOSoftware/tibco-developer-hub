# Custom Log Palette

A Flogo extension that provides custom logging activities with a structured log format. The palette includes three activities for structured logging in flows, supporting configurable headers, context parameters, and text or JSON output.

- **License:** [LICENSE](LICENSE) (MIT)  
- **Short description:** [SHORT_DESCRIPTION.md](SHORT_DESCRIPTION.md)  
- **Third-party licenses:** [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES)

---

## Project Overview

### What It Contains

This project is a **Flogo connector** (a group of related activities) that extends the Flogo palette with custom logging capabilities. All activities output logs in a custom structured format, suitable for integration with TIBCO logging infrastructures.

### Activities

| Activity | Ref / Name | Description |
|----------|------------|-------------|
| **Set and Log Message** | `tibco-set-and-log` | Sets flow-scoped context (headers, context params) and logs a message. Must typically run first to populate `customFlowInfo` used by other log activities. Supports all log levels (INFO, WARN, ERROR, DEBUG). |
| **Custom Log Message** | `tibco-custom-log` | Logs a message using context from `customFlowInfo` (set by Set and Log). Reads Header and contextParams from flow scope; LogInput and additionalLogParams from activity input. Supports all log levels. |
| **Custom Exception Log Message** | `tibco-exception-log` | Same as Custom Log but restricted to **ERROR** level. Used for exception/error logging. Phase is `ProcessEnd` (vs `ProcessStart` for the others). |

### Shared Components

- **logutil** (`activity/logutil/customlogformat.go`): Shared package providing `FormatCustomLog()` for custom log output (text or JSON). Used by all three log activities.

---

## Repository Structure

**IMPORTANT:** This structure must be preserved for the extension to build correctly. Flogo expects contributions (connectors) to follow a specific layout.

```
customlogpalette/
├── README.md
├── LICENSE                               # MIT license
├── THIRD_PARTY_LICENSES                  # Third-party dependency licenses
├── SHORT_DESCRIPTION.md                  # Project summary (e.g. for marketplace / hackathon)
├── src/
│   └── app/
│       └── CustomLog/                    # Connector root
│           ├── go.mod                    # Go module definition (required)
│           ├── go.sum                    # Go module checksums
│           ├── contribution.json         # Connector metadata (required for connectors)
│           └── activity/
│               ├── logutil/              # Shared package (not an activity)
│               │   └── customlogformat.go
│               ├── setandlog/
│               │   ├── activity.go
│               │   ├── activity.json     # Activity descriptor
│               │   ├── metadata.go
│               │   ├── activity_test.go
│               │   └── icons/
│               ├── customlog/
│               │   ├── activity.go
│               │   ├── activity.json
│               │   ├── metadata.go
│               │   └── ...
│               └── exceptionlog/
│                   ├── activity.go
│                   ├── activity.json
│                   ├── metadata.go
│                   └── ...
└── CustomLog-Info/                       # Reference / documentation (sample logs)
```

### Key Structural Requirements

1. **go.mod** and **go.sum** must be inside `src/app/CustomLog/` (the connector folder), not at the repository root.

2. **Module name** in `go.mod` must match the `ref` in each `activity.json`:
   - Module: `github.com/extensions/customlogpalette/src/app/CustomLog`
   - Activity refs: `github.com/extensions/customlogpalette/src/app/CustomLog/activity/setandlog`, etc.

3. **contribution.json** defines the connector:
   - Must be next to `go.mod`
   - Required when you have multiple activities grouped as a connector

4. **Packages**: Each activity folder is a separate Go package (`customlog`, `setandlog`, `exceptionlog`). The `activity` folder also contains the `logutil` package (no `init`/activity registration).

5. **Cross-package imports**: Activities import `logutil` via:
   ```go
   import "github.com/extensions/customlogpalette/src/app/CustomLog/activity/logutil"
   ```

---

## Building the Go Project

To verify that the extension compiles without errors:

```bash
cd src/app/CustomLog
go build ./...
```

To build specific activities:

```bash
go build ./activity/setandlog/...
go build ./activity/customlog/...
go build ./activity/exceptionlog/...
```

To run tests:

```bash
go test ./...
```

---

## Building the Flogo Application

After adding this extension to a Flogo app (via the Flogo CLI or UI), build the application executable using the Flogo build tool:

```bash
.\flogobuild.exe --debug --verbose build-exe -f <path-to-your-app.flogo>
```

Example:

```bash
.\flogobuild.exe --debug --verbose build-exe -f ..\dddf.flogo
```

- `--debug`: Enables debug output
- `--verbose`: Verbose build logs
- `-f`: Path to the `.flogo` app descriptor file

The compiled executable will include the Custom Log palette activities and all their dependencies (including `logutil`).

---

## Dependencies

- Go 1.25+
- [project-flogo/core](https://github.com/project-flogo/core) v1.6.17
- [project-flogo/flow](https://github.com/project-flogo/flow) v1.6.24 (indirect)

---

## Log Format

- **Text**: `timestamp LEVEL [loggerName] - a_key1="value1", a_key2="value2", ...`
- **JSON** (when `logFormat=json`): Same data as a JSON object. Field order is fixed: metadata (`timestamp`, `level`, `logger`) first, then tracking (applicationName, processName, jobId, activityName, sessionId, correlationId, trackingId, …), then message and custom parameters. Optimized for indexing and analysis (e.g. Elasticsearch) and for ingestion into process mining platforms that rely on structured event logs.

The `customFlowInfo` flow variable (set by Set and Log Message) stores Header and contextParams as a map for downstream activities (Custom Log, Exception Log). The `logFormat` value is case-insensitive (e.g. `"json"`, `"JSON"`).

---

## Documentation and Assets

| File | Purpose |
|------|--------|
| [LICENSE](LICENSE) | MIT license; copyright p4future (p4future.com). |
| [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES) | List of third-party dependencies and their licenses (BSD-3, MIT, etc.). |
| [SHORT_DESCRIPTION.md](SHORT_DESCRIPTION.md) | Short project summary and main features (e.g. for marketplace or hackathon submission). |
---

