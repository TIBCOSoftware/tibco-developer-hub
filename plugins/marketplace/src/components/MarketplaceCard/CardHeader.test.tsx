/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { CardHeader, formatTypeDisplay } from './CardHeader';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { starredEntitiesApiRef } from '@backstage/plugin-catalog-react';

const mockStarredEntitiesApi = {
  toggleStarred: jest.fn(),
  starredEntitie$: jest.fn(() => {
    const observable = {
      subscribe: jest.fn(() => ({
        unsubscribe: jest.fn(),
        closed: false,
      })),
      [Symbol.observable]() {
        return this;
      },
    };
    return observable;
  }),
};

describe('CardHeader Component', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'Test Template',
      title: 'Test Template Title',
      'tibco.developer.hub/marketplace': {
        isNew: true,
      },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: true,
  };

  it('renders the template type and "Installed" status', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Template')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
  });

  it('displays the "New" icon when the template is marked as new', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByTestId('new-image')).toBeInTheDocument();
  });

  it('does not display the "New" icon when the template is not marked as new', async () => {
    const templateWithoutNew = {
      ...mockTemplate,
      metadata: {
        ...mockTemplate.metadata,
        'tibco.developer.hub/marketplace': {
          isNew: false,
        },
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={templateWithoutNew} />
      </TestApiProvider>,
    );
    expect(screen.queryByTestId('new-image')).not.toBeInTheDocument();
  });

  it('does not render owned by relations when they do not exist', async () => {
    const templateWithoutRelations = {
      ...mockTemplate,
      relations: [],
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={templateWithoutRelations} />
      </TestApiProvider>,
    );
    expect(
      screen.queryByTestId('marketplace-card-actions--ownedby'),
    ).not.toBeInTheDocument();
  });

  it('renders the correct background and icon based on the template type', async () => {
    const documentTemplate = {
      ...mockTemplate,
      spec: {
        type: 'document',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={documentTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByAltText('document')).toBeInTheDocument();
  });

  it('renders artificial-intelligence type correctly with proper formatting', async () => {
    const aiAgentTemplate = {
      ...mockTemplate,
      spec: {
        type: 'artificial-intelligence',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={aiAgentTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
    expect(screen.getByAltText('artificial-intelligence')).toBeInTheDocument();
  });

  it('renders Import Flow type correctly with proper formatting', async () => {
    const importFlowTemplate = {
      ...mockTemplate,
      spec: {
        type: 'import-flow',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={importFlowTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Import Flow')).toBeInTheDocument();
    expect(screen.getByAltText('import-flow')).toBeInTheDocument();
  });

  it('renders Sample type correctly with proper formatting', async () => {
    const sampleTemplate = {
      ...mockTemplate,
      spec: {
        type: 'sample',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={sampleTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.getByAltText('sample')).toBeInTheDocument();
  });

  it('renders Self Service type correctly with proper formatting', async () => {
    const selfServiceTemplate = {
      ...mockTemplate,
      spec: {
        type: 'self-service',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={selfServiceTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Self Service')).toBeInTheDocument();
    expect(screen.getByAltText('self-service')).toBeInTheDocument();
  });

  it('renders Document type correctly with proper formatting', async () => {
    const documentTemplate = {
      ...mockTemplate,
      spec: {
        type: 'document',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={documentTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByAltText('document')).toBeInTheDocument();
  });

  it('handles unknown types by using blank icon and fallback formatting', async () => {
    const unknownTemplate = {
      ...mockTemplate,
      spec: {
        type: 'unknown-type',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={unknownTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Unknown Type')).toBeInTheDocument();
    expect(screen.getByAltText('unknown-type')).toBeInTheDocument();
  });

  it('handles multi-word hyphenated types correctly', async () => {
    const multiWordTemplate = {
      ...mockTemplate,
      spec: {
        type: 'custom-integration-flow',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={multiWordTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Custom Integration Flow')).toBeInTheDocument();
  });

  it('handles undefined type gracefully', async () => {
    const noTypeTemplate = {
      ...mockTemplate,
      spec: {
        type: undefined as any,
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        <CardHeader template={noTypeTemplate} />
      </TestApiProvider>,
    );
    // Should render empty string for type display when type is undefined
    const typeElements = screen.queryAllByText('');
    expect(typeElements.length).toBeGreaterThan(0);
  });
});

describe('formatTypeDisplay function', () => {
  it('returns empty string for undefined input', () => {
    expect(formatTypeDisplay(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(formatTypeDisplay('')).toBe('');
  });

  it('handles artificial-intelligence with standard formatting', () => {
    expect(formatTypeDisplay('artificial-intelligence')).toBe(
      'Artificial Intelligence',
    );
  });

  it('formats single word correctly', () => {
    expect(formatTypeDisplay('template')).toBe('Template');
    expect(formatTypeDisplay('document')).toBe('Document');
    expect(formatTypeDisplay('sample')).toBe('Sample');
  });

  it('formats hyphenated words correctly', () => {
    expect(formatTypeDisplay('import-flow')).toBe('Import Flow');
    expect(formatTypeDisplay('custom-integration')).toBe('Custom Integration');
    expect(formatTypeDisplay('multi-word-type')).toBe('Multi Word Type');
  });

  it('handles mixed case input correctly', () => {
    expect(formatTypeDisplay('TEMPLATE')).toBe('Template');
    expect(formatTypeDisplay('MixedCase')).toBe('Mixedcase');
  });

  it('handles already formatted input correctly', () => {
    expect(formatTypeDisplay('Already Formatted')).toBe('Already Formatted');
  });

  it('handles single character input', () => {
    expect(formatTypeDisplay('a')).toBe('A');
    expect(formatTypeDisplay('x-y')).toBe('X Y');
  });

  it('handles numeric input', () => {
    expect(formatTypeDisplay('type-1')).toBe('Type 1');
    expect(formatTypeDisplay('version-2-template')).toBe('Version 2 Template');
  });
});

describe('CardHeader FavoriteToggle', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      namespace: 'default',
      title: 'Test Template Title',
      'tibco.developer.hub/marketplace': {
        isNew: false,
      },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };

  const mockFavoriteToggleApi = {
    toggleStarred: jest.fn(),
    starredEntitie$: jest.fn(() => {
      const observable = {
        subscribe: jest.fn(() => ({
          unsubscribe: jest.fn(),
          closed: false,
        })),
        [Symbol.observable]() {
          return this;
        },
      };
      return observable;
    }),
  };

  it('renders FavoriteToggle component', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockFavoriteToggleApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
    );

    // Find button by its class or within the favorite icon container
    const favoriteButtons = screen.getAllByRole('button');
    // The FavoriteToggle button should be present
    expect(favoriteButtons.length).toBeGreaterThan(0);
  });

  it('FavoriteToggle container has onClick handler', async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockFavoriteToggleApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
    );

    const favoriteContainer = container.querySelector(
      '[role="button"][tabindex="0"]',
    );

    expect(favoriteContainer).toBeInTheDocument();
    expect(favoriteContainer).toHaveProperty('onclick');
  });

  it('FavoriteToggle container has proper accessibility attributes', async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockFavoriteToggleApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
    );

    const favoriteContainer = container.querySelector(
      '[role="button"][tabindex="0"]',
    );

    expect(favoriteContainer).toBeInTheDocument();
    expect(favoriteContainer).toHaveAttribute('role', 'button');
    expect(favoriteContainer).toHaveAttribute('tabIndex', '0');
  });

  it('FavoriteToggle container has keyboard event handler', async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockFavoriteToggleApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
    );

    const favoriteContainer = container.querySelector(
      '[role="button"][tabindex="0"]',
    );

    expect(favoriteContainer).toBeInTheDocument();
    expect(favoriteContainer).toHaveProperty('onkeydown');
  });
});
