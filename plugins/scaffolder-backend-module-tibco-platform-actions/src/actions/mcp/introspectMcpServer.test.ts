/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { introspectRemote } from '@internal/plugin-mcp-introspection-backend';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { introspectMcpServerAction } from './introspectMcpServer';

jest.mock('@internal/plugin-mcp-introspection-backend', () => ({
  introspectRemote: jest.fn(),
}));

const mockIntrospectRemote = introspectRemote as jest.Mock;

/** A representative introspection result returned by the mocked core. */
const sampleResult = {
  remote: { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
  serverInfo: { name: 'demo-server', version: '1.2.3' },
  capabilities: { tools: {}, resources: {}, prompts: {} },
  tools: [
    {
      name: 'echo',
      description: 'Echoes back',
      inputSchema: { type: 'object' },
    },
    { name: 'add', description: 'Adds numbers' },
  ],
  resources: [{ uri: 'docs://readme', name: 'Readme' }],
  prompts: [{ name: 'summarize' }],
  errors: [],
};

/** Creates a minimal scaffolder action context for testing. */
function createMockContext(
  input: Record<string, unknown>,
  workspacePath: string,
  secrets: Record<string, string> = {},
) {
  const outputs: Record<string, unknown> = {};
  return {
    input,
    workspacePath,
    secrets,
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn().mockReturnThis(),
    },
    output: jest.fn((key: string, val: unknown) => {
      outputs[key] = val;
    }),
    outputs,
    logStream: { write: jest.fn() },
    createTemporaryDirectory: jest.fn(),
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
  };
}

describe('tibco:mcp:introspect', () => {
  let tmpDir: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockIntrospectRemote.mockResolvedValue(sampleResult);
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-introspect-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('has the correct action id', () => {
    expect(introspectMcpServerAction.id).toBe('tibco:mcp:introspect');
  });

  it('outputs the tools/resources/prompts and their counts', async () => {
    const ctx = createMockContext(
      { url: 'https://mcp.example.com/mcp' },
      tmpDir,
    );

    await introspectMcpServerAction.handler(ctx as any);

    expect(ctx.outputs.tools).toEqual(sampleResult.tools);
    expect(ctx.outputs.resources).toEqual(sampleResult.resources);
    expect(ctx.outputs.prompts).toEqual(sampleResult.prompts);
    expect(ctx.outputs.toolCount).toBe(2);
    expect(ctx.outputs.resourceCount).toBe(1);
    expect(ctx.outputs.promptCount).toBe(1);
    expect(ctx.outputs.serverInfo).toEqual(sampleResult.serverInfo);
    expect(ctx.outputs.errors).toEqual([]);
  });

  it('defaults to the streamable-http transport', async () => {
    const ctx = createMockContext(
      { url: 'https://mcp.example.com/mcp' },
      tmpDir,
    );

    await introspectMcpServerAction.handler(ctx as any);

    expect(mockIntrospectRemote).toHaveBeenCalledWith(
      { type: 'streamable-http', url: 'https://mcp.example.com/mcp' },
      expect.objectContaining({ token: undefined, headers: undefined }),
    );
  });

  it('passes the bearer token, custom headers and transport through', async () => {
    const ctx = createMockContext(
      {
        url: 'https://mcp.example.com/sse',
        transport: 'sse',
        token: 'abc123',
        headers: { 'X-API-Key': 'k' },
      },
      tmpDir,
    );

    await introspectMcpServerAction.handler(ctx as any);

    expect(mockIntrospectRemote).toHaveBeenCalledWith(
      { type: 'sse', url: 'https://mcp.example.com/sse' },
      expect.objectContaining({
        token: 'abc123',
        headers: { 'X-API-Key': 'k' },
      }),
    );
  });

  it('falls back to the mcpToken secret when no token input is given', async () => {
    const ctx = createMockContext(
      { url: 'https://mcp.example.com/mcp' },
      tmpDir,
      { mcpToken: 'secret-token' },
    );

    await introspectMcpServerAction.handler(ctx as any);

    expect(mockIntrospectRemote).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ token: 'secret-token' }),
    );
  });

  it('writes the result to a file when resultPath is set', async () => {
    const ctx = createMockContext(
      { url: 'https://mcp.example.com/mcp', resultPath: 'mcp/result.json' },
      tmpDir,
    );

    await introspectMcpServerAction.handler(ctx as any);

    const written = await fs.readFile(
      path.join(tmpDir, 'mcp', 'result.json'),
      'utf8',
    );
    expect(JSON.parse(written)).toEqual(sampleResult);
    expect(ctx.output).toHaveBeenCalledWith(
      'filePath',
      expect.stringContaining('result.json'),
    );
  });

  it('does not write a file when resultPath is omitted', async () => {
    const ctx = createMockContext(
      { url: 'https://mcp.example.com/mcp' },
      tmpDir,
    );

    await introspectMcpServerAction.handler(ctx as any);

    expect(ctx.outputs.filePath).toBeUndefined();
    expect(await fs.readdir(tmpDir)).toHaveLength(0);
  });

  it('wraps connection failures with a clear message', async () => {
    mockIntrospectRemote.mockRejectedValue(
      new Error('Streamable HTTP error: 401'),
    );

    const ctx = createMockContext(
      { url: 'https://mcp.example.com/mcp' },
      tmpDir,
    );

    await expect(introspectMcpServerAction.handler(ctx as any)).rejects.toThrow(
      /Failed to introspect MCP server https:\/\/mcp\.example\.com\/mcp: Streamable HTTP error: 401/,
    );
  });
});
