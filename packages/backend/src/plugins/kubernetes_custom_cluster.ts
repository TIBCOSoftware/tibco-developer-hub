// In packages/backend/src/plugins/kubernetes.ts
// import {KubernetesBuilder} from '@backstage/plugin-kubernetes-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

import {
  ClusterDetails,
  KubernetesBuilder,
  KubernetesClustersSupplier,
} from '@backstage/plugin-kubernetes-backend';
import { Duration } from 'luxon';

export class CustomClustersSupplier implements KubernetesClustersSupplier {
  constructor(private clusterDetails: ClusterDetails[] = []) {}

  static create(refreshInterval: Duration) {
    const clusterSupplier = new CustomClustersSupplier();
    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/runPeriodically.ts
    setInterval(
      () => clusterSupplier.refreshClusters(),
      refreshInterval.toMillis(),
    );
    return clusterSupplier;
  }

  async refreshClusters(): Promise<void> {
    console.log('Refreshing clusters...');
    this.clusterDetails = []; // fetch from somewhere
  }

  async getClusters(): Promise<ClusterDetails[]> {
    return this.clusterDetails;
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const builder = await KubernetesBuilder.createBuilder({
    permissions: env.permissions,
    // const {router} = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    catalogApi,
  }); // .build();
  builder.setClusterSupplier(
    // CustomClustersSupplier.create(Duration.fromObject({minutes: 60})),
    CustomClustersSupplier.create(Duration.fromObject({ seconds: 30 })),
  );
  const { router } = await builder.build();
  return router;
}
