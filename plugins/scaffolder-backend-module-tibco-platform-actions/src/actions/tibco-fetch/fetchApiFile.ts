import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import {
  ComponentEntity,
  ApiEntity,
  stringifyEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import fs from 'fs-extra';
import { fetchApiFileExamples } from './fetchApiFile.examples';

export const fetchApiFileAction = (catalog: CatalogService) => {
  return createTemplateAction({
    id: 'tibco:fetch-api-file',
    description:
      'Fetches an API definition from an Entity and writes it to a file.',
    examples: fetchApiFileExamples,
    schema: {
      input: z =>
        z.object({
          kind: z.string().optional().describe('Entity kind (optional)'),
          namespace: z
            .string()
            .optional()
            .describe('Entity namespace (default: default)'),
          name: z.string().min(1).describe('Entity name'),
          path: z
            .string()
            .min(1)
            .describe('Relative path to save the definition'),
          preferredApiType: z
            .string()
            .optional()
            .describe(
              'If multiple APIs are found, prefer this type (e.g., openapi, graphql)',
            ),
        }),
      output: z =>
        z.object({
          filePath: z.string(),
          sourceEntity: z.string(),
          apiType: z.string(),
        }),
    },
    async handler(ctx) {
      const { kind, namespace, name, path, preferredApiType } = ctx.input;

      const parsedRef = parseEntityRef(name, {
        defaultKind: kind,
        defaultNamespace: namespace,
      });
      const entityRef = stringifyEntityRef(parsedRef);
      ctx.logger.info(`Stringified entityRef: ${entityRef}`);

      ctx.logger.info(`Fetching entity: ${entityRef}`);

      let entity = await catalog.getEntityByRef(entityRef, {
        credentials: await ctx.getInitiatorCredentials(),
      });
      if (!entity) {
        throw new Error(`Entity ${entityRef} not found`);
      }
      if (entity.kind === 'Component') {
        const component = entity as ComponentEntity;
        const providedApiRefs = component.spec?.providesApis || [];

        if (providedApiRefs.length === 0) {
          throw new Error(`Component ${entityRef} does not provide any APIs.`);
        }

        ctx.logger.info(
          `Found ${
            providedApiRefs.length
          } provided APIs: ${providedApiRefs.join(', ')}`,
        );

        // Handle component providing multiple APIs
        let selectedApiEntity: ApiEntity | null = null;
        const apiEntities = await Promise.all(
          providedApiRefs.map(async ref => {
            const apiRef = stringifyEntityRef(
              parseEntityRef(ref, {
                defaultKind: 'api',
                defaultNamespace: component.metadata.namespace || 'default',
              }),
            );
            ctx.logger.info(`Resolving API ref: ${ref} -> ${apiRef}`);
            return catalog.getEntityByRef(apiRef, {
              credentials: await ctx.getInitiatorCredentials(),
            });
          }),
        );
        const validApis = apiEntities.filter(
          (e): e is ApiEntity => e !== undefined && e.kind === 'API',
        );
        if (validApis.length === 0) {
          throw new Error(
            `None of the provided APIs could be resolved in the catalog.`,
          );
        }
        // Match Preference
        if (preferredApiType) {
          const match = validApis.find(
            api => api.spec.type === preferredApiType,
          );
          if (match) {
            ctx.logger.info(
              `Found match for preferred type '${preferredApiType}': ${match.metadata.name}`,
            );
            selectedApiEntity = match;
          } else {
            ctx.logger.warn(
              `No API matched preference '${preferredApiType}'. Falling back to default.`,
            );
          }
        }
        // Default (First one)
        if (!selectedApiEntity) {
          selectedApiEntity = validApis[0];
          ctx.logger.info(
            `Selected default API: ${selectedApiEntity.metadata.name} (Type: ${selectedApiEntity.spec.type})`,
          );
        }

        entity = selectedApiEntity;
      }

      if (entity.kind !== 'API') {
        throw new Error(
          `Resolved entity is not an API, got kind: ${entity.kind}`,
        );
      }

      const apiEntity = entity as ApiEntity;
      const definition = apiEntity.spec.definition;
      const type = apiEntity.spec.type;

      if (!definition) {
        throw new Error(`API ${apiEntity.metadata.name} has no definition.`);
      }

      // Write to Workspace
      const targetPath = resolveSafeChildPath(ctx.workspacePath, path);
      await fs.outputFile(targetPath, definition);

      const outputEntityRef = stringifyEntityRef({
        kind: 'api',
        namespace: apiEntity.metadata.namespace || 'default',
        name: apiEntity.metadata.name,
      });

      ctx.logger.info(
        `Successfully wrote API definition to ${path} (${definition.length} bytes)`,
      );

      ctx.output('filePath', targetPath);
      ctx.output('sourceEntity', outputEntityRef);
      ctx.output('apiType', type);
    },
  });
};
