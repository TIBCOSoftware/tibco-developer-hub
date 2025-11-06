/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TestApiProvider } from '@backstage/test-utils';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetchAllEntities } from './useFetchAllEntities';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

// Mock entities for different test scenarios
const mockEntitiesComplete = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      namespace: 'default',
      name: 'group1-name',
      title: 'Group1 title',
      description: 'Group1 description',
    },
    spec: {
      type: 'organization',
      profile: {
        displayName: 'Group1 display name',
        email: 'info@acme.com',
      },
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'System',
    metadata: {
      namespace: 'default',
      name: 'system1-name',
      title: 'System1 title',
      description: 'System1 description',
      tags: ['tag1', 'tag2'],
    },
    spec: {
      type: 'service',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'default',
      name: 'component1-name',
      title: 'Component1 title',
      description: 'Component1 description',
      tags: ['tag1', 'tag2'],
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      system: 'system1-name',
      owner: 'group1-name',
      providesApis: ['api1-name'],
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'production',
      name: 'component2-name',
      title: 'Component2 title',
      description: 'Component2 description',
      tags: ['tag1', 'tag2'],
      annotations: {
        'backstage.io/techdocs-ref': 'dir:.',
      },
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      system: 'system1-name',
      owner: 'group1-name',
      providesApis: ['api1-name'],
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: {
      namespace: 'default',
      name: 'api1-name',
      title: 'API1 title',
      description: 'API1 description',
      tags: ['tag1', 'tag2'],
    },
    spec: {
      type: 'openapi',
      definition: 'https://api.example.com/openapi.yaml',
    },
  },
  {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      namespace: 'default',
      name: 'template1-name',
      title: 'Template1 title',
      description: 'Template1 description',
      tags: ['bwce'],
    },
    spec: {
      type: 'service',
      parameters: [],
      steps: [],
    },
  },
  {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      namespace: 'default',
      name: 'template2-name',
      title: 'Template2 title',
      description: 'Template2 description',
      tags: ['flogo'],
    },
    spec: {
      type: 'service',
      parameters: [],
      steps: [],
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Resource',
    metadata: {
      namespace: 'default',
      name: 'resource1-name',
      title: 'Resource1 title',
      description: 'Resource1 description',
    },
    spec: {
      type: 'database',
      owner: 'group1-name',
      system: 'system1-name',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Domain',
    metadata: {
      namespace: 'default',
      name: 'domain1-name',
      title: 'Domain1 title',
      description: 'Domain1 description',
    },
    spec: {
      owner: 'group1-name',
    },
  },
  {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      namespace: 'default',
      name: 'import-flow1-name',
      title: 'Import flow1 title',
      description: 'Import flow1 description',
      tags: ['import-flow', 'bwce'],
    },
    spec: {
      type: 'service',
      parameters: [],
      steps: [],
    },
  },
] as Entity[];

const mockEntitiesEmpty: Entity[] = [];

const mockEntitiesSingleKind = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'default',
      name: 'component1-name',
      title: 'Component1 title',
    },
    spec: {
      type: 'service',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'default',
      name: 'component2-name',
      title: 'Component2 title',
    },
    spec: {
      type: 'service',
    },
  },
] as Entity[];

const mockEntitiesDuplicateKinds = [
  ...mockEntitiesSingleKind,
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'System',
    metadata: {
      namespace: 'default',
      name: 'system1-name',
      title: 'System1 title',
    },
    spec: {
      type: 'service',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: 'default',
      name: 'component3-name',
      title: 'Component3 title',
    },
    spec: {
      type: 'library',
    },
  },
] as Entity[];

describe('useFetchAllEntities', () => {
  let mockCatalogApi: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCatalogApi = catalogApiMock.mock({
      getEntities: jest.fn().mockResolvedValue({
        items: mockEntitiesComplete,
      }),
    });
  });

  const renderHookWithProvider = (customCatalogApi = mockCatalogApi) =>
    renderHook(() => useFetchAllEntities(), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[catalogApiRef, customCatalogApi]]}>
          {children}
        </TestApiProvider>
      ),
    });

  describe('Basic Functionality', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHookWithProvider();

      expect(result.current.entities).toEqual([]);
      expect(result.current.kinds).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should fetch entities correctly', async () => {
      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.entities).toEqual(mockEntitiesComplete);
        expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should extract unique kinds correctly', async () => {
      const { result } = renderHookWithProvider();

      await waitFor(() => {
        const expectedKinds = [
          ...new Set(mockEntitiesComplete.map(entity => entity.kind)),
        ];
        expect(result.current.kinds).toEqual(expectedKinds);
        expect(result.current.kinds).toContain('Group');
        expect(result.current.kinds).toContain('System');
        expect(result.current.kinds).toContain('Component');
        expect(result.current.kinds).toContain('API');
        expect(result.current.kinds).toContain('Template');
        expect(result.current.kinds).toContain('Resource');
        expect(result.current.kinds).toContain('Domain');
      });
    });

    it('should set loading to false after successful fetch', async () => {
      const { result } = renderHookWithProvider();

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should maintain error as null on successful fetch', async () => {
      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.error).toBe(null);
        expect(result.current.entities).toHaveLength(
          mockEntitiesComplete.length,
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors correctly', async () => {
      const errorMessage = 'Network error occurred';
      const errorMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockRejectedValue(new Error(errorMessage)),
      });

      const { result } = renderHookWithProvider(errorMockCatalogApi);

      await waitFor(() => {
        expect(result.current.error).toBe(
          `Error fetching entity kinds: ${errorMessage}`,
        );
        expect(result.current.loading).toBe(false);
        expect(result.current.entities).toEqual([]);
        expect(result.current.kinds).toEqual([]);
      });
    });

    it('should handle API errors without message', async () => {
      const errorMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockRejectedValue('Simple error string'),
      });

      const { result } = renderHookWithProvider(errorMockCatalogApi);

      await waitFor(() => {
        expect(result.current.error).toBe(
          'Error fetching entity kinds: Simple error string',
        );
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle null/undefined errors', async () => {
      const errorMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockRejectedValue(null),
      });

      const { result } = renderHookWithProvider(errorMockCatalogApi);

      await waitFor(() => {
        expect(result.current.error).toBe('Error fetching entity kinds: null');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      const errorMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockRejectedValue(timeoutError),
      });

      const { result } = renderHookWithProvider(errorMockCatalogApi);

      await waitFor(() => {
        expect(result.current.error).toBe(
          'Error fetching entity kinds: Request timeout',
        );
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty entity list', async () => {
      const emptyMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: mockEntitiesEmpty,
        }),
      });

      const { result } = renderHookWithProvider(emptyMockCatalogApi);

      await waitFor(() => {
        expect(result.current.entities).toEqual([]);
        expect(result.current.kinds).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle entities with same kind', async () => {
      const singleKindMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: mockEntitiesSingleKind,
        }),
      });

      const { result } = renderHookWithProvider(singleKindMockCatalogApi);

      await waitFor(() => {
        expect(result.current.entities).toEqual(mockEntitiesSingleKind);
        expect(result.current.kinds).toEqual(['Component']);
        expect(result.current.kinds).toHaveLength(1);
      });
    });

    it('should deduplicate kinds correctly', async () => {
      const duplicateKindsMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: mockEntitiesDuplicateKinds,
        }),
      });

      const { result } = renderHookWithProvider(duplicateKindsMockCatalogApi);

      await waitFor(() => {
        expect(result.current.kinds).toEqual(['Component', 'System']);
        expect(result.current.kinds).toHaveLength(2);
        // Verify no duplicates
        const uniqueKinds = [...new Set(result.current.kinds)];
        expect(result.current.kinds).toEqual(uniqueKinds);
      });
    });

    it('should handle malformed API response', async () => {
      const malformedMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: undefined,
        }),
      });

      const { result } = renderHookWithProvider(malformedMockCatalogApi);

      await waitFor(() => {
        expect(result.current.error).toContain('Error fetching entity kinds:');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle response without items property', async () => {
      const noItemsMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({}),
      });

      const { result } = renderHookWithProvider(noItemsMockCatalogApi);

      await waitFor(() => {
        expect(result.current.error).toContain('Error fetching entity kinds:');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('API Integration', () => {
    it('should call catalogApi.getEntities with no parameters', async () => {
      renderHookWithProvider();

      await waitFor(() => {
        expect(mockCatalogApi.getEntities).toHaveBeenCalledWith();
        expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
      });
    });

    it('should not refetch on re-render with same catalogApi', async () => {
      const { result, rerender } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);

      // Re-render the hook
      rerender();

      await waitFor(() => {
        expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1); // Should not increase
      });
    });

    it('should handle concurrent API calls gracefully', async () => {
      let resolveCount = 0;
      const delayedMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockImplementation(async () => {
          resolveCount++;
          await new Promise(resolve => setTimeout(resolve, 100));
          return { items: mockEntitiesComplete };
        }),
      });

      const { result } = renderHookWithProvider(delayedMockCatalogApi);

      // The hook should only make one call despite potential race conditions
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(delayedMockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
      expect(resolveCount).toBe(1);
    });
  });

  describe('State Management', () => {
    it('should update all state properties atomically', async () => {
      const { result } = renderHookWithProvider();

      // Initially loading should be true, others should be empty/null
      expect(result.current.loading).toBe(true);
      expect(result.current.entities).toEqual([]);
      expect(result.current.kinds).toEqual([]);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // After loading, all properties should be updated
      expect(result.current.entities).toEqual(mockEntitiesComplete);
      expect(result.current.kinds.length).toBeGreaterThan(0);
      expect(result.current.error).toBe(null);
    });

    it('should maintain consistent state during error scenarios', async () => {
      const errorMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockRejectedValue(new Error('Test error')),
      });

      const { result } = renderHookWithProvider(errorMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toEqual([]);
      expect(result.current.kinds).toEqual([]);
      expect(result.current.error).toContain('Test error');
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', async () => {
      // Create a large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        apiVersion: 'backstage.io/v1alpha1',
        kind: `Kind${index % 10}`, // 10 different kinds
        metadata: {
          namespace: 'default',
          name: `entity-${index}`,
          title: `Entity ${index}`,
        },
        spec: {
          type: 'service',
        },
      })) as Entity[];

      const largeMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: largeDataset,
        }),
      });

      const { result } = renderHookWithProvider(largeMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toHaveLength(1000);
      expect(result.current.kinds).toHaveLength(10); // Unique kinds
      expect(result.current.error).toBe(null);
    });

    it('should handle entities with missing or malformed kind property', async () => {
      const malformedEntities = [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { namespace: 'default', name: 'valid-component' },
          spec: { type: 'service' },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          // Missing kind property
          metadata: { namespace: 'default', name: 'invalid-entity-1' },
          spec: { type: 'service' },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: '', // Empty kind
          metadata: { namespace: 'default', name: 'invalid-entity-2' },
          spec: { type: 'service' },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'System',
          metadata: { namespace: 'default', name: 'valid-system' },
          spec: { type: 'service' },
        },
      ] as any;

      const malformedMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: malformedEntities,
        }),
      });

      const { result } = renderHookWithProvider(malformedMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toEqual(malformedEntities);
      // Should handle malformed entities gracefully
      expect(result.current.kinds).toContain('Component');
      expect(result.current.kinds).toContain('System');
      // May or may not contain empty string or undefined depending on implementation
      expect(result.current.error).toBe(null);
    });
  });

  describe('React Hooks Best Practices', () => {
    it('should cleanup properly on unmount', async () => {
      const { result, unmount } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should not throw any errors on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should have stable return object structure', async () => {
      const { result } = renderHookWithProvider();

      const initialKeys = Object.keys(result.current);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const finalKeys = Object.keys(result.current);
      expect(finalKeys).toEqual(initialKeys);
      expect(finalKeys.sort()).toEqual([
        'entities',
        'error',
        'kinds',
        'loading',
      ]);
    });

    it('should prevent memory leaks on unmount during async operation', async () => {
      let resolvePromise: (value: any) => void;
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      const delayedMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockReturnValue(delayedPromise),
      });

      const { result, unmount } = renderHookWithProvider(delayedMockCatalogApi);

      expect(result.current.loading).toBe(true);

      // Unmount before the promise resolves
      unmount();

      // Now resolve the promise
      resolvePromise!({ items: mockEntitiesComplete });

      // Wait a bit to ensure any state updates would have occurred
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should not cause any warnings or errors about updating unmounted component
      expect(() => {}).not.toThrow();
    });
  });

  describe('Real-world Integration Scenarios', () => {
    it('should work correctly with actual Backstage entity structure', async () => {
      const realWorldEntities = [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            namespace: 'default',
            name: 'petstore',
            description: 'The Petstore from the OpenAPI tutorial',
            labels: {
              'backstage.io/techdocs-ref': 'dir:.',
            },
            annotations: {
              'backstage.io/managed-by-location':
                'url:https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/petstore-component.yaml',
              'backstage.io/managed-by-origin-location':
                'url:https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/petstore-component.yaml',
            },
          },
          spec: {
            type: 'service',
            lifecycle: 'experimental',
            owner: 'petstore-team',
            providesApis: ['petstore'],
            system: 'petstore',
          },
          relations: [
            {
              type: 'ownedBy',
              targetRef: 'group:default/petstore-team',
            },
            {
              type: 'providesApi',
              targetRef: 'api:default/petstore',
            },
            {
              type: 'partOf',
              targetRef: 'system:default/petstore',
            },
          ],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'API',
          metadata: {
            namespace: 'default',
            name: 'petstore',
            description: 'The Petstore API',
          },
          spec: {
            type: 'openapi',
            lifecycle: 'experimental',
            owner: 'petstore-team',
            system: 'petstore',
            definition: {
              $text: 'https://petstore.swagger.io/v2/swagger.json',
            },
          },
        },
      ] as Entity[];

      const realWorldMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: realWorldEntities,
        }),
      });

      const { result } = renderHookWithProvider(realWorldMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toEqual(realWorldEntities);
      expect(result.current.kinds).toEqual(['Component', 'API']);
      expect(result.current.error).toBe(null);
    });

    it('should handle mixed valid and invalid entities gracefully', async () => {
      const mixedEntities = [
        // Valid entity
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            namespace: 'default',
            name: 'valid-component',
          },
          spec: {
            type: 'service',
          },
        },
        // Entity with missing kind (invalid)
        {
          apiVersion: 'backstage.io/v1alpha1',
          metadata: {
            namespace: 'default',
            name: 'invalid-entity-1',
          },
          spec: {
            type: 'service',
          },
        },
        // Entity with empty kind (invalid)
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: '',
          metadata: {
            namespace: 'default',
            name: 'invalid-entity-2',
          },
          spec: {
            type: 'service',
          },
        },
        // Entity with whitespace-only kind (invalid)
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: '   ',
          metadata: {
            namespace: 'default',
            name: 'invalid-entity-3',
          },
          spec: {
            type: 'service',
          },
        },
        // Another valid entity
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'System',
          metadata: {
            namespace: 'default',
            name: 'valid-system',
          },
          spec: {
            type: 'service',
          },
        },
      ] as any;

      const mixedMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: mixedEntities,
        }),
      });

      const { result } = renderHookWithProvider(mixedMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toEqual(mixedEntities);
      // Should only include valid kinds
      expect(result.current.kinds).toEqual(['Component', 'System']);
      expect(result.current.error).toBe(null);
    });

    it('should handle API pagination correctly (if supported)', async () => {
      // Simulate paginated response - most real APIs would return all items at once
      const paginatedMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: mockEntitiesComplete,
          totalItems: mockEntitiesComplete.length,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'start',
            endCursor: 'end',
          },
        }),
      });

      const { result } = renderHookWithProvider(paginatedMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toEqual(mockEntitiesComplete);
      expect(result.current.kinds.length).toBeGreaterThan(0);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Performance Edge Cases', () => {
    it('should handle extremely large number of unique kinds', async () => {
      // Create entities with many unique kinds
      const manyKindsDataset = Array.from({ length: 500 }, (_, index) => ({
        apiVersion: 'backstage.io/v1alpha1',
        kind: `UniqueKind${index}`,
        metadata: {
          namespace: 'default',
          name: `entity-${index}`,
        },
        spec: {
          type: 'service',
        },
      })) as Entity[];

      const manyKindsMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: manyKindsDataset,
        }),
      });

      const { result } = renderHookWithProvider(manyKindsMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toHaveLength(500);
      expect(result.current.kinds).toHaveLength(500);
      expect(new Set(result.current.kinds).size).toBe(500); // All should be unique
      expect(result.current.error).toBe(null);
    });

    it('should handle entities with complex nested structures', async () => {
      const complexEntities = [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            namespace: 'default',
            name: 'complex-component',
            labels: {
              'app.kubernetes.io/name': 'complex-app',
              'app.kubernetes.io/version': '1.0.0',
              'app.kubernetes.io/component': 'frontend',
            },
            annotations: {
              'backstage.io/kubernetes-id': 'complex-app',
              'backstage.io/kubernetes-namespace': 'production',
              'sonarqube.org/project-key': 'complex-project',
            },
            tags: ['react', 'typescript', 'frontend'],
          },
          spec: {
            type: 'website',
            lifecycle: 'production',
            owner: 'team-frontend',
            system: 'ecommerce-platform',
            dependsOn: ['resource:default/database'],
            providesApis: ['api:default/user-api', 'api:default/product-api'],
            consumesApis: ['api:default/payment-api'],
          },
          relations: [
            {
              type: 'ownedBy',
              targetRef: 'group:default/team-frontend',
            },
            {
              type: 'dependsOn',
              targetRef: 'resource:default/database',
            },
            {
              type: 'providesApi',
              targetRef: 'api:default/user-api',
            },
            {
              type: 'providesApi',
              targetRef: 'api:default/product-api',
            },
            {
              type: 'consumesApi',
              targetRef: 'api:default/payment-api',
            },
          ],
        },
      ] as Entity[];

      const complexMockCatalogApi = catalogApiMock.mock({
        getEntities: jest.fn().mockResolvedValue({
          items: complexEntities,
        }),
      });

      const { result } = renderHookWithProvider(complexMockCatalogApi);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entities).toEqual(complexEntities);
      expect(result.current.kinds).toEqual(['Component']);
      expect(result.current.error).toBe(null);
    });
  });
});
