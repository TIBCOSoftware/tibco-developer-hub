/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { CardHeader } from './CardHeader';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import { renderInTestApp } from '@backstage/test-utils';

describe('CardHeader Component', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'Test Template',
      title: 'Test Template Title',
      'tibco.developer.hub/marketplace': {
        isNew: true,
      },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: true,
  };

  it('renders the template type and "Installed" status', async () => {
    await renderInTestApp(<CardHeader template={mockTemplate} />);
    expect(screen.getByText('template')).toBeInTheDocument();
    expect(screen.getByText('Installed')).toBeInTheDocument();
  });

  it('displays the "New" icon when the template is marked as new', async () => {
    await renderInTestApp(<CardHeader template={mockTemplate} />);
    expect(screen.getByTestId('new-image')).toBeInTheDocument();
  });

  it('does not display the "New" icon when the template is not marked as new', async () => {
    const templateWithoutNew = {
      ...mockTemplate,
      metadata: {
        ...mockTemplate.metadata,
        'tibco.developer.hub/marketplace': {
          isNew: false,
        },
      },
    };
    await renderInTestApp(<CardHeader template={templateWithoutNew} />);
    expect(screen.queryByTestId('new-image')).not.toBeInTheDocument();
  });

  it('does not render owned by relations when they do not exist', async () => {
    const templateWithoutRelations = {
      ...mockTemplate,
      relations: [],
    };
    await renderInTestApp(<CardHeader template={templateWithoutRelations} />);
    expect(
      screen.queryByTestId('marketplace-card-actions--ownedby'),
    ).not.toBeInTheDocument();
  });

  it('renders the correct background and icon based on the template type', async () => {
    const documentTemplate = {
      ...mockTemplate,
      spec: {
        type: 'document',
        steps: [],
      },
    };
    await renderInTestApp(<CardHeader template={documentTemplate} />);
    expect(screen.getByAltText('document')).toBeInTheDocument();
  });
});
