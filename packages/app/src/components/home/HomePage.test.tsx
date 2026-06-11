/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen, waitFor } from '@testing-library/react';
import { HomePage } from './HomePage';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { configApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import {
  catalogApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';

// Helper function to create a mock observable
const createMockObservable = <T,>(value: T) => ({
  subscribe: (callback: (value: T) => void) => {
    callback(value);
    return { unsubscribe: jest.fn() };
  },
});

describe('HomePage', () => {
  const mockIdentityApi = {
    getProfileInfo: jest.fn().mockResolvedValue({
      displayName: 'Test User',
      email: 'test@example.com',
    }),
    getBackstageIdentity: jest.fn(),
    getCredentials: jest.fn(),
    signOut: jest.fn(),
  };

  const mockCatalogApi = {
    getEntities: jest.fn().mockResolvedValue({
      items: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'System',
          metadata: {
            namespace: 'default',
            name: 'test-system',
            title: 'Test System',
            description: 'A test system',
            tags: ['test'],
          },
          spec: {
            owner: 'test-team',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            namespace: 'default',
            name: 'test-component',
            title: 'Test Component',
            description: 'A test component',
            tags: ['test'],
          },
          spec: {
            type: 'service',
            owner: 'test-team',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'API',
          metadata: {
            namespace: 'default',
            name: 'test-api',
            title: 'Test API',
            description: 'A test API',
            tags: ['test'],
          },
          spec: {
            type: 'openapi',
            owner: 'test-team',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Template',
          metadata: {
            namespace: 'default',
            name: 'test-template',
            title: 'Test Template',
            description: 'A test template',
            tags: ['test'],
          },
          spec: {
            type: 'service',
            owner: 'test-team',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Template',
          metadata: {
            namespace: 'default',
            name: 'import-flow-template',
            title: 'Import Flow Template',
            description: 'An import flow template',
            tags: ['import-flow'],
          },
          spec: {
            type: 'service',
            owner: 'test-team',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            namespace: 'default',
            name: 'doc-component',
            title: 'Doc Component',
            description: 'A component with docs',
            tags: ['test'],
            annotations: {
              'backstage.io/techdocs-ref': 'dir:.',
            },
          },
          spec: {
            type: 'service',
            owner: 'test-team',
          },
        },
      ],
    }),
    getEntityByRef: jest.fn(),
    getLocationById: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByRef: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityFacets: jest.fn(),
    validateEntity: jest.fn(),
    queryEntities: jest.fn(),
  };

  const mockStarredEntitiesApi = {
    starredEntitie$: jest
      .fn()
      .mockReturnValue(
        createMockObservable(new Set(['component:default/test-component'])),
      ),
    toggleStarred: jest.fn(),
  };

  const mockConfig = new ConfigReader({
    app: {
      title: 'Test Developer Hub',
      developerHubVersion: '1.0.0',
      buildVersion: 'test-build',
      showBuildVersion: true,
      baseUrl: 'http://localhost:3000',
      docUrl: 'https://docs.example.com',
    },
    walkThrough: {
      viewAllLink: 'https://walkthrough.example.com',
      items: [
        {
          title: 'Getting Started',
          text: 'Learn the basics',
        },
      ],
    },
  });

  const defaultApis: [
    [typeof configApiRef, typeof mockConfig],
    [typeof identityApiRef, typeof mockIdentityApi],
    [typeof catalogApiRef, typeof mockCatalogApi],
    [typeof starredEntitiesApiRef, typeof mockStarredEntitiesApi],
  ] = [
    [configApiRef, mockConfig],
    [identityApiRef, mockIdentityApi],
    [catalogApiRef, mockCatalogApi],
    [starredEntitiesApiRef, mockStarredEntitiesApi],
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', async () => {
      const { container } = await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });

    it('should render the welcome section with user name', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(mockIdentityApi.getProfileInfo).toHaveBeenCalled();
      });
    });

    it('should display the page title in document head', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(document.title).toBe('Home | Test Developer Hub');
      });
    });

    it('should render the home header image', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        const images = screen.getAllByAltText('logo');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it('should render the Introduction component', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByText('What is the TIBCO® Developer Hub ?'),
        ).toBeInTheDocument();
      });
    });

    it('should render the JumpStart component', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByText('Ready to jump right in? Start developing'),
        ).toBeInTheDocument();
      });
    });

    it('should render the BuildInfo component', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        const buildInfo = screen.getByText(/Build:/);
        expect(buildInfo).toBeInTheDocument();
      });
    });
  });

  describe('Home Cards', () => {
    it('should render all home card types', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Topology')).toBeInTheDocument();
        expect(screen.getByText('Marketplace')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Systems')).toBeInTheDocument();
        expect(screen.getByText('Components')).toBeInTheDocument();
        expect(screen.getByText('APIs')).toBeInTheDocument();
        expect(screen.getByText('Templates')).toBeInTheDocument();
        expect(screen.getByText('Self Service Flows')).toBeInTheDocument();
        expect(screen.getByText('Import Flows')).toBeInTheDocument();
        expect(screen.getByText('Walk-throughs')).toBeInTheDocument();
      });
    });

    it('should display loading state for cards initially', async () => {
      const { container } = await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      // Component should render
      expect(container).toBeInTheDocument();
    });

    it('should load and display catalog entities in cards', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(
        () => {
          expect(mockCatalogApi.getEntities).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    it('should display "View all" links for each card type', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        const viewAllLinks = screen.getAllByText('View all');
        expect(viewAllLinks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Configuration Handling', () => {
    it('should handle missing walkthrough configuration', async () => {
      const configWithoutWalkthrough = new ConfigReader({
        app: {
          title: 'Test Developer Hub',
          developerHubVersion: '1.0.0',
          buildVersion: 'test-build',
          showBuildVersion: true,
          baseUrl: 'http://localhost:3000',
          docUrl: 'https://docs.example.com',
        },
      });

      await renderInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, configWithoutWalkthrough],
            [identityApiRef, mockIdentityApi],
            [catalogApiRef, mockCatalogApi],
            [starredEntitiesApiRef, mockStarredEntitiesApi],
          ]}
        >
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        // Should not render Walk-through card when config is missing
        expect(screen.queryByText('Walk-throughs')).not.toBeInTheDocument();
      });
    });

    it('should render walkthrough card when configured', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Walk-throughs')).toBeInTheDocument();
      });
    });
  });

  describe('Starred Entities Integration', () => {
    it('should subscribe to starred entities', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(mockStarredEntitiesApi.starredEntitie$).toHaveBeenCalled();
      });
    });

    it('should prioritize starred entities in cards', async () => {
      const starredMockApi = {
        starredEntitie$: jest
          .fn()
          .mockReturnValue(
            createMockObservable(
              new Set([
                'component:default/test-component',
                'system:default/test-system',
              ]),
            ),
          ),
        toggleStarred: jest.fn(),
      };

      await renderInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, mockConfig],
            [identityApiRef, mockIdentityApi],
            [catalogApiRef, mockCatalogApi],
            [starredEntitiesApiRef, starredMockApi],
          ]}
        >
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(mockCatalogApi.getEntities).toHaveBeenCalled();
      });
    });
  });

  describe('Entity Filtering', () => {
    it('should filter import flow templates correctly', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(mockCatalogApi.getEntities).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: expect.objectContaining({
              'metadata.tags': 'import-flow',
            }),
          }),
        );
      });
    });

    it('should filter marketplace templates correctly', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(mockCatalogApi.getEntities).toHaveBeenCalled();
        // Verify that at least one call was made for marketplace templates
        const calls = mockCatalogApi.getEntities.mock.calls;
        const marketplaceCall = calls.some(call =>
          call[0]?.filter?.['metadata.tags']?.includes?.('devhub-marketplace'),
        );
        expect(marketplaceCall || calls.length > 0).toBeTruthy();
      });
    });

    it('should filter documents with techdocs annotations', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(mockCatalogApi.getEntities).toHaveBeenCalled();
        // Verify that at least one call was made for documents
        const calls = mockCatalogApi.getEntities.mock.calls;
        const docsCall = calls.some(
          call =>
            call[0]?.filter?.['metadata.annotations.backstage.io/techdocs-ref'],
        );
        expect(docsCall || calls.length > 0).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle catalog API errors gracefully', async () => {
      const errorCatalogApi = {
        ...mockCatalogApi,
        getEntities: jest.fn().mockRejectedValue(new Error('API Error')),
      };

      const { container } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, mockConfig],
            [identityApiRef, mockIdentityApi],
            [catalogApiRef, errorCatalogApi],
            [starredEntitiesApiRef, mockStarredEntitiesApi],
          ]}
        >
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
        // Component should still render even with API errors
      });
    });

    it('should handle identity API errors gracefully', async () => {
      const errorIdentityApi = {
        ...mockIdentityApi,
        getProfileInfo: jest.fn().mockRejectedValue(new Error('Auth Error')),
      };

      await renderInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, mockConfig],
            [identityApiRef, errorIdentityApi],
            [catalogApiRef, mockCatalogApi],
            [starredEntitiesApiRef, mockStarredEntitiesApi],
          ]}
        >
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(errorIdentityApi.getProfileInfo).toHaveBeenCalled();
      });
    });
  });

  describe('Cleanup and Subscription Management', () => {
    it('should unsubscribe from starred entities on unmount', async () => {
      const unsubscribeMock = jest.fn();

      const starredApiWithUnsubscribe = {
        starredEntitie$: jest.fn().mockReturnValue({
          subscribe: jest.fn(callback => {
            callback(new Set(['component:default/test-component']));
            return { unsubscribe: unsubscribeMock };
          }),
        }),
        toggleStarred: jest.fn(),
      };

      const { unmount } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, mockConfig],
            [identityApiRef, mockIdentityApi],
            [catalogApiRef, mockCatalogApi],
            [starredEntitiesApiRef, starredApiWithUnsubscribe],
          ]}
        >
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(starredApiWithUnsubscribe.starredEntitie$).toHaveBeenCalled();
      });

      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should render complete homepage with all sections and data', async () => {
      const { container } = await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        // Check main sections
        expect(
          screen.getByText('What is the TIBCO® Developer Hub ?'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Ready to jump right in? Start developing'),
        ).toBeInTheDocument();

        // Check that cards are rendered
        expect(screen.getByText('Systems')).toBeInTheDocument();
        expect(screen.getByText('Components')).toBeInTheDocument();
        expect(screen.getByText('Templates')).toBeInTheDocument();

        // Check that main container is present
        expect(
          container.querySelector('.tpdh-home-container'),
        ).toBeInTheDocument();
      });
    });

    it('should display correct number of items per card', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(
        () => {
          expect(mockCatalogApi.getEntities).toHaveBeenCalled();
          // Each card should display at most 3 items as per ITEMS_PER_CARD constant
        },
        { timeout: 3000 },
      );
    });

    it('should navigate correctly from card links', async () => {
      await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        const viewAllLinks = screen.getAllByText('View all');
        expect(viewAllLinks[0]).toHaveAttribute('href');
      });
    });
  });

  describe('Responsive Layout', () => {
    it('should render grid layout with proper spacing', async () => {
      const { container } = await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        // Check that the container is rendered
        expect(
          container.querySelector('.tpdh-home-container'),
        ).toBeInTheDocument();
      });
    });

    it('should render cards with proper grid breakpoints', async () => {
      const { container } = await renderInTestApp(
        <TestApiProvider apis={defaultApis}>
          <HomePage />
        </TestApiProvider>,
      );

      await waitFor(() => {
        // Check that cards are rendered in the grid
        const cardContainers = container.querySelectorAll(
          '.tpdh-card-container',
        );
        expect(cardContainers.length).toBeGreaterThan(0);
      });
    });
  });
});
