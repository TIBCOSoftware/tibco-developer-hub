/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { marketplacePlugin, MarketplacePage } from '../src/plugin';

createDevApp()
  .registerPlugin(marketplacePlugin)
  .addPage({
    element: <MarketplacePage />,
    title: 'Root Page',
    path: '/marketplace',
  })
  .render();
