/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

/**
 * Helpers for turning a tool's JSON Schema (`inputSchema` / `outputSchema`) into
 * a compact, human-readable one-line summary for the MCP Details tab, e.g.
 * `source: string, format: csv|json|parquet, filters?: object`. Only the top
 * level of `properties` is summarized; the full schema is available via the
 * card's "Show schema" expander. Everything is guarded so an unexpected server
 * schema degrades to a best-effort label rather than throwing during render.
 */

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];

const dedupe = (values: string[]): string[] => Array.from(new Set(values));

/** Derives a short type label for a single property schema. */
function typeLabel(schema: unknown): string {
  if (!isObject(schema)) {
    return 'any';
  }

  // enum → the allowed values joined by `|` (e.g. csv|json|parquet).
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum.map(v => String(v)).join('|');
  }

  // const → the single allowed value.
  if (schema.const !== undefined) {
    return String(schema.const);
  }

  // anyOf / oneOf → the distinct member type labels joined by `|`.
  const union = schema.anyOf ?? schema.oneOf;
  if (Array.isArray(union) && union.length > 0) {
    const parts = dedupe(union.map(member => typeLabel(member)));
    return parts.join('|');
  }

  // Explicit JSON Schema `type` (may itself be an array of types).
  if (typeof schema.type === 'string') {
    return schema.type;
  }
  if (Array.isArray(schema.type)) {
    const parts = dedupe(asStringArray(schema.type));
    if (parts.length > 0) {
      return parts.join('|');
    }
  }

  // No explicit type: infer from shape.
  if (isObject(schema.properties)) {
    return 'object';
  }
  return 'any';
}

/**
 * Summarizes an object schema's top-level properties as
 * `name: <type>` / `name?: <type>` (optional when not listed in `required`),
 * joined by `, `. Returns `''` when there are no properties to show (the caller
 * renders a muted placeholder such as "No input").
 */
export function summarizeSchema(schema: unknown): string {
  if (!isObject(schema) || !isObject(schema.properties)) {
    return '';
  }

  const required = new Set(asStringArray(schema.required));
  const entries = Object.entries(schema.properties);
  if (entries.length === 0) {
    return '';
  }

  return entries
    .map(([name, propSchema]) => {
      const optional = required.has(name) ? '' : '?';
      return `${name}${optional}: ${typeLabel(propSchema)}`;
    })
    .join(', ');
}

/** True when the value is a non-null object with at least one own key. */
export function hasSchema(schema: unknown): boolean {
  return isObject(schema) && Object.keys(schema).length > 0;
}
