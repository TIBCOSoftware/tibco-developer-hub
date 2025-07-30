/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import React from 'react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { MarketplaceListPage } from './MarketplaceListPage.tsx';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mountedRoutes = {
  mountedRoutes: {
    '/': scaffolderPlugin.routes.root,
    '/marketplace/:namespace/:kind/:name': entityRouteRef,
  },
};

describe('MarketplaceListPage', () => {
  const mockCatalogApi = {
    getEntities: async () => ({
      items: [
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: {
            namespace: 'default',
            name: 'marketplace1-name',
            title: 'Marketplace1 title',
            description: 'Marketplace1 description',
            tags: ['devhub-marketplace', 'bwce'],
          },
          spec: {
            type: 'document',
            system: 'system1-name',
            owner: 'group:default/group1-name',
          },
          /*  relations: [
              {
                type: "ownedBy",
                targetRef: "group:default/group1-name",
                target: {
                  "kind": "group",
                  "namespace": "default",
                  "name": "group1-name"
                }
              }
            ]*/
        },
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: {
            namespace: 'default',
            name: 'marketplace2-name',
            title: 'Marketplace2 title',
            description: 'Marketplace2 description',
            tags: ['devhub-marketplace', 'flogo'],
            'tibco.developer.hub/marketplace': {
              isNew: true,
              isMultiInstall: true,
              moreInfo: [
                {
                  text: 'Get more info',
                  url: 'https://moreinfo.com',
                  icon: 'docs',
                },
                {
                  text: 'TIBCO',
                  url: 'https://www.tibco.com',
                  icon: 'star',
                },
              ],
            },
          },
          spec: {
            type: 'sample',
            system: 'system1-name',
            owner: 'group:default/group2-name',
          },
          /*   relations: [
               {
                 type: "ownedBy",
                 targetRef: "group:default/group2d-name",
                 target: {
                   "kind": "group",
                   "namespace": "default",
                   "name": "group2d-name"
                 }
               }
               ]*/
        },
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: {
            namespace: 'default',
            name: 'marketplace3-name',
            title: 'Marketplace3 title',
            description: 'Marketplace3 description',
            tags: [
              'devhub-marketplace',
              'flogo1',
              'flogo2',
              'flogo3',
              'flogo4',
              'flogo5',
              'flogo6',
              'flogo7',
            ],
            'tibco.developer.hub/marketplace': {
              imageURL: 'https://img.com',
              moreInfo: [
                {
                  text: 'Get more info1',
                  url: 'https://moreinfo1.com',
                  icon: 'docs',
                },
                {
                  text: 'TIBCO1',
                  url: 'https://www.tibco1.com',
                  icon: 'star',
                },
                {
                  text: 'TIBCO2',
                  url: 'https://www.tibco2.com',
                  icon: 'star',
                },
                {
                  text: 'TIBCO3',
                  url: 'https://www.tibco3.com',
                  icon: 'star',
                },
                {
                  text: 'TIBCO4',
                  url: 'https://www.tibco4.com',
                  icon: 'star',
                },
              ],
            },
          },
          spec: {
            type: 'template',
            system: 'system1-name',
            owner: 'group:default/group2-name',
          },
          /*   relations: [
               {
                 type: "ownedBy",
                 targetRef: "group:default/group2d-name",
                 target: {
                   "kind": "group",
                   "namespace": "default",
                   "name": "group2d-name"
                 }
               }
               ]*/
        },
      ],
    }),
    getEntitiesByRefs: async () => ({
      items: [
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Group',
          metadata: {
            namespace: 'default',
            name: 'group1-name',
            title: 'Group1 title',
            description: 'Group1 description',
          },
          spec: {
            type: 'organization',
            profile: {
              displayName: 'Group1 display name',
              email: 'info@acme.com',
            },
          },
        },
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Group',
          metadata: {
            namespace: 'default',
            name: 'group2-name',
            title: 'Group2 title',
            description: 'Group2 description',
          },
          spec: {
            type: 'organization',
            profile: {
              displayName: 'Group2 display name',
              email: 'info@acme.com',
            },
          },
        },
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: {
            namespace: 'default',
            name: 'template1-name',
            title: 'Template1 title',
            description: 'Template1 description',
            tags: ['bwce'],
          },
          spec: {
            type: 'service',
            system: 'system1-name',
            owner: 'group:default/group1-name',
          },
        },
      ],
    }),
    /*  getEntityFacets: async () => ({
            facets: { 'spec.type': [{ value: 'service', count: 1 }] },
        }),*/
  };

  jest.spyOn(global, 'fetch').mockImplementation(
    jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              name: 'marketplace1-name',
              namespace: 'default',
              data: [
                {
                  id: 'b6b304f5-95e8-4a36-99a2-b1315394dd1b',
                  created_at: '2025-06-06T18:44:20.895392+00:00',
                  output: {
                    links: [
                      {
                        title: 'Open in catalog',
                        type: 'catalog',
                        icon: 'catalog',
                        entityRef: 'template:default/template1-name',
                      },
                    ],
                  },
                },
              ],
            },
          ]),
      }),
    ) as jest.Mock,
  );

  it('should render the search bar for templates', async () => {
    const { getByPlaceholderText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          // @ts-ignore
          [catalogApiRef, mockCatalogApi],
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
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <MarketplaceListPage />
      </TestApiProvider>,
      mountedRoutes,
    );
    await waitFor(() => {
      expect(getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });

  it('should render the category picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          // @ts-ignore
          [catalogApiRef, mockCatalogApi],
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
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <MarketplaceListPage />
      </TestApiProvider>,
      mountedRoutes,
    );
    await waitFor(() => {
      expect(getByText('Categories')).toBeInTheDocument();
    });
  });

  it('should render the EntityTag picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          // @ts-ignore
          [catalogApiRef, mockCatalogApi],
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
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <MarketplaceListPage />
      </TestApiProvider>,
      mountedRoutes,
    );
    await waitFor(() => {
      expect(getByText('Tags')).toBeInTheDocument();
    });
  });

  it('should render the Marketplace cards', async () => {
    const { getByText, getByTestId } = await renderInTestApp(
      <TestApiProvider
        apis={[
          // @ts-ignore
          [catalogApiRef, mockCatalogApi],
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
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <MarketplaceListPage />
      </TestApiProvider>,
      mountedRoutes,
    );
    expect(
      getByText('Welcome to the TIBCO® Developer Hub Marketplace'),
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect(getByText('Tags')).toBeInTheDocument();
    });
    const entry = getByText('Marketplace1 title');
    expect(entry).toBeInTheDocument();
    await userEvent.click(entry);
    await waitFor(async () => {
      expect(getByTestId('detail-container')).toBeInTheDocument();
    });
    const entry1 = getByText('Marketplace3 title');
    expect(entry1).toBeInTheDocument();
    await userEvent.click(entry1);
    await waitFor(() => {
      expect(getByTestId('detail-container')).toBeInTheDocument();
      expect(getByTestId('detail-custom-image')).toBeInTheDocument();
    });
    expect(getByText('TIBCO4').closest('a')).toHaveAttribute(
      'href',
      'https://www.tibco4.com',
    );
  });
});
