/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendModule,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { ResponseError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

interface Location {
  type?: string;
  target: string;
}
interface EssentialLocations {
  locations?: Location[];
  runScheduler?: boolean;
  frequencyInMinutes?: number;
}

const addLocationsToCatalog = async (
  catalogApi: CatalogClient,
  logger: LoggerService,
  locations: Location[],
  token: string,
) => {
  try {
    for (const loc of locations) {
      await catalogApi.addLocation(loc, { token });
    }
  } catch (e) {
    if (e instanceof ResponseError && e.response.status === 409) {
      logger.debug('Location already added', e as Error);
    } else {
      logger.error('Error while adding locations', e as Error);
    }
  }
};

export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'addEssentialLocation',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        auth: coreServices.auth,
        catalog: catalogServiceRef,
      },
      async init({ logger, config, discovery, auth, scheduler }) {
        try {
          const catalogApi: CatalogClient = new CatalogClient({
            discoveryApi: discovery,
          });
          const essentialLocations: EssentialLocations | undefined =
            config.getOptional('essentialLocations');
          if (
            essentialLocations &&
            essentialLocations?.locations &&
            essentialLocations?.locations?.length > 0
          ) {
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'catalog',
            });
            if (essentialLocations?.runScheduler) {
              await scheduler.scheduleTask({
                frequency: {
                  minutes: essentialLocations.frequencyInMinutes || 60 * 2,
                },
                timeout: { minutes: 5 },
                initialDelay: { seconds: 30 },
                scope: 'global',
                id: 'add-essential-location-scheduler',
                fn: async () => {
                  await addLocationsToCatalog(
                    catalogApi,
                    logger,
                    essentialLocations?.locations || [],
                    token,
                  );
                },
              });
              logger.info('Essential location added successfully.');
              return;
            }
            setTimeout(async () => {
              await addLocationsToCatalog(
                catalogApi,
                logger,
                essentialLocations?.locations || [],
                token,
              );
              logger.info('Essential location added successfully.');
            }, 30 * 1000);
          }
        } catch (e) {
          logger.error(
            'Error while initializing essential locations',
            e as Error,
          );
        }
      },
    });
  },
});
