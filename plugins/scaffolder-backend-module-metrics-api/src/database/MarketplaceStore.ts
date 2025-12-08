/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Config } from '@backstage/config';

/**
 * Store definition for the user settings.
 */
export interface MarketplaceStore {
  get(config: Config): Promise<{ name: string; namespace: string }[]>;
}
