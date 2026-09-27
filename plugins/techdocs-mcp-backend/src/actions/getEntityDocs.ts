/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import type {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { parseEntityRef } from '@backstage/catalog-model';
import { InputError, NotFoundError, ResponseError } from '@backstage/errors';

type Deps = {
  actionsRegistry: ActionsRegistryService;
  discovery: DiscoveryService;
  auth: AuthService;
  logger: LoggerService;
};

type TechDocsMetadata = {
  site_name?: string;
  site_description?: string;
  files?: string[];
};

/** Very small HTML -> text converter, good enough for feeding docs to an LLM. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

/** Max number of page names embedded in a "page not found" error message. */
const MAX_LISTED_PAGES = 50;

/**
 * Max number of page names returned in the action output. TechDocs sites can
 * have thousands of files; returning them all would bloat the MCP response and
 * inflate memory/latency, so the list is capped and `availablePagesTruncated`
 * / `totalAvailablePages` tell the caller when there is more.
 */
const MAX_RETURNED_PAGES = 100;

/** Best-effort percent-decode; returns the input unchanged if it is malformed. */
function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Normalise a requested doc path to a fetchable file within the built site.
 *
 * `path` is caller-controlled, so this also validates it: query/fragment parts
 * are stripped (a doc path addresses a file, not a URL with params) and any
 * `..` traversal segment — literal, percent-encoded (`%2e%2e`), or hidden behind
 * a backslash separator — is rejected. Without this, the WHATWG URL parser used
 * by `fetch` would collapse `..` segments and let a caller escape the entity's
 * docs directory.
 *
 * @throws {InputError} if the path attempts traversal.
 */
function normalizeDocPath(path?: string): string {
  if (!path || path === '/' || path.trim() === '') {
    return 'index.html';
  }
  // Drop any query/fragment the caller may have appended and normalise
  // backslashes so Windows-style separators can't smuggle a `..` past the check.
  let p = path
    .trim()
    .replace(/[?#].*$/, '')
    .replace(/\\/g, '/');
  const wasDirStyle = p.endsWith('/');
  p = p.replace(/^\/+/, '');

  const segments = p.split('/').filter(seg => seg !== '' && seg !== '.');
  for (const seg of segments) {
    // Reject `..` and any segment that *decodes* to a traversal token or to an
    // embedded path separator (`%2e%2e`, `%2f`, `%5c`, `%2e%2e%2f`, …). Encoded
    // separators would survive the split-on-`/` above and could re-introduce a
    // `..` once a downstream server decodes the URL.
    const decoded = safeDecode(seg);
    if (
      seg === '..' ||
      decoded === '..' ||
      decoded.includes('/') ||
      decoded.includes('\\')
    ) {
      throw new InputError(
        `Invalid documentation path "${path}": path traversal is not allowed.`,
      );
    }
  }

  let normalized = segments.join('/');
  if (normalized === '') {
    return 'index.html';
  }
  if (wasDirStyle) {
    normalized = `${normalized}/index.html`;
  } else if (!/\.[a-z0-9]+$/i.test(normalized)) {
    // Directory-style path with no extension -> its index page.
    normalized = `${normalized}/index.html`;
  }
  return normalized;
}

/**
 * Formats the available-page list for a "not found" error, truncating large
 * TechDocs sites so the message (and any log line / MCP response built from it)
 * stays bounded.
 */
function formatAvailablePages(pages: string[]): string {
  if (pages.length === 0) {
    return 'No pages are available for this entity.';
  }
  const shown = pages.slice(0, MAX_LISTED_PAGES);
  if (pages.length > shown.length) {
    return `Available pages (showing ${shown.length} of ${
      pages.length
    }): ${shown.join(', ')}, …`;
  }
  return `Available pages: ${shown.join(', ')}`;
}

export function registerGetEntityDocsAction({
  actionsRegistry,
  discovery,
  auth,
  logger,
}: Deps): void {
  actionsRegistry.register({
    name: 'get-entity-docs',
    title: 'Get Component Documentation',
    description:
      'Fetch the TechDocs documentation for a catalog entity (component, system, etc.). ' +
      'Returns the requested page as plain text (default) or raw HTML, along with the ' +
      'list of available documentation pages so you can navigate to a specific one.',
    attributes: { readOnly: true, idempotent: true },
    schema: {
      input: z =>
        z.object({
          entityRef: z
            .string()
            .describe(
              'Entity reference, e.g. "component:default/my-service" or just "my-service" ' +
                '(defaults to kind "component", namespace "default").',
            ),
          path: z
            .string()
            .optional()
            .describe(
              'Optional documentation page path relative to the docs site, e.g. ' +
                '"index.html" or "getting-started/". Defaults to the docs home page.',
            ),
          format: z
            .enum(['text', 'html'])
            .optional()
            .describe(
              'Output format. "text" (default) strips HTML; "html" is raw.',
            ),
        }),
      output: z =>
        z.object({
          entityRef: z.string(),
          siteName: z.string().optional(),
          path: z.string(),
          content: z.string(),
          availablePages: z.array(z.string()),
          totalAvailablePages: z.number(),
          availablePagesTruncated: z.boolean(),
        }),
    },
    action: async ({ input, credentials }) => {
      const { kind, namespace, name } = parseEntityRef(input.entityRef, {
        defaultKind: 'component',
        defaultNamespace: 'default',
      });
      // TechDocs stores/serves the entity triplet lower-cased.
      const ns = namespace.toLowerCase();
      const k = kind.toLowerCase();
      const n = name.toLowerCase();

      // Validate/normalise the caller-supplied path up front so a traversal
      // attempt is rejected before we make any request.
      const docPath = normalizeDocPath(input.path);

      const baseUrl = await discovery.getBaseUrl('techdocs');
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'techdocs',
      });
      const authHeaders = { Authorization: `Bearer ${token}` };

      // Best-effort metadata fetch for the site name and the page list.
      let metadata: TechDocsMetadata = {};
      try {
        const metaRes = await fetch(
          `${baseUrl}/metadata/techdocs/${ns}/${k}/${n}`,
          { headers: authHeaders },
        );
        if (metaRes.ok) {
          metadata = (await metaRes.json()) as TechDocsMetadata;
        } else if (metaRes.status === 404) {
          throw new NotFoundError(
            `No TechDocs found for "${input.entityRef}". The entity may not have a ` +
              '"backstage.io/techdocs-ref" annotation, or its docs have not been built yet.',
          );
        }
      } catch (err) {
        if (err instanceof NotFoundError) throw err;
        logger.warn(
          `Failed to fetch TechDocs metadata for ${input.entityRef}: ${err}`,
        );
      }

      const allPages = metadata.files ?? [];

      // Encode each path segment so reserved characters in a legitimate file
      // name can't corrupt the request target. Traversal segments were already
      // rejected in normalizeDocPath, so no `..` survives here.
      const encodedDocPath = docPath
        .split('/')
        .map(encodeURIComponent)
        .join('/');

      const contentRes = await fetch(
        `${baseUrl}/static/docs/${ns}/${k}/${n}/${encodedDocPath}`,
        { headers: authHeaders },
      );
      if (contentRes.status === 404) {
        throw new NotFoundError(
          `Documentation page "${docPath}" was not found for "${
            input.entityRef
          }". ${formatAvailablePages(allPages)}`,
        );
      }
      if (!contentRes.ok) {
        throw await ResponseError.fromResponse(contentRes);
      }

      const raw = await contentRes.text();
      const format = input.format ?? 'text';
      const content = format === 'html' ? raw : htmlToText(raw);

      return {
        output: {
          entityRef: `${k}:${ns}/${n}`,
          siteName: metadata.site_name,
          path: docPath,
          content,
          availablePages: allPages.slice(0, MAX_RETURNED_PAGES),
          totalAvailablePages: allPages.length,
          availablePagesTruncated: allPages.length > MAX_RETURNED_PAGES,
        },
      };
    },
  });
}
