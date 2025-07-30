/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent } from '@testing-library/react';
import { FullTextSearchFilter } from './FullTextSearchFilter';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { HighlightContext } from './HighlightContext';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
}));

describe('FullTextSearchFilter Component', () => {
  const mockUpdateFilters = jest.fn();
  const mockSetHighlight = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
      queryParameters: { text: '' },
    });
  });

  it('renders the search input with placeholder text', async () => {
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <FullTextSearchFilter />
      </HighlightContext.Provider>,
    );
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('updates the search value when typing in the input', async () => {
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <FullTextSearchFilter />
      </HighlightContext.Provider>,
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test search' } });
    expect(input).toHaveValue('test search');
  });

  it('clears the search value when the clear button is clicked', async () => {
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <FullTextSearchFilter />
      </HighlightContext.Provider>,
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test search' } });
    const clearButton = screen.getByLabelText('clear search');
    fireEvent.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('disables the clear button when the search value is empty', async () => {
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <FullTextSearchFilter />
      </HighlightContext.Provider>,
    );
    const clearButton = screen.getByLabelText('clear search');
    expect(clearButton).toBeDisabled();
  });

  it('calls updateFilters with the correct filter when search value changes', async () => {
    jest.useFakeTimers();
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <FullTextSearchFilter />
      </HighlightContext.Provider>,
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test search' } });
    jest.runAllTimers();
    expect(mockUpdateFilters).toHaveBeenCalledWith({
      text: expect.objectContaining({ value: 'test search' }),
    });
  });

  it('calls setHighlight with the search value after debounce', async () => {
    jest.useFakeTimers();
    await renderInTestApp(
      <HighlightContext.Provider
        value={{ highlight: '', setHighlight: mockSetHighlight }}
      >
        <FullTextSearchFilter />
      </HighlightContext.Provider>,
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'highlight test' } });
    jest.runAllTimers();
    expect(mockSetHighlight).toHaveBeenCalledWith('highlight test');
  });
});
