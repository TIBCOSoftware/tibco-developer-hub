/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockStorageApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import React from 'react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { TemplateListPage } from './TemplateListPage';

describe('TemplateListPage', () => {
  const mockCatalogApi = {
    getEntities: async () => ({
      items: [
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'blob', tags: ['blob'] },
          spec: {
            type: 'service',
          },
        },
      ],
    }),
    getEntityFacets: async () => ({
      facets: { 'spec.type': [{ value: 'service', count: 1 }] },
    }),
  };

  it('should render the search bar for templates', async () => {
    const { getByPlaceholderText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': scaffolderPlugin.routes.root } },
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
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': scaffolderPlugin.routes.root } },
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
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      { mountedRoutes: { '/': scaffolderPlugin.routes.root } },
    );

    expect(getByText('Categories')).toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render the EntityTag picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
    );

    expect(getByText('Tags')).toBeInTheDocument();
  });

  describe('scaffolder page context menu', () => {
    it('should render if context menu props are not set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: MockStorageApi.create(),
              }),
            ],
            [permissionApiRef, {}],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        { mountedRoutes: { '/': scaffolderPlugin.routes.root } },
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
                storageApi: MockStorageApi.create(),
              }),
            ],
            [permissionApiRef, {}],
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
        { mountedRoutes: { '/': scaffolderPlugin.routes.root } },
      );
      expect(queryByTestId('menu-button')).not.toBeInTheDocument();
    });
  });
});
