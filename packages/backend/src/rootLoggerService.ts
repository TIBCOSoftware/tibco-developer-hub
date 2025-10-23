/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
import { transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { DevHubConfig } from './config.ts';

export default createServiceFactory({
  service: coreServices.rootLogger,
  deps: {},
  async factory() {
    if (process.env.NODE_ENV === 'development') {
      return WinstonLogger.create({
        transports: [new transports.Console()],
      });
    }
    const transport: DailyRotateFile = new DailyRotateFile(
      DevHubConfig.logFileConfig,
    );
    return WinstonLogger.create({
      transports: [new transports.Console(), transport],
    });
  },
});
