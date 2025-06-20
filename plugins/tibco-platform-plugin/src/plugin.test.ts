/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  tibcoPlatformPlugin,
  PlatformApplicationDeploymentsPage,
  PlatformApplicationDeploymentsCard,
  PlatformApplicationDeploymentsError,
} from './plugin';

describe('tibco-platform-plugin', () => {
  it('should export plugin', () => {
    expect(tibcoPlatformPlugin).toBeDefined();
    expect(PlatformApplicationDeploymentsPage).toBeDefined();
    expect(PlatformApplicationDeploymentsCard).toBeDefined();
    expect(PlatformApplicationDeploymentsError).toBeDefined();
  });
});
