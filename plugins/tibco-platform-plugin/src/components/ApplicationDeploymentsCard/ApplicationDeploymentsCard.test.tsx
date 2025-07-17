/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  EntityProvider,
  catalogApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  TestApiProvider,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import { ConfigReader } from '@backstage/core-app-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import React from 'react';
import {
  ApplicationDeploymentsCard,
  ApplicationDeploymentsError,
} from './index.ts';
import { configApiRef } from '@backstage/core-plugin-api';

describe('ApplicationDeploymentsCard for tibco-platform-plugin', () => {
  const catalogApi = catalogApiMock.mock();

  /*  beforeEach(() => {
    jest.clearAllMocks();
  });*/

  it('should render 2 columns in table when no CP config in tibcoPlatformApps', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'mydemodpid1',
            capabilityInstanceId: 'mydemocapabilityInstanceid1',
            appId: 'mydemoappid1',
          },
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app2',
            dataPlaneName: 'my-DP-prod',
            dpId: 'mydemodpid2',
            capabilityInstanceId: 'mydemocapabilityInstanceid2',
            appId: 'mydemoappid2',
          },
        ],
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { getByText, queryByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              cpLink: 'https://cp-url.com',
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
            }),
          ],
          [catalogApiRef, catalogApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(getByText('Data plane')).toBeInTheDocument();
    expect(getByText('Application')).toBeInTheDocument();
    expect(getByText('my-BWCE-app1')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/bwce/appdetails?dp_id=mydemodpid1&capability_instance_id=mydemocapabilityInstanceid1&app_id=mydemoappid1',
    );
    expect(getByText('my-DP-dev')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/app/data-plane?dp_id=mydemodpid1',
    );
    expect(getByText('my-BWCE-app2')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/bwce/appdetails?dp_id=mydemodpid2&capability_instance_id=mydemocapabilityInstanceid2&app_id=mydemoappid2',
    );
    expect(getByText('my-DP-prod')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/app/data-plane?dp_id=mydemodpid2',
    );
    expect(queryByText('Primary Control Plane')).toBeNull();
    expect(queryByText('Control plane')).toBeNull();
  });
  it('should render 3 columns in table when CP config exists in tibcoPlatformApps', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'mydemodpid1',
            capabilityInstanceId: 'mydemocapabilityInstanceid1',
            appId: 'mydemoappid1',
            controlPlaneName: 'my control plane1',
            controlPlaneUrl: 'https://cp1.com',
          },
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app2',
            dataPlaneName: 'my-DP-prod',
            dpId: 'mydemodpid2',
            capabilityInstanceId: 'mydemocapabilityInstanceid2',
            appId: 'mydemoappid2',
            controlPlaneId: 'cp1',
          },
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app3',
            dataPlaneName: 'my-DP-prod1',
            dpId: 'mydemodpid3',
            capabilityInstanceId: 'mydemocapabilityInstanceid3',
            appId: 'mydemoappid3',
          },
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app4',
            dataPlaneName: 'my-DP-prod2',
            dpId: 'mydemodpid4',
            capabilityInstanceId: 'mydemocapabilityInstanceid4',
            appId: 'mydemoappid4',
            controlPlaneId: 'cp2',
          },
        ],
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { getByText, queryByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {},
              }),
            ),
          ],
          [
            configApiRef,
            new ConfigReader({
              cpLink: '/cp-url.com',
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
              secondaryControlPlanes: [
                {
                  name: 'my control plane2',
                  url: 'https://cp2.com',
                  id: 'cp1',
                },
                {
                  name: 'my control plane3',
                  url1: 'https://cp3.com',
                  id: 'cp3',
                },
              ],
            }),
          ],
          [catalogApiRef, catalogApi],
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(getByText('Control plane')).toBeInTheDocument();
    expect(getByText('Data plane')).toBeInTheDocument();
    expect(getByText('Application')).toBeInTheDocument();
    expect(getByText('my-BWCE-app1')).toHaveAttribute(
      'href',
      'https://cp1.com/cp/bwce/appdetails?dp_id=mydemodpid1&capability_instance_id=mydemocapabilityInstanceid1&app_id=mydemoappid1',
    );
    expect(getByText('my-DP-dev')).toHaveAttribute(
      'href',
      'https://cp1.com/cp/app/data-plane?dp_id=mydemodpid1',
    );
    expect(getByText('my control plane1')).toHaveAttribute(
      'href',
      'https://cp1.com',
    );
    expect(getByText('my-BWCE-app2')).toHaveAttribute(
      'href',
      'https://cp2.com/cp/bwce/appdetails?dp_id=mydemodpid2&capability_instance_id=mydemocapabilityInstanceid2&app_id=mydemoappid2',
    );
    expect(getByText('my-DP-prod')).toHaveAttribute(
      'href',
      'https://cp2.com/cp/app/data-plane?dp_id=mydemodpid2',
    );
    expect(getByText('my control plane2')).toHaveAttribute(
      'href',
      'https://cp2.com',
    );
    expect(getByText('my-BWCE-app3')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/bwce/appdetails?dp_id=mydemodpid3&capability_instance_id=mydemocapabilityInstanceid3&app_id=mydemoappid3',
    );
    expect(getByText('my-DP-prod1')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/app/data-plane?dp_id=mydemodpid3',
    );
    expect(getByText('Primary Control Plane')).toHaveAttribute(
      'href',
      'https://cp-url.com/',
    );
    expect(queryByText('my-BWCE-app4')).toBeNull();
    expect(queryByText('my-DP-prod2')).toBeNull();
    expect(queryByText('my control plane3')).toBeNull();
  });
  it('should not render if cpLink not in config', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'mydemodpid1',
            capabilityInstanceId: 'mydemocapabilityInstanceid1',
            appId: 'mydemoappid1',
            controlPlaneName: 'my control plane1',
            controlPlaneUrl: 'https://cp1.com',
          },
        ],
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {},
              }),
            ),
          ],
          [
            configApiRef,
            new ConfigReader({
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
            }),
          ],
          [catalogApiRef, catalogApi],
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(getByText('CP link not found')).toBeInTheDocument();
  });
  it('should render error if the entity has configuration issue', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'mydemodpid1',
            capabilityInstanceId: 'mydemocapabilityInstanceid1',
            appId: 'mydemoappid1',
            controlPlaneName: 'my control plane1',
            controlPlaneUrl: 'https://cp1.com',
          },
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app2',
            dataPlaneName: 'my-DP-prod',
            dpId: 'mydemodpid2',
            capabilityInstanceId: 'mydemocapabilityInstanceid2',
            appId: 'mydemoappid2',
            controlPlaneId: 'cp1',
          },
        ],
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {},
              }),
            ),
          ],
          [
            configApiRef,
            new ConfigReader({
              cpLink: 'https://cp-url.com',
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
              secondaryControlPlanes: [
                {
                  name: 'my control plane4',
                  url: 'https://cp-url4.com',
                  id: 'cp3',
                },
              ],
            }),
          ],
          [catalogApiRef, catalogApi],
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsError />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(
      getByText('This entity has configuration issue in tibcoPlatformApps'),
    ).toBeInTheDocument();
  });
  it('should not render error if the entity do not have configuration issue', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'mydemodpid1',
            capabilityInstanceId: 'mydemocapabilityInstanceid1',
            appId: 'mydemoappid1',
            controlPlaneName: 'my control plane1',
            controlPlaneUrl: 'https://cp1.com',
          },
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app2',
            dataPlaneName: 'my-DP-prod',
            dpId: 'mydemodpid2',
            capabilityInstanceId: 'mydemocapabilityInstanceid2',
            appId: 'mydemoappid2',
            controlPlaneId: 'cp1',
          },
        ],
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { queryByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {},
              }),
            ),
          ],
          [
            configApiRef,
            new ConfigReader({
              cpLink: 'https://cp-url.com',
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
              secondaryControlPlanes: [
                {
                  name: 'my control plane4',
                  url: 'https://cp-url4.com',
                  id: 'cp1',
                },
              ],
            }),
          ],
          [catalogApiRef, catalogApi],
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsError />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(
      queryByText('This entity has configuration issue in tibcoPlatformApps'),
    ).toBeNull();
  });
});
