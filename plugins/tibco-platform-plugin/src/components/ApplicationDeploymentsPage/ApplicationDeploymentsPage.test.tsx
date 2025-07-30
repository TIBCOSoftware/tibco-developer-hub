/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { EntityProvider, catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/core-app-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import React from 'react';
import { ApplicationDeploymentsPage } from './index.ts';
import { configApiRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../routes.ts';

describe('<ApplicationDeploymentsPage />', () => {
  const catalogApi = catalogApiMock.mock();

  it('renders info', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'test-BWCE-app1',
            dataPlaneName: 'test-DP-dev',
            dpId: 'testdpid1',
            capabilityInstanceId: 'testcapabilityInstanceid1',
            appId: 'testappid1',
            controlPlaneName: 'cp1 name',
            controlPlaneUrl: 'https://cp1.com',
          },
          {
            appType: 'BWCE',
            appName: 'test-BWCE-app2',
            dataPlaneName: 'test-DP-prod',
            dpId: 'testdpid2',
            capabilityInstanceId: 'testcapabilityInstanceid2',
            appId: 'testappid2',
            controlPlaneId: 'cp1',
          },
          {
            appType: 'BWCE',
            appName: 'test-BWCE-app3',
            dataPlaneName: 'test-DP-prod',
            dpId: 'testdpid3',
            capabilityInstanceId: 'testcapabilityInstanceid3',
            appId: 'testappid3',
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
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsPage />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/tibco-platform-plugin': rootRouteRef,
        },
      },
    );
    expect(getByText('Welcome to tibco-platform-plugin!')).toBeInTheDocument();
    expect(getByText('Optional subtitle')).toBeInTheDocument();
    expect(
      getByText('All content should be wrapped in a card like this.'),
    ).toBeInTheDocument();
    expect(
      getByText('TIBCO platform application deployments'),
    ).toBeInTheDocument();

    expect(getByText('test-BWCE-app1')).toHaveAttribute(
      'href',
      'https://cp1.com/cp/bwce/appdetails?dp_id=testdpid1&capability_instance_id=testcapabilityInstanceid1&app_id=testappid1',
    );
    expect(getByText('cp1 name')).toHaveAttribute('href', 'https://cp1.com');
    expect(getByText('test-DP-dev')).toHaveAttribute(
      'href',
      'https://cp1.com/cp/app/data-plane?dp_id=testdpid1',
    );
    expect(getByText('test-BWCE-app3')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/bwce/appdetails?dp_id=testdpid3&capability_instance_id=testcapabilityInstanceid3&app_id=testappid3',
    );
    expect(getByText('Primary Control Plane')).toHaveAttribute(
      'href',
      'https://cp-url.com/',
    );
    expect(getByText('test-DP-prod')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/app/data-plane?dp_id=testdpid3',
    );
  });
});
