import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import fs from 'fs-extra';
import { fetchPlatformApiExamples } from './fetchPlatformApi.examples';
import path from 'path';
import FormData from 'form-data';

type ContentType = 'json' | 'formData' | 'urlEncoded';

/** Maps common file extensions to their MIME types. */
const MIME_TYPES: Record<string, string> = {
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.zip': 'application/zip',
  '.gz': 'application/gzip',
  '.tar': 'application/x-tar',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.html': 'text/html',
  '.yaml': 'application/x-yaml',
  '.yml': 'application/x-yaml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.flogo': 'application/octet-stream',
};

/** Maps non-formData content types to their Content-Type header values. */
const CONTENT_TYPE_HEADERS: Record<Exclude<ContentType, 'formData'>, string> = {
  json: 'application/json',
  urlEncoded: 'application/x-www-form-urlencoded',
};

/**
 * Returns the MIME type for a file. Uses `explicitMimeType` when provided;
 * otherwise derives it from the file extension, falling back to
 * `application/octet-stream`.
 */
function getMimeType(filePath: string, explicitMimeType?: string): string {
  if (explicitMimeType) {
    return explicitMimeType;
  }
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}

/**
 * Serializes an object to an `application/x-www-form-urlencoded` string.
 * Object and array values are JSON-stringified before encoding.
 */
function toUrlEncoded(data: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      params.append(
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value),
      );
    }
  }
  return params.toString();
}

/**
 * Coerces a body value to a plain object. Strings are parsed as JSON;
 * plain objects are returned as-is.
 * @throws if a string value is not valid JSON.
 */
function parseBodyToObject(
  body: string | Record<string, unknown>,
): Record<string, unknown> {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      throw new Error(
        'Body string must be valid JSON when using formData or urlEncoded content type',
      );
    }
  }
  return body;
}

/**
 * Reads the text content of a workspace-relative file path.
 * @throws if the file does not exist.
 */
async function readFileAsText(
  workspacePath: string,
  filePathInput: string,
): Promise<string> {
  const safePath = resolveSafeChildPath(workspacePath, filePathInput);
  if (!(await fs.pathExists(safePath))) {
    throw new Error(`File not found at: ${filePathInput}`);
  }
  return fs.readFile(safePath, 'utf-8');
}

/**
 * Builds a multipart `FormData` object from an optional file and optional body
 * fields. The file is read into memory as a `Buffer` so that `getBuffer()` can
 * serialise the entire payload synchronously — required when using Node.js
 * native `fetch` which does not accept a readable stream as the body.
 */
async function buildFormData(
  workspacePath: string,
  formFieldName: string,
  filePathInput?: string,
  bodyInput?: string | Record<string, unknown>,
  mimeType?: string,
): Promise<FormData> {
  const formData = new FormData();

  if (filePathInput) {
    const safePath = resolveSafeChildPath(workspacePath, filePathInput);
    if (!(await fs.pathExists(safePath))) {
      throw new Error(`File not found at: ${filePathInput}`);
    }
    const [fileBuffer, fileStats] = await Promise.all([
      fs.readFile(safePath),
      fs.stat(safePath),
    ]);
    const fileName = path.basename(filePathInput);
    const contentType = getMimeType(filePathInput, mimeType);

    formData.append(formFieldName, fileBuffer, {
      filename: fileName,
      contentType,
      knownLength: fileStats.size,
    });
  }

  if (bodyInput) {
    const bodyData = parseBodyToObject(bodyInput);
    for (const [key, value] of Object.entries(bodyData)) {
      formData.append(
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      );
    }
  }

  return formData;
}

/**
 * Resolves the authentication token to attach to the outbound request.
 *
 * Priority for caller-supplied tokens (honoured for any allowed target host,
 * because the caller explicitly owns and provides them for this call):
 *   1. `cpToken` from template input (explicit per-invocation override)
 *   2. `cpToken` from template secrets
 *
 * The `TIBCOPlatformToken` from Backstage configuration is an *ambient backend
 * service credential*, not something the caller supplies per call. It is only
 * attached when the request targets the trusted Control Plane host
 * (`isTrustedCpTarget`). This prevents a caller-chosen `baseUrl` from causing
 * the service credential to be sent — and thereby exfiltrated — to an arbitrary
 * host via SSRF.
 *
 * Returns `undefined` when no applicable token is found.
 */
function resolveAuthToken(
  inputToken: string | undefined,
  secretToken: string | undefined,
  configToken: string | undefined,
  isTrustedCpTarget: boolean,
): string | undefined {
  const callerToken = inputToken ?? secretToken;
  if (callerToken) {
    return callerToken;
  }
  return isTrustedCpTarget ? configToken : undefined;
}

/**
 * Resolves the Control Plane base URL with the correct protocol.
 *
 * Priority:
 *   1. `CP_DOMAIN` env variable — raw domain accessed over `http` (internal/proxy)
 *   2. `cpLink` from Backstage config — URL or domain accessed over `https` (external)
 *
 * Returns `undefined` when neither source is configured.
 */
export function getCpBaseUrl(config: Config): string | undefined {
  const cpDomain = process.env.CP_DOMAIN;
  if (cpDomain) {
    const domain = cpDomain.startsWith('/') ? cpDomain.slice(1) : cpDomain;
    return `http://${domain}`;
  }
  const cpLink = config.getOptionalString('cpLink');
  if (cpLink) {
    return ensureHttps(cpLink);
  }
  return undefined;
}

/**
 * Resolves the external-facing Control Plane URL suitable for browser navigation.
 *
 * Unlike `getCpBaseUrl()` which prefers `CP_DOMAIN` (internal K8s proxy over `http`),
 * this function resolves the external `https` URL that end-users can click in a browser.
 *
 * Priority:
 *   1. `cpLink` from Backstage config → `ensureHttps()` (local dev)
 *   2. `CP_URL` env variable → `https://${CP_URL}` (production K8s)
 *   3. Empty string (graceful fallback — link omitted or rendered as relative)
 */
export function getCpBrowserUrl(config: Config): string {
  const cpLink = config.getOptionalString('cpLink');
  if (cpLink) {
    return ensureHttps(cpLink);
  }
  const cpUrl = process.env.CP_URL;
  if (cpUrl) {
    return `https://${cpUrl}`;
  }
  return '';
}

/**
 * Ensures a URL string has an `https://` prefix.
 * Used for user-supplied `baseUrl` and config-sourced `cpLink` values.
 * Already-correct `http://` or `https://` strings are returned unchanged.
 */
function ensureHttps(url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  const cleaned = url.startsWith('/') ? url.slice(1) : url;
  return `https://${cleaned}`;
}

/**
 * Constructs a well-formed URL by joining a base URL and an endpoint path,
 * ensuring exactly one `/` separates them. For user-provided `baseUrl` values
 * that lack a protocol, `https://` is added as a safe default.
 */
function buildUrl(baseUrl: string, endpoint: string): string {
  const joined = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  return ensureHttps(joined);
}

/**
 * Extracts the lowercased hostname from a URL string, or `undefined` when it
 * cannot be parsed. Parsing with `URL().hostname` (rather than string matching)
 * defeats authority-confusion tricks such as embedded credentials
 * (`https://trusted-host@evil.example`) that would otherwise fool a naive
 * "does the URL contain the trusted host" check.
 */
function safeHostname(url: string): string | undefined {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

/**
 * Returns the set of hostnames that are considered the trusted Control Plane
 * endpoints for this deployment. These are derived exclusively from
 * operator-controlled configuration (`CP_DOMAIN`/`cpLink`/`CP_URL`), never from
 * caller input, so they are safe to treat as the destinations allowed to
 * receive the ambient platform service credential.
 */
function getTrustedCpHosts(config: Config): Set<string> {
  const hosts = new Set<string>();
  for (const url of [getCpBaseUrl(config), getCpBrowserUrl(config)]) {
    const host = url ? safeHostname(url) : undefined;
    if (host) {
      hosts.add(host);
    }
  }
  return hosts;
}

export const fetchPlatformApiAction = (config: Config) => {
  return createTemplateAction({
    id: 'tibco:call-platform-api',
    description:
      'Calls an external API with authentication. Can use direct URL or Backstage proxy.',
    // Read-only verbs (GET/HEAD/OPTIONS) run unchanged during a dry-run since
    // they carry no risk; mutating verbs are suppressed and logged instead
    // (see the isDryRun guard in the handler).
    supportsDryRun: true,
    examples: fetchPlatformApiExamples,
    schema: {
      input: z =>
        z.object({
          baseUrl: z
            .string()
            .optional()
            .describe('Base URL. Defaults to config value cpLink if omitted.'),
          endpoint: z.string().describe('The endpoint path (e.g. /users)'),
          method: z
            .string()
            .default('GET')
            .describe('HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)'),
          body: z
            .union([z.string(), z.record(z.any())])
            .optional()
            .describe('Request body data'),
          filePath: z
            .string()
            .optional()
            .describe(
              'Workspace-relative path to a file to upload (formData) or read as body content. Supports any file type: .zip, .json, .flogo, etc.',
            ),
          fileMimeType: z
            .string()
            .optional()
            .describe(
              'MIME type of the file. Auto-detected from extension if omitted. Examples: application/zip, application/json, application/octet-stream',
            ),
          contentType: z
            .enum(['json', 'formData', 'urlEncoded'])
            .optional()
            .default('json')
            .describe(
              'Content type for the request body: json, formData, or urlEncoded. Default: json',
            ),
          formFieldName: z
            .string()
            .optional()
            .default('file')
            .describe(
              'Form field name used for the file when contentType is formData. Default: file',
            ),
          headers: z
            .record(z.string())
            .optional()
            .describe('Additional HTTP headers to include in the request'),
          requireAuth: z
            .boolean()
            .optional()
            .default(true)
            .describe(
              'Whether an authentication token is required. Throws error if true and no token is found. Default: true',
            ),
          cpToken: z
            .string()
            .optional()
            .describe(
              'Authentication token. Takes priority over template secrets and Backstage configuration.',
            ),
        }),
      output: z =>
        z.object({
          status: z.number(),
          data: z.any(),
          headers: z.any(),
          cpUrl: z.string(),
          appBaseUrl: z
            .string()
            .describe(
              'The Developer Hub base URL (from app.baseUrl config). Use for constructing browser-facing catalog links.',
            ),
          cpBrowserUrl: z
            .string()
            .describe(
              'The external Control Plane URL for browser navigation (from cpLink config or CP_URL env). Empty string if unavailable.',
            ),
        }),
    },
    async handler(ctx) {
      const {
        baseUrl,
        endpoint,
        method,
        body,
        filePath,
        fileMimeType,
        contentType = 'json',
        formFieldName = 'file',
        headers: inputHeaders,
        requireAuth = true,
        cpToken: inputToken,
      } = ctx.input;

      // Normalize the verb once so mutating-detection and the dry-run log agree
      // on casing.
      const normalizedMethod = (method ?? 'GET').toUpperCase();

      // URL resolution — validated BEFORE the dry-run guard so a dry-run surfaces
      // the same misconfiguration (missing baseUrl/cpLink) a real run would,
      // instead of silently succeeding with synthetic output.
      const resolvedBaseUrl = baseUrl ?? getCpBaseUrl(config);
      if (!resolvedBaseUrl) {
        throw new Error(
          'No baseUrl provided in input or configuration (cpLink).',
        );
      }
      const finalUrl = buildUrl(resolvedBaseUrl, endpoint);

      // SSRF / credential-exfil guard.
      //
      // `baseUrl` is caller-controlled, so `finalUrl` can point at any host. Two
      // protections are applied here:
      //
      //  1. Ambient-credential scoping (root cause): the ambient backend service
      //     credential (`TIBCOPlatformToken` from config) is only attached when
      //     the target host is a trusted Control Plane host — see
      //     `resolveAuthToken`. This stops a caller-chosen `baseUrl` from
      //     exfiltrating the service token.
      //
      //  2. Optional operator host allowlist (defense-in-depth): when
      //     `scaffolder.tibcoCallPlatformApi.allowedHosts` is configured, any
      //     target host outside the trusted CP hosts + that allowlist is
      //     rejected (fail closed). When it is not configured, existing behaviour
      //     is preserved but a caller-supplied non-CP target is logged.
      const targetHost = safeHostname(finalUrl);
      if (!targetHost) {
        throw new Error(
          `Refusing to call platform API: '${finalUrl}' is not a valid URL.`,
        );
      }

      const trustedCpHosts = getTrustedCpHosts(config);
      const isTrustedCpTarget = trustedCpHosts.has(targetHost);

      const allowedHosts = (
        config.getOptionalStringArray(
          'scaffolder.tibcoCallPlatformApi.allowedHosts',
        ) ?? []
      ).map(host => host.toLowerCase());

      if (allowedHosts.length > 0) {
        if (!isTrustedCpTarget && !allowedHosts.includes(targetHost)) {
          throw new Error(
            `Refusing to call platform API: host '${targetHost}' is not permitted. Add it to 'scaffolder.tibcoCallPlatformApi.allowedHosts' to allow it.`,
          );
        }
      } else if (baseUrl && !isTrustedCpTarget) {
        ctx.logger.warn(
          `tibco:call-platform-api is targeting non-Control-Plane host '${targetHost}'. Configure 'scaffolder.tibcoCallPlatformApi.allowedHosts' to restrict outbound targets.`,
        );
      }

      // Authentication — resolved and validated BEFORE the dry-run guard so a
      // dry-run surfaces the same auth misconfiguration a real run would (e.g.
      // requireAuth with no token available) instead of silently succeeding.
      const cptoken = resolveAuthToken(
        inputToken,
        ctx.secrets?.cpToken,
        config.getOptionalString('TIBCOPlatformToken'),
        isTrustedCpTarget,
      );
      if (requireAuth && !cptoken) {
        const cpTokenScopingHint = !isTrustedCpTarget
          ? " The configured 'TIBCOPlatformToken' is only sent to the trusted Control Plane host, so for other hosts you must pass cpToken explicitly."
          : '';
        throw new Error(
          `Authentication required but no token found. Provide cpToken in the action input, template secrets, or as TIBCOPlatformToken in Backstage configuration.${cpTokenScopingHint}`,
        );
      }

      // During a dry-run, suppress mutating calls (anything other than the
      // read-only verbs) so no real platform change is made. Read-only calls
      // fall through and execute normally, which is what makes the dry-run
      // meaningful. The emitted outputs here are SYNTHETIC placeholders, not a
      // real API response. The SSRF/host guard and auth validation above still
      // run first, so a misconfigured target or missing token surfaces during a
      // dry-run too.
      const isMutating = !['GET', 'HEAD', 'OPTIONS'].includes(normalizedMethod);
      if (ctx.isDryRun && isMutating) {
        ctx.logger.info(
          `[dry-run] Would call ${normalizedMethod} ${endpoint}. Request suppressed. ` +
            `Emitting synthetic status=200 and empty data.`,
        );
        ctx.output('status', 200);
        ctx.output('data', {});
        ctx.output('headers', {});
        ctx.output('cpUrl', resolvedBaseUrl);
        ctx.output(
          'appBaseUrl',
          config.getString('app.baseUrl').replace(/\/$/, ''),
        );
        ctx.output('cpBrowserUrl', getCpBrowserUrl(config));
        return;
      }

      // Output platform URLs (config-derived, available regardless of API call outcome)
      ctx.output(
        'appBaseUrl',
        config.getString('app.baseUrl').replace(/\/$/, ''),
      );
      ctx.output('cpBrowserUrl', getCpBrowserUrl(config));

      ctx.logger.info(
        `tibco:call-platform-api — ${normalizedMethod} ${finalUrl} (contentType=${contentType}, requireAuth=${requireAuth})`,
      );

      // Build request body
      let requestBody: string | FormData | undefined;
      let isFormData = false;

      switch (contentType) {
        case 'formData': {
          ctx.logger.info('Building multipart/form-data body');
          requestBody = await buildFormData(
            ctx.workspacePath,
            formFieldName,
            filePath,
            body,
            fileMimeType,
          );
          if (filePath) {
            const stats = await fs.stat(
              resolveSafeChildPath(ctx.workspacePath, filePath),
            );
            ctx.logger.info(
              `FormData file: field="${formFieldName}", name="${path.basename(
                filePath,
              )}", size=${stats.size} bytes, mimeType="${getMimeType(
                filePath,
                fileMimeType,
              )}"`,
            );
          }
          isFormData = true;
          break;
        }

        case 'urlEncoded': {
          ctx.logger.info('Building application/x-www-form-urlencoded body');
          let dataToEncode: Record<string, unknown>;

          if (filePath) {
            const fileContent = await readFileAsText(
              ctx.workspacePath,
              filePath,
            );
            try {
              dataToEncode = JSON.parse(fileContent);
            } catch {
              throw new Error(
                `File at "${filePath}" must contain valid JSON for urlEncoded content type`,
              );
            }
          } else if (body) {
            dataToEncode = parseBodyToObject(body);
          } else {
            throw new Error(
              'Either body or filePath is required for urlEncoded content type',
            );
          }

          requestBody = toUrlEncoded(dataToEncode);
          ctx.logger.info(
            `URL-encoded body fields: [${Object.keys(dataToEncode).join(
              ', ',
            )}]`,
          );
          break;
        }

        case 'json':
        default: {
          if (filePath) {
            const fileContent = await readFileAsText(
              ctx.workspacePath,
              filePath,
            );
            try {
              const parsed: unknown = JSON.parse(fileContent);
              requestBody = JSON.stringify(parsed);
            } catch {
              throw new Error(
                `File at "${filePath}" must contain valid JSON for json content type`,
              );
            }
            ctx.logger.info(
              `JSON body read from file "${filePath}" (${
                (requestBody as string).length
              } chars)`,
            );
          } else if (body) {
            requestBody =
              typeof body === 'string' ? body : JSON.stringify(body);
          }
          break;
        }
      }

      //  Build request headers
      // When using formData, strip any user-supplied Content-Type header so
      // that the form-data library can set it with the correct multipart boundary.
      const sanitisedInputHeaders: Record<string, string> = Object.fromEntries(
        Object.entries(inputHeaders ?? {}).filter(([key]) => {
          const isContentType = key.toLowerCase() === 'content-type';
          if (isContentType && isFormData) {
            ctx.logger.warn(
              `Dropping user-supplied header "${key}" — formData auto-generates Content-Type with boundary`,
            );
          }
          return !(isContentType && isFormData);
        }),
      );

      const baseHeaders: Record<string, string> = {
        ...(cptoken && requireAuth
          ? { authorization: `Bearer ${cptoken}` }
          : {}),
        ...(!isFormData ? { accept: 'application/json' } : {}),
        ...sanitisedInputHeaders,
      };

      if (!isFormData) {
        const ctHeader =
          CONTENT_TYPE_HEADERS[contentType as Exclude<ContentType, 'formData'>];
        if (ctHeader) {
          baseHeaders['content-type'] = ctHeader;
        }
      }

      // Merge form-data generated headers last so the boundary-bearing
      // Content-Type header always wins.
      const finalHeaders: Record<string, string> =
        isFormData && requestBody instanceof FormData
          ? { ...baseHeaders, ...requestBody.getHeaders() }
          : baseHeaders;

      // ctx.logger.info(`Request headers: ${JSON.stringify(finalHeaders)}`);

      // Execute request
      try {
        // Native Node.js fetch requires a serialised body, not a readable stream.
        // form-data's getBuffer() synchronously serialises the whole payload.
        // Slice the Buffer's underlying ArrayBuffer to obtain a plain ArrayBuffer
        // (not SharedArrayBuffer), which satisfies the BodyInit constraint.
        const formBuffer =
          isFormData && requestBody instanceof FormData
            ? requestBody.getBuffer()
            : undefined;
        const fetchBody: ArrayBuffer | string | undefined = formBuffer
          ? (formBuffer.buffer.slice(
              formBuffer.byteOffset,
              formBuffer.byteOffset + formBuffer.byteLength,
            ) as ArrayBuffer)
          : (requestBody as string | undefined);

        if (formBuffer) {
          ctx.logger.info(
            `FormData body serialised: ${formBuffer.length} bytes`,
          );
        }

        const response = await fetch(finalUrl, {
          method,
          headers: finalHeaders,
          body: fetchBody,
        });

        const responseData: unknown = await response.json();

        // ctx.logger.info(`Response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(
            `API call failed with status ${response.status}: ${JSON.stringify(
              responseData,
            )}`,
          );
        }

        // Iterate headers via forEach for broad runtime compatibility.
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // ctx.logger.debug(`tibco:call-platform-api response data: ${JSON.stringify(responseData)}`);
        ctx.output('status', response.status);
        ctx.output('data', responseData);
        ctx.output('headers', responseHeaders);
        ctx.output('cpUrl', resolvedBaseUrl);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ctx.logger.error(`tibco:call-platform-api failed: ${message}`);
        throw new Error(`Failed to call platform API: ${message}`);
      }
    },
  });
};
