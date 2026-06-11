/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderHook } from '@testing-library/react';

const mockFetch = jest.fn();
const mockGetBaseUrl = jest.fn();

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: (ref: { id: string }) => {
    if (ref.id === 'core.fetch') {
      return { fetch: mockFetch };
    }
    if (ref.id === 'core.discovery') {
      return { getBaseUrl: mockGetBaseUrl };
    }
    return {};
  },
  fetchApiRef: { id: 'core.fetch' },
  discoveryApiRef: { id: 'core.discovery' },
}));

import { usePlatformApi } from './usePlatformApi';

describe('usePlatformApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBaseUrl.mockResolvedValue('http://localhost:7007/api/scaffolder');
  });

  describe('fetchDataplanes', () => {
    it('fetches data-planes from the scaffolder API', async () => {
      const payload = {
        status: 'ok',
        response: [{ id: 'dp-1', name: 'Dataplane 1' }],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => payload,
      });

      const { result } = renderHook(() => usePlatformApi());

      const data = await result.current.fetchDataplanes();

      expect(mockGetBaseUrl).toHaveBeenCalledWith('scaffolder');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/api/scaffolder/platform/v1/data-planes',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        }),
      );
      expect(data).toEqual(payload);
    });

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });

      const { result } = renderHook(() => usePlatformApi());

      await expect(result.current.fetchDataplanes()).rejects.toThrow(
        /503 Service Unavailable/,
      );
    });
  });

  describe('fetchDataplanesWithCapabilities', () => {
    it('fetches data-planes with correct requiredCapabilities query param', async () => {
      const payload = {
        dataplanes: [
          {
            id: 'dp-1',
            name: 'DP 1',
            capabilities: [
              {
                id: 'cap-1',
                name: 'FLOGO',
                type: 'PLATFORM',
                capabilityStatus: 'green',
              },
            ],
            deployment: {
              capabilityId: 'cap-1',
              capabilityName: 'FLOGO',
              capabilityType: 'PLATFORM',
              dataplaneUrl: 'https://dp.example.com/tibco/platform/dp-1/',
              dataplaneHost: 'dp.example.com',
            },
          },
        ],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => payload,
      });

      const { result } = renderHook(() => usePlatformApi());

      const data = await result.current.fetchDataplanesWithCapabilities([
        'FLOGO',
        'BWCE',
      ]);

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('requiredCapabilities=FLOGO%2CBWCE');
      expect(data).toEqual(payload);
    });

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const { result } = renderHook(() => usePlatformApi());

      await expect(
        result.current.fetchDataplanesWithCapabilities(['FLOGO']),
      ).rejects.toThrow(/400 Bad Request/);
    });
  });
});
