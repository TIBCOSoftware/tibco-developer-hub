/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import {
  LoggerService,
  resolveSafeChildPath,
} from '@backstage/backend-plugin-api';
import { XMLParser } from 'fast-xml-parser';
import { promises } from 'fs';
import { relative } from 'path';
import { Worker } from 'worker_threads';
import { JsonArray, JsonObject, JsonPrimitive } from '@backstage/types';
import jp from 'jsonpath';
import { glob } from 'glob';
import { select } from 'xpath';
import { DOMParser } from '@xmldom/xmldom';
import { examples } from './extract-parameters.examples';
import RegexParser from 'regex-parser';
import { z as zz } from 'zod';

type JsonValue = JsonObject | JsonArray | JsonPrimitive;

enum TibcoImportType {
  xml = 'xml',
  json = 'json',
  file = 'file',
  workspace = 'workspace',
}

type TibcoImportXmlXpath = {
  type: TibcoImportType.xml;
  filePath: string;
  xPath: string;
};
type TibcoImportXmlJsonPath = {
  type: TibcoImportType.xml;
  filePath: string;
  jsonPath: string;
};
type TibcoImportJson = {
  type: TibcoImportType.json;
  filePath: string;
  jsonPath: string;
};
type RegexStatement = {
  regexPattern: string;
  regexFlags?: string;
};
type TibcoImportFile = {
  type: TibcoImportType.file;
  filePath: string;
  regex: string | RegexStatement;
};
type TibcoImportWorkspace = {
  type: TibcoImportType.workspace;
  directoryPath?: string;
  glob?: string;
  onlyName?: boolean;
  regex: string | RegexStatement;
};
type TibcoImport =
  | TibcoImportXmlXpath
  | TibcoImportXmlJsonPath
  | TibcoImportJson
  | TibcoImportFile
  | TibcoImportWorkspace;

interface ExtractParameters {
  [key: string]: TibcoImport;
}

interface ExtractOutput {
  [key: string]: JsonValue[] | undefined;
}

const importSchemaXMLXpath = zz
  .object({
    type: zz.literal(TibcoImportType.xml),
    filePath: zz.string(),
    xPath: zz.string(),
  })
  .required();

const importSchemaXMLJsonPath = zz
  .object({
    type: zz.literal(TibcoImportType.xml),
    filePath: zz.string(),
    jsonPath: zz.string(),
  })
  .required();

const importSchemaJson = zz
  .object({
    type: zz.literal(TibcoImportType.json),
    filePath: zz.string(),
    jsonPath: zz.string(),
  })
  .required();

const importSchemaFile = zz
  .object({
    type: zz.literal(TibcoImportType.file),
    filePath: zz.string(),
    regex: zz.union([
      zz.string(),
      zz.object({
        regexPattern: zz.string(),
        regexFlags: zz.string().optional(),
      }),
    ]),
  })
  .required();

const importSchemaWorkspace = zz.object({
  type: zz.literal(TibcoImportType.workspace),
  directoryPath: zz.string().optional(),
  glob: zz.string().optional(),
  onlyName: zz.boolean().optional(),
  regex: zz.union([
    zz.string(),
    zz.object({
      regexPattern: zz.string(),
      regexFlags: zz.string().optional(),
    }),
  ]),
});

/**
 * Rejects paths that resolve into a repository's git metadata directory.
 *
 * `resolveSafeChildPath` only prevents escaping the workspace (`../`); it still
 * permits dotfiles such as `.git/config`. A cloned repo's `.git/config` can hold
 * credential material (e.g. persisted `http.extraHeader`), so allowing an
 * arbitrary regex file-read over it would let a template exfiltrate secrets via
 * the action's output/logs. Reading git internals is never a legitimate use of
 * this action, so we block it defensively regardless of how git is configured.
 */
function assertNotGitInternal(workspacePath: string, resolvedPath: string) {
  const rel = relative(workspacePath, resolvedPath);
  const segments = rel.split(/[\\/]/);
  if (segments.some(segment => segment.toLowerCase() === '.git')) {
    throw new Error(
      `Refusing to read '${rel}': access to git internals ('.git') is not allowed.`,
    );
  }
}

/** Maximum wall-clock time a single regex evaluation is allowed to run. */
const REGEX_MATCH_TIMEOUT_MS = 1000;
/** Maximum length of a haystack (file content / path) fed to a regex. */
const MAX_HAYSTACK_LENGTH = 5_000_000;
/** Maximum length of a caller-supplied regex pattern. */
const MAX_PATTERN_LENGTH = 1000;

/**
 * Worker entrypoint (executed via `new Worker(..., { eval: true })`). It runs the
 * regex match(es) in its own thread so the parent can hard-terminate it on
 * timeout. A single compiled `RegExp` is applied to every input in `inputs`, so
 * one worker can match a whole batch (e.g. all workspace paths) without paying
 * the per-item worker-startup cost. Each match array is flattened to plain
 * strings so it survives structured clone.
 */
const REGEX_WORKER_SOURCE = `
const { parentPort, workerData } = require('worker_threads');
try {
  const { pattern, flags, inputs } = workerData;
  const re = new RegExp(pattern, flags);
  const results = inputs.map(input => {
    const result = input.match(re);
    return result ? Array.from(result) : null;
  });
  parentPort.postMessage({ ok: true, results });
} catch (err) {
  parentPort.postMessage({
    ok: false,
    error: err && err.message ? String(err.message) : String(err),
  });
}
`;

/**
 * Matches every string in `inputs` against a caller-supplied regex with a single
 * hard timeout, defending against catastrophic backtracking (ReDoS).
 *
 * The `tibco:extract-parameters` action lets the (template-author) caller supply
 * both the regex pattern and — via a dry-run workspace — the haystack. A native
 * `RegExp` runs synchronously on the shared event loop with no way to interrupt
 * it, so a single pathological pattern (e.g. `(a+)+$`) could stall the Backstage
 * pod for every tenant on the data plane. Running the match in a worker thread
 * lets us `terminate()` it if it exceeds the budget, guaranteeing the event loop
 * is never blocked beyond `timeoutMs`. Cheap length bounds reject obviously
 * abusive inputs before a worker is even spawned.
 *
 * The whole batch is evaluated inside ONE worker (the compiled `RegExp` is
 * applied to each input in turn), so matching a large workspace listing costs a
 * single worker spawn rather than one-per-path. The `timeoutMs` budget therefore
 * covers the entire batch.
 *
 * Returns one entry per input, in order: an array of strings (capture groups /
 * global matches, mirroring `String.prototype.match`), or `null` when that input
 * did not match.
 */
async function matchAllWithTimeout(
  pattern: string,
  flags: string | undefined,
  inputs: string[],
  timeoutMs: number = REGEX_MATCH_TIMEOUT_MS,
): Promise<(string[] | null)[]> {
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new Error(
      `Regex pattern too long (${pattern.length} > ${MAX_PATTERN_LENGTH} chars); refusing to evaluate.`,
    );
  }
  if (inputs.length === 0) {
    return [];
  }
  for (const input of inputs) {
    if (input.length > MAX_HAYSTACK_LENGTH) {
      throw new Error(
        `Input too large to match (${input.length} > ${MAX_HAYSTACK_LENGTH} chars); refusing to evaluate.`,
      );
    }
  }

  return await new Promise<(string[] | null)[]>((resolve, reject) => {
    const worker = new Worker(REGEX_WORKER_SOURCE, {
      eval: true,
      workerData: { pattern, flags: flags ?? '', inputs },
    });

    let settled = false;
    // Held in an object so `finish` can clear a timer that is created after it.
    const timerRef: { id?: ReturnType<typeof setTimeout> } = {};
    const finish = (fn: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timerRef.id);
      void worker.terminate();
      fn();
    };

    timerRef.id = setTimeout(() => {
      finish(() =>
        reject(
          new Error(
            `Regex evaluation timed out after ${timeoutMs}ms (possible ReDoS); aborted.`,
          ),
        ),
      );
    }, timeoutMs);

    worker.once(
      'message',
      (msg: { ok: boolean; results?: (string[] | null)[]; error?: string }) => {
        finish(() => {
          if (msg.ok) {
            resolve(msg.results ?? []);
          } else {
            reject(new Error(msg.error ?? 'Regex evaluation failed'));
          }
        });
      },
    );

    worker.once('error', err => {
      finish(() => reject(err));
    });

    // If the worker exits abnormally without first emitting `message` or
    // `error` (e.g. an abrupt termination or OOM kill), settle immediately
    // rather than waiting out the full timeout. A code of 0 here means the
    // worker ended before posting a result, which is still unexpected.
    worker.once('exit', code => {
      finish(() =>
        reject(
          new Error(
            `Regex evaluation worker exited unexpectedly (code ${code}) before returning a result`,
          ),
        ),
      );
    });
  });
}

/**
 * Convenience wrapper around {@link matchAllWithTimeout} for a single input.
 * Returns the match array, or `null` when there is no match.
 */
async function matchWithTimeout(
  pattern: string,
  flags: string | undefined,
  input: string,
  timeoutMs: number = REGEX_MATCH_TIMEOUT_MS,
): Promise<string[] | null> {
  const [result] = await matchAllWithTimeout(
    pattern,
    flags,
    [input],
    timeoutMs,
  );
  return result ?? null;
}

async function ExtractParameter(
  params: ExtractParameters,
  workspacePath: string,
  logger: LoggerService,
  failOnError?: boolean,
): Promise<ExtractOutput> {
  const out: ExtractOutput = {};
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const param = params[key];
      try {
        switch (param.type) {
          case TibcoImportType.xml: {
            logger.info(
              `Extracting parameter: ${key}, Type: ${TibcoImportType.xml}, File path: ${param.filePath}`,
            );
            const filePath = resolveSafeChildPath(
              workspacePath,
              param.filePath,
            );
            logger.info(`Workspace file path: ${filePath}`);
            assertNotGitInternal(workspacePath, filePath);
            const xmlContent = await promises.readFile(filePath, 'utf8');
            if ((param as TibcoImportXmlXpath).xPath) {
              const doc = new DOMParser().parseFromString(
                xmlContent,
                'text/xml',
              );
              const result = [];
              const nodes = select(
                (param as TibcoImportXmlXpath).xPath,
                doc,
                false,
              );
              if (Array.isArray(nodes)) {
                for (const node of nodes) {
                  result.push(node.toString());
                }
              } else {
                result.push(nodes);
              }
              // @ts-ignore
              out[key] = result;
              logger.info(`Successfully Extracted parameter: ${key}`);
              break;
            }
            const parser = new XMLParser({
              ignoreAttributes: false,
            });
            const xmlParsedContent = parser.parse(xmlContent);
            out[key] = jp.query(
              xmlParsedContent,
              (param as TibcoImportXmlJsonPath).jsonPath,
            );
            logger.info(`Successfully Extracted parameter: ${key}`);
            break;
          }
          case TibcoImportType.json: {
            logger.info(
              `Extracting parameter: ${key}, Type: ${TibcoImportType.json}, File path: ${param.filePath}`,
            );
            const filePath = resolveSafeChildPath(
              workspacePath,
              param.filePath,
            );
            logger.info(`Workspace file path: ${filePath}`);
            assertNotGitInternal(workspacePath, filePath);
            const jsonContent = await promises.readFile(filePath, 'utf8');
            const jsonParsedContent = JSON.parse(jsonContent);
            out[key] = jp.query(jsonParsedContent, param.jsonPath);
            logger.info(`Successfully Extracted parameter: ${key}`);
            break;
          }
          case TibcoImportType.file: {
            logger.info(
              `Extracting parameter: ${key}, Type: ${TibcoImportType.file}, File path: ${param.filePath}`,
            );
            const filePath = resolveSafeChildPath(
              workspacePath,
              param.filePath,
            );
            logger.info(`Workspace file path: ${filePath}`);
            assertNotGitInternal(workspacePath, filePath);
            const fileContent = await promises.readFile(filePath, 'utf8');
            if (typeof param.regex === 'object' && param.regex.regexPattern) {
              out[key] =
                (await matchWithTimeout(
                  param.regex.regexPattern,
                  param.regex.regexFlags,
                  fileContent,
                )) || [];
            } else if (typeof param.regex === 'string') {
              const parsed = RegexParser(param.regex);
              out[key] =
                (await matchWithTimeout(
                  parsed.source,
                  parsed.flags,
                  fileContent,
                )) || [];
            } else {
              out[key] = [];
            }
            logger.info(`Successfully Extracted parameter: ${key}`);
            break;
          }
          case TibcoImportType.workspace: {
            logger.info(
              `Extracting parameter: ${key}, Type: ${TibcoImportType.workspace}, File path: ${param.directoryPath}`,
            );
            logger.info(`Directory path: ${param.directoryPath}`);
            const directoryFullPath = resolveSafeChildPath(
              workspacePath,
              param.directoryPath || '',
            );
            logger.info(`Workspace directory path: ${directoryFullPath}`);
            let allPaths: (string | any)[] = await glob(param.glob || `**/*`, {
              cwd: directoryFullPath,
            });
            if (param.onlyName) {
              allPaths = allPaths.map(p => {
                return p.split('/').at(-1);
              });
            }
            // Match every path in a single worker rather than spawning one
            // worker per path, while still keeping the ReDoS hard-timeout guard.
            const pathInputs = allPaths as string[];
            let matchResults: (string[] | null)[] = [];
            if (typeof param.regex === 'object' && param.regex.regexPattern) {
              matchResults = await matchAllWithTimeout(
                param.regex.regexPattern,
                param.regex.regexFlags,
                pathInputs,
              );
            } else if (typeof param.regex === 'string') {
              const parsed = RegexParser(param.regex);
              matchResults = await matchAllWithTimeout(
                parsed.source,
                parsed.flags,
                pathInputs,
              );
            }
            const workspaceOut: string[] = [];
            pathInputs.forEach((p, i) => {
              if (matchResults[i]) {
                workspaceOut.push(p);
              }
            });
            out[key] = workspaceOut;
            logger.info(`Successfully Extracted parameter: ${key}`);
            break;
          }
          default: {
            logger.info(`Successfully Extracted parameter: ${key}`);
          }
        }
      } catch (err) {
        logger.error(`Error while extracting the parameter: ${key}`);
        logger.error(`${err}`);
        if (failOnError) {
          throw err;
        }
      }
    }
  }
  return out;
}

export function ExtractParametersAction() {
  return createTemplateAction({
    id: 'tibco:extract-parameters',
    description:
      'Tibco platform extract parameters action, refer to examples for extractParameters and output schema',
    examples,
    schema: {
      input: {
        failOnError: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Boolean flag to stop the task when there is an error, optional, default is false, when true task execution will be stopped in this step when there is an error',
            ),
        sourcePath: z =>
          z
            .string()
            .optional()
            .describe(
              'Source path relative to workspace, optional, path within the workspace that will be used as the repository root',
            ),
        extractParameters: z =>
          z
            .record(
              z.string(),
              (z.union as any)([
                importSchemaXMLXpath,
                importSchemaXMLJsonPath,
                importSchemaJson,
                importSchemaFile,
                importSchemaWorkspace,
              ]),
            )
            .describe(
              'A object/record containing key as the parameters to be extracted and value as the object containing keys as per the extract type',
            ),
      },
      output: z =>
        z
          .record(z.string(), z.array(z.string()))
          .describe(
            'A object/record containing key as the parameters to be extracted provided as input and value as an array of result',
          ),
    },
    async handler(ctx) {
      ctx.logger.info(
        `Source path relative to workspace: ${ctx.input.sourcePath || ''}`,
      );
      ctx.logger.info(
        `Fail on error: ${ctx.input.failOnError ? 'True' : 'False'}`,
      );
      ctx.logger.info(`Extract Parameters: `, ctx.input.extractParameters);
      const relativeWorkspacePath = resolveSafeChildPath(
        ctx.workspacePath,
        ctx.input.sourcePath || '',
      );
      ctx.logger.info(`Final workspace path: ${relativeWorkspacePath}`);
      const output = await ExtractParameter(
        ctx.input.extractParameters,
        relativeWorkspacePath,
        ctx.logger,
        ctx.input.failOnError,
      );
      for (const key in output) {
        if (output.hasOwnProperty(key)) {
          ctx.output(key, (output[key] as string[]) || []);
        }
      }
      ctx.logger.info(`Extracted Parameters output: `, output);
    },
  });
}
