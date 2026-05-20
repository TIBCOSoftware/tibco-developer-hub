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
 * Resolves the authentication token with the following priority order:
 *   1. `cpToken` from template input (explicit per-invocation override)
 *   2. `cpToken` from template secrets
 *   3. `TIBCOPlatformToken` from Backstage configuration
 *
 * Returns `undefined` when no token is found.
 */
function resolveAuthToken(
  inputToken: string | undefined,
  secretToken: string | undefined,
  configToken: string | undefined,
): string | undefined {
  return inputToken ?? secretToken ?? configToken;
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

export const fetchPlatformApiAction = (config: Config) => {
  return createTemplateAction({
    id: 'tibco:call-platform-api',
    description:
      'Calls an external API with authentication. Can use direct URL or Backstage proxy.',
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

      // URL resolution
      const resolvedBaseUrl = baseUrl ?? getCpBaseUrl(config);
      if (!resolvedBaseUrl) {
        throw new Error(
          'No baseUrl provided in input or configuration (cpLink).',
        );
      }
      const finalUrl = buildUrl(resolvedBaseUrl, endpoint);

      // Output platform URLs (config-derived, available regardless of API call outcome)
      ctx.output(
        'appBaseUrl',
        config.getString('app.baseUrl').replace(/\/$/, ''),
      );
      ctx.output('cpBrowserUrl', getCpBrowserUrl(config));

      // Authentication
      const cptoken = resolveAuthToken(
        inputToken,
        ctx.secrets?.cpToken,
        config.getOptionalString('TIBCOPlatformToken'),
      );
      if (requireAuth && !cptoken) {
        throw new Error(
          'Authentication required but no token found. Provide cpToken in the action input, template secrets, or as TIBCOPlatformToken in Backstage configuration.',
        );
      }

      ctx.logger.info(
        `tibco:call-platform-api — ${method} ${finalUrl} (contentType=${contentType}, requireAuth=${requireAuth})`,
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
