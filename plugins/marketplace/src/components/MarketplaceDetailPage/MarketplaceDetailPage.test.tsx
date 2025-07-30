/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent } from '@testing-library/react';
import { MarketplaceDetailPage } from './MarketplaceDetailPage';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import React from 'react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';

describe('MarketplaceDetailPage Component', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      title: 'Test Template Title',
      description: 'This is a test description.',
      tags: ['tag1', 'tag2'],
      links: [
        { url: 'https://example.com', title: 'Example Link', icon: 'language' },
      ],
      'tibco.developer.hub/marketplace': {
        isNew: true,
        imageURL: 'https://example.com/image.png',
      },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };

  it('renders the detail container with correct data-testid', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={mockTemplate}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('detail-container')).toBeInTheDocument();
  });

  it('renders the custom image when imageURL is provided', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={mockTemplate}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('detail-custom-image')).toBeInTheDocument();
  });

  it('renders the default image when imageURL is not provided', async () => {
    const templateWithoutImage = {
      ...mockTemplate,
      metadata: {
        ...mockTemplate.metadata,
        'tibco.developer.hub/marketplace': {},
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={templateWithoutImage}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('detail-default-image')).toBeInTheDocument();
  });

  it('renders external links when links are provided', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={mockTemplate}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('marketplace-detail-links')).toBeInTheDocument();
    expect(
      screen.getAllByTestId('marketplace-detail-links--metalink'),
    ).toHaveLength(1);
  });

  it('renders tags when tags are provided', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={mockTemplate}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('marketplace-detail-tags')).toBeInTheDocument();
    expect(screen.getAllByTestId(/marketplace-detail-tag-item-/)).toHaveLength(
      2,
    );
  });

  it('renders no tags when no tags are provided', async () => {
    const templateWithoutTags = {
      ...mockTemplate,
      metadata: { ...mockTemplate.metadata, tags: [] },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={templateWithoutTags}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(
      screen.queryByTestId('marketplace-detail-tags'),
    ).not.toBeInTheDocument();
  });

  it('triggers onCloseDetailPage when close icon is clicked', async () => {
    const mockOnClose = jest.fn();
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={mockTemplate}
          onCloseDetailPage={mockOnClose}
        />
      </TestApiProvider>,
    );
    fireEvent.click(screen.getByTestId('close-detail-icon'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders the install button when the template is not installed', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={mockTemplate}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(
      screen.getByTestId('marketplace-detail-actions--install'),
    ).toBeInTheDocument();
  });

  it('renders the open button when the template is installed', async () => {
    const installedTemplate = {
      ...mockTemplate,
      installed: true,
      installedEntityRef: '/installed-entity',
    };
    await renderInTestApp(
      <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
        <MarketplaceDetailPage
          template={installedTemplate}
          onCloseDetailPage={jest.fn()}
        />
      </TestApiProvider>,
    );
    expect(
      screen.getByTestId('marketplace-detail-actions--view'),
    ).toBeInTheDocument();
  });
});
