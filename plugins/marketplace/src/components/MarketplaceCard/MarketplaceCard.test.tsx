/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent } from '@testing-library/react';
import { MarketplaceCard } from './MarketplaceCard.tsx';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';

describe('MarketplaceCard Component', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      title: 'Test Template Title',
      tags: ['devhub-marketplace', 'custom-tag'],
      links: [{ url: 'https://example.com', title: 'Example Link' }],
      'tibco.developer.hub/marketplace': {
        moreInfo: [
          { url: 'https://moreinfo.com', text: 'More Info Link', icon: 'docs' },
        ],
      },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };

  it('renders the card with correct title and tags', async () => {
    await renderInTestApp(
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
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceCard template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Test Template Title')).toBeInTheDocument();
    expect(screen.getByText('custom-tag')).toBeInTheDocument();
  });

  it('show Installed when the template is installed', async () => {
    const installedTemplate = { ...mockTemplate, installed: true };
    await renderInTestApp(
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
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceCard template={installedTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Installed')).toBeInTheDocument();
  });

  it('renders additional links when they exist', async () => {
    await renderInTestApp(
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
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceCard template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Example Link')).toBeInTheDocument();
    expect(screen.getByText('More Info Link')).toBeInTheDocument();
  });

  it('does not render tags when they are filtered out', async () => {
    const templateWithFilteredTags = {
      ...mockTemplate,
      metadata: { ...mockTemplate.metadata, tags: ['devhub-marketplace'] },
    };

    await renderInTestApp(
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
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceCard template={templateWithFilteredTags} />
      </TestApiProvider>,
    );
    expect(screen.queryByText('devhub-marketplace')).not.toBeInTheDocument();
  });

  it('calls onSelected with correct arguments when card is clicked', async () => {
    const mockOnSelected = jest.fn();
    await renderInTestApp(
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
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceCard template={mockTemplate} onSelected={mockOnSelected} />
      </TestApiProvider>,
    );
    const card = screen.getByTestId('test-template');
    fireEvent.click(card);
    expect(mockOnSelected).toHaveBeenCalledTimes(1);
  });

  it('renders card actions when permissions allow task creation', async () => {
    await renderInTestApp(
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
            }),
          ],
          [permissionApiRef, {}],
        ]}
      >
        <MarketplaceCard template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('marketplace-card-actions')).toBeInTheDocument();
  });
});
