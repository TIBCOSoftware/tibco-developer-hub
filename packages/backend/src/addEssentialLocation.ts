/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createBackendModule,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { ResponseError } from '@backstage/errors';

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
) => {
  try {
    for (const loc of locations) {
      await catalogApi.addLocation(loc);
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
      },
      async init({ logger, config, discovery, scheduler }) {
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
            if (essentialLocations?.runScheduler) {
              await scheduler.scheduleTask({
                frequency: {
                  minutes: essentialLocations.frequencyInMinutes || 60 * 2,
                },
                timeout: { minutes: 5 },
                initialDelay: { seconds: 0 },
                scope: 'global',
                id: 'add-essential-location-scheduler',
                fn: async () => {
                  await addLocationsToCatalog(
                    catalogApi,
                    logger,
                    essentialLocations?.locations || [],
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
              );
              logger.info('Essential location added successfully.');
            }, 0);
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
