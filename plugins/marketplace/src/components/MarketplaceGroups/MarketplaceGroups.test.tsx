/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { ConfigReader } from '@backstage/core-app-api';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
}));

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  TemplateGroup: jest.fn(() => null),
}));

import { useEntityList } from '@backstage/plugin-catalog-react';
import { MarketplaceGroups } from './MarketplaceGroups.tsx';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef, errorApiRef } from '@backstage/core-plugin-api';
import { TemplateGroup } from '@backstage/plugin-scaffolder-react/alpha';
import React from 'react';

describe('TemplateGroups', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return progress if the hook is loading', async () => {
    (useEntityList as jest.Mock).mockReturnValue({ loading: true });

    const { findByTestId } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, {}],
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
        ]}
      >
        <MarketplaceGroups groups={[]} />
      </TestApiProvider>,
    );

    expect(await findByTestId('progress')).toBeInTheDocument();
  });

  it('should use the error api if there is an error with the retrieval of entitylist', async () => {
    const mockError = new Error('things went poop');
    (useEntityList as jest.Mock).mockReturnValue({
      error: mockError,
    });
    const errorApi = {
      post: jest.fn(),
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, errorApi],
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
        ]}
      >
        <MarketplaceGroups groups={[]} />
      </TestApiProvider>,
    );

    expect(errorApi.post).toHaveBeenCalledWith(mockError);
  });

  it('should return a no templates message if entities is unset', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      entities: null,
      loading: false,
      error: null,
    });

    const { findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, {}],
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
        ]}
      >
        <MarketplaceGroups groups={[]} />
      </TestApiProvider>,
    );

    expect(
      await findByText(/No marketplace entries found/),
    ).toBeInTheDocument();
  });

  it('should return a no templates message if entities has no values in it', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      entities: [],
      loading: false,
      error: null,
    });

    const { findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, {}],
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
        ]}
      >
        <MarketplaceGroups groups={[]} />
      </TestApiProvider>,
    );

    expect(
      await findByText(/No marketplace entries found/),
    ).toBeInTheDocument();
  });

  it('should call the template group with the components', async () => {
    const mockEntities = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't1',
        },
        spec: {},
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't2',
        },
        spec: {},
      },
    ];

    (useEntityList as jest.Mock).mockReturnValue({
      entities: mockEntities,
      loading: false,
      error: null,
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, {}],
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
        ]}
      >
        <MarketplaceGroups groups={[{ title: 'all', filter: () => true }]} />
      </TestApiProvider>,
    );

    expect(TemplateGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        templates: mockEntities.map(template =>
          expect.objectContaining({ template }),
        ),
      }),
      {},
    );
  });

  it('should apply the filter for each group', async () => {
    const mockEntities = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't1',
        },
        spec: {},
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't2',
        },
        spec: {},
      },
    ];

    (useEntityList as jest.Mock).mockReturnValue({
      entities: mockEntities,
      loading: false,
      error: null,
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, {}],
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
        ]}
      >
        <MarketplaceGroups
          groups={[{ title: 'all', filter: e => e.metadata.name === 't1' }]}
        />
      </TestApiProvider>,
    );

    expect(TemplateGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        templates: [expect.objectContaining({ template: mockEntities[0] })],
      }),
      {},
    );
  });

  it('should filter out templates based on filter condition', async () => {
    const mockEntities = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't1',
        },
        spec: {},
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't2',
        },
        spec: {},
      },
    ];

    (useEntityList as jest.Mock).mockReturnValue({
      entities: mockEntities,
      loading: false,
      error: null,
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, {}],
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
        ]}
      >
        <MarketplaceGroups
          groups={[{ title: 'all', filter: _ => true }]}
          templateFilter={e => e.metadata.name === 't1'}
        />
      </TestApiProvider>,
    );

    expect(TemplateGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        templates: [expect.objectContaining({ template: mockEntities[0] })],
      }),
      {},
    );
  });
});
