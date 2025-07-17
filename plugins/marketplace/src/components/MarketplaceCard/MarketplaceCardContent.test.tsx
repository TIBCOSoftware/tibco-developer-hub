/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { MarketplaceCardContent } from './MarketplaceCardContent';
import {
  HighlightContext,
  HighlightProvider,
} from '../Filtering/HighlightContext';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage.tsx';

describe('MarketplaceCardContent Component', () => {
  const mockSetHighlight = jest.fn();
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      title: 'Test Template Title',
      description: 'This is a test description with markdown.',
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };

  it('renders description text correctly when provided', async () => {
    await renderInTestApp(
      <HighlightProvider>
        <MarketplaceCardContent template={mockTemplate} />
      </HighlightProvider>,
    );
    expect(
      screen.getByText('This is a test description with markdown.'),
    ).toBeInTheDocument();
  });

  it('renders default text when description is not provided', async () => {
    const templateWithoutDescription: MarketplaceEntity = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'test-template',
        title: 'Test Template Title',
      },
      spec: {
        type: 'template',
        steps: [],
      },
      installed: false,
    };
    await renderInTestApp(
      <HighlightProvider>
        <MarketplaceCardContent template={templateWithoutDescription} />
      </HighlightProvider>,
    );
    expect(screen.getByText('No description')).toBeInTheDocument();
  });

  it('renders the grid container with correct data-testid', async () => {
    await renderInTestApp(
      <HighlightProvider>
        <MarketplaceCardContent template={mockTemplate} />
      </HighlightProvider>,
    );
    expect(
      screen.getByTestId('marketplace-card-content-grid'),
    ).toBeInTheDocument();
  });

  it('highlights matching words in the description', async () => {
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: 'test markdown', setHighlight: mockSetHighlight }}
      >
        <MarketplaceCardContent template={mockTemplate} />
      </HighlightContext.Provider>,
    );
    const highlightedElements = screen.getAllByText(
      (content, element) =>
        element?.tagName === 'MARK' && ['test', 'markdown'].includes(content),
    );
    expect(highlightedElements).toHaveLength(2);
  });

  it('does not highlight words when highlight context is empty', async () => {
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <MarketplaceCardContent template={mockTemplate} />
      </HighlightContext.Provider>,
    );
    const highlightedElements = screen.queryAllByText('mark');
    expect(highlightedElements).toHaveLength(0);
  });
});
