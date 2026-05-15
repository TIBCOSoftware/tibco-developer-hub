# Flogo Custom Log Palette

A custom logging extension for **TIBCO Flogo&reg;** that produces structured logs (text or JSON) enriched with flow-scoped context such as `correlationId`, `sessionId`, and `trackingId`. Designed for end-to-end traceability in distributed integration scenarios and for ingestion into platforms like Elasticsearch and process-mining tools.

Contributed by [p4future](https://p4future.com) under the MIT license.

---

## What it gives you

A Flogo connector that adds three new activities to your palette under the **CustomLog** category:

| Activity | Ref | Purpose |
|---|---|---|
| **Set and Log Message** | `tibco-set-and-log` | Sets flow-scoped context (Header + contextParams) and writes the first log entry. Run this once near the start of a flow so downstream activities can inherit context. Supports INFO / WARN / ERROR / DEBUG. |
| **Custom Log Message** | `tibco-custom-log` | Writes a log entry that automatically inherits the Header and contextParams set earlier in the flow. Supports INFO / WARN / ERROR / DEBUG. |
| **Custom Exception Log Message** | `tibco-exception-log` | Same as Custom Log but locked to ERROR level and tagged as `ProcessEnd` for consistent exception logging. |

Each log line carries application name, process name, activity name, timestamps, and (optionally) the OpenTelemetry trace ID — so you can stitch a single business transaction across services without bespoke wiring in every flow.

---

## Structured log format

Two output formats are supported via the `logFormat` activity input (case-insensitive):

**Text**

```
2026-04-12T09:14:22Z INFO [orderProcessor] - a_correlationId="c-918", a_sessionId="s-22", message="Payment captured"
```

**JSON** (recommended for Elasticsearch / process mining)

The same data with a fixed field order: metadata first (`timestamp`, `level`, `logger`), then tracking fields (`applicationName`, `processName`, `jobId`, `activityName`, `sessionId`, `correlationId`, `trackingId`, ...), then `message`, then any custom parameters. The fixed ordering keeps documents predictable for indexing and for tools that key off field positions.

---

## Flow-scoped context

The **Set and Log Message** activity stores its `Header` and `contextParams` into a flow variable called `customFlowInfo`. Subsequent **Custom Log** and **Custom Exception Log** activities read from that variable, so you only have to populate context once per flow. Defaults shipped in `Header.json` cover the common keys: `sessionId`, `correlationId`, `trackingId`, `sender`, `serviceScope`.

---

## Source layout

The connector follows the layout Flogo expects when you ship multiple grouped activities:

```
custom-log-palette/
├── README.md, LICENSE, THIRD_PARTY_LICENSES, SHORT_DESCRIPTION.md
└── src/
    └── app/
        └── CustomLog/                # connector root
            ├── go.mod / go.sum
            ├── contribution.json     # connector descriptor
            └── activity/
                ├── logutil/          # shared formatter (FormatCustomLog)
                ├── setandlog/        # Set and Log Message
                ├── customlog/        # Custom Log Message
                └── exceptionlog/     # Custom Exception Log Message
```

Two structural rules to be aware of if you fork or extend it:

1. `go.mod` lives inside `src/app/CustomLog/`, **not** at the repository root. Flogo's tooling expects the module to sit next to `contribution.json`.
2. The Go module name in `go.mod` must match the `ref` in each `activity.json`:

   ```
   module: github.com/extensions/customlogpalette/src/app/CustomLog
   ref:    github.com/extensions/customlogpalette/src/app/CustomLog/activity/setandlog
   ```

The shared `logutil` package is imported by all three activities via the same module path.

---

## Building the extension

From `src/app/CustomLog/`:

```bash
go build ./...
go test ./...
```

Or build a single activity:

```bash
go build ./activity/setandlog/...
```

## Building a Flogo app that uses it

After adding the palette to your Flogo app (via the Flogo CLI or the Web UI), build the executable with the Flogo build tool:

```bash
flogobuild --debug --verbose build-exe -f path/to/your-app.flogo
```

The compiled binary will include the three Custom Log activities and the shared `logutil` package.

---

## Dependencies

- Go 1.25+
- [project-flogo/core](https://github.com/project-flogo/core) v1.6.17
- [project-flogo/flow](https://github.com/project-flogo/flow) v1.6.24 (indirect)

---

## License & attribution

- **Source license:** MIT &mdash; copyright [p4future](https://p4future.com). See `LICENSE` in the source folder.
- **Third-party licenses:** see `THIRD_PARTY_LICENSES` for the BSD-3 / MIT components used by the underlying Flogo runtime.
