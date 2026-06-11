/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  useApi,
  fetchApiRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { useCallback } from 'react';
import type {
  DataplaneListResponse,
  DataplanesWithCapabilitiesResponse,
} from '../types';

export function usePlatformApi() {
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const fetchDataplanes =
    useCallback(async (): Promise<DataplaneListResponse> => {
      const baseUrl = await discoveryApi.getBaseUrl('scaffolder');
      const response = await fetchApi.fetch(
        `${baseUrl}/platform/v1/data-planes`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data-planes: ${response.status} ${response.statusText}`,
        );
      }

      return response.json() as Promise<DataplaneListResponse>;
    }, [fetchApi, discoveryApi]);

  const fetchDataplanesWithCapabilities = useCallback(
    async (
      requiredCapabilities: string[],
    ): Promise<DataplanesWithCapabilitiesResponse> => {
      const baseUrl = await discoveryApi.getBaseUrl('scaffolder');
      const params = new URLSearchParams({
        requiredCapabilities: requiredCapabilities.join(','),
      });
      const response = await fetchApi.fetch(
        `${baseUrl}/platform/v1/data-planes-with-capabilities?${params.toString()}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data-planes with capabilities: ${response.status} ${response.statusText}`,
        );
      }

      return response.json() as Promise<DataplanesWithCapabilitiesResponse>;
    },
    [fetchApi, discoveryApi],
  );

  return {
    fetchDataplanes,
    fetchDataplanesWithCapabilities,
  };
}
