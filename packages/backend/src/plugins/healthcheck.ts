import { createStatusCheckRouter } from '@backstage/backend-common';
import { PluginEnvironment } from '../types';

export default async function createRouter({ logger }: PluginEnvironment) {
  return await createStatusCheckRouter({ logger, path: '/health' });
}
