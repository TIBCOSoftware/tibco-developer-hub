/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { CardHeaderDetail } from './CardHeaderDetail';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

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

  it('renders the category text correctly', async () => {
    await renderInTestApp(<CardHeaderDetail template={mockTemplate} />);
    expect(screen.getByText('template')).toBeInTheDocument();
  });

  it('renders the "New" icon when the template is marked as new', async () => {
    await renderInTestApp(<CardHeaderDetail template={mockTemplate} />);
    expect(screen.getByAltText('new-logo')).toBeInTheDocument();
  });

  it('renders the "Installed" text and icon when the template is installed', async () => {
    const installedTemplate = { ...mockTemplate, installed: true };
    await renderInTestApp(<CardHeaderDetail template={installedTemplate} />);
    expect(screen.getByText('Installed')).toBeInTheDocument();
    expect(screen.getByAltText('new-logo')).toBeInTheDocument();
  });

  it('renders the header image with correct background and icon based on template type', async () => {
    await renderInTestApp(<CardHeaderDetail template={mockTemplate} />);
    const headerImage = screen.getByAltText('template');
    expect(headerImage).toBeInTheDocument();
  });

  it('does not render owned by relations when none are available', async () => {
    await renderInTestApp(<CardHeaderDetail template={mockTemplate} />);
    expect(
      screen.queryByTestId('marketplace-card-actions--ownedby'),
    ).not.toBeInTheDocument();
  });
});
