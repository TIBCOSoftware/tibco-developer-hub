/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import express from 'express';
import Router from 'express-promise-router';
import { MarketplaceStore } from './database/MarketplaceStore.ts';
import { Config } from '@backstage/config';

export async function createRouter({
  marketplaceStore,
  config,
}: {
  marketplaceStore: MarketplaceStore;
  config: Config;
}): Promise<express.Router> {
  const router = Router();
  router.get('/marketplace/v1/tasks', async (_req, res) => {
    res.json(await marketplaceStore.get(config));
  });
  return router;
}
