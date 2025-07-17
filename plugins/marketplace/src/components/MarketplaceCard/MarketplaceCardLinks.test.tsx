/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent } from '@testing-library/react';
import { MarketplaceCardLinks } from './MarketplaceCardLinks';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

describe('MarketplaceCardLinks Component', () => {
  const mockTemplate: TemplateEntityV1beta3 = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      links: [
        { url: 'https://example.com', title: 'Example Link', icon: 'language' },
        { url: 'https://another.com', title: 'Another Link', icon: 'language' },
      ],
    },
    spec: {
      type: 'template',
      steps: [],
    },
  };

  const mockAdditionalLinks = [
    { url: 'https://extra1.com', text: 'Extra Link 1', icon: 'language' },
    { url: 'https://extra2.com', text: 'Extra Link 2', icon: 'language' },
  ];

  it('await renderInTestApps all links when less than or equal to two links are provided', async () => {
    await renderInTestApp(<MarketplaceCardLinks template={mockTemplate} />);
    expect(screen.getAllByTestId('marketplace-card-links--item')).toHaveLength(
      2,
    );
    expect(
      screen.queryByTestId('marketplace-card-links--more'),
    ).not.toBeInTheDocument();
  });

  it('await renderInTestApps extra links button when more than two links are provided', async () => {
    await renderInTestApp(
      <MarketplaceCardLinks
        template={mockTemplate}
        additionalLinks={mockAdditionalLinks}
      />,
    );
    expect(screen.getAllByTestId('marketplace-card-links--item')).toHaveLength(
      2,
    );
    expect(
      screen.getByTestId('marketplace-card-links--more'),
    ).toBeInTheDocument();
    expect(screen.getByText('+ 2 more')).toBeInTheDocument();
  });

  it('await renderInTestApps no links when no links are provided', async () => {
    const templateWithoutLinks = {
      ...mockTemplate,
      metadata: { ...mockTemplate.metadata, links: [] },
    };
    await renderInTestApp(
      <MarketplaceCardLinks template={templateWithoutLinks} />,
    );
    expect(
      screen.queryByTestId('marketplace-card-links--item'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('marketplace-card-links--more'),
    ).not.toBeInTheDocument();
  });

  it('await renderInTestApps links with correct text and URL', async () => {
    await renderInTestApp(<MarketplaceCardLinks template={mockTemplate} />);
    const linkElements = screen.getAllByTestId('marketplace-card-links--item');
    expect(linkElements[0]).toHaveTextContent('Example Link');
    expect(linkElements[1]).toHaveTextContent('Another Link');
  });

  it('triggers button click for extra links', async () => {
    await renderInTestApp(
      <MarketplaceCardLinks
        template={mockTemplate}
        additionalLinks={mockAdditionalLinks}
      />,
    );
    const moreButton = screen.getByText('+ 2 more');
    fireEvent.click(moreButton);
    expect(moreButton).toBeInTheDocument();
  });
});
