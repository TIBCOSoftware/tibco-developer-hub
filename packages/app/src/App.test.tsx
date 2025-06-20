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
          name: 'Group1-name',
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
          name: 'System1-name',
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
          name: 'Component1-name',
          title: 'Component1 title',
          description: 'Component1 description',
          tags: ['tag1', 'tag2'],
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          system: 'System1-name',
          owner: 'Group1-name',
          providesApis: ['API1-name'],
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'Component2-name',
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
          system: 'System1-name',
          owner: 'Group1-name',
          providesApis: ['API1-name'],
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'API',
        metadata: {
          namespace: 'default',
          name: 'API1-name',
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
          name: 'Template1-name',
          title: 'Template1 title',
          description: 'Template1 description',
          tags: ['bwce'],
        },
        spec: {
          type: 'service',
          system: 'System1-name',
          owner: 'Group1-name',
        },
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          namespace: 'default',
          name: 'Import-flow1-name',
          title: 'Import flow1 title',
          description: 'Import flow1 description',
          tags: ['import-flow', 'bwce'],
        },
        spec: {
          type: 'service',
          system: 'System1-name',
          owner: 'Group1-name',
        },
      },
    ],
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
                developerHubVersion: '1.8.0',
                buildVersion: 'master',
                showBuildVersion: true,
                baseUrl: 'http://localhost:3000',
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.8.0/doc/html#cshid=developer_hub_overview',
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
        ]}
      >
        <Root>{routes}</Root>
      </TestApiProvider>,
      {
        routeEntries: ['/'],
        /* mountedRoutes: {
            '/': homePlugin.routes.root,
          },*/
      },
    );
    expect(getByLabelText('Search')).toBeInTheDocument();
    expect(getByText('Custom version : test version')).toBeInTheDocument();
    expect(getByText('Build: master')).toBeInTheDocument();
    expect(getByText('Version : 1.8.0')).toBeInTheDocument();
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
      'https://docs.tibco.com/go/platform-cp/1.8.0/doc/html#cshid=developer_hub_overview',
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
      '/catalog/default/system/System1-name',
    );
    const com = getAllByText('Component2 title');
    expect(com[0]).toHaveAttribute(
      'href',
      '/catalog/default/component/Component2-name',
    );
    expect(com[1]).toHaveAttribute(
      'href',
      '/docs/default/component/Component2-name',
    );
    expect(getByText('Component1 title')).toHaveAttribute(
      'href',
      '/catalog/default/component/Component1-name',
    );
    expect(getByText('API1 title')).toHaveAttribute(
      'href',
      '/catalog/default/api/API1-name',
    );
    expect(getByText('Template1 title')).toHaveAttribute(
      'href',
      '/create/templates/default/Template1-name',
    );
    expect(getByText('Import flow1 title')).toHaveAttribute(
      'href',
      '/import-flow/templates/default/Import-flow1-name',
    );
  });
  it('should render develop page', async () => {
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
                  'https://docs.tibco.com/go/platform-cp/1.8.0/doc/html#cshid=developer_hub_overview',
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
  });
  it('should render import flow page', async () => {
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
                  'https://docs.tibco.com/go/platform-cp/1.8.0/doc/html#cshid=developer_hub_overview',
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
  });
});
