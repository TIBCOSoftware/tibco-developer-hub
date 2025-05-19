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
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/core-app-api';
import { screen } from '@testing-library/react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import React from 'react';
import { ApplicationDeploymentsCard } from './ApplicationDeploymentsCard.tsx';
import { configApiRef } from '@backstage/core-plugin-api';

describe('<ApplicationDeploymentsCard />', () => {
  const catalogApi = catalogApiMock.mock();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders info', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      tibcoPlatformApps: [
        {
          appType: 'BWCE',
          appName: 'BWCE-app',
          dataPlaneName: 'DP-dev',
          dpId: 'demodpid1',
          capabilityInstanceId: 'democapabilityInstanceid1',
          appId: 'demoappid1',
          controlPlaneName: 'cp1 name',
          controlPlaneUrl: 'https://google.com',
        },
        {
          appType: 'BWCE',
          appName: 'BWCE-app3',
          dataPlaneName: 'DP-prod',
          dpId: 'demodpid3',
          capabilityInstanceId: 'democapabilityInstanceid3',
          appId: 'demoappid3',
          controlPlaneId: 'cp255',
        },
        {
          appType: 'BWCE',
          appName: 'BWCE-app4',
          dataPlaneName: 'DP-prody',
          dpId: 'demodpid3',
          capabilityInstanceId: 'democapabilityInstanceid3',
          appId: 'demoappid3',
          controlPlaneId: 'cp2557',
        },
        {
          appType: 'BWCE',
          appName: 'BWCE-app1',
          dataPlaneName: 'DP-prod',
          dpId: 'demodpid2',
          capabilityInstanceId: 'democapabilityInstanceid2',
          appId: 'demoappid2',
          controlPlaneId: 'cp1',
        },
      ],
    };

    await renderInTestApp(
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
              cpLink: 'https://ptdev.cp1-my.cp-platform.dataplanes.pro',
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.6.0/doc/html#cshid=developer_hub_overview',
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

    expect(screen.getByText('BWCE-app')).toBeInTheDocument();
    expect(screen.getByText('DP-dev')).toBeInTheDocument();
  });
});
