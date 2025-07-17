/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  TestApiProvider,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import { ConfigReader, FlatRoutes } from '@backstage/core-app-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import React from 'react';
import { configApiRef } from '@backstage/core-plugin-api';
import { Route } from 'react-router';
import { CustomScaffolderPage } from './plugin.ts';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';

describe('<CustomScaffolderPage>', () => {
  const mockCatalogApi = catalogApiMock({
    entities: [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 'Template1-name',
          title: 'Template1 title',
          description: 'Template1 description',
          tags: ['bwce'],
        },
        spec: {
          type: 'service',
        },
      },
    ],
  });

  it('should render develop page', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              templateGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['dp'],
                },
              ],
            }),
          ],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [catalogApiRef, mockCatalogApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <FlatRoutes>
          <Route path="/" element={<CustomScaffolderPage />} />
        </FlatRoutes>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/': scaffolderPlugin.routes.root,
          '/import-flow/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(getByText('Develop a new component')).toBeInTheDocument();
    expect(
      getByText(
        'Develop new software components using standard templates in your organization',
      ),
    ).toBeInTheDocument();
    /*  expect(getByText('Register Existing Component').closest('a')).toHaveAttribute(
        'href',
        '/catalog-import',
    );*/
  });
});
