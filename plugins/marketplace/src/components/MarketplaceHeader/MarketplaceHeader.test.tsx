/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { MarketplaceHeader } from './MarketplaceHeader';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import React from 'react';

describe('MarketplaceHeader tests for marketplace', () => {
  it('should render marketplace header', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              app: {
                title: 'test app',
                baseUrl: 'http://localhost:3000',
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
              backend: { baseUrl: 'http://localhost:7007' },
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceHeader />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/': scaffolderPlugin.routes.root,
        },
      },
    );
    expect(
      getByText('Welcome to the TIBCO® Developer Hub Marketplace'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'TIBCO® Developer Hub is the center for building the apps for empowering your organization',
      ),
    ).toBeInTheDocument();
    expect(
      getByText('What is the TIBCO® Developer Hub Marketplace ?'),
    ).toBeInTheDocument();
    expect(getByText('Learn more').closest('a')).toHaveAttribute(
      'href',
      'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
    );
  });
});
