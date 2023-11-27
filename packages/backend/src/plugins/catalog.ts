import {
  CatalogBuilder,
  EntityProvider,
} from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import {
  GithubEntityProvider,
  GithubOrgEntityProvider,
} from '@backstage/plugin-catalog-backend-module-github';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  builder.addProcessor(new ScaffolderEntitiesProcessor());

  builder.addEntityProvider(getGithubProviders(env));

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}

function getGithubProviders(env: PluginEnvironment): EntityProvider[] {
  const entityProviders: EntityProvider[] = [];

  entityProviders.push(
    // array will be empty if there are no providers configured under catalog.providers.github
    ...GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }),
  );

  const orgProviderConfig = env.config.getOptionalConfig(
    'orgCatalog.providers.github',
  );
  if (orgProviderConfig) {
    entityProviders.push(
      GithubOrgEntityProvider.fromConfig(env.config, {
        id: orgProviderConfig.getString('providerId'),
        orgUrl: orgProviderConfig.get('orgUrl'),
        logger: env.logger,
        schedule: env.scheduler.createScheduledTaskRunner(
          orgProviderConfig.getOptional('schedule') ?? {
            frequency: { minutes: 60 },
            timeout: { minutes: 15 },
          },
        ),
      }),
    );
  }

  return entityProviders;
}
