/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useState, useEffect, useCallback } from 'react';

export interface FavoriteUrl {
  [key: string]: string;
}

export const useUrlFavorites = () => {
  const storageApi = useApi(storageApiRef).forBucket('url-favorites');
  const STORAGE_KEY = 'topology-favorites';

  const getSnapshot = useCallback((): FavoriteUrl[] => {
    const snapshot = storageApi.snapshot(STORAGE_KEY);
    return (snapshot.value as FavoriteUrl[]) ?? [];
  }, [storageApi]);

  const [favorites, setFavorites] = useState<FavoriteUrl[]>(getSnapshot);

  useEffect(() => {
    const subscription = storageApi.observe$(STORAGE_KEY).subscribe({
      next: snapshot => setFavorites((snapshot.value as FavoriteUrl[]) ?? []),
    });
    return () => subscription.unsubscribe();
  }, [storageApi]);

  const toggleFavorite = async (item: FavoriteUrl) => {
    const current = getSnapshot();
    const itemEntityName = Object.keys(item)[0];
    const itemUrl = Object.values(item)[0];

    // Check if entity name exists in favorites
    const existingIndex = current.findIndex(
      f => Object.keys(f)[0] === itemEntityName,
    );

    let updated: FavoriteUrl[];
    if (existingIndex !== -1) {
      // Entity name exists
      const existingUrl = Object.values(current[existingIndex])[0];

      if (existingUrl === itemUrl) {
        // Same URL, remove the favorite (toggle off)
        updated = current.filter((_, index) => index !== existingIndex);
      } else {
        // Different URL, overwrite it
        updated = [...current];
        updated[existingIndex] = item;
      }
    } else {
      // Entity name doesn't exist, add it
      updated = [...current, item];
    }

    // .set returns a Promise in newer Backstage versions
    await storageApi.set(STORAGE_KEY, updated as any);
    setFavorites(updated);
  };

  const isFavorited = (url: string) =>
    favorites.some(f => Object.values(f)[0] === url);

  return { favorites, toggleFavorite, isFavorited };
};
