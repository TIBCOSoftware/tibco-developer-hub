/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { CardHeaderDetail } from './CardHeaderDetail';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('CardHeaderDetail Component', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      title: 'Test Template Title',
      'tibco.developer.hub/marketplace': { isNew: true },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };
  const mockCatalogApi = catalogApiMock({
    entities: [],
  });
  it('renders the category text correctly', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('template')).toBeInTheDocument();
  });

  it('renders the "New" icon when the template is marked as new', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByAltText('new-logo')).toBeInTheDocument();
  });

  it('renders the "Installed" text and icon when the template is installed', async () => {
    const installedTemplate = { ...mockTemplate, installed: true };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={installedTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByAltText('new-logo')).toBeInTheDocument();
  });

  it('renders the header image with correct background and icon based on template type', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    const headerImage = screen.getByAltText('template');
    expect(headerImage).toBeInTheDocument();
  });

  it('does not render owned by relations when none are available', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(
      screen.queryByTestId('marketplace-card-actions--ownedby'),
    ).not.toBeInTheDocument();
  });
});
