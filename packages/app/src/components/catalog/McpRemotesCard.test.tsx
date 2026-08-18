/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { McpRemotesCard } from './McpRemotesCard';

describe('McpRemotesCard', () => {
  it('renders the spec.remotes connections of an MCP server', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'example-mcp-server' },
      spec: {
        type: 'mcp-server',
        lifecycle: 'production',
        owner: 'group:default/mcp-admins',
        remotes: [
          { type: 'sse', url: 'https://mcp.example.com/sse' },
          { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
        ],
      },
    };

    const rendered = await renderInTestApp(
      <EntityProvider entity={entity}>
        <McpRemotesCard />
      </EntityProvider>,
    );

    expect(
      rendered.getByText('https://mcp.example.com/sse'),
    ).toBeInTheDocument();
    expect(rendered.getByText('streamable-http')).toBeInTheDocument();
  });

  it('shows a message for non-MCP entities', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'plain-api' },
      spec: { type: 'openapi', lifecycle: 'production', owner: 'guest' },
    };

    const rendered = await renderInTestApp(
      <EntityProvider entity={entity}>
        <McpRemotesCard />
      </EntityProvider>,
    );

    expect(
      rendered.getByText('This entity is not an MCP server.'),
    ).toBeInTheDocument();
  });
});
