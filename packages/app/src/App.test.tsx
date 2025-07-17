/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import App, { routes } from './App';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import {
  catalogApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { Root } from './components/Root';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { searchApiRef } from '@backstage/plugin-search-react';

describe('App', () => {
  it('should render App', async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            backend: { baseUrl: 'http://localhost:7007' },
            auth: {
              enableAuthProviders: ['oauth2Proxy'],
            },
          },
          context: 'test',
        },
      ] as any,
    };

    const rendered = render(<App />);
    await waitFor(() => {
      expect(rendered.baseElement).toBeInTheDocument();
    });
  });
});

describe('Should render all the routes correctly', () => {
  const mockCatalogApi = catalogApiMock({
    entities: [
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
        kind: 'System',
        metadata: {
          namespace: 'default',
          name: 'system1-name',
          title: 'System1 title',
          description: 'System1 description',
          tags: ['tag1', 'tag2'],
        },
        spec: {
          type: 'service',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'component1-name',
          title: 'Component1 title',
          description: 'Component1 description',
          tags: ['tag1', 'tag2'],
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          system: 'system1-name',
          owner: 'group1-name',
          providesApis: ['api1-name'],
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'component2-name',
          title: 'Component2 title',
          description: 'Component2 description',
          tags: ['tag1', 'tag2'],
          annotations: {
            'backstage.io/techdocs-ref': 'dir:.',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          system: 'system1-name',
          owner: 'group1-name',
          providesApis: ['api1-name'],
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'API',
        metadata: {
          namespace: 'default',
          name: 'api1-name',
          title: 'API1 title',
          description: 'API1 description',
          tags: ['tag1', 'tag2'],
        },
        spec: {
          type: 'service',
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
          owner: 'group1-name',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'template2-name',
          title: 'Template2 title',
          description: 'Template2 description',
          tags: ['flogo'],
        },
        spec: {
          type: 'service',
          system: 'system1-name',
          owner: 'group1-name',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'import-flow1-name',
          title: 'Import flow1 title',
          description: 'Import flow1 description',
          tags: ['import-flow', 'bwce'],
        },
        spec: {
          type: 'service',
          system: 'system1-name',
          owner: 'group1-name',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'import-flow2-name',
          title: 'Import flow2 title',
          description: 'Import flow2 description',
          tags: ['import-flow', 'flogo'],
        },
        spec: {
          type: 'service',
          system: 'system1-name',
          owner: 'group1-name',
        },
      },
    ],
  });
  const searchApiMock = {
    query: jest.fn().mockResolvedValue({
      results: [
        {
          type: 'software-catalog',
          document: {
            title: 'MARKETPLACE TEMPLATE 1',
            text: 'test',
            componentType: 'Template',
            type: 'Template',
            namespace: 'default',
            kind: 'Template',
            lifecycle: '',
            owner: 'group:default/tibco-imported',
            location: '/catalog/default/template/marketplace-template-1-entry',
          },
          rank: 6,
          highlight: {
            preTag: '<54972aa6-1e1a-4d08-8493-0b6222a92bcd>',
            postTag: '</54972aa6-1e1a-4d08-8493-0b6222a92bcd>',
            fields: {},
          },
        },
        {
          type: 'techdocs',
          document: {
            title: 'MARKETPLACE TEMPLATE 1',
            text: 'test',
            componentType: 'Template',
            type: 'Template',
            namespace: 'default',
            kind: 'Template',
            lifecycle: '',
            owner: 'group:default/tibco-imported',
            location: '/catalog/default/template/marketplace-template-1-entry',
          },
          rank: 6,
          highlight: {
            preTag: '<54972aa6-1e1a-4d08-8493-0b6222a92bcd>',
            postTag: '</54972aa6-1e1a-4d08-8493-0b6222a92bcd>',
            fields: {},
          },
        },
        {
          type: 'techdocs1',
          document: {
            title: 'MARKETPLACE TEMPLATE 2',
            text: 'test',
            componentType: 'Template',
            type: 'Template',
            namespace: 'default',
            kind: 'Template',
            lifecycle: '',
            owner: 'group:default/tibco-imported',
            location: '/catalog/default/template/marketplace-template-1-entry',
          },
          rank: 6,
          highlight: {
            preTag: '<54972aa6-1e1a-4d08-8493-0b6222a92bcd>',
            postTag: '</54972aa6-1e1a-4d08-8493-0b6222a92bcd>',
            fields: {},
          },
        },
      ],
    }),
  };
  const mockObservable = {
    subscribe: jest.fn(callback => {
      callback(new Set(['component:default/component1-name']));
      return { unsubscribe: jest.fn() }; // Mock unsubscribe
    }),
  };
  const starApiMock = {
    starredEntitie$: jest.fn().mockReturnValue(mockObservable),
  };

  it('should render search page', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              app: {
                title: 'test app',
                developerHubVersion: '1.9.0',
                buildVersion: 'master',
                showBuildVersion: true,
                baseUrl: 'http://localhost:3000',
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
              cpLink: '/cp-url.com',
              tibcoDeveloperHubCustomAppVersion: 'test version',
              backend: { baseUrl: 'http://localhost:7007' },
              secondaryControlPlanes: [
                {
                  name: 'Control Plane1',
                  url: 'https://cp1.com',
                  id: 'cp1',
                },
                {
                  name: 'Control Plane2',
                  url: 'https://cp2.com',
                  id: 'cp2',
                },
              ],
              templateGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
                },
              ],
              importFlowGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
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
          [searchApiRef, searchApiMock],
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/search'],
      },
    );
    expect(getByText('Result Type')).toBeInTheDocument();
  });
  it('should render side nav and home page', async () => {
    const { getByText, getAllByText, getByLabelText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              app: {
                title: 'test app',
                developerHubVersion: '1.9.0',
                buildVersion: 'master',
                showBuildVersion: true,
                baseUrl: 'http://localhost:3000',
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
              cpLink: '/cp-url.com',
              tibcoDeveloperHubCustomAppVersion: 'test version',
              backend: { baseUrl: 'http://localhost:7007' },
              secondaryControlPlanes: [
                {
                  name: 'Control Plane1',
                  url: 'https://cp1.com',
                  id: 'cp1',
                },
                {
                  name: 'Control Plane2',
                  url: 'https://cp2.com',
                  id: 'cp2',
                },
              ],
              templateGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
                },
              ],
              importFlowGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
                },
              ],
            }),
          ],
          [starredEntitiesApiRef, starApiMock],
          [catalogApiRef, mockCatalogApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/'],
      },
    );
    expect(getByLabelText('Search')).toBeInTheDocument();
    expect(getByText('Custom version : test version')).toBeInTheDocument();
    expect(getByText('Build: master')).toBeInTheDocument();
    expect(getByText('Version : 1.9.0')).toBeInTheDocument();
    expect(getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(getByText('Catalog').closest('a')).toHaveAttribute(
      'href',
      '/catalog',
    );
    const apis = getAllByText('APIs');
    expect(apis.length).toEqual(2);
    expect(apis[0].closest('a')).toHaveAttribute('href', '/api-docs');
    expect(getByText('Docs').closest('a')).toHaveAttribute('href', '/docs');
    expect(getByText('Develop...').closest('a')).toHaveAttribute(
      'href',
      '/create',
    );
    expect(getByText('Import...').closest('a')).toHaveAttribute(
      'href',
      '/import-flow',
    );
    expect(getByText('Settings').closest('a')).toHaveAttribute(
      'href',
      '/settings',
    );
    expect(getByText('Sign out')).toBeInTheDocument();
    fireEvent.click(getByText('Control Plane'));
    expect(getByText('Primary Control Plane').closest('a')).toHaveAttribute(
      'href',
      'https://cp-url.com',
    );
    expect(getByText('Control Plane1').closest('a')).toHaveAttribute(
      'href',
      'https://cp1.com',
    );
    expect(getByText('Control Plane2').closest('a')).toHaveAttribute(
      'href',
      'https://cp2.com',
    );

    expect(getByText('What is the TIBCO® Developer Hub ?')).toBeInTheDocument();
    expect(getByText('See how it works').closest('a')).toHaveAttribute(
      'href',
      'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
    );
    expect(getByText('Get started').closest('a')).toHaveAttribute(
      'href',
      '/create',
    );
    expect(
      getByText('Ready to jump right in? Start developing'),
    ).toBeInTheDocument();
    expect(getByText('Create new component').closest('a')).toHaveAttribute(
      'href',
      '/create',
    );
    expect(
      getByText('Register existing component').closest('a'),
    ).toHaveAttribute('href', '/catalog-import');
    expect(getByText('Systems')).toBeInTheDocument();
    expect(getByText('Components')).toBeInTheDocument();
    expect(getByText('Documents')).toBeInTheDocument();
    expect(getByText('Templates')).toBeInTheDocument();
    expect(getByText('Import flows')).toBeInTheDocument();
    const viewAll = getAllByText('View all');
    expect(viewAll.length).toEqual(6);
    expect(viewAll[0]).toHaveAttribute('href', '/catalog?filters[kind]=system');
    expect(viewAll[1]).toHaveAttribute(
      'href',
      '/catalog?filters[kind]=component',
    );
    expect(viewAll[2]).toHaveAttribute('href', '/docs');
    expect(viewAll[3]).toHaveAttribute('href', '/api-docs');
    expect(viewAll[4]).toHaveAttribute('href', '/create');
    expect(viewAll[5]).toHaveAttribute('href', '/import-flow');
    expect(getByText('System1 title')).toHaveAttribute(
      'href',
      '/catalog/default/system/system1-name',
    );
    const com = getAllByText('Component2 title');
    expect(com[0]).toHaveAttribute(
      'href',
      '/catalog/default/component/component2-name',
    );
    expect(com[1]).toHaveAttribute(
      'href',
      '/docs/default/component/component2-name',
    );
    expect(getByText('Component1 title')).toHaveAttribute(
      'href',
      '/catalog/default/component/component1-name',
    );
    expect(getByText('API1 title')).toHaveAttribute(
      'href',
      '/catalog/default/api/api1-name',
    );
    expect(getByText('Template1 title')).toHaveAttribute(
      'href',
      '/create/templates/default/template1-name',
    );
    expect(getByText('Import flow1 title')).toHaveAttribute(
      'href',
      '/import-flow/templates/default/import-flow1-name',
    );
  });
  it('should render develop page', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
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
              cpLink: '/cp-url.com',
              templateGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
                },
              ],
            }),
          ],
          [catalogApiRef, mockCatalogApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/create'],
      },
    );
    expect(getByText('Control Plane').closest('a')).toHaveAttribute(
      'href',
      'https://cp-url.com',
    );
    expect(getByText('Develop a new component')).toBeInTheDocument();
    expect(
      getByText(
        'Develop new software components using standard templates in your organization',
      ),
    ).toBeInTheDocument();
    expect(
      getByText('Register Existing Component').closest('a'),
    ).toHaveAttribute('href', '/catalog-import');
    await waitFor(() => {
      expect(getByText('Group1')).toBeInTheDocument();
      expect(getByText('Group2')).toBeInTheDocument();
      expect(getByText('Template1 title')).toBeInTheDocument();
      expect(getByText('Template2 title')).toBeInTheDocument();
      expect(getAllByText('Choose').length).toEqual(2);
    });
  });
  it('should render import flow page', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
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
              importFlowGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
                },
              ],
            }),
          ],
          [catalogApiRef, mockCatalogApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/import-flow'],
      },
    );
    expect(getByText('Import Flow')).toBeInTheDocument();
    expect(
      getByText('Import new software components using import flows'),
    ).toBeInTheDocument();
    expect(
      getByText('Register Existing Import Flow').closest('a'),
    ).toHaveAttribute('href', '/catalog-import');
    await waitFor(() => {
      expect(getByText('Group1')).toBeInTheDocument();
      expect(getByText('Group2')).toBeInTheDocument();
      expect(getByText('Import flow1 title')).toBeInTheDocument();
      expect(getByText('Import flow2 title')).toBeInTheDocument();
      expect(getAllByText('Choose').length).toEqual(2);
    });
  });
  it('should render marketplace page', async () => {
    const mockCatalogApi1 = {
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
    const {
      getByText,
      getByPlaceholderText,
      getByTestId,
      getAllByText,
      queryByText,
      queryByTestId,
    } = await renderInTestApp(
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
              marketplaceGroups: [
                {
                  name: 'Group1',
                  tagFilters: ['bwce'],
                },
                {
                  name: 'Group2',
                  tagFilters: ['flogo', 'tibco'],
                },
              ],
            }),
          ],
          [catalogApiRef, mockCatalogApi1],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/marketplace'],
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
    expect(
      getByText(
        'Welcome to the TIBCO® Developer Hub Marketplace, from here you can install additional entities into your TIBCO® Developer Hub instance. From here you can install documents & examples into your TIBCO® Developer Hub. This will help you accelerate your development process by adding pre-built templates. This will help you get complete insight into your Integration landscape & topology by adding import flows to bring in existing TIBCO® code into your TIBCO® Developer Hub.',
      ),
    ).toBeInTheDocument();
    expect(getByText('Learn more').closest('a')).toHaveAttribute(
      'href',
      'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
    );
    await waitFor(async () => {
      expect(getByText('Tags')).toBeInTheDocument();
    });

    expect(getByText('Explore marketplace entries')).toBeInTheDocument();
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
    expect(getByText('Categories')).toBeInTheDocument();
    expect(getByText('Group1')).toBeInTheDocument();
    expect(getByText('Group2')).toBeInTheDocument();
    expect(getByText('Other Marketplace Entries')).toBeInTheDocument();
    expect(getByText('Marketplace1 title')).toBeInTheDocument();
    expect(getByText('Marketplace1 description')).toBeInTheDocument();
    const entry = getByText('Marketplace2 title');
    expect(entry).toBeInTheDocument();
    expect(getByText('Marketplace2 description')).toBeInTheDocument();
    expect(getAllByText('Install').length).toEqual(2);
    expect(getByText('Open')).toBeInTheDocument();
    expect(getByText('Open').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/template/template1-name',
    );
    expect(getByText('document')).toBeInTheDocument();
    expect(getByText('sample')).toBeInTheDocument();
    expect(getByText('template')).toBeInTheDocument();
    expect(getByText('Installed')).toBeInTheDocument();
    expect(getByTestId('new-image')).toBeInTheDocument();
    //   expect(getByText('Group1 display name')).toBeInTheDocument();
    // expect(getByText('Group2 display name')).toBeInTheDocument();
    expect(getByText('Get more info').closest('a')).toHaveAttribute(
      'href',
      'https://moreinfo.com',
    );
    expect(getByText('TIBCO').closest('a')).toHaveAttribute(
      'href',
      'https://www.tibco.com',
    );
    expect(getByText('TIBCO1').closest('a')).toHaveAttribute(
      'href',
      'https://www.tibco1.com',
    );
    expect(getByText('bwce')).toBeInTheDocument();
    expect(getByText('flogo')).toBeInTheDocument();
    expect(queryByText('TIBCO2')).not.toBeInTheDocument();
    expect(queryByText('TIBCO4')).not.toBeInTheDocument();
    expect(getByText('flogo1')).toBeInTheDocument();
    expect(getByText('flogo2')).toBeInTheDocument();
    expect(getByText('flogo3')).toBeInTheDocument();
    expect(queryByText('flogo4')).not.toBeInTheDocument();
    expect(queryByText('flogo7')).not.toBeInTheDocument();
    await userEvent.click(entry);
    await waitFor(() => {
      expect(getByTestId('detail-container')).toBeInTheDocument();
    });
    expect(getByTestId('detail-default-image')).toBeInTheDocument();
    expect(getAllByText('Install').length).toEqual(3);
    expect(getAllByText('Marketplace2 title').length).toEqual(2);
    expect(getAllByText('Marketplace2 description').length).toEqual(2);
    expect(getAllByText('sample').length).toEqual(2);
    expect(getAllByText('flogo').length).toEqual(2);
    expect(getAllByText('Get more info').length).toEqual(2);

    const entry1 = getByText('Marketplace3 title');
    expect(entry1).toBeInTheDocument();
    await userEvent.click(entry1);
    await waitFor(() => {
      expect(getByTestId('detail-container')).toBeInTheDocument();
      expect(getByTestId('detail-custom-image')).toBeInTheDocument();
    });
    expect(getByText('TIBCO2').closest('a')).toHaveAttribute(
      'href',
      'https://www.tibco2.com',
    );
    expect(getByText('TIBCO4').closest('a')).toHaveAttribute(
      'href',
      'https://www.tibco4.com',
    );
    expect(getByText('flogo4')).toBeInTheDocument();
    expect(getByText('flogo7')).toBeInTheDocument();
    const closeIcon = getByTestId('close-detail-icon');
    expect(closeIcon).toBeInTheDocument();
    await userEvent.click(closeIcon);
    await waitFor(() => {
      expect(queryByTestId('detail-container')).not.toBeInTheDocument();
    });
    expect(queryByText('flogo7')).not.toBeInTheDocument();
  }, 10000);
});
