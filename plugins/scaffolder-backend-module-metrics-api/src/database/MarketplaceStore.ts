/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

/**
 * Store definition for the user settings.
 */
export interface MarketplaceStore {
  get(): Promise<{ name: string; namespace: string }[]>;
}
