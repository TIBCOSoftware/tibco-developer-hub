/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { storageApiRef } from '@backstage/core-plugin-api';
import { useUrlFavorites, FavoriteUrl } from './useUrlFavourites';
import { ReactNode } from 'react';

describe('useUrlFavorites', () => {
  let mockStorageApi: any;
  let mockSnapshot: any;
  let mockObservable: any;
  let mockSubscription: any;

  beforeEach(() => {
    mockSubscription = {
      unsubscribe: jest.fn(),
    };

    mockObservable = {
      subscribe: jest.fn(({ next }: { next: (value: any) => void }) => {
        next({ value: mockSnapshot.value });
        return mockSubscription;
      }),
    };

    mockSnapshot = {
      value: [],
    };

    mockStorageApi = {
      forBucket: jest.fn().mockReturnThis(),
      snapshot: jest.fn(() => mockSnapshot),
      observe$: jest.fn(() => mockObservable),
      set: jest.fn().mockResolvedValue(undefined),
    };
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestApiProvider apis={[[storageApiRef, mockStorageApi]]}>
      {children}
    </TestApiProvider>
  );

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    expect(result.current.favorites).toEqual([]);
    expect(mockStorageApi.forBucket).toHaveBeenCalledWith('url-favorites');
    expect(mockStorageApi.snapshot).toHaveBeenCalledWith('topology-favorites');
  });

  it('should initialize with existing favorites from storage', () => {
    const existingFavorites: FavoriteUrl[] = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
    ];
    mockSnapshot.value = existingFavorites;

    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    expect(result.current.favorites).toEqual(existingFavorites);
  });

  it('should add a new favorite', async () => {
    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    const newFavorite: FavoriteUrl = {
      'test-entity': '/topology?rootEntityRefs=test-entity',
    };

    await act(async () => {
      await result.current.toggleFavorite(newFavorite);
    });

    expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
      newFavorite,
    ]);
  });

  it('should remove an existing favorite when toggled with same URL', async () => {
    const existingFavorites: FavoriteUrl[] = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
    ];
    mockSnapshot.value = existingFavorites;

    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    await act(async () => {
      await result.current.toggleFavorite(existingFavorites[0]);
    });

    expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
      existingFavorites[1],
    ]);
  });

  it('should update an existing favorite when toggled with different URL', async () => {
    const existingFavorites: FavoriteUrl[] = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1&maxDepth=1' },
    ];
    mockSnapshot.value = existingFavorites;

    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    const updatedFavorite: FavoriteUrl = {
      'entity-1': '/topology?rootEntityRefs=entity-1&maxDepth=2',
    };

    await act(async () => {
      await result.current.toggleFavorite(updatedFavorite);
    });

    expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
      updatedFavorite,
    ]);
  });

  it('should correctly identify if a URL is favorited', () => {
    const existingFavorites: FavoriteUrl[] = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
    ];
    mockSnapshot.value = existingFavorites;

    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    expect(
      result.current.isFavorited('/topology?rootEntityRefs=entity-1'),
    ).toBe(true);
    expect(
      result.current.isFavorited('/topology?rootEntityRefs=entity-3'),
    ).toBe(false);
  });

  it('should update favorites when storage observable emits', async () => {
    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    const newFavorites: FavoriteUrl[] = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
    ];
    act(() => {
      const nextCallback = mockObservable.subscribe.mock.calls[0][0].next;
      nextCallback({ value: newFavorites });
    });

    await waitFor(() => {
      expect(result.current.favorites).toEqual(newFavorites);
    });
  });

  it('should handle multiple favorites', async () => {
    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    const favorites: FavoriteUrl[] = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
      { 'entity-3': '/topology?rootEntityRefs=entity-3' },
    ];

    for (const favorite of favorites) {
      await act(async () => {
        await result.current.toggleFavorite(favorite);
      });
    }

    expect(mockStorageApi.set).toHaveBeenCalledTimes(3);
  });

  it('should unsubscribe from storage observable on unmount', () => {
    const { unmount } = renderHook(() => useUrlFavorites(), { wrapper });

    unmount();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle empty entity name', async () => {
    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    const emptyFavorite: FavoriteUrl = { '': '/topology' };

    await act(async () => {
      await result.current.toggleFavorite(emptyFavorite);
    });

    expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
      emptyFavorite,
    ]);
  });

  it('should handle storage with null or undefined value', () => {
    mockSnapshot.value = null;

    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    expect(result.current.favorites).toEqual([]);
  });

  it('should maintain order when adding favorites', async () => {
    const { result } = renderHook(() => useUrlFavorites(), { wrapper });

    const favorite1: FavoriteUrl = {
      'entity-1': '/topology?rootEntityRefs=entity-1',
    };
    const favorite2: FavoriteUrl = {
      'entity-2': '/topology?rootEntityRefs=entity-2',
    };

    await act(async () => {
      await result.current.toggleFavorite(favorite1);
    });

    mockSnapshot.value = [favorite1];

    await act(async () => {
      await result.current.toggleFavorite(favorite2);
    });

    expect(mockStorageApi.set).toHaveBeenLastCalledWith('topology-favorites', [
      favorite1,
      favorite2,
    ]);
  });
});
