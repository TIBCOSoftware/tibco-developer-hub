/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { integrationTopologyPlugin } from './plugin';

describe('integration-topology', () => {
  it('should export plugin', () => {
    expect(integrationTopologyPlugin).toBeDefined();
  });
});
