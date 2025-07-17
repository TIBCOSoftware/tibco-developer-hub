/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { TemplateListPage } from './TemplateListPage';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import React from 'react';
import { waitFor } from '@testing-library/react';

const mountedRoutes = {
  mountedRoutes: {
    '/': scaffolderPlugin.routes.root,
    '/import-flow/:namespace/:kind/:name': entityRouteRef,
  },
};

describe('TemplateListPage for import flow', () => {
  const mockCatalogApi = catalogApiMock({
    entities: [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 'Test import flow name',
          title: 'Test import flow title',
          description: 'Test import flow description',
          tags: ['import-flow', 'bwce'],
        },
        spec: {
          type: 'service',
        },
      },
    ],
  });

  it('should render correct title and subtitle', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage
          headerOptions={{
            title: 'Import flow title',
            subtitle: 'Import flow subtitle',
          }}
        />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Import flow title')).toBeInTheDocument();
    expect(getByText('Import flow subtitle')).toBeInTheDocument();
  });

  it('should render the search bar for import flows', async () => {
    const { getByPlaceholderText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('should render the all and starred filters', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByRole('menuitem', { name: /All/ })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /Starred/ })).toBeInTheDocument();
  });

  it('should render the category picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Categories')).toBeInTheDocument();
  });

  it('should render the EntityOwnerPicker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Owner')).toBeInTheDocument();
  });

  it('should render the EntityTag picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Tags')).toBeInTheDocument();
  });

  it('should render the import flow cards', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );
    await waitFor(() => {
      expect(getByText('Test import flow title')).toBeInTheDocument();
    });
  });

  describe('Import flow page context menu', () => {
    it('should render if context menu props are not set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        mountedRoutes,
      );
      expect(queryByTestId('menu-button')).toBeInTheDocument();
    });

    it('should not render if context menu props are set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage
            contextMenu={{
              editor: false,
              actions: false,
              tasks: false,
            }}
          />
        </TestApiProvider>,
        mountedRoutes,
      );
      expect(queryByTestId('menu-button')).not.toBeInTheDocument();
    });
  });
});
