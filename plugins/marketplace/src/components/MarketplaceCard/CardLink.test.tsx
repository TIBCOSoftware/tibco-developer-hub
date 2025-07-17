/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { CardLink } from './CardLink';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

jest.mock('@backstage/core-components', () => ({
  Link: jest.fn(({ children, ...props }) => <a {...props}>{children}</a>),
}));

describe('CardLink Component', () => {
  const mockIcon = jest.fn(() => <span data-testid="mock-icon" />);

  it('renders the icon and text correctly', async () => {
    await renderInTestApp(
      <CardLink icon={mockIcon} text="Test Link" url="/test-url" />,
    );
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders the URL when text is not provided', async () => {
    await renderInTestApp(<CardLink icon={mockIcon} text="" url="/test-url" />);
    expect(screen.getByText('/test-url')).toBeInTheDocument();
  });

  it('applies correct styles to the link', async () => {
    await renderInTestApp(
      <CardLink icon={mockIcon} text="Styled Link" url="/styled-url" />,
    );
    const link = screen.getByText('Styled Link');
    expect(link).toHaveStyle({ marginLeft: '8px' });
  });
});
