/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent } from '@testing-library/react';
import { MarketplaceCardActions } from './MarketplaceCardActions';
import React from 'react';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage.tsx';
import { renderInTestApp } from '@backstage/test-utils';

jest.mock('@backstage/core-components', () => ({
  Link: jest.fn(({ children, ...props }) => <a {...props}>{children}</a>),
}));

describe('MarketplaceCardActions Component', () => {
  const mockHandleChoose = jest.fn();
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      title: 'Test Template Title',
      'tibco.developer.hub/marketplace': { isMultiInstall: false },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };

  it('renders the Open button when template is installed and not multi-install', async () => {
    await renderInTestApp(
      <MarketplaceCardActions
        canCreateTask
        handleChoose={mockHandleChoose}
        template={{
          ...mockTemplate,
          installed: true,
          installedEntityRef: '/installed-entity',
        }}
      />,
    );
    const openButton = screen.getByTestId('marketplace-card-actions--view');
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveTextContent('Open');
  });

  it('renders the Install button when template is not installed and can create task', async () => {
    await renderInTestApp(
      <MarketplaceCardActions
        canCreateTask
        handleChoose={mockHandleChoose}
        template={mockTemplate}
      />,
    );
    const installButton = screen.getByTestId(
      'marketplace-card-actions--install',
    );
    expect(installButton).toBeInTheDocument();
    expect(installButton).toHaveTextContent('Install');
  });

  it('does not render any button when template is installed and multi-install is false', async () => {
    await renderInTestApp(
      <MarketplaceCardActions
        canCreateTask
        handleChoose={mockHandleChoose}
        template={{ ...mockTemplate, installed: true }}
      />,
    );
    expect(
      screen.queryByTestId('marketplace-card-actions--view'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('marketplace-card-actions--install'),
    ).not.toBeInTheDocument();
  });

  it('calls handleChoose when Install button is clicked', async () => {
    await renderInTestApp(
      <MarketplaceCardActions
        canCreateTask
        handleChoose={mockHandleChoose}
        template={mockTemplate}
      />,
    );
    const installButton = screen.getByTestId(
      'marketplace-card-actions--install',
    );
    fireEvent.click(installButton);
    expect(mockHandleChoose).toHaveBeenCalled();
  });

  it('does not render Install button when canCreateTask is false', async () => {
    await renderInTestApp(
      <MarketplaceCardActions
        canCreateTask={false}
        handleChoose={mockHandleChoose}
        template={mockTemplate}
      />,
    );
    expect(
      screen.queryByTestId('marketplace-card-actions--install'),
    ).not.toBeInTheDocument();
  });
});
