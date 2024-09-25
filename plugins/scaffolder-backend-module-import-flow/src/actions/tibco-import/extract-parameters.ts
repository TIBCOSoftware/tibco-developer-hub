import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { promises } from 'fs';
import { JsonArray, JsonObject, JsonPrimitive } from '@backstage/types';
import jp from 'jsonpath';
import { Logger } from 'winston';
import { glob } from 'glob';
import { select } from 'xpath';
import { DOMParser } from '@xmldom/xmldom';

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
type TibcoImportFile = {
  type: TibcoImportType.file;
  filePath: string;
  regex: string;
};
type TibcoImportWorkspace = {
  type: TibcoImportType.workspace;
  directoryPath?: string;
  glob?: string;
  onlyName?: boolean;
  regex: string;
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

const importSchemaXMLXpath = z
  .object({
    type: z.literal(TibcoImportType.xml),
    filePath: z.string(),
    xPath: z.string(),
  })
  .required();

const importSchemaXMLJsonPath = z
  .object({
    type: z.literal(TibcoImportType.xml),
    filePath: z.string(),
    jsonPath: z.string(),
  })
  .required();

const importSchemaJson = z
  .object({
    type: z.literal(TibcoImportType.json),
    filePath: z.string(),
    jsonPath: z.string(),
  })
  .required();

const importSchemaFile = z
  .object({
    type: z.literal(TibcoImportType.file),
    filePath: z.string(),
    regex: z.string(),
  })
  .required();

const importSchemaWorkspace = z.object({
  type: z.literal(TibcoImportType.workspace),
  directoryPath: z.string().optional(),
  glob: z.string().optional(),
  onlyName: z.boolean().optional(),
  regex: z.string(),
});

async function ExtractParameter(
  params: ExtractParameters,
  workspacePath: string,
  logger: Logger,
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
            const fileContent = await promises.readFile(filePath, 'utf8');
            out[key] = fileContent.match(param.regex) || [];
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
            const workspaceOut: string[] = [];
            for (const p of allPaths) {
              if (p.match(param.regex)) {
                workspaceOut.push(p);
              }
            }
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
        logger.error(err);
        if (failOnError) {
          throw err;
        }
      }
    }
  }
  return out;
}

export function ExtractParametersAction() {
  return createTemplateAction<{
    sourcePath?: string;
    failOnError?: boolean;
    extractParameters: ExtractParameters;
  }>({
    id: 'tibco:extract-parameters',
    description: 'Tibco Platform Extract Parameter Action',
    schema: {
      input: z.object({
        failOnError: z.boolean().optional(),
        sourcePath: z.string().optional(),
        extractParameters: z.record(
          z.string(),
          z.union([
            importSchemaXMLXpath,
            importSchemaXMLJsonPath,
            importSchemaJson,
            importSchemaFile,
            importSchemaWorkspace,
          ]),
        ),
      }),
      output: z.record(z.string(), z.any()),
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
          ctx.output(key, output[key]);
        }
      }
      ctx.logger.info(`Extracted Parameters output: `, output);
    },
  });
}
