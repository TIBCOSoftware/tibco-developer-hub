/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { FetchApi, configApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { useOutlet } from 'react-router-dom';
import {
  catalogImportApiRef,
  CatalogImportClient,
} from '@backstage/plugin-catalog-import';
import { ImportPage } from './ImportPage';
import React from 'react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutlet: jest.fn(),
}));

describe('<ImportPage />', () => {
  const fetchApi: FetchApi = {
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
          fetchApi,
          scmAuthApi: {} as any,
          scmIntegrationsApi: {} as any,
          catalogApi: {} as any,
          configApi: new ConfigReader({}),
        }),
      ],
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('renders without exploding', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportPage />
      </ApiProvider>,
    );

    expect(
      screen.getByText('Start tracking your component in Backstage'),
    ).toBeInTheDocument();
  });

  it('renders with custom children', async () => {
    (useOutlet as jest.Mock).mockReturnValue(<div>Hello World</div>);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportPage />
      </ApiProvider>,
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
