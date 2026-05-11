/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
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
import { configApiRef } from '@backstage/core-plugin-api';
import { Route } from 'react-router';
import { CustomScaffolderPage } from './plugin.ts';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import {
  templateGroupsValue,
  type TemplateGroups,
} from './CustomScaffolderComponent';

describe('templateGroupsValue', () => {
  it('returns undefined for undefined input', () => {
    expect(templateGroupsValue(undefined)).toBeUndefined();
  });

  it('returns undefined for non-array input', () => {
    expect(
      templateGroupsValue('not-an-array' as unknown as TemplateGroups[]),
    ).toBeUndefined();
  });

  it('returns the valid groups unchanged', () => {
    const input: TemplateGroups[] = [
      { name: 'Group1', tagFilters: ['bwce'] },
      { name: 'Group2', tagFilters: ['dp', 'react'] },
    ];
    expect(templateGroupsValue(input)).toEqual(input);
  });

  it('excludes groups where name is not a string', () => {
    const input = [
      { name: 123 as unknown as string, tagFilters: ['bwce'] },
      { name: 'Group2', tagFilters: ['dp'] },
    ];
    expect(templateGroupsValue(input as TemplateGroups[])).toEqual([
      { name: 'Group2', tagFilters: ['dp'] },
    ]);
  });

  it('excludes groups where tagFilters is not an array', () => {
    const input = [
      { name: 'Group1', tagFilters: 'not-an-array' as unknown as string[] },
      { name: 'Group2', tagFilters: ['dp'] },
    ];
    expect(templateGroupsValue(input as TemplateGroups[])).toEqual([
      { name: 'Group2', tagFilters: ['dp'] },
    ]);
  });

  it('excludes groups where a tagFilter element is not a string', () => {
    const input = [
      { name: 'Group1', tagFilters: [123 as unknown as string] },
      { name: 'Group2', tagFilters: ['dp'] },
    ];
    expect(templateGroupsValue(input as TemplateGroups[])).toEqual([
      { name: 'Group2', tagFilters: ['dp'] },
    ]);
  });

  it('returns an empty array when all groups are invalid', () => {
    const input = [{ name: null as unknown as string, tagFilters: ['bwce'] }];
    expect(templateGroupsValue(input as TemplateGroups[])).toEqual([]);
  });

  it('accepts groups with an empty tagFilters array', () => {
    const input: TemplateGroups[] = [{ name: 'Group1', tagFilters: [] }];
    expect(templateGroupsValue(input)).toEqual(input);
  });
});

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
  }, 30000);
});
