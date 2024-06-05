import { createRouter } from '@backstage/plugin-proxy-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { HostDiscovery } from '@backstage/backend-common';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const discovery = HostDiscovery.fromConfig(env.config, {
    basePath: '/api',
  });

  return await createRouter({
    logger: env.logger,
    config: env.config,
    discovery: discovery,
  });
}
