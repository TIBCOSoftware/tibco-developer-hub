/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent } from '@testing-library/react';
import { MarketplaceCardTags } from './MarketplaceCardTags';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

describe('MarketplaceCardTags Component', () => {
  const mockTemplate: TemplateEntityV1beta3 = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    },
    spec: {
      type: 'template',
      steps: [],
    },
  };

  it('renders all tags when less than or equal to three tags are provided', async () => {
    const templateWithFewTags = {
      ...mockTemplate,
      metadata: { name: 'test-template', tags: ['tag1', 'tag2', 'tag3'] },
    };
    await renderInTestApp(
      <MarketplaceCardTags template={templateWithFewTags} />,
    );
    expect(screen.getAllByTestId(/marketplace-card-tag-item-/)).toHaveLength(3);
    expect(
      screen.queryByTestId('marketplace-card-links--more'),
    ).not.toBeInTheDocument();
  });

  it('renders extra tags button when more than three tags are provided', async () => {
    await renderInTestApp(<MarketplaceCardTags template={mockTemplate} />);
    expect(
      screen.queryByTestId('marketplace-card-tags--more'),
    ).toBeInTheDocument();
  });

  it('renders tags with correct text', async () => {
    await renderInTestApp(<MarketplaceCardTags template={mockTemplate} />);
    const tagElements = screen.getAllByTestId(/marketplace-card-tag-item-/);
    expect(tagElements[0]).toHaveTextContent('tag1');
    expect(tagElements[1]).toHaveTextContent('tag2');
    expect(tagElements[2]).toHaveTextContent('tag3');
  });

  it('triggers button click for extra tags', async () => {
    await renderInTestApp(<MarketplaceCardTags template={mockTemplate} />);
    const moreButton = screen.getByText('+ 2 more');
    fireEvent.click(moreButton);
    expect(moreButton).toBeInTheDocument();
  });
});
