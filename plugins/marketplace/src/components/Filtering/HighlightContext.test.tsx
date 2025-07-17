/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { HighlightProvider, HighlightContext } from './HighlightContext';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

describe('HighlightProvider Component', () => {
  it('provides default highlight value', async () => {
    await renderInTestApp(
      <HighlightProvider>
        <HighlightContext.Consumer>
          {({ highlight }) => <span>{highlight}</span>}
        </HighlightContext.Consumer>
      </HighlightProvider>,
    );
    expect(screen.queryByText('new highlight')).not.toBeInTheDocument();
  });

  it('updates highlight value when setHighlight is called', async () => {
    await renderInTestApp(
      <HighlightProvider>
        <HighlightContext.Consumer>
          {({ highlight, setHighlight }) => {
            setHighlight('new highlight');
            return <span>{highlight}</span>;
          }}
        </HighlightContext.Consumer>
      </HighlightProvider>,
    );
    expect(screen.getByText('new highlight')).toBeInTheDocument();
  });

  it('renders children correctly', async () => {
    await renderInTestApp(
      <HighlightProvider>
        <div>Child Component</div>
      </HighlightProvider>,
    );
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
});
