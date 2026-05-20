/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { act, screen } from '@testing-library/react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { configApiRef } from '@backstage/core-plugin-api';
import {
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/core-app-api';
import { TemplateUserListPicker } from './TemplateUserListPicker';

jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useEntityList: jest.fn(),
  useStarredEntities: jest.fn(),
}));

const TEMPLATE_ENTITY = {
  apiVersion: 'scaffolder.backstage.io/v1beta3' as const,
  kind: 'Template',
  metadata: { name: 'tmpl-1', namespace: 'default' },
  spec: { type: 'service' },
};
const TEMPLATE_REF = stringifyEntityRef(TEMPLATE_ENTITY);

const TEMPLATE_ENTITY_B = {
  apiVersion: 'scaffolder.backstage.io/v1beta3' as const,
  kind: 'Template',
  metadata: { name: 'tmpl-2', namespace: 'default' },
  spec: { type: 'service' },
};

describe('TemplateUserListPicker', () => {
  const mockUpdateFilters = jest.fn();

  const renderComponent = (configValues: object = {}) =>
    renderInTestApp(
      <TestApiProvider apis={[[configApiRef, new ConfigReader(configValues)]]}>
        <TemplateUserListPicker />
      </TestApiProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      entities: [],
    });
    (useStarredEntities as jest.Mock).mockReturnValue({
      starredEntities: new Set<string>(),
      toggleStarredEntity: jest.fn(),
    });
  });

  it('renders the Personal section', async () => {
    await renderComponent();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('falls back to "Company" when org name is not configured', async () => {
    await renderComponent();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('shows the configured org name', async () => {
    await renderComponent({ organization: { name: 'ACME Corp' } });
    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
  });

  it('shows the All count equal to total number of entities', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      entities: [TEMPLATE_ENTITY, TEMPLATE_ENTITY],
    });
    await renderComponent();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows the Starred count equal to the starred entities in the current list', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      entities: [TEMPLATE_ENTITY, TEMPLATE_ENTITY_B, TEMPLATE_ENTITY_B],
    });
    (useStarredEntities as jest.Mock).mockReturnValue({
      starredEntities: new Set([TEMPLATE_REF]),
      toggleStarredEntity: jest.fn(),
    });
    await renderComponent();
    expect(screen.getByText('3')).toBeInTheDocument(); // All count
    expect(screen.getByText('1')).toBeInTheDocument(); // Starred count
  });

  it('disables the Starred item when there are no starred entities', async () => {
    await renderComponent();
    expect(screen.getByTestId('user-picker-starred')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('does not disable the Starred item when starred entities are present', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      entities: [TEMPLATE_ENTITY],
    });
    (useStarredEntities as jest.Mock).mockReturnValue({
      starredEntities: new Set([TEMPLATE_REF]),
      toggleStarredEntity: jest.fn(),
    });
    await renderComponent();
    expect(screen.getByTestId('user-picker-starred')).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('calls updateFilters on mount with the all filter', async () => {
    await renderComponent();
    expect(mockUpdateFilters).toHaveBeenCalledWith(
      expect.objectContaining({ user: expect.anything() }),
    );
  });

  it('calls updateFilters with the starred filter when Starred is clicked', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      entities: [TEMPLATE_ENTITY],
    });
    (useStarredEntities as jest.Mock).mockReturnValue({
      starredEntities: new Set([TEMPLATE_REF]),
      toggleStarredEntity: jest.fn(),
    });
    await renderComponent();
    mockUpdateFilters.mockClear();

    await act(async () => {
      screen.getByTestId('user-picker-starred').click();
    });

    expect(mockUpdateFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ value: 'starred' }),
      }),
    );
  });

  it('calls updateFilters with the all filter when All is clicked', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      entities: [TEMPLATE_ENTITY],
    });
    (useStarredEntities as jest.Mock).mockReturnValue({
      starredEntities: new Set([TEMPLATE_REF]),
      toggleStarredEntity: jest.fn(),
    });
    await renderComponent();
    // First select Starred, then click All
    await act(async () => {
      screen.getByTestId('user-picker-starred').click();
    });
    mockUpdateFilters.mockClear();

    await act(async () => {
      screen.getByTestId('user-picker-all').click();
    });

    expect(mockUpdateFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ value: 'all' }),
      }),
    );
  });
});
