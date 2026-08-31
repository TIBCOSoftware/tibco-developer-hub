/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useCallback, useState } from 'react';
import {
  useApi,
  fetchApiRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { McpPromptInfo, McpResourceInfo, McpToolInfo } from './mcpCapabilities';

export type { McpToolInfo, McpResourceInfo, McpPromptInfo };

/** Response shape of GET /api/mcp-introspection/capabilities. */
export interface McpCapabilitiesResponse {
  entityRef: string;
  remote: { type: string; url: string };
  serverInfo?: { name?: string; version?: string };
  capabilities?: unknown;
  tools: McpToolInfo[];
  resources: McpResourceInfo[];
  prompts: McpPromptInfo[];
  errors: string[];
}

/**
 * Fetches the live tools/resources/prompts of an MCP server from the
 * `mcp-introspection` backend plugin.
 */
export function useMcpCapabilities(entityRef: string) {
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const [data, setData] = useState<McpCapabilitiesResponse | undefined>();
  // Lazy: nothing is fetched until the caller invokes `refresh` (the Capabilities
  // tab only introspects live when the user opts in via "Fetch live").
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const load = useCallback(
    async (opts?: {
      token?: string;
      headers?: Record<string, string>;
      remoteIndex?: number;
    }) => {
      const { token, headers, remoteIndex } = opts ?? {};
      setLoading(true);
      setError(undefined);
      try {
        const baseUrl = await discoveryApi.getBaseUrl('mcp-introspection');
        const params = new URLSearchParams({ entityRef });
        // When a specific remote is selected, pin the backend to it; otherwise
        // the backend auto-selects the first reachable remote.
        if (remoteIndex !== undefined) {
          params.set('remoteIndex', String(remoteIndex));
        }
        const hasHeaders = headers && Object.keys(headers).length > 0;
        const response = await fetchApi.fetch(
          `${baseUrl}/capabilities?${params.toString()}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              // Supplied by the user via the Capabilities tab (like the Swagger
              // "Authorize" input). Sent as a Bearer token to the MCP server.
              ...(token ? { 'x-mcp-token': token } : {}),
              // Arbitrary auth headers (e.g. X-API-Key) for non-bearer servers,
              // JSON-encoded — matches the `headers` input of the
              // `tibco:mcp:introspect` scaffolder action.
              ...(hasHeaders
                ? { 'x-mcp-headers': JSON.stringify(headers) }
                : {}),
            },
          },
        );

        if (!response.ok) {
          let message = `Failed to introspect MCP server: ${response.status} ${response.statusText}`;
          try {
            const body = await response.json();
            if (body?.detail || body?.message) {
              message = body.detail ?? body.message;
            }
          } catch {
            // ignore body parse errors, keep the status-based message
          }
          throw new Error(message);
        }

        setData((await response.json()) as McpCapabilitiesResponse);
      } catch (err) {
        setError(err as Error);
        setData(undefined);
      } finally {
        setLoading(false);
      }
    },
    [fetchApi, discoveryApi, entityRef],
  );

  return { data, loading, error, refresh: load };
}
