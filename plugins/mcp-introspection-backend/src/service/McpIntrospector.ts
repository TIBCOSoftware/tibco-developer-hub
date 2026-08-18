/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { LoggerService } from '@backstage/backend-plugin-api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

/**
 * A transport endpoint of an MCP server, as declared in `spec.remotes`.
 */
export interface McpRemote {
  type: string;
  url: string;
}

/** Normalized, JSON-serializable MCP tool. */
export interface McpToolInfo {
  name: string;
  description?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}

/** Normalized, JSON-serializable MCP resource. */
export interface McpResourceInfo {
  uri: string;
  name?: string;
  mimeType?: string;
  description?: string;
}

/** Normalized, JSON-serializable MCP prompt. */
export interface McpPromptInfo {
  name: string;
  description?: string;
  arguments?: unknown;
}

/** Result of introspecting a single MCP server. */
export interface McpCapabilities {
  remote: McpRemote;
  serverInfo?: { name?: string; version?: string };
  capabilities?: unknown;
  tools: McpToolInfo[];
  resources: McpResourceInfo[];
  prompts: McpPromptInfo[];
  /** Non-fatal per-list errors (e.g. server has tools but no prompts endpoint). */
  errors: string[];
}

const CLIENT_INFO = {
  name: 'tibco-developer-hub-mcp-introspector',
  version: '1.0.0',
};

/** Authentication to attach to every request the transport makes. */
export interface McpAuth {
  /** Sent as `Authorization: Bearer <token>`. Takes priority over a same-named header. */
  token?: string;
  /** Arbitrary extra headers (e.g. `X-API-Key`) for non-bearer servers. */
  headers?: Record<string, string>;
}

/**
 * Resolves a remote's declared URL to an absolute URL.
 *
 * `spec.remotes[].url` may be a relative path (e.g. `/api/mcp-actions/v1`) when
 * the MCP server is hosted by the Developer Hub itself. `new URL(relative)`
 * throws "Invalid URL", so such paths are resolved against `baseUrl` (the
 * backend's external base URL). Absolute URLs are returned unchanged.
 *
 * Note the resolution deliberately does NOT use plain `new URL(rawUrl, baseUrl)`:
 * a root-relative reference like `/api/mcp-actions/v1` would replace the base's
 * entire path, dropping the `/tibco/hub` prefix and hitting the wrong endpoint
 * (404). Instead the relative path is APPENDED to the base URL's path, so
 * base `https://host/tibco/hub` + `/api/mcp-actions/v1` becomes
 * `https://host/tibco/hub/api/mcp-actions/v1`. A guard avoids duplicating the
 * prefix if the relative URL already includes the base path.
 */
export function resolveRemoteUrl(rawUrl: string, baseUrl?: string): URL {
  try {
    return new URL(rawUrl);
  } catch {
    // Not an absolute URL — treat it as relative to the Hub's own base URL.
    if (!baseUrl) {
      throw new Error(
        `Invalid MCP remote URL "${rawUrl}": it is not absolute and no base URL ` +
          `is configured to resolve it against. Set backend.baseUrl, or use an ` +
          `absolute URL in spec.remotes.`,
      );
    }
    let base: URL;
    try {
      base = new URL(baseUrl);
    } catch {
      throw new Error(
        `Invalid MCP remote URL "${rawUrl}" (could not resolve against base ` +
          `"${baseUrl}").`,
      );
    }
    // Normalize the relative reference against the origin so its path, query and
    // hash are parsed correctly, independent of the base path.
    const relRef = new URL(rawUrl, base.origin);
    const basePath = base.pathname.replace(/\/+$/, ''); // strip trailing slash(es)
    const relPath = relRef.pathname; // always begins with '/'
    // Keep the base path prefix (e.g. `/tibco/hub`) unless the relative path
    // already includes it, so we neither drop nor duplicate it.
    const alreadyPrefixed =
      basePath !== '' &&
      (relPath === basePath || relPath.startsWith(`${basePath}/`));
    const resolved = new URL(base.origin);
    resolved.pathname = alreadyPrefixed ? relPath : `${basePath}${relPath}`;
    resolved.search = relRef.search;
    resolved.hash = relRef.hash;
    return resolved;
  }
}

/**
 * Builds a client transport for the given remote. `streamable-http` maps to the
 * Streamable HTTP transport; everything else (including `sse`) falls back to the
 * SSE transport. A relative `remote.url` is resolved against `baseUrl` (see
 * {@link resolveRemoteUrl}). Any supplied auth (custom headers and/or a Bearer
 * token) is attached to all requests the transport makes; a Bearer `token` is
 * applied last so it wins over a same-named custom header.
 *
 * The auth is passed via `requestInit.headers`, which the SDK merges into the
 * headers of every request (both transports do this in their `_commonHeaders`).
 * We deliberately do NOT pass a custom `fetch`: the SDK hands it a `Headers`
 * instance as `init.headers`, and wrapping it would drop the SDK's own `Accept`
 * / `Content-Type` headers (spreading a `Headers` object yields nothing), which
 * makes servers reject the request with "Not Acceptable".
 */
function createTransport(
  remote: McpRemote,
  auth?: McpAuth,
  baseUrl?: string,
  logger?: LoggerService,
): Transport {
  const url = resolveRemoteUrl(remote.url, baseUrl);
  // Log the full absolute URL we actually connect to. When the declared remote
  // URL was relative, also show what it was resolved against so it's clear which
  // host/path the live introspection hit.
  if (url.href !== remote.url) {
    logger?.info(
      `[mcp-introspection] Connecting live to ${remote.type} remote "${url.href}" ` +
        `(resolved relative URL "${remote.url}" against base "${baseUrl}")`,
    );
  } else {
    logger?.info(
      `[mcp-introspection] Connecting live to ${remote.type} remote "${url.href}"`,
    );
  }
  const headers: Record<string, string> = {
    ...(auth?.headers ?? {}),
    ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
  };
  const requestInit: RequestInit | undefined =
    Object.keys(headers).length > 0 ? { headers } : undefined;

  if (remote.type === 'streamable-http') {
    return new StreamableHTTPClientTransport(url, { requestInit });
  }

  return new SSEClientTransport(url, { requestInit });
}

/**
 * Connects to a single MCP remote and reads its advertised capabilities plus the
 * tools/resources/prompts it exposes. Each list is only queried when the server
 * advertises the corresponding capability; per-list failures are collected into
 * `errors` so a partial result is still returned. Always closes the client.
 */
export async function introspectRemote(
  remote: McpRemote,
  options: {
    token?: string;
    headers?: Record<string, string>;
    baseUrl?: string;
    logger?: LoggerService;
  },
): Promise<McpCapabilities> {
  const { token, headers, baseUrl, logger } = options;
  const client = new Client(CLIENT_INFO);
  const transport = createTransport(
    remote,
    { token, headers },
    baseUrl,
    logger,
  );
  const errors: string[] = [];

  await client.connect(transport);
  try {
    const serverVersion = client.getServerVersion();
    const capabilities = client.getServerCapabilities();

    const tools: McpToolInfo[] = [];
    const resources: McpResourceInfo[] = [];
    const prompts: McpPromptInfo[] = [];

    if (capabilities?.tools) {
      try {
        const res = await client.listTools();
        for (const t of res.tools ?? []) {
          tools.push({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
            // `outputSchema` is part of the MCP spec but absent on older
            // servers; forward it when present so the UI can render OUTPUT.
            outputSchema: (t as { outputSchema?: unknown }).outputSchema,
          });
        }
      } catch (err) {
        errors.push(`Failed to list tools: ${(err as Error).message}`);
      }
    }

    if (capabilities?.resources) {
      try {
        const res = await client.listResources();
        for (const r of res.resources ?? []) {
          resources.push({
            uri: r.uri,
            name: r.name,
            mimeType: r.mimeType,
            description: r.description,
          });
        }
      } catch (err) {
        errors.push(`Failed to list resources: ${(err as Error).message}`);
      }
    }

    if (capabilities?.prompts) {
      try {
        const res = await client.listPrompts();
        for (const p of res.prompts ?? []) {
          prompts.push({
            name: p.name,
            description: p.description,
            arguments: p.arguments,
          });
        }
      } catch (err) {
        errors.push(`Failed to list prompts: ${(err as Error).message}`);
      }
    }

    return {
      remote,
      serverInfo: serverVersion
        ? { name: serverVersion.name, version: serverVersion.version }
        : undefined,
      capabilities,
      tools,
      resources,
      prompts,
      errors,
    };
  } finally {
    try {
      await client.close();
    } catch (err) {
      logger?.warn(
        `[mcp-introspection] Failed to close MCP client for ${remote.url}: ${
          (err as Error).message
        }`,
      );
    }
  }
}

/**
 * Introspects an MCP server described by a list of remotes. When `remoteIndex` is
 * provided only that remote is tried; otherwise remotes are tried in order of
 * preference (`streamable-http` first, then the rest) until one connects. Throws
 * if every candidate remote fails to connect.
 */
export async function introspectServer(
  remotes: McpRemote[],
  options: {
    token?: string;
    headers?: Record<string, string>;
    baseUrl?: string;
    remoteIndex?: number;
    logger?: LoggerService;
  },
): Promise<McpCapabilities> {
  const { token, headers, baseUrl, remoteIndex, logger } = options;

  if (remotes.length === 0) {
    throw new Error('This MCP server has no remotes defined in spec.remotes.');
  }

  let candidates: McpRemote[];
  if (remoteIndex !== undefined) {
    const chosen = remotes[remoteIndex];
    if (!chosen) {
      throw new Error(`remoteIndex ${remoteIndex} is out of range.`);
    }
    candidates = [chosen];
  } else {
    candidates = [...remotes].sort((a, b) => {
      const score = (r: McpRemote) => (r.type === 'streamable-http' ? 0 : 1);
      return score(a) - score(b);
    });
  }

  const connectErrors: string[] = [];
  for (const remote of candidates) {
    try {
      return await introspectRemote(remote, {
        token,
        headers,
        baseUrl,
        logger,
      });
    } catch (err) {
      const message = `${remote.type} (${remote.url}): ${
        (err as Error).message
      }`;
      logger?.warn(`[mcp-introspection] Failed to introspect ${message}`);
      connectErrors.push(message);
    }
  }

  throw new Error(
    `Unable to connect to any MCP remote. Tried: ${connectErrors.join('; ')}`,
  );
}
