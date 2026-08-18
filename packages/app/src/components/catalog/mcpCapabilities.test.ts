/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import { readDeclaredCapabilities } from './mcpCapabilities';

const base: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'API',
  metadata: { name: 'example-mcp-server', namespace: 'default' },
  spec: { type: 'mcp-server', lifecycle: 'production', owner: 'guest' },
};

const withDefinition = (definition: unknown): Entity => ({
  ...base,
  spec: { ...base.spec, definition } as any,
});

describe('readDeclaredCapabilities', () => {
  it('parses a YAML-format definition string (from a $text file)', () => {
    const entity = withDefinition(
      [
        'tools:',
        '  - name: echo',
        '    description: Echoes back the message.',
        'resources:',
        '  - uri: docs://readme',
        '    name: Readme',
        'prompts:',
        '  - name: summarize',
      ].join('\n'),
    );

    const { tools, resources, prompts } = readDeclaredCapabilities(entity);

    expect(tools).toEqual([
      {
        name: 'echo',
        description: 'Echoes back the message.',
        inputSchema: undefined,
      },
    ]);
    expect(resources[0].uri).toBe('docs://readme');
    expect(prompts[0].name).toBe('summarize');
  });

  it('parses a JSON-format definition string (from a $text file)', () => {
    const entity = withDefinition(
      JSON.stringify({
        tools: [{ name: 'search_docs', description: 'Searches the KB.' }],
        resources: [
          { uri: 'kb://index', name: 'Index', mimeType: 'application/json' },
        ],
        prompts: [],
      }),
    );

    const { tools, resources, prompts } = readDeclaredCapabilities(entity);

    expect(tools).toEqual([
      {
        name: 'search_docs',
        description: 'Searches the KB.',
        inputSchema: undefined,
      },
    ]);
    expect(resources[0].mimeType).toBe('application/json');
    expect(prompts).toEqual([]);
  });

  it('accepts an already-parsed inline definition object', () => {
    const entity = withDefinition({
      tools: [{ name: 'add', description: 'Adds two numbers.' }],
    });

    const { tools } = readDeclaredCapabilities(entity);

    expect(tools[0].name).toBe('add');
  });

  it('captures a tool inputSchema and outputSchema', () => {
    const entity = withDefinition({
      tools: [
        {
          name: 'extract',
          inputSchema: {
            type: 'object',
            properties: { url: { type: 'string' } },
          },
          outputSchema: {
            type: 'object',
            properties: { data: { type: 'array' } },
          },
        },
      ],
    });

    const { tools } = readDeclaredCapabilities(entity);

    expect(tools[0].inputSchema).toEqual({
      type: 'object',
      properties: { url: { type: 'string' } },
    });
    expect(tools[0].outputSchema).toEqual({
      type: 'object',
      properties: { data: { type: 'array' } },
    });
  });

  it('falls back to legacy top-level spec fields when no definition is set', () => {
    const entity: Entity = {
      ...base,
      spec: {
        ...base.spec,
        tools: [{ name: 'legacy-tool' }],
      } as any,
    };

    const { tools } = readDeclaredCapabilities(entity);

    expect(tools[0].name).toBe('legacy-tool');
  });

  it('yields empty lists for a malformed definition string', () => {
    const entity = withDefinition(': not valid : yaml : [');

    const { tools, resources, prompts } = readDeclaredCapabilities(entity);

    expect(tools).toEqual([]);
    expect(resources).toEqual([]);
    expect(prompts).toEqual([]);
  });
});
