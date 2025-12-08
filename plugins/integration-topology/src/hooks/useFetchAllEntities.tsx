/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useState, useEffect, useRef } from 'react';

export const useFetchAllEntities = () => {
  const catalogApi = useApi(catalogApiRef);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [kinds, setKinds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if component is still mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Reset mounted ref when effect runs
    isMountedRef.current = true;

    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state on new fetch

        const response = await catalogApi.getEntities();

        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format from catalog API');
        }

        const { items } = response;

        if (!Array.isArray(items)) {
          throw new Error('API response does not contain a valid items array');
        }

        if (isMountedRef.current) {
          setEntities(items);

          // Extract unique kinds from the fetched entities, filtering out invalid kinds
          const validKinds = items
            .map(entity => entity?.kind)
            .filter(
              (kind): kind is string =>
                typeof kind === 'string' && kind.trim() !== '',
            );

          const uniqueKinds = [...new Set(validKinds)];
          setKinds(uniqueKinds);
        }
      } catch (err: any | null) {
        if (isMountedRef.current) {
          const errorMessage =
            err?.message || String(err) || 'Unknown error occurred';
          setError(`Error fetching entity kinds: ${errorMessage}`);
          setEntities([]);
          setKinds([]);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchEntities();

    return () => {
      isMountedRef.current = false;
    };
  }, [catalogApi]);

  return { entities, kinds, loading, error };
};
