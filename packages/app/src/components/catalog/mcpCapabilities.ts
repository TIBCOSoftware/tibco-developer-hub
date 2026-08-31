/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import { parse as parseYaml } from 'yaml';

/** Normalized MCP tool. Shared by declared (YAML) and live (introspection) data. */
export interface McpToolInfo {
  name: string;
  description?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}

/** Normalized MCP resource. */
export interface McpResourceInfo {
  uri: string;
  name?: string;
  mimeType?: string;
  description?: string;
}

/** Normalized MCP prompt. */
export interface McpPromptInfo {
  name: string;
  description?: string;
  arguments?: unknown;
}

/** The three capability lists an MCP server can expose. */
export interface McpCapabilityLists {
  tools: McpToolInfo[];
  resources: McpResourceInfo[];
  prompts: McpPromptInfo[];
}

const asRecordArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null,
      )
    : [];

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

/** The shape of a resolved MCP capability definition. */
interface McpDefinition {
  tools?: unknown;
  resources?: unknown;
  prompts?: unknown;
}

/**
 * Parses a `spec.definition` string that holds the capability definition in
 * either JSON or YAML — the same two formats API entities support for their
 * `spec.definition` (openapi/graphql/asyncapi). JSON is tried first (it is
 * stricter and faster); anything that is not valid JSON is parsed as YAML.
 * Because YAML is a superset of JSON the YAML pass alone would suffice, but
 * trying JSON first keeps the intent explicit and avoids surprising coercions.
 */
function parseDefinition(text: string): McpDefinition | undefined {
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') {
      return parsed as McpDefinition;
    }
  } catch {
    // Not JSON — fall through to YAML.
  }
  try {
    const parsed = parseYaml(text);
    if (parsed && typeof parsed === 'object') {
      return parsed as McpDefinition;
    }
  } catch {
    // Malformed definition text — caller falls back to the legacy fields.
  }
  return undefined;
}

/**
 * Resolves the capability definition object for an MCP server entity.
 *
 * The tools/resources/prompts live in `spec.definition`, mirroring the way API
 * entities carry their spec: the catalog YAML uses a `$text` placeholder that
 * inlines the referenced file's raw content as a string, which we parse here as
 * JSON or YAML. For robustness we also accept an already-parsed object (e.g. a
 * `$yaml`/`$json` placeholder or an inline object) and fall back to legacy
 * top-level `spec.tools/resources/prompts` for entities not yet migrated.
 */
function readDefinition(entity: Entity): McpDefinition {
  const spec = (entity.spec ?? {}) as McpDefinition & { definition?: unknown };
  const { definition } = spec;

  if (typeof definition === 'string') {
    const parsed = parseDefinition(definition);
    if (parsed) {
      return parsed;
    }
  } else if (definition && typeof definition === 'object') {
    return definition as McpDefinition;
  }

  // Legacy fallback: capabilities declared directly on the entity spec.
  return spec;
}

/**
 * Reads the tools/resources/prompts an MCP server entity declares statically
 * (the YAML source of truth). These fields are not part of the alpha
 * `McpServerApiEntity` type, so the spec/definition are read defensively;
 * anything missing or malformed yields an empty list.
 */
export function readDeclaredCapabilities(entity: Entity): McpCapabilityLists {
  const spec = readDefinition(entity);

  const tools: McpToolInfo[] = asRecordArray(spec.tools)
    .map(t => ({
      name: asOptionalString(t.name) ?? '',
      description: asOptionalString(t.description),
      inputSchema: t.inputSchema,
      outputSchema: t.outputSchema,
    }))
    .filter(t => t.name);

  const resources: McpResourceInfo[] = asRecordArray(spec.resources)
    .map(r => ({
      uri: asOptionalString(r.uri) ?? '',
      name: asOptionalString(r.name),
      mimeType: asOptionalString(r.mimeType),
      description: asOptionalString(r.description),
    }))
    .filter(r => r.uri);

  const prompts: McpPromptInfo[] = asRecordArray(spec.prompts)
    .map(p => ({
      name: asOptionalString(p.name) ?? '',
      description: asOptionalString(p.description),
      arguments: p.arguments,
    }))
    .filter(p => p.name);

  return { tools, resources, prompts };
}

/** Convenience: the counts of each declared capability list. */
export function countDeclaredCapabilities(entity: Entity): {
  tools: number;
  resources: number;
  prompts: number;
} {
  const { tools, resources, prompts } = readDeclaredCapabilities(entity);
  return {
    tools: tools.length,
    resources: resources.length,
    prompts: prompts.length,
  };
}
