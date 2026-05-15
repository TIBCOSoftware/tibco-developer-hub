# Custom Log Palette — Short Description

**Flogo Custom Logging Extension** is a custom logging extension for TIBCO Flogo® designed to produce structured logs in JSON format, optimized for indexing and analysis on platforms such as Elasticsearch.

The solution enables **centralized context management** (e.g. correlationId, sessionId, trackingId): you set headers and context parameters once at the start of a flow (Set and Log Message), and every subsequent log entry is automatically enriched with that context. By standardizing log structure and ensuring traceability across flows, it significantly improves **monitoring, debugging, and observability** in distributed integration scenarios.

## Main features

- **Three activities**: **Set and Log Message** (set flow-scoped context and log), **Custom Log Message** (log with inherited context and custom payload), **Custom Exception Log Message** (ERROR-level logging for exceptions).
- **Structured output**: JSON (recommended for Elasticsearch) or text; same fields, consistent ordering (metadata first, then tracking, message, and custom parameters).
- **Flow-scoped context**: Headers and context params defined once are reused by all downstream log activities without reconfiguration.
- **Full traceability**: Each log carries application name, process name, activity name, timestamps, and optional OpenTelemetry trace ID for end-to-end correlation.
