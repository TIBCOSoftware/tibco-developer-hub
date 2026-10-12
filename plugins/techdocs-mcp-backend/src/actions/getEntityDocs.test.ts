/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { registerGetEntityDocsAction } from './getEntityDocs';

/** Builds a minimal object shaped like the parts of `Response` this code uses. */
function mockResponse(opts: {
  ok?: boolean;
  status?: number;
  json?: unknown;
  text?: string;
}): Response {
  return {
    ok: opts.ok ?? true,
    status: opts.status ?? 200,
    json: async () => opts.json ?? {},
    text: async () => opts.text ?? '',
  } as unknown as Response;
}

describe('get-entity-docs action', () => {
  const baseUrl = 'http://localhost:7007/api/techdocs';
  const credentials = {
    $$type: '@backstage/BackstageCredentials',
  } as any;

  let registered: any;
  let actionsRegistry: any;
  let discovery: any;
  let auth: any;
  let logger: any;
  let fetchSpy: jest.SpyInstance;

  const invoke = (input: any) => registered.action({ input, credentials });

  /** Default fetch mock: metadata returns `files`, content returns `html`. */
  function mockFetch(
    files: string[] = ['index.html'],
    html = '<html><body>doc</body></html>',
    contentStatus = 200,
  ) {
    fetchSpy.mockImplementation(async (url: any) => {
      if (String(url).includes('/metadata/')) {
        return mockResponse({
          ok: true,
          status: 200,
          json: { site_name: 'My Docs', files },
        });
      }
      return mockResponse({
        ok: contentStatus < 400,
        status: contentStatus,
        text: html,
      });
    });
  }

  const contentCall = () =>
    fetchSpy.mock.calls.find(c => String(c[0]).includes('/static/docs/'));

  beforeEach(() => {
    registered = undefined;
    actionsRegistry = {
      register: jest.fn((cfg: any) => {
        registered = cfg;
      }),
    };
    discovery = { getBaseUrl: jest.fn().mockResolvedValue(baseUrl) };
    auth = {
      getPluginRequestToken: jest
        .fn()
        .mockResolvedValue({ token: 'test-token' }),
    };
    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn().mockReturnThis(),
    };
    fetchSpy = jest.spyOn(globalThis, 'fetch');
    registerGetEntityDocsAction({ actionsRegistry, discovery, auth, logger });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers a single read-only, idempotent action', () => {
    expect(actionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registered.name).toBe('get-entity-docs');
    expect(registered.attributes).toEqual({
      readOnly: true,
      idempotent: true,
    });
  });

  it('fetches the index page by default and returns stripped text', async () => {
    mockFetch(
      ['index.html'],
      '<html><body><h1>Title</h1><p>Hello&nbsp;world</p><script>evil()</script></body></html>',
    );

    const res = await invoke({ entityRef: 'component:default/my-service' });

    expect(res.output.path).toBe('index.html');
    expect(res.output.content).toContain('Title');
    expect(res.output.content).toContain('Hello world');
    expect(res.output.content).not.toContain('<h1>');
    expect(res.output.content).not.toContain('evil()');
    expect(String(contentCall()[0])).toBe(
      `${baseUrl}/static/docs/default/component/my-service/index.html`,
    );
  });

  it('returns raw HTML when format is "html"', async () => {
    mockFetch(['index.html'], '<h1>Raw</h1>');
    const res = await invoke({ entityRef: 'my-service', format: 'html' });
    expect(res.output.content).toBe('<h1>Raw</h1>');
  });

  it('lower-cases the entity triplet in both the request and the output', async () => {
    mockFetch();
    const res = await invoke({ entityRef: 'Component:Default/My-Service' });
    expect(res.output.entityRef).toBe('component:default/my-service');
    expect(String(contentCall()[0])).toContain(
      '/static/docs/default/component/my-service/',
    );
  });

  it('appends index.html to a directory-style path', async () => {
    mockFetch();
    const res = await invoke({
      entityRef: 'my-service',
      path: 'getting-started/',
    });
    expect(res.output.path).toBe('getting-started/index.html');
  });

  it('appends index.html to an extensionless path', async () => {
    mockFetch();
    const res = await invoke({ entityRef: 'my-service', path: 'guide/setup' });
    expect(res.output.path).toBe('guide/setup/index.html');
  });

  it('strips a query string / fragment from the path', async () => {
    mockFetch();
    const res = await invoke({
      entityRef: 'my-service',
      path: 'page.html?foo=bar#frag',
    });
    expect(res.output.path).toBe('page.html');
  });

  it('encodes reserved characters in a legitimate file name', async () => {
    mockFetch(['my file.html']);
    await invoke({ entityRef: 'my-service', path: 'my file.html' });
    expect(String(contentCall()[0])).toContain('/my%20file.html');
  });

  it('rejects a literal path-traversal attempt before making any request', async () => {
    fetchSpy.mockImplementation(async () => mockResponse({}));
    await expect(
      invoke({ entityRef: 'my-service', path: '../../secret/index.html' }),
    ).rejects.toThrow(/traversal is not allowed/i);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(discovery.getBaseUrl).not.toHaveBeenCalled();
  });

  it('rejects a percent-encoded (%2e%2e) traversal attempt', async () => {
    fetchSpy.mockImplementation(async () => mockResponse({}));
    await expect(
      invoke({ entityRef: 'my-service', path: 'docs/%2e%2e/%2e%2e/etc' }),
    ).rejects.toThrow(/traversal is not allowed/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects a backslash-separated traversal attempt', async () => {
    fetchSpy.mockImplementation(async () => mockResponse({}));
    await expect(
      invoke({ entityRef: 'my-service', path: '..\\..\\secret' }),
    ).rejects.toThrow(/traversal is not allowed/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects a segment whose decoded form hides a separator', async () => {
    fetchSpy.mockImplementation(async () => mockResponse({}));
    // decodes to "../" — slips past a plain `=== '..'` check.
    await expect(
      invoke({ entityRef: 'my-service', path: 'docs/%2e%2e%2f/secret' }),
    ).rejects.toThrow(/traversal is not allowed/i);
    // encoded forward-slash inside a single segment.
    await expect(
      invoke({ entityRef: 'my-service', path: 'a%2f..%2fb' }),
    ).rejects.toThrow(/traversal is not allowed/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('caps availablePages and reports the true total when truncated', async () => {
    const many = Array.from({ length: 250 }, (_, i) => `page-${i}.html`);
    mockFetch(many);
    const res = await invoke({ entityRef: 'my-service' });
    expect(res.output.availablePages).toHaveLength(100);
    expect(res.output.totalAvailablePages).toBe(250);
    expect(res.output.availablePagesTruncated).toBe(true);
  });

  it('does not flag truncation for small sites', async () => {
    mockFetch(['index.html', 'a.html']);
    const res = await invoke({ entityRef: 'my-service' });
    expect(res.output.availablePages).toEqual(['index.html', 'a.html']);
    expect(res.output.totalAvailablePages).toBe(2);
    expect(res.output.availablePagesTruncated).toBe(false);
  });

  it('throws NotFoundError listing available pages when the page is missing', async () => {
    mockFetch(['index.html', 'a.html', 'b.html'], '', 404);
    const err = await invoke({
      entityRef: 'my-service',
      path: 'missing.html',
    }).catch((e: Error) => e);
    expect(err.message).toMatch(/was not found/i);
    expect(err.message).toContain(
      'Available pages: index.html, a.html, b.html',
    );
  });

  it('truncates the available-page list for large sites', async () => {
    const many = Array.from({ length: 120 }, (_, i) => `page-${i}.html`);
    mockFetch(many, '', 404);
    const err = await invoke({
      entityRef: 'my-service',
      path: 'missing.html',
    }).catch((e: Error) => e);
    expect(err.message).toContain('showing 50 of 120');
    expect(err.message).toContain('page-0.html');
    expect(err.message).not.toContain('page-50.html');
  });

  it('throws NotFoundError when the entity has no TechDocs metadata', async () => {
    fetchSpy.mockImplementation(async (url: any) => {
      if (String(url).includes('/metadata/')) {
        return mockResponse({ ok: false, status: 404 });
      }
      return mockResponse({});
    });
    await expect(invoke({ entityRef: 'my-service' })).rejects.toThrow(
      /No TechDocs found/i,
    );
  });

  it('requests the techdocs plugin token and sends it as a bearer header', async () => {
    mockFetch();
    await invoke({ entityRef: 'my-service' });
    expect(auth.getPluginRequestToken).toHaveBeenCalledWith({
      onBehalfOf: credentials,
      targetPluginId: 'techdocs',
    });
    expect(contentCall()[1].headers).toEqual({
      Authorization: 'Bearer test-token',
    });
  });
});
