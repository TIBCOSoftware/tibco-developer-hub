/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockFetchDataplanes = jest.fn();

jest.mock('../hooks/usePlatformApi', () => ({
  usePlatformApi: () => ({
    fetchDataplanes: mockFetchDataplanes,
  }),
}));

import { DataplaneSelector } from './DataplaneSelector';
import type { DataplaneSummary } from '../types';

function renderSelector(
  overrides: Partial<{
    onChange: (val: DataplaneSummary) => void;
    rawErrors: string[];
    required: boolean;
    formData: DataplaneSummary;
  }> = {},
) {
  const defaultProps = {
    onChange: jest.fn(),
    rawErrors: [],
    required: false,
    formData: undefined as DataplaneSummary | undefined,
    schema: {},
    uiSchema: {},
    name: 'dataplane',
    formContext: {},
    idSchema: { $id: 'root' },
    ...overrides,
  };

  return {
    ...render(<DataplaneSelector {...(defaultProps as any)} />),
    onChange: defaultProps.onChange,
  };
}

describe('DataplaneSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator while fetching', () => {
    // Never resolve so loading stays visible
    mockFetchDataplanes.mockReturnValue(new Promise(() => {}));
    renderSelector();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error when no data-planes are returned', async () => {
    mockFetchDataplanes.mockResolvedValueOnce({ response: [] });

    renderSelector();

    await waitFor(() => {
      expect(
        screen.getByText(/no data-planes are available/i),
      ).toBeInTheDocument();
    });
  });

  it('renders dropdown with data-planes after loading', async () => {
    mockFetchDataplanes.mockResolvedValueOnce({
      response: [
        { id: 'dp-1', name: 'Dataplane 1' },
        { id: 'dp-2', name: 'Dataplane 2' },
      ],
    });

    renderSelector();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Dataplane 1')).toBeInTheDocument();
  });

  it('auto-selects first dataplane and calls onChange', async () => {
    mockFetchDataplanes.mockResolvedValueOnce({
      response: [{ id: 'dp-1', name: 'Dataplane 1' }],
    });

    const { onChange } = renderSelector();

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        id: 'dp-1',
        name: 'Dataplane 1',
      });
    });
  });

  it('displays error message on fetch failure', async () => {
    mockFetchDataplanes.mockRejectedValueOnce(new Error('Network failure'));

    renderSelector();

    await waitFor(() => {
      expect(screen.getByText('Network failure')).toBeInTheDocument();
    });
  });

  it('shows selected dataplane id in helper text', async () => {
    mockFetchDataplanes.mockResolvedValueOnce({
      response: [{ id: 'dp-99', name: 'My DP' }],
    });

    renderSelector();

    await waitFor(() => {
      expect(screen.getByText(/dp-99/)).toBeInTheDocument();
    });
  });
});
