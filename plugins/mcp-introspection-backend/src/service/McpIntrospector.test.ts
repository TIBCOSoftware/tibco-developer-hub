/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { resolveRemoteUrl } from './McpIntrospector.ts';

describe('resolveRemoteUrl', () => {
  it('returns an absolute URL unchanged', () => {
    expect(resolveRemoteUrl('https://mcp.example.com/mcp').href).toBe(
      'https://mcp.example.com/mcp',
    );
  });

  it('appends a relative path to the base path (preserving /tibco/hub)', () => {
    expect(
      resolveRemoteUrl(
        '/api/mcp-actions/v1',
        'https://test-gg.localhost.dataplanes.pro/tibco/hub',
      ).href,
    ).toBe(
      'https://test-gg.localhost.dataplanes.pro/tibco/hub/api/mcp-actions/v1',
    );
  });

  it('tolerates a trailing slash on the base URL', () => {
    expect(
      resolveRemoteUrl('/api/mcp-actions/v1', 'https://host/tibco/hub/').href,
    ).toBe('https://host/tibco/hub/api/mcp-actions/v1');
  });

  it('does not duplicate the base path when the relative URL already includes it', () => {
    expect(
      resolveRemoteUrl(
        '/tibco/hub/api/mcp-actions/v1',
        'https://host/tibco/hub',
      ).href,
    ).toBe('https://host/tibco/hub/api/mcp-actions/v1');
  });

  it('works when the base URL has no path', () => {
    expect(
      resolveRemoteUrl('/tibco/hub/api/mcp-actions/v1', 'http://localhost:7007')
        .href,
    ).toBe('http://localhost:7007/tibco/hub/api/mcp-actions/v1');
  });

  it('preserves query and hash on the relative URL', () => {
    expect(
      resolveRemoteUrl('/api/mcp?foo=bar#frag', 'https://host/tibco/hub').href,
    ).toBe('https://host/tibco/hub/api/mcp?foo=bar#frag');
  });

  it('throws when the URL is relative and no base URL is provided', () => {
    expect(() => resolveRemoteUrl('/api/mcp-actions/v1')).toThrow(
      /not absolute and no base URL/,
    );
  });

  it('throws when the base URL itself is invalid', () => {
    expect(() =>
      resolveRemoteUrl('/api/mcp-actions/v1', 'not-a-valid-base'),
    ).toThrow(/could not resolve against base/);
  });
});
