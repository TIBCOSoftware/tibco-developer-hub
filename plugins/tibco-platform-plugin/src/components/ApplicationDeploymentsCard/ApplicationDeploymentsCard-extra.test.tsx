/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { ApplicationDeploymentsCard } from './ApplicationDeploymentsCard';
import React from 'react';
import { ConfigReader } from '@backstage/core-app-api';

describe('ApplicationDeploymentsCard Component', () => {
  it('renders error panel when CP link is missing in configuration', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        tibcoPlatformApps: [],
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, new ConfigReader({})]]}>
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(getByText('CP link not found')).toBeInTheDocument();
  });

  it('renders empty state when no deployments are available', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        tibcoPlatformApps: [],
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
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(
      getByText('TIBCO platform application deployments'),
    ).toBeInTheDocument();
    expect(getByText('Read more')).toBeInTheDocument();
  });

  it('renders table with correct columns when CP configuration exists', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'dp1',
            capabilityInstanceId: 'cap1',
            appId: 'app1',
            controlPlaneName: 'Control Plane 1',
            controlPlaneUrl: 'https://cp1.com',
          },
        ],
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
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(getByText('Control plane')).toBeInTheDocument();
    expect(getByText('Data plane')).toBeInTheDocument();
    expect(getByText('Application')).toBeInTheDocument();
    expect(getByText('my-BWCE-app1')).toHaveAttribute(
      'href',
      'https://cp1.com/cp/bwce/appdetails?dp_id=dp1&capability_instance_id=cap1&app_id=app1',
    );
    expect(getByText('my-DP-dev')).toHaveAttribute(
      'href',
      'https://cp1.com/cp/app/data-plane?dp_id=dp1',
    );
    expect(getByText('Control Plane 1')).toHaveAttribute(
      'href',
      'https://cp1.com',
    );
  });

  it('renders table without control plane column when CP configuration is missing', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            appName: 'my-BWCE-app1',
            dataPlaneName: 'my-DP-dev',
            dpId: 'dp1',
            capabilityInstanceId: 'cap1',
            appId: 'app1',
          },
        ],
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
        ]}
      >
        <EntityProvider entity={entity}>
          <ApplicationDeploymentsCard />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(getByText('Data plane')).toBeInTheDocument();
    expect(getByText('Application')).toBeInTheDocument();
    expect(getByText('my-BWCE-app1')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/bwce/appdetails?dp_id=dp1&capability_instance_id=cap1&app_id=app1',
    );
    expect(getByText('my-DP-dev')).toHaveAttribute(
      'href',
      'https://cp-url.com/cp/app/data-plane?dp_id=dp1',
    );
    expect(queryByText('Control plane')).toBeNull();
  });
});
