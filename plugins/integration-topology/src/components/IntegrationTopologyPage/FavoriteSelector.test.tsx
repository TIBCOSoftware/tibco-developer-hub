/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { storageApiRef } from '@backstage/core-plugin-api';
import { FavoriteSelector } from './FavoriteSelector';

describe('FavoriteSelector', () => {
  let mockStorageApi: any;
  let mockSnapshot: any;
  let mockObservable: any;
  let mockSubscription: any;
  const mockOnFavoriteSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

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

  const defaultProps = {
    onFavoriteSelected: mockOnFavoriteSelected,
    currentUrl: undefined as string | undefined,
  };

  const renderComponent = (props: Partial<typeof defaultProps> = {}) => {
    return render(
      <TestApiProvider apis={[[storageApiRef, mockStorageApi]]}>
        <FavoriteSelector {...defaultProps} {...props} />
      </TestApiProvider>,
    );
  };

  it('should not render when there are no favorites', () => {
    mockSnapshot.value = [];
    const { container } = renderComponent();

    expect(screen.queryByText('Select from Favorites')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('should render with label when favorites exist', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    renderComponent();

    expect(screen.getByText('Select from Favorites')).toBeInTheDocument();
  });

  it('should render select dropdown when favorites exist', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    renderComponent();

    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();
  });

  it('should display placeholder when no favorite is selected', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    renderComponent();

    expect(
      screen.getByText('Select a favorite topology view'),
    ).toBeInTheDocument();
  });

  it('should display favorites in dropdown', () => {
    mockSnapshot.value = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
    ];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    waitFor(() => {
      expect(screen.getByText('entity-1')).toBeInTheDocument();
      expect(screen.getByText('entity-2')).toBeInTheDocument();
    });
  });

  it('should call onFavoriteSelected when a favorite is selected', async () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      expect(screen.getByText('entity-1')).toBeInTheDocument();
    });

    const option = screen.getByText('entity-1');
    fireEvent.click(option);

    expect(mockOnFavoriteSelected).toHaveBeenCalledWith(
      '/topology?rootEntityRefs=entity-1',
    );
  });

  it('should not render when favorites array is empty', () => {
    mockSnapshot.value = [];

    const { container } = renderComponent();

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('Select from Favorites')).not.toBeInTheDocument();
  });

  it('should match current URL to display selected favorite', () => {
    mockSnapshot.value = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1' },
      { 'entity-2': '/topology?rootEntityRefs=entity-2' },
    ];

    renderComponent({ currentUrl: '/topology?rootEntityRefs=entity-1' });

    // The select should show 'entity-1' as selected
    waitFor(() => {
      expect(screen.getByText('entity-1')).toBeInTheDocument();
    });
  });

  it('should show placeholder when currentUrl does not match any favorite', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];

    renderComponent({ currentUrl: '/topology?rootEntityRefs=entity-3' });

    expect(
      screen.getByText('Select a favorite topology view'),
    ).toBeInTheDocument();
  });

  it('should handle multiple favorites with same entity name but different URLs', () => {
    mockSnapshot.value = [
      { 'entity-1': '/topology?rootEntityRefs=entity-1&maxDepth=1' },
      { 'entity-1': '/topology?rootEntityRefs=entity-1&maxDepth=2' },
    ];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    waitFor(() => {
      const options = screen.getAllByText('entity-1');
      // Both should be present (though with same display name)
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it('should render with outlined variant', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    const { container } = renderComponent();

    const select = container.querySelector('.MuiOutlinedInput-root');
    expect(select).toBeInTheDocument();
  });

  it('should display expand icon', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    renderComponent();

    const selectButton = screen.getByRole('button');
    expect(selectButton).toBeInTheDocument();
    // Icon is rendered by Material-UI Select component
  });

  it('should apply correct styling to placeholder', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    renderComponent();

    const placeholder = screen.getByText('Select a favorite topology view');
    expect(placeholder).toHaveStyle({ color: '#757575' });
  });

  it('should render entity name in dropdown items', async () => {
    mockSnapshot.value = [
      { 'my-component': '/topology?rootEntityRefs=my-component' },
      { 'my-system': '/topology?rootEntityRefs=my-system' },
    ];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      expect(screen.getByText('my-component')).toBeInTheDocument();
      expect(screen.getByText('my-system')).toBeInTheDocument();
    });
  });

  it('should handle favorites with complex URLs', async () => {
    mockSnapshot.value = [
      {
        'entity-1':
          '/topology?rootEntityRefs=entity-1&maxDepth=2&selectedKinds=Component,System&direction=LR',
      },
    ];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      expect(screen.getByText('entity-1')).toBeInTheDocument();
    });

    const option = screen.getByText('entity-1');
    fireEvent.click(option);

    expect(mockOnFavoriteSelected).toHaveBeenCalledWith(
      '/topology?rootEntityRefs=entity-1&maxDepth=2&selectedKinds=Component,System&direction=LR',
    );
  });

  it('should not call onFavoriteSelected when selecting disabled placeholder', async () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    // Try to click the disabled option (should not trigger callback)
    const listbox = screen.getByRole('listbox');
    const disabledOption = listbox.querySelector('[aria-disabled="true"]');
    if (disabledOption) {
      fireEvent.click(disabledOption);
    }

    expect(mockOnFavoriteSelected).not.toHaveBeenCalled();
  });

  it('should update when favorites change via observable', async () => {
    const { rerender, container } = renderComponent();

    // Initially no favorites - component should not render
    expect(container.firstChild).toBeNull();
    expect(
      screen.queryByText('Select a favorite topology view'),
    ).not.toBeInTheDocument();

    // Simulate favorites being added
    mockSnapshot.value = [
      { 'new-entity': '/topology?rootEntityRefs=new-entity' },
    ];

    // Trigger observable update
    const nextCallback = mockObservable.subscribe.mock.calls[0][0].next;
    nextCallback({ value: mockSnapshot.value });

    // Rerender component
    rerender(
      <TestApiProvider apis={[[storageApiRef, mockStorageApi]]}>
        <FavoriteSelector onFavoriteSelected={mockOnFavoriteSelected} />
      </TestApiProvider>,
    );

    // Now the component should render
    expect(screen.getByText('Select from Favorites')).toBeInTheDocument();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      expect(screen.getByText('new-entity')).toBeInTheDocument();
    });
  });

  it('should have proper form control styling', () => {
    mockSnapshot.value = [{ 'entity-1': '/topology?rootEntityRefs=entity-1' }];
    const { container } = renderComponent();

    const formControl = container.querySelector('.MuiFormControl-root');
    expect(formControl).toBeInTheDocument();
  });

  it('should handle empty entity names gracefully', async () => {
    mockSnapshot.value = [{ '': '/topology?rootEntityRefs=empty' }];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      // Should still render, even with empty entity name
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
  });

  it('should handle entity names with special characters', async () => {
    mockSnapshot.value = [
      { 'entity-with-dashes': '/topology?rootEntityRefs=entity-with-dashes' },
      {
        entity_with_underscores:
          '/topology?rootEntityRefs=entity_with_underscores',
      },
    ];

    renderComponent();

    const select = screen.getByRole('button');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      expect(screen.getByText('entity-with-dashes')).toBeInTheDocument();
      expect(screen.getByText('entity_with_underscores')).toBeInTheDocument();
    });
  });
});
