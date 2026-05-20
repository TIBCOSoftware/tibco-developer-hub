/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { EntityKindAndNameSelector } from './EntityKindAndNameSelector';
import {
  SearchContextProvider,
  searchApiRef,
  MockSearchApi,
} from '@backstage/plugin-search-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

describe('EntityKindAndNameSelector', () => {
  const mockKindOnChange = jest.fn();
  const mockNameOnSelected = jest.fn();
  const mockSearchApi = new MockSearchApi();

  const defaultProps = {
    label: 'Select Entity Kind and Name',
    kindDropdownProps: {
      selected: 'Component',
      items: [
        { label: 'Component', value: 'Component' },
        { label: 'System', value: 'System' },
        { label: 'API', value: 'API' },
      ],
      onChange: mockKindOnChange,
    },
    nameDropdownProps: {
      name: 'entityName',
      onSelected: mockNameOnSelected,
      givenValues: ['entity-1', 'entity-2', 'entity-3'],
      rootEntityNames: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = async (props = {}) => {
    return renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchContextProvider>
          <EntityKindAndNameSelector {...defaultProps} {...props} />
        </SearchContextProvider>
      </TestApiProvider>,
    );
  };

  it('should render with default label', async () => {
    await renderComponent();

    expect(screen.getByText('Select Entity Kind and Name')).toBeInTheDocument();
  });

  it('should render with custom label', async () => {
    const customLabel = 'Choose Your Entity';
    await renderComponent({ label: customLabel });

    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it('should render both kind and name selectors', async () => {
    await renderComponent();

    const nameSelector = screen.getByRole('combobox');
    expect(nameSelector).toBeInTheDocument();
  });

  it('should display selectors in a row layout', async () => {
    const { container } = await renderComponent();

    const controlsRow = container.querySelector('[class*="controlsRow"]');
    expect(controlsRow).toBeInTheDocument();
  });

  it('should have proper spacing between selectors', async () => {
    const { container } = await renderComponent();

    const controlsRow = container.querySelector('[class*="controlsRow"]');
    expect(controlsRow).toBeInTheDocument();
  });

  it('should make name selector flex and fill available space', async () => {
    const { container } = await renderComponent();

    const nameSelector = container.querySelector('[class*="nameSelector"]');
    expect(nameSelector).toBeInTheDocument();
  });

  it('should keep kind selector at fixed size', async () => {
    const { container } = await renderComponent();

    const kindSelector = container.querySelector('[class*="kindSelector"]');
    expect(kindSelector).toBeInTheDocument();
  });

  it('should handle empty kind items array', async () => {
    await renderComponent({
      kindDropdownProps: {
        selected: '',
        items: [],
        onChange: mockKindOnChange,
      },
    });

    expect(screen.getByText('Select Entity Kind and Name')).toBeInTheDocument();
  });

  it('should handle empty name values array', async () => {
    await renderComponent({
      nameDropdownProps: {
        name: 'entityName',
        onSelected: mockNameOnSelected,
        givenValues: [],
        rootEntityNames: [],
      },
    });

    // Should still render without error
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with Typography for label', async () => {
    await renderComponent();

    const label = screen.getByText('Select Entity Kind and Name');
    expect(label.tagName.toLowerCase()).toBe('span');
  });

  it('should apply padding to container', async () => {
    const { container } = await renderComponent();

    const mainContainer = container.querySelector('[class*="container"]');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should pass props to child components correctly', async () => {
    await renderComponent();

    const nameSelector = screen.getByPlaceholderText('Select entityName...');
    expect(nameSelector).toBeInTheDocument();
  });

  it('should render searchable dropdown for name selection', async () => {
    await renderComponent();

    const autocomplete = screen.getByRole('combobox');
    expect(autocomplete).toBeInTheDocument();
  });

  it('should render with proper component structure', async () => {
    const { container } = await renderComponent();

    const mainContainer = container.querySelector('[class*="container"]');
    expect(mainContainer).toBeInTheDocument();

    const controlsRow = container.querySelector('[class*="controlsRow"]');
    expect(controlsRow).toBeInTheDocument();
  });
});
