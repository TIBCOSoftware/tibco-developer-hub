/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { marketplacePlugin } from './plugin';

describe('marketplace', () => {
  it('should export plugin', () => {
    expect(marketplacePlugin).toBeDefined();
  });
});
