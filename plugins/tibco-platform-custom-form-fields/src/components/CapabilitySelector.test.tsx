/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockFetchDataplanesWithCapabilities = jest.fn();

jest.mock('../hooks/usePlatformApi', () => ({
  usePlatformApi: () => ({
    fetchDataplanesWithCapabilities: mockFetchDataplanesWithCapabilities,
  }),
}));

import { CapabilitySelector } from './CapabilitySelector';
import type { CapabilitySelectorValue } from '../types';

const sampleDataplanes = [
  {
    id: 'dp-1',
    name: 'Dataplane 1',
    capabilities: [
      {
        id: 'cap-f1',
        name: 'FLOGO',
        type: 'PLATFORM',
        capabilityStatus: 'green',
      },
    ],
    deployment: {
      capabilityId: 'cap-f1',
      capabilityName: 'FLOGO',
      capabilityType: 'PLATFORM',
      dataplaneUrl: 'https://dp1.example.com/tibco/platform/dp-1/',
      dataplaneHost: 'dp1.example.com',
    },
  },
  {
    id: 'dp-2',
    name: 'Dataplane 2',
    capabilities: [
      {
        id: 'cap-f2',
        name: 'FLOGO',
        type: 'PLATFORM',
        capabilityStatus: 'green',
      },
    ],
    deployment: {
      capabilityId: 'cap-f2',
      capabilityName: 'FLOGO',
      capabilityType: 'PLATFORM',
      dataplaneUrl: 'https://dp2.example.com/tibco/platform/dp-2/',
      dataplaneHost: 'dp2.example.com',
    },
  },
];

function renderSelector(
  overrides: Partial<{
    onChange: (val: CapabilitySelectorValue) => void;
    rawErrors: string[];
    required: boolean;
    formData: CapabilitySelectorValue;
    uiSchema: Record<string, unknown>;
  }> = {},
) {
  const defaultProps = {
    onChange: jest.fn(),
    rawErrors: [],
    required: false,
    formData: undefined as CapabilitySelectorValue | undefined,
    schema: {},
    uiSchema: {
      'ui:options': {
        requiredCapabilities: ['FLOGO'],
      },
    },
    name: 'deploymentTarget',
    formContext: {},
    idSchema: { $id: 'root' },
    ...overrides,
  };

  return {
    ...render(<CapabilitySelector {...(defaultProps as any)} />),
    onChange: defaultProps.onChange,
  };
}

describe('CapabilitySelector', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows loading indicator while fetching', () => {
    mockFetchDataplanesWithCapabilities.mockReturnValue(new Promise(() => {}));
    renderSelector();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error when no dataplanes match required capabilities', async () => {
    mockFetchDataplanesWithCapabilities.mockResolvedValue({
      dataplanes: [],
    });

    renderSelector();

    await waitFor(() => {
      expect(
        screen.getByText(/no data-planes with the required capabilities/i),
      ).toBeInTheDocument();
    });
  });

  it('renders dropdown with matching dataplanes after loading', async () => {
    mockFetchDataplanesWithCapabilities.mockResolvedValueOnce({
      dataplanes: sampleDataplanes,
    });

    renderSelector();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Dataplane 1')).toBeInTheDocument();
  });

  it('auto-selects first dataplane and calls onChange with full value', async () => {
    mockFetchDataplanesWithCapabilities.mockResolvedValue({
      dataplanes: sampleDataplanes,
    });

    const { onChange } = renderSelector();

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        dataplaneId: 'dp-1',
        dataplaneName: 'Dataplane 1',
        capabilityId: 'cap-f1',
        capabilityName: 'FLOGO',
        capabilityType: 'PLATFORM',
        dataplaneUrl: 'https://dp1.example.com/tibco/platform/dp-1/',
        dataplaneHost: 'dp1.example.com',
      });
    });
  });

  it('displays deployment detail fields', async () => {
    mockFetchDataplanesWithCapabilities.mockResolvedValue({
      dataplanes: sampleDataplanes,
    });

    renderSelector();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue('https://dp1.example.com/tibco/platform/dp-1/'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('dp1.example.com')).toBeInTheDocument();
  });

  it('handles API failure gracefully', async () => {
    mockFetchDataplanesWithCapabilities.mockRejectedValue(
      new Error('Network failure'),
    );

    renderSelector();

    await waitFor(() => {
      expect(screen.getByText('Network failure')).toBeInTheDocument();
    });
  });

  it('shows error when requiredCapabilities is not configured', async () => {
    renderSelector({
      uiSchema: { 'ui:options': {} },
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /no required capabilities specified in template configuration/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it('allows manual editing of dataplaneUrl field', async () => {
    mockFetchDataplanesWithCapabilities.mockResolvedValue({
      dataplanes: sampleDataplanes,
    });

    const { onChange } = renderSelector();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const urlInput = screen.getByDisplayValue(
      'https://dp1.example.com/tibco/platform/dp-1/',
    );

    fireEvent.change(urlInput, {
      target: { value: 'https://manual.example.com/' },
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dataplaneUrl: 'https://manual.example.com/',
      }),
    );
  });

  it('allows manual editing of dataplaneHost field', async () => {
    mockFetchDataplanesWithCapabilities.mockResolvedValue({
      dataplanes: sampleDataplanes,
    });

    const { onChange } = renderSelector();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const hostInput = screen.getByDisplayValue('dp1.example.com');

    fireEvent.change(hostInput, {
      target: { value: 'manual.example.com' },
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dataplaneHost: 'manual.example.com',
      }),
    );
  });
});
