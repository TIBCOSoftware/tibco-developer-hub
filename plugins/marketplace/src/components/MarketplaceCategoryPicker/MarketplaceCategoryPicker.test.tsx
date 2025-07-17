/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useEntityList } from '@backstage/plugin-catalog-react';
import { MarketplaceCategoryPicker } from './MarketplaceCategoryPicker.tsx';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { alertApiRef } from '@backstage/core-plugin-api';
import React from 'react';
import { Entity } from '@backstage/catalog-model';
import userEvent from '@testing-library/user-event';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
}));

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template-1',
      tags: ['devhub-marketplace'],
    },
    spec: {
      type: 'Service1',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template-2',
      tags: ['devhub-marketplace'],
    },
    spec: {
      type: 'Service2',
    },
  },
];

describe('MarketplaceCategoryPicker', () => {
  const mockAlertApi = { post: jest.fn() };

  beforeEach(() => {
    mockAlertApi.post.mockClear();
  });

  it('should post the error to errorApi if an errors is returned', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      error: new Error('something broked'),
      updateFilters: jest.fn(),
      queryParameters: { categories: [] },
      backendEntities: [],
    });

    await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <MarketplaceCategoryPicker />
      </TestApiProvider>,
    );

    expect(mockAlertApi.post).toHaveBeenCalledWith({
      message: expect.stringContaining('something broked'),
      severity: 'error',
    });
  });

  it('should render loading if the hook is loading', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      loading: true,
      queryParameters: { categories: [] },
      updateFilters: jest.fn(),
      backendEntities: [],
    });

    const { findByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <MarketplaceCategoryPicker />
      </TestApiProvider>,
    );

    expect(await findByTestId('progress')).toBeInTheDocument();
  });

  it('should not render if there is no available types', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: jest.fn(),
      queryParameters: { categories: [] },
      backendEntities: [],
    });

    const { queryByText } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <MarketplaceCategoryPicker />
      </TestApiProvider>,
    );

    expect(queryByText('Categories')).not.toBeInTheDocument();
  });

  it('renders the autocomplete with the marketPlaceCategories', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: jest.fn(),
      backendEntities: entities,
      queryParameters: { categories: [] },
    });

    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <MarketplaceCategoryPicker />
      </TestApiProvider>,
    );

    const openButton = getByRole('button', { name: 'Open' });
    await userEvent.click(openButton);

    expect(getByRole('checkbox', { name: 'Service1' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Service2' })).toBeInTheDocument();
  });
});
