/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { DeploymentsEmptyState } from './DeploymentsEmptyState.tsx';
import { ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

describe('<DeploymentsEmptyState> for tibco-platform-plugin', () => {
  it('should render empty state messages and example', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              app: {
                docUrl:
                  'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
              },
            }),
          ],
        ]}
      >
        <DeploymentsEmptyState />
      </TestApiProvider>,
    );

    expect(
      getByText(
        'No TIBCO platform application deployments defined for this entity. You can add TIBCO platform application deployment to your entity YAML as shown in the highlighted example below:',
      ),
    ).toBeInTheDocument();
    expect(getByText('Read more').closest('a')).toHaveAttribute(
      'href',
      'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview',
    );
    expect(getByText('tibcoPlatformApps:')).toBeInTheDocument();
  });
});
