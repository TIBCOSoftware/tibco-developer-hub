/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { storageApiRef } from '@backstage/core-plugin-api';
import { CustomUrlFavoriteToggle } from './CustomUrlFavoriteToggle';

describe('CustomUrlFavoriteToggle', () => {
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

  const renderComponent = async (entityName: string, url: string) => {
    return renderInTestApp(
      <TestApiProvider apis={[[storageApiRef, mockStorageApi]]}>
        <CustomUrlFavoriteToggle entityName={entityName} url={url} />
      </TestApiProvider>,
    );
  };

  it('should render with "Add to favorites" title when not favorited', async () => {
    await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity',
    );

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });
  });

  it('should render with "Remove from favorites" title when favorited', async () => {
    mockSnapshot.value = [
      { 'test-entity': '/topology?rootEntityRefs=test-entity' },
    ];

    await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity',
    );

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /remove from favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });
  });

  it('should add to favorites when clicked and not favorited', async () => {
    await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity',
    );

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });

    const toggle = screen.getByRole('button', {
      name: /add to favorites/i,
    });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
        { 'test-entity': '/topology?rootEntityRefs=test-entity' },
      ]);
    });
  });

  it('should remove from favorites when clicked and already favorited', async () => {
    mockSnapshot.value = [
      { 'test-entity': '/topology?rootEntityRefs=test-entity' },
    ];

    await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity',
    );

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /remove from favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });

    const toggle = screen.getByRole('button', {
      name: /remove from favorites/i,
    });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', []);
    });
  });

  it('should handle multiple favorites correctly', async () => {
    mockSnapshot.value = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
    ];

    await renderComponent('entity-1', '/topology?rootEntityRefs=entity-1');

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /remove from favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });
  });

  it('should update favorite with new URL when entity name exists', async () => {
    mockSnapshot.value = [
      { 'test-entity': '/topology?rootEntityRefs=test-entity&maxDepth=1' },
    ];

    await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity&maxDepth=2',
    );

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });

    const toggle = screen.getByRole('button', {
      name: /add to favorites/i,
    });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
        { 'test-entity': '/topology?rootEntityRefs=test-entity&maxDepth=2' },
      ]);
    });
  });

  it('should handle entity names with special characters', async () => {
    const specialEntityName = 'test-entity-with-special-chars_123';
    const url = `/topology?rootEntityRefs=${specialEntityName}`;

    await renderComponent(specialEntityName, url);

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });
  });

  it('should handle URLs with multiple parameters', async () => {
    const url =
      '/topology?rootEntityRefs=test-entity&maxDepth=2&selectedKinds=Component,System';

    await renderComponent('test-entity', url);

    await waitFor(() => {
      const toggle = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      expect(toggle).toBeInTheDocument();
    });
  });

  it('should maintain correct state when toggling multiple times', async () => {
    const result = await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity',
    );

    // First click - add to favorites
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /add to favorites/i }),
      ).toBeInTheDocument();
    });

    let toggle = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', [
        { 'test-entity': '/topology?rootEntityRefs=test-entity' },
      ]);
    });

    // Update mock to reflect the added favorite
    mockSnapshot.value = [
      { 'test-entity': '/topology?rootEntityRefs=test-entity' },
    ];

    // Rerender to reflect new state
    result.rerender(
      <TestApiProvider apis={[[storageApiRef, mockStorageApi]]}>
        <CustomUrlFavoriteToggle
          entityName="test-entity"
          url="/topology?rootEntityRefs=test-entity"
        />
      </TestApiProvider>,
    );

    // Second click - remove from favorites
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /remove from favorites/i }),
      ).toBeInTheDocument();
    });

    toggle = screen.getByRole('button', { name: /remove from favorites/i });
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(mockStorageApi.set).toHaveBeenCalledWith('topology-favorites', []);
    });
  });

  it('should have correct accessibility attributes', async () => {
    await renderComponent(
      'test-entity',
      '/topology?rootEntityRefs=test-entity',
    );

    await waitFor(() => {
      const toggle = screen.getByRole('button');
      expect(toggle).toHaveAttribute('id', 'topology-url-favorite-toggle');
    });
  });

  it('should handle empty entity name gracefully', async () => {
    await renderComponent('', '/topology');

    await waitFor(() => {
      const toggle = screen.getByRole('button');
      expect(toggle).toBeInTheDocument();
    });
  });

  it('should handle empty URL gracefully', async () => {
    await renderComponent('test-entity', '');

    await waitFor(() => {
      const toggle = screen.getByRole('button');
      expect(toggle).toBeInTheDocument();
    });
  });
});
