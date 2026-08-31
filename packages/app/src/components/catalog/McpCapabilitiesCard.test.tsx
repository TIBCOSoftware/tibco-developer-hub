/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import { McpCapabilitiesCard } from './McpCapabilitiesCard';
import * as hook from './useMcpCapabilities';

jest.mock('./useMcpCapabilities');

const mockUseMcpCapabilities = hook.useMcpCapabilities as jest.Mock;

const mcpEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'API',
  metadata: { name: 'example-mcp-server', namespace: 'default' },
  spec: {
    type: 'mcp-server',
    lifecycle: 'production',
    owner: 'group:default/mcp-admins',
    remotes: [{ type: 'streamable-http', url: 'https://mcp.example.com/mcp' }],
  },
};

const idleHook = {
  data: undefined,
  loading: false,
  error: undefined,
  refresh: jest.fn(),
};

describe('McpCapabilitiesCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders declared capabilities from the definition ($text) by default', async () => {
    mockUseMcpCapabilities.mockReturnValue(idleHook);

    // `spec.definition` holds the raw YAML text that the `$text` catalog
    // placeholder inlines from the external definition file.
    const declaredEntity = {
      ...mcpEntity,
      spec: {
        ...mcpEntity.spec,
        definition: [
          'tools:',
          '  - name: declared-tool',
          '    description: From the YAML',
          'resources:',
          '  - uri: docs://readme',
          '    name: Readme',
          'prompts:',
          '  - name: summarize',
        ].join('\n'),
      },
    };

    const rendered = await renderInTestApp(
      <EntityProvider entity={declaredEntity}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    // Declared data renders without any backend call.
    expect(rendered.getByText('declared-tool')).toBeInTheDocument();
    expect(rendered.getByText('summarize')).toBeInTheDocument();
    expect(idleHook.refresh).not.toHaveBeenCalled();
  });

  it('summarizes a tool INPUT schema and reveals the raw schema on demand', async () => {
    mockUseMcpCapabilities.mockReturnValue(idleHook);

    const entity = {
      ...mcpEntity,
      spec: {
        ...mcpEntity.spec,
        definition: {
          tools: [
            {
              name: 'extract_data',
              description: 'Extract data from a source',
              inputSchema: {
                type: 'object',
                properties: {
                  source: { type: 'string' },
                  format: { enum: ['csv', 'json'] },
                },
                required: ['source'],
              },
            },
          ],
        },
      },
    };

    const rendered = await renderInTestApp(
      <EntityProvider entity={entity}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    // Compact INPUT summary is shown.
    expect(
      rendered.getByText('source: string, format?: csv|json'),
    ).toBeInTheDocument();

    // The raw JSON schema is hidden until "Show schema" is clicked.
    expect(rendered.queryByText(/"properties"/)).not.toBeInTheDocument();
    fireEvent.click(rendered.getByText('Show schema'));
    expect(rendered.getByText(/"properties"/)).toBeInTheDocument();
  });

  it('renders tools returned by the introspection backend after Fetch live', async () => {
    const refresh = jest.fn();
    mockUseMcpCapabilities.mockReturnValue({
      data: {
        entityRef: 'api:default/example-mcp-server',
        remote: { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
        serverInfo: { name: 'demo-server', version: '1.2.3' },
        tools: [{ name: 'search', description: 'Search the knowledge base' }],
        resources: [],
        prompts: [],
        errors: [],
      },
      loading: false,
      error: undefined,
      refresh,
    });

    const rendered = await renderInTestApp(
      <EntityProvider entity={mcpEntity}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    fireEvent.click(rendered.getByText('Fetch live'));

    expect(refresh).toHaveBeenCalled();
    expect(rendered.getByText('search')).toBeInTheDocument();
    expect(rendered.getByText('demo-server')).toBeInTheDocument();
  });

  it('sends custom auth headers entered in the live controls', async () => {
    const refresh = jest.fn();
    mockUseMcpCapabilities.mockReturnValue({
      data: {
        entityRef: 'api:default/example-mcp-server',
        remote: { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
        serverInfo: { name: 'demo-server', version: '1.2.3' },
        tools: [],
        resources: [],
        prompts: [],
        errors: [],
      },
      loading: false,
      error: undefined,
      refresh,
    });

    const rendered = await renderInTestApp(
      <EntityProvider entity={mcpEntity}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    fireEvent.click(rendered.getByText('Fetch live'));

    // Add a custom header row and fill it in.
    fireEvent.click(rendered.getByText('Add custom header'));
    fireEvent.change(rendered.getByPlaceholderText('X-API-Key'), {
      target: { value: 'X-API-Key' },
    });
    fireEvent.change(rendered.getByPlaceholderText('value'), {
      target: { value: 'k-123' },
    });

    fireEvent.click(rendered.getByText('Authorize'));

    expect(refresh).toHaveBeenLastCalledWith(
      expect.objectContaining({ headers: { 'X-API-Key': 'k-123' } }),
    );
  });

  it('shows an error panel when introspection fails', async () => {
    mockUseMcpCapabilities.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('Unable to connect to any MCP remote.'),
      refresh: jest.fn(),
    });

    const rendered = await renderInTestApp(
      <EntityProvider entity={mcpEntity}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    fireEvent.click(rendered.getByText('Fetch live'));

    expect(
      rendered.getByText('Unable to connect to any MCP remote.'),
    ).toBeInTheDocument();
  });

  it('lets the user pick a remote when several are defined', async () => {
    const refresh = jest.fn();
    mockUseMcpCapabilities.mockReturnValue({
      data: {
        entityRef: 'api:default/multi-remote',
        remote: { type: 'streamable-http', url: 'https://a.example.com/mcp' },
        serverInfo: { name: 'multi', version: '1.0.0' },
        tools: [],
        resources: [],
        prompts: [],
        errors: [],
      },
      loading: false,
      error: undefined,
      refresh,
    });

    const multiRemoteEntity = {
      ...mcpEntity,
      metadata: { name: 'multi-remote', namespace: 'default' },
      spec: {
        ...mcpEntity.spec,
        remotes: [
          { type: 'streamable-http', url: 'https://a.example.com/mcp' },
          { type: 'sse', url: 'https://b.example.com/sse' },
        ],
      },
    };

    const rendered = await renderInTestApp(
      <EntityProvider entity={multiRemoteEntity}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    // Live controls only appear after opting into live introspection.
    fireEvent.click(rendered.getByText('Fetch live'));

    // The remote selector is present (defaulting to Auto) because there is
    // more than one remote.
    const select = rendered.getByText('Auto (first reachable)');
    expect(select).toBeInTheDocument();

    // Selecting the second remote and refreshing pins remoteIndex=1.
    fireEvent.mouseDown(select);
    fireEvent.click(rendered.getByText('sse — https://b.example.com/sse'));
    fireEvent.click(rendered.getByText('Refresh'));

    expect(refresh).toHaveBeenCalledWith(
      expect.objectContaining({ remoteIndex: 1 }),
    );
  });

  it('shows a message for non-MCP entities', async () => {
    const plain = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'plain-api', namespace: 'default' },
      spec: { type: 'openapi', lifecycle: 'production', owner: 'guest' },
    };

    const rendered = await renderInTestApp(
      <EntityProvider entity={plain}>
        <McpCapabilitiesCard />
      </EntityProvider>,
    );

    expect(
      rendered.getByText('This entity is not an MCP server.'),
    ).toBeInTheDocument();
  });
});
