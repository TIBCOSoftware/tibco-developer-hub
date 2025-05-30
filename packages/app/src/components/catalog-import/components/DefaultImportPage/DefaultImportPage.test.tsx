/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import {
  catalogImportApiRef,
  CatalogImportClient,
} from '@backstage/plugin-catalog-import';
import { DefaultImportPage } from './DefaultImportPage';
import React from 'react';

describe('<DefaultImportPage />', () => {
  const fetchApi = {
    fetch: jest.fn(),
  };

  let apis: TestApiRegistry;

  beforeEach(() => {
    apis = TestApiRegistry.from(
      [configApiRef, new ConfigReader({ integrations: {} })],
      [catalogApiRef, catalogApiMock()],
      [
        catalogImportApiRef,
        new CatalogImportClient({
          discoveryApi: {} as any,
          scmAuthApi: {
            getCredentials: async () => ({ token: 'token', headers: {} }),
          },
          fetchApi,
          scmIntegrationsApi: {} as any,
          catalogApi: {} as any,
          configApi: {} as any,
        }),
      ],
    );
  });

  it('renders without exploding', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <DefaultImportPage />
      </ApiProvider>,
    );

    expect(
      screen.getByText('Start tracking your component in Backstage'),
    ).toBeInTheDocument();
  });
});
