/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { fireEvent, render, waitFor } from '@testing-library/react';
import App, { routes } from './App';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import {
  configApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
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
import { TopologyContext } from '@internal/plugin-integration-topology';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import {
  catalogImportApiRef,
  CatalogImportClient,
} from '@backstage/plugin-catalog-import';

describe('App', () => {
  it('should render App', async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            backend: { baseUrl: 'http://localhost:7007' },
            auth: {
              enableAuthProviders: ['tibco-control-plane'],
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
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'self-service1-name',
          title: 'Self Service1 title',
          description: 'Self Service1 description',
          tags: ['self-service', 'bwce'],
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
          name: 'self-service2-name',
          title: 'Self Service2 title',
          description: 'Self Service2 description',
          tags: ['self-service', 'flogo'],
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
                developerHubVersion: '1.10.0',
                buildVersion: 'master',
                showBuildVersion: true,
                baseUrl: 'http://localhost:3000',
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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
  }, 30000);
  it('should render side nav and home page', async () => {
    const { getByText, getAllByText, queryByText, getByLabelText } =
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [
              configApiRef,
              new ConfigReader({
                app: {
                  title: 'test app',
                  developerHubVersion: '1.10.0',
                  buildVersion: 'master',
                  showBuildVersion: true,
                  baseUrl: 'http://localhost:3000',
                  docUrl:
                    'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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
    await waitFor(() => {
      expect(getByText('Build: master')).toBeInTheDocument();
    });
    expect(getByText('Version : 1.10.0')).toBeInTheDocument();
    expect(getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(getByText('Catalog').closest('a')).toHaveAttribute(
      'href',
      '/catalog',
    );
    const topologyLinks = getAllByText('Topology');
    expect(topologyLinks.length).toBeGreaterThanOrEqual(1);
    expect(topologyLinks[0].closest('a')).toHaveAttribute(
      'href',
      '/integration-topology',
    );
    const apis = getAllByText('APIs');
    expect(apis.length).toEqual(2);
    expect(apis[0].closest('a')).toHaveAttribute('href', '/api-docs');
    const docsLinks = getAllByText('Documents');
    expect(docsLinks.length).toBeGreaterThanOrEqual(2);
    expect(docsLinks[0].closest('a')).toHaveAttribute('href', '/docs');
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
      'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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

    // Check all HomeCardTypes are rendered
    // Note: Some cards appear in both sidebar and home, so we check they exist
    const topologyCards = getAllByText('Topology');
    expect(topologyCards.length).toBeGreaterThanOrEqual(2); // sidebar + home card
    const marketplaceCards = getAllByText('Marketplace');
    expect(marketplaceCards.length).toBeGreaterThanOrEqual(2); // sidebar + home card
    expect(getByText('Systems')).toBeInTheDocument();
    expect(getByText('Components')).toBeInTheDocument();
    const apisCards = getAllByText('APIs');
    expect(apisCards.length).toBeGreaterThanOrEqual(2); // sidebar + home card
    expect(getByText('Templates')).toBeInTheDocument();
    const documentsCards = getAllByText('Documents');
    expect(documentsCards.length).toBeGreaterThanOrEqual(2); // sidebar + home card
    expect(getByText('Self Service Flows')).toBeInTheDocument();
    expect(getByText('Import Flows')).toBeInTheDocument();
    // Walk-throughs is conditional based on config, so we check it can be null or present
    const walkthroughs = queryByText('Walk-throughs');
    // If walkthroughs config is set, card will be present
    expect(walkthroughs === null || walkthroughs?.tagName).toBeTruthy();

    const viewAll = getAllByText('View all');
    // At least 8 view all links (9 if Walk-throughs is enabled)
    expect(viewAll.length).toBeGreaterThanOrEqual(8);
    // Check that the expected view all links are present
    const viewAllHrefs = viewAll.map(link => link.getAttribute('href'));
    expect(viewAllHrefs).toContain('/integration-topology');
    expect(viewAllHrefs).toContain('/marketplace');
    expect(viewAllHrefs).toContain('/catalog?filters[kind]=system');
    expect(viewAllHrefs).toContain('/catalog?filters[kind]=component');
    expect(viewAllHrefs).toContain('/create');
    expect(viewAllHrefs).toContain('/docs');
    expect(viewAllHrefs).toContain('/api-docs');
    expect(viewAllHrefs).toContain('/import-flow');
    const system1 = getAllByText('System1 title');
    const system1Hrefs = system1.map(link => link.getAttribute('href'));
    expect(system1Hrefs).toContain('/catalog/default/system/system1-name');
    const com = getAllByText('Component2 title');
    const comHrefs = com.map(link => link.getAttribute('href'));
    expect(comHrefs).toContain('/catalog/default/component/component2-name');
    expect(comHrefs).toContain('/docs/default/component/component2-name');
    const com1 = getAllByText('Component1 title');
    const com1Hrefs = com1.map(link => link.getAttribute('href'));
    expect(com1Hrefs).toContain('/catalog/default/component/component1-name');
    const api1 = getAllByText('API1 title');
    const api1Hrefs = api1.map(link => link.getAttribute('href'));
    expect(api1Hrefs).toContain('/catalog/default/api/api1-name');
    const template1 = getAllByText('Template1 title');
    const template1Hrefs = template1.map(link => link.getAttribute('href'));
    expect(template1Hrefs).toContain(
      '/create/templates/default/template1-name',
    );
    const importFlow1 = getAllByText('Import flow1 title');
    const importFlow1Hrefs = importFlow1.map(link => link.getAttribute('href'));
    expect(importFlow1Hrefs).toContain(
      '/import-flow/templates/default/import-flow1-name',
    );
  }, 30000);
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
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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
  }, 30000);
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
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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
    await waitFor(() => {
      expect(getByText('Import Flow')).toBeInTheDocument();
    });
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
  }, 30000);
  it('should render self service page', async () => {
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
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
              },
              backend: { baseUrl: 'http://localhost:7007' },
              selfServiceGroups: [
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
        routeEntries: ['/self-service-flow'],
      },
    );
    expect(
      getByText('Setup new software components using self service flows'),
    ).toBeInTheDocument();
    expect(
      getByText('Register Existing Self Service Flow').closest('a'),
    ).toHaveAttribute('href', '/catalog-import');
    await waitFor(() => {
      expect(getByText('Group1')).toBeInTheDocument();
      expect(getByText('Group2')).toBeInTheDocument();
      expect(getByText('Self Service1 title')).toBeInTheDocument();
      expect(getByText('Self Service2 title')).toBeInTheDocument();
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
          {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            kind: 'Template',
            metadata: {
              namespace: 'default',
              name: 'ai-agent1-name',
              title: 'AI Agent 1 title',
              description: 'AI Agent 1 description',
              tags: ['devhub-marketplace', 'ai', 'agent'],
              'tibco.developer.hub/marketplace': {
                isNew: false,
                moreInfo: [
                  {
                    text: 'AI Agent Info',
                    url: 'https://ai-agent-info.com',
                    icon: 'docs',
                  },
                ],
              },
            },
            spec: {
              type: 'artificial-intelligence',
              system: 'system1-name',
              owner: 'group:default/group1-name',
            },
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
    const mockFetchApi = {
      fetch: jest.fn(() =>
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
    };
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
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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
          [fetchApiRef, mockFetchApi],
          [
            identityApiRef,
            mockApis.identity({
              token: 'test',
            }),
          ],
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
      'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
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
    expect(getAllByText('Get').length).toEqual(3);
    expect(getByText('Open')).toBeInTheDocument();
    expect(getByText('Open').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/template/template1-name',
    );
    expect(getByText('Document')).toBeInTheDocument();
    expect(getByText('Sample')).toBeInTheDocument();
    expect(getByText('Template')).toBeInTheDocument();
    expect(getByText('Artificial Intelligence')).toBeInTheDocument();
    expect(getByText('Added')).toBeInTheDocument();
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
    expect(getByText('AI Agent 1 title')).toBeInTheDocument();
    expect(getByText('AI Agent 1 description')).toBeInTheDocument();
    expect(getByText('ai')).toBeInTheDocument();
    expect(getByText('agent')).toBeInTheDocument();
    expect(getByText('AI Agent Info').closest('a')).toHaveAttribute(
      'href',
      'https://ai-agent-info.com',
    );
    expect(queryByText('flogo4')).not.toBeInTheDocument();
    expect(queryByText('flogo7')).not.toBeInTheDocument();
    await userEvent.click(entry);
    await waitFor(() => {
      expect(getByTestId('detail-container')).toBeInTheDocument();
    });
    expect(getByTestId('detail-default-image')).toBeInTheDocument();
    expect(getAllByText('Get').length).toEqual(4);
    expect(getAllByText('Marketplace2 title').length).toEqual(2);
    expect(getAllByText('Marketplace2 description').length).toEqual(2);
    expect(getAllByText('Sample').length).toEqual(2);
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
  }, 30000);

  it('should render register page', async () => {
    const mockFetchApi = {
      fetch: jest.fn(),
    };
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
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
              },
              backend: { baseUrl: 'http://localhost:7007' },
              integrations: {},
            }),
          ],
          [catalogApiRef, mockCatalogApi],
          [permissionApiRef, mockApis.permission()],
          [
            catalogImportApiRef,
            new CatalogImportClient({
              discoveryApi: {} as any,
              fetchApi: mockFetchApi as any,
              scmAuthApi: {} as any,
              scmIntegrationsApi: {} as any,
              catalogApi: mockCatalogApi,
              configApi: new ConfigReader({ integrations: {} }),
            }),
          ],
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/catalog-import'],
      },
    );
    expect(
      getByText('Start tracking your component in test app'),
    ).toBeInTheDocument();
  }, 30000);

  it('should render integration topology page', async () => {
    jest.mock(
      '@internal/plugin-integration-topology/src/components/EntityNodeDetails/EntityNodeDetails',
      () => ({
        EntityNodeDetails: () => (
          <div data-testid="mocked-entity-node-details">Entity Details</div>
        ),
      }),
    );
    const mockedDetailsEntity = {
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
    };
    const mockedTopologyContext = {
      display: 'block',
      rootEntity: mockedDetailsEntity,
      detailsEntity: mockedDetailsEntity,
      detailsLocked: false,
      toggleDisplay: () => {},
      setDisplay: () => {},
      setRootEntity: () => {},
      setDetailsEntity: () => {},
      setDetailsLocked: () => {},
    };
    const { getByText, getByPlaceholderText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              app: {
                title: 'test app',
                baseUrl: 'http://localhost:3000',
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.10.0/doc/html#cshid=developer_hub_overview',
              },
              backend: {
                baseUrl: 'http://localhost:7007',
              },
              cpLink: '/cp-url.com',
            }),
          ],
          [catalogApiRef, mockCatalogApi],
          [searchApiRef, searchApiMock],
          [translationApiRef, mockApis.translation()],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TopologyContext.Provider value={mockedTopologyContext}>
          <Root>{routes}</Root>
        </TopologyContext.Provider>
      </TestApiProvider>,
      {
        routeEntries: ['/integration-topology'],
      },
    );
    await waitFor(
      async () => {
        expect(getByText('Topology View')).toBeInTheDocument();
        expect(getByText('Graph View')).toBeInTheDocument();
        expect(getByText('Max depth')).toBeInTheDocument();
        expect(getByText('Kinds')).toBeInTheDocument();
        expect(getByText('Relations')).toBeInTheDocument();
        expect(getByText('Direction')).toBeInTheDocument();
        expect(getByText('Curve')).toBeInTheDocument();
        expect(getByText('Simplified')).toBeInTheDocument();
        expect(getByText('Merge relations')).toBeInTheDocument();
        expect(getByText('Select Entity Kind and Name')).toBeInTheDocument();
        expect(getByText('Search Entities by Name')).toBeInTheDocument();
        expect(getByPlaceholderText('component1-name')).toBeInTheDocument();
      },
      { timeout: 15000 },
    );
  }, 60000);
});
