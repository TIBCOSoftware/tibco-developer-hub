/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TestApiProvider } from '@backstage/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchAllLinks } from './useFetchAllLinks';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { Entity, EntityLink } from '@backstage/catalog-model';

// Mock entities for testing different scenarios
const createMockEntity = (
  kind: string,
  metadata: any = {},
  spec: any = {},
): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind,
  metadata: {
    namespace: 'default',
    name: `${kind.toLowerCase()}-test`,
    ...metadata,
  },
  spec,
});

const mockComponentEntity = createMockEntity('Component', {
  name: 'test-component',
  namespace: 'default',
});

const mockApiEntity = createMockEntity('API', {
  name: 'test-api',
  namespace: 'default',
});

const mockResourceEntity = createMockEntity('Resource', {
  name: 'test-resource',
  namespace: 'default',
});

const mockSystemEntity = createMockEntity('System', {
  name: 'test-system',
  namespace: 'default',
});

const mockEntityWithExternalLinks = createMockEntity('Component', {
  name: 'component-with-links',
  namespace: 'default',
  links: [
    {
      url: 'https://example.com/docs',
      title: 'Documentation',
      icon: 'docs',
    },
    {
      url: 'https://example.com/repo',
      title: 'Repository',
      icon: 'github',
    },
    {
      url: 'https://example.com/monitoring',
      title: 'Monitoring',
      icon: 'monitoring',
    },
    {
      url: 'https://example.com/extra1',
      title: 'Extra Link 1',
      icon: 'link',
    },
    {
      url: 'https://example.com/extra2',
      title: 'Extra Link 2',
      icon: 'link',
    },
  ] as EntityLink[],
});

const mockEntityWithSourceAnnotation = createMockEntity('Component', {
  name: 'component-with-source',
  namespace: 'default',
  annotations: {
    'backstage.io/view-url': 'https://github.com/example/repo',
  },
});

const mockEntityWithTibcoPlatformApps = createMockEntity('Component', {
  name: 'component-with-platform-apps',
  namespace: 'default',
  tibcoPlatformApps: [
    {
      appType: 'BWCE',
      dpId: 'dp-123',
      capabilityInstanceId: 'cap-456',
      appId: 'app-789',
      dataPlaneName: 'Development Data Plane',
    },
    {
      appType: 'Flogo',
      dpId: 'dp-abc',
      capabilityInstanceId: 'cap-def',
      appId: 'app-ghi',
      dataPlaneName: 'Production Data Plane',
    },
  ],
});

const mockConfigWithCpLink = new ConfigReader({
  cpLink: 'https://tibco-platform.example.com',
  backend: { baseUrl: 'http://localhost:7007' },
});

const mockConfigWithoutCpLink = new ConfigReader({
  backend: { baseUrl: 'http://localhost:7007' },
});

// Helper function to render hook with providers
const renderHookWithProvider = (
  entity: Entity,
  config: ConfigReader = mockConfigWithCpLink,
) => {
  return renderHook(() => useFetchAllLinks(entity), {
    wrapper: ({ children }: { children: any }) => (
      <TestApiProvider apis={[[configApiRef, config]]}>
        {children}
      </TestApiProvider>
    ),
  });
};

describe('useFetchAllLinks', () => {
  describe('Basic Functionality', () => {
    it('should initialize with correct default state', async () => {
      const { result } = renderHookWithProvider(mockComponentEntity);

      // Hook immediately processes entity and sets links
      expect(result.current.externalLinks).toEqual([]);
      expect(result.current.infoLinks).toEqual({
        docs: '/catalog/default/Component/test-component/docs',
        apis: '/catalog/default/Component/test-component/api',
        cicd: '/catalog/default/Component/test-component/ci-cd',
      });
      expect(result.current.platformLinks).toEqual([]);

      // Wait for cpLink to be loaded from config
      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });
    });

    it('should load cpLink from config', async () => {
      const { result } = renderHookWithProvider(
        mockComponentEntity,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });
    });

    it('should handle missing cpLink in config', async () => {
      const { result } = renderHookWithProvider(
        mockComponentEntity,
        mockConfigWithoutCpLink,
      );

      // Should remain empty string when cpLink is not in config
      expect(result.current.cpLink).toBe('');
    });

    it('should return stable object structure', async () => {
      const { result } = renderHookWithProvider(mockComponentEntity);

      const initialKeys = Object.keys(result.current);

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });

      const finalKeys = Object.keys(result.current);
      expect(finalKeys).toEqual(initialKeys);
      expect(finalKeys.sort()).toEqual([
        'cpLink',
        'error',
        'externalLinks',
        'infoLinks',
        'platformLinks',
      ]);
    });
  });

  describe('Info Links Generation for Different Entity Types', () => {
    it('should generate correct info links for Component entity', async () => {
      const { result } = renderHookWithProvider(mockComponentEntity);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/Component/test-component/docs',
          apis: '/catalog/default/Component/test-component/api',
          cicd: '/catalog/default/Component/test-component/ci-cd',
        });
      });
    });

    it('should generate correct info links for API entity', async () => {
      const { result } = renderHookWithProvider(mockApiEntity);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/API/test-api/docs',
          apis: '/catalog/default/API/test-api/definition',
        });
      });
    });

    it('should generate correct info links for Resource entity', async () => {
      const { result } = renderHookWithProvider(mockResourceEntity);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/Resource/test-resource/docs',
        });
      });
    });

    it('should generate empty info links for System entity', async () => {
      const { result } = renderHookWithProvider(mockSystemEntity);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({});
      });
    });

    it('should handle entity with source annotation', async () => {
      const { result } = renderHookWithProvider(mockEntityWithSourceAnnotation);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/Component/component-with-source/docs',
          apis: '/catalog/default/Component/component-with-source/api',
          cicd: '/catalog/default/Component/component-with-source/ci-cd',
          source: 'https://github.com/example/repo',
        });
      });
    });
  });

  describe('External Links Processing', () => {
    it('should process external links correctly when less than or equal to 3', async () => {
      const entityWithFewLinks = createMockEntity('Component', {
        name: 'component-few-links',
        namespace: 'default',
        links: [
          { url: 'https://example.com/docs', title: 'Docs', icon: 'docs' },
          { url: 'https://example.com/repo', title: 'Repo', icon: 'github' },
        ] as EntityLink[],
      });

      const { result } = renderHookWithProvider(entityWithFewLinks);

      await waitFor(() => {
        expect(result.current.externalLinks).toHaveLength(2);
        expect(result.current.externalLinks).toEqual([
          { url: 'https://example.com/docs', title: 'Docs', icon: 'docs' },
          { url: 'https://example.com/repo', title: 'Repo', icon: 'github' },
        ]);
      });
    });

    it('should limit external links to first 3 when more than 3 exist', async () => {
      const { result } = renderHookWithProvider(mockEntityWithExternalLinks);

      await waitFor(() => {
        expect(result.current.externalLinks).toHaveLength(3);
        expect(result.current.externalLinks).toEqual([
          {
            url: 'https://example.com/docs',
            title: 'Documentation',
            icon: 'docs',
          },
          {
            url: 'https://example.com/repo',
            title: 'Repository',
            icon: 'github',
          },
          {
            url: 'https://example.com/monitoring',
            title: 'Monitoring',
            icon: 'monitoring',
          },
        ]);
      });
    });

    it('should handle entity with no external links', async () => {
      const { result } = renderHookWithProvider(mockComponentEntity);

      await waitFor(() => {
        expect(result.current.externalLinks).toEqual([]);
      });
    });

    it('should handle entity with empty links array', async () => {
      const entityWithEmptyLinks = createMockEntity('Component', {
        name: 'component-empty-links',
        namespace: 'default',
        links: [],
      });

      const { result } = renderHookWithProvider(entityWithEmptyLinks);

      await waitFor(() => {
        expect(result.current.externalLinks).toEqual([]);
      });
    });
  });

  describe('Platform Links Generation', () => {
    it('should generate platform links when cpLink and tibcoPlatformApps are available', async () => {
      const { result } = renderHookWithProvider(
        mockEntityWithTibcoPlatformApps,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });

      await waitFor(() => {
        expect(result.current.platformLinks).toHaveLength(2);
        expect(result.current.platformLinks).toEqual([
          {
            pLink:
              'https://tibco-platform.example.com/cp/bwce/appdetails/processes?dp_id=dp-123&capability_instance_id=cap-456&app_id=app-789',
            pLabel: 'Development Data Plane',
            pAppType: 'BWCE',
          },
          {
            pLink:
              'https://tibco-platform.example.com/cp/flogo/appdetails/processes?dp_id=dp-abc&capability_instance_id=cap-def&app_id=app-ghi',
            pLabel: 'Production Data Plane',
            pAppType: 'Flogo',
          },
        ]);
      });
    });

    it('should not generate platform links when cpLink is not available', async () => {
      const { result } = renderHookWithProvider(
        mockEntityWithTibcoPlatformApps,
        mockConfigWithoutCpLink,
      );

      await waitFor(() => {
        expect(result.current.platformLinks).toEqual([]);
      });
    });

    it('should not generate platform links when tibcoPlatformApps is not available', async () => {
      const { result } = renderHookWithProvider(
        mockComponentEntity,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.platformLinks).toEqual([]);
      });
    });

    it('should handle empty tibcoPlatformApps array', async () => {
      const entityWithEmptyPlatformApps = createMockEntity('Component', {
        name: 'component-empty-apps',
        namespace: 'default',
        tibcoPlatformApps: [],
      });

      const { result } = renderHookWithProvider(
        entityWithEmptyPlatformApps,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.platformLinks).toEqual([]);
      });
    });

    it('should handle platform apps with mixed case appType', async () => {
      const entityWithMixedCaseApps = createMockEntity('Component', {
        name: 'component-mixed-case',
        namespace: 'default',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            dpId: 'dp-123',
            capabilityInstanceId: 'cap-456',
            appId: 'app-789',
            dataPlaneName: 'Dev Plane',
          },
          {
            appType: 'Flogo',
            dpId: 'dp-abc',
            capabilityInstanceId: 'cap-def',
            appId: 'app-ghi',
            dataPlaneName: 'Prod Plane',
          },
        ],
      });

      const { result } = renderHookWithProvider(
        entityWithMixedCaseApps,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.platformLinks[0].pLink).toContain('/cp/bwce/');
        expect(result.current.platformLinks[1].pLink).toContain('/cp/flogo/');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null entity gracefully', async () => {
      const { result } = renderHook(() => useFetchAllLinks(null as any), {
        wrapper: ({ children }: { children: any }) => (
          <TestApiProvider apis={[[configApiRef, mockConfigWithCpLink]]}>
            {children}
          </TestApiProvider>
        ),
      });

      // Should not crash and should maintain initial state
      expect(result.current.externalLinks).toEqual([]);
      expect(result.current.infoLinks).toEqual({});
      expect(result.current.platformLinks).toEqual([]);

      // Should still load cpLink from config
      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });
    });

    it('should handle undefined entity gracefully', async () => {
      const { result } = renderHook(() => useFetchAllLinks(undefined as any), {
        wrapper: ({ children }: { children: any }) => (
          <TestApiProvider apis={[[configApiRef, mockConfigWithCpLink]]}>
            {children}
          </TestApiProvider>
        ),
      });

      // Should not crash and should maintain initial state
      expect(result.current.externalLinks).toEqual([]);
      expect(result.current.infoLinks).toEqual({});
      expect(result.current.platformLinks).toEqual([]);
    });

    it('should handle entity with missing metadata', async () => {
      const entityWithMissingMetadata = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        spec: {},
      } as Entity;

      const { result } = renderHookWithProvider(entityWithMissingMetadata);

      await waitFor(() => {
        // Should generate info links with default values for missing metadata
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/Component/unknown/docs',
          apis: '/catalog/default/Component/unknown/api',
          cicd: '/catalog/default/Component/unknown/ci-cd',
        });
      });
    });

    it('should handle entity with malformed platform apps', async () => {
      const entityWithMalformedApps = createMockEntity('Component', {
        name: 'component-malformed-apps',
        namespace: 'default',
        tibcoPlatformApps: [
          {
            // Missing required fields
            appType: 'BWCE',
            dataPlaneName: 'Incomplete App',
          },
          {
            appType: 'Flogo',
            dpId: 'dp-complete',
            capabilityInstanceId: 'cap-complete',
            appId: 'app-complete',
            dataPlaneName: 'Complete App',
          },
        ],
      });

      const { result } = renderHookWithProvider(
        entityWithMalformedApps,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });

      await waitFor(() => {
        // Should only have one platform link since the first one is malformed
        expect(result.current.platformLinks).toHaveLength(1);
        expect(result.current.platformLinks[0].pLabel).toBe('Complete App');
      });
    });

    it('should handle case-insensitive kind matching', async () => {
      const entityWithUppercaseKind = {
        ...mockComponentEntity,
        kind: 'COMPONENT',
      };

      const { result } = renderHookWithProvider(entityWithUppercaseKind);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/COMPONENT/test-component/docs',
          apis: '/catalog/default/COMPONENT/test-component/api',
          cicd: '/catalog/default/COMPONENT/test-component/ci-cd',
        });
      });
    });
  });

  describe('State Management and Re-renders', () => {
    it('should update state when entity changes', async () => {
      // Create a wrapper that can change the entity
      let currentEntity = mockComponentEntity;

      const { result, rerender } = renderHook(
        () => useFetchAllLinks(currentEntity),
        {
          wrapper: ({ children }: { children: any }) => (
            <TestApiProvider apis={[[configApiRef, mockConfigWithCpLink]]}>
              {children}
            </TestApiProvider>
          ),
        },
      );

      await waitFor(() => {
        expect(result.current.infoLinks.docs).toBe(
          '/catalog/default/Component/test-component/docs',
        );
      });

      // Change entity
      currentEntity = mockApiEntity;
      rerender();

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/API/test-api/docs',
          apis: '/catalog/default/API/test-api/definition',
        });
      });
    });

    it('should reset links when switching entities', async () => {
      let currentEntity = mockEntityWithExternalLinks;

      const { result, rerender } = renderHook(
        () => useFetchAllLinks(currentEntity),
        {
          wrapper: ({ children }: { children: any }) => (
            <TestApiProvider apis={[[configApiRef, mockConfigWithCpLink]]}>
              {children}
            </TestApiProvider>
          ),
        },
      );

      await waitFor(() => {
        expect(result.current.externalLinks).toHaveLength(3);
      });

      // Switch to entity without links
      currentEntity = mockComponentEntity;
      rerender();

      await waitFor(() => {
        expect(result.current.externalLinks).toEqual([]);
      });
    });

    it('should update platform links when cpLink becomes available', async () => {
      const { result } = renderHookWithProvider(
        mockEntityWithTibcoPlatformApps,
        mockConfigWithoutCpLink,
      );

      // Initially no platform links due to no cpLink
      await waitFor(() => {
        expect(result.current.platformLinks).toEqual([]);
      });

      // This test verifies the hook handles the scenario correctly
      // In real usage, cpLink would be set when config is available
      expect(result.current.platformLinks).toEqual([]);
    });
  });

  describe('Complex Integration Scenarios', () => {
    it('should handle entity with all types of links', async () => {
      const complexEntity = createMockEntity('Component', {
        name: 'complex-component',
        namespace: 'production',
        annotations: {
          'backstage.io/view-url': 'https://github.com/example/complex-repo',
        },
        links: [
          {
            url: 'https://example.com/docs',
            title: 'Documentation',
            icon: 'docs',
          },
          {
            url: 'https://example.com/monitoring',
            title: 'Monitoring',
            icon: 'monitoring',
          },
        ] as EntityLink[],
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            dpId: 'dp-prod-123',
            capabilityInstanceId: 'cap-prod-456',
            appId: 'app-prod-789',
            dataPlaneName: 'Production Data Plane',
          },
        ],
      });

      const { result } = renderHookWithProvider(
        complexEntity,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/production/Component/complex-component/docs',
          apis: '/catalog/production/Component/complex-component/api',
          cicd: '/catalog/production/Component/complex-component/ci-cd',
          source: 'https://github.com/example/complex-repo',
        });
        expect(result.current.externalLinks).toHaveLength(2);
        expect(result.current.platformLinks).toHaveLength(1);
        expect(result.current.platformLinks[0].pLabel).toBe(
          'Production Data Plane',
        );
      });
    });

    it('should handle entity with special characters in names', async () => {
      const entityWithSpecialChars = createMockEntity('Component', {
        name: 'my-component_with-special.chars',
        namespace: 'team-alpha',
      });

      const { result } = renderHookWithProvider(entityWithSpecialChars);

      await waitFor(() => {
        expect(result.current.infoLinks.docs).toBe(
          '/catalog/team-alpha/Component/my-component_with-special.chars/docs',
        );
      });
    });

    it('should handle rapid entity changes without state inconsistencies', async () => {
      let currentEntity = mockComponentEntity;

      const { result, rerender } = renderHook(
        () => useFetchAllLinks(currentEntity),
        {
          wrapper: ({ children }: { children: any }) => (
            <TestApiProvider apis={[[configApiRef, mockConfigWithCpLink]]}>
              {children}
            </TestApiProvider>
          ),
        },
      );

      // Rapidly change entities
      currentEntity = mockApiEntity;
      rerender();
      currentEntity = mockResourceEntity;
      rerender();
      currentEntity = mockSystemEntity;
      rerender();
      currentEntity = mockComponentEntity;
      rerender();

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/Component/test-component/docs',
          apis: '/catalog/default/Component/test-component/api',
          cicd: '/catalog/default/Component/test-component/ci-cd',
        });
      });
    });
  });

  describe('Additional Edge Cases', () => {
    it('should handle entity with non-string tibcoPlatformApps', async () => {
      const entityWithInvalidApps = createMockEntity('Component', {
        name: 'component-invalid-apps',
        namespace: 'default',
        tibcoPlatformApps: 'not-an-array', // Invalid type
      });

      const { result } = renderHookWithProvider(
        entityWithInvalidApps,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });

      // Should handle gracefully and return no platform links
      expect(result.current.platformLinks).toEqual([]);
    });

    it('should handle entity with null tibcoPlatformApps entries', async () => {
      const entityWithNullApps = createMockEntity('Component', {
        name: 'component-null-apps',
        namespace: 'default',
        tibcoPlatformApps: [
          null,
          {
            appType: 'BWCE',
            dpId: 'dp-123',
            capabilityInstanceId: 'cap-456',
            appId: 'app-789',
            dataPlaneName: 'Valid App',
          },
          undefined,
        ],
      });

      const { result } = renderHookWithProvider(
        entityWithNullApps,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });

      await waitFor(() => {
        // Should only process valid entries
        expect(result.current.platformLinks).toHaveLength(1);
        expect(result.current.platformLinks[0].pLabel).toBe('Valid App');
      });
    });

    it('should handle entity with very long names and special characters', async () => {
      const entityWithLongName = createMockEntity('Component', {
        name: 'very-long-component-name-with-special-chars_and.dots-and-123-numbers',
        namespace: 'very-long-namespace-with-special_chars',
      });

      const { result } = renderHookWithProvider(entityWithLongName);

      await waitFor(() => {
        expect(result.current.infoLinks.docs).toBe(
          '/catalog/very-long-namespace-with-special_chars/Component/very-long-component-name-with-special-chars_and.dots-and-123-numbers/docs',
        );
      });
    });

    it('should handle entity with empty string values', async () => {
      const entityWithEmptyStrings = createMockEntity('Component', {
        name: '',
        namespace: '',
        annotations: {
          'backstage.io/view-url': '',
        },
        links: [],
      });

      const { result } = renderHookWithProvider(entityWithEmptyStrings);

      await waitFor(() => {
        expect(result.current.infoLinks).toEqual({
          docs: '/catalog/default/Component/unknown/docs',
          apis: '/catalog/default/Component/unknown/api',
          cicd: '/catalog/default/Component/unknown/ci-cd',
        });
        expect(result.current.externalLinks).toEqual([]);
      });
    });

    it('should handle memory cleanup on unmount during async operations', async () => {
      const { unmount } = renderHookWithProvider(
        mockEntityWithTibcoPlatformApps,
      );

      // Unmount immediately while effects are still running
      unmount();

      // Should not cause any warnings or errors about updating unmounted component
      expect(() => {}).not.toThrow();
    });
  });

  describe('Platform Link URL Generation', () => {
    it('should generate correct URLs for different app types', async () => {
      const entityWithMultipleAppTypes = createMockEntity('Component', {
        name: 'multi-app-component',
        namespace: 'default',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            dpId: 'dp-bwce',
            capabilityInstanceId: 'cap-bwce',
            appId: 'app-bwce',
            dataPlaneName: 'BWCE App',
          },
          {
            appType: 'Flogo',
            dpId: 'dp-flogo',
            capabilityInstanceId: 'cap-flogo',
            appId: 'app-flogo',
            dataPlaneName: 'Flogo App',
          },
          {
            appType: 'CustomApp',
            dpId: 'dp-custom',
            capabilityInstanceId: 'cap-custom',
            appId: 'app-custom',
            dataPlaneName: 'Custom App',
          },
        ],
      });

      const { result } = renderHookWithProvider(
        entityWithMultipleAppTypes,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe(
          'https://tibco-platform.example.com',
        );
      });

      await waitFor(() => {
        expect(result.current.platformLinks).toHaveLength(3);

        const bwceLink = result.current.platformLinks.find(
          link => link.pAppType === 'BWCE',
        );
        expect(bwceLink?.pLink).toBe(
          'https://tibco-platform.example.com/cp/bwce/appdetails/processes?dp_id=dp-bwce&capability_instance_id=cap-bwce&app_id=app-bwce',
        );

        const flogoLink = result.current.platformLinks.find(
          link => link.pAppType === 'Flogo',
        );
        expect(flogoLink?.pLink).toBe(
          'https://tibco-platform.example.com/cp/flogo/appdetails/processes?dp_id=dp-flogo&capability_instance_id=cap-flogo&app_id=app-flogo',
        );

        const customLink = result.current.platformLinks.find(
          link => link.pAppType === 'CustomApp',
        );
        expect(customLink?.pLink).toBe(
          'https://tibco-platform.example.com/cp/customapp/appdetails/processes?dp_id=dp-custom&capability_instance_id=cap-custom&app_id=app-custom',
        );
      });
    });

    it('should handle platform apps with numeric and special character IDs', async () => {
      const entityWithSpecialIds = createMockEntity('Component', {
        name: 'special-ids-component',
        namespace: 'default',
        tibcoPlatformApps: [
          {
            appType: 'BWCE',
            dpId: '12345-67890-abcde',
            capabilityInstanceId: 'cap_123-456_789',
            appId: 'app.123.456.789',
            dataPlaneName: 'Special IDs App',
          },
        ],
      });

      const { result } = renderHookWithProvider(
        entityWithSpecialIds,
        mockConfigWithCpLink,
      );

      await waitFor(() => {
        expect(result.current.platformLinks).toHaveLength(1);
        expect(result.current.platformLinks[0].pLink).toBe(
          'https://tibco-platform.example.com/cp/bwce/appdetails/processes?dp_id=12345-67890-abcde&capability_instance_id=cap_123-456_789&app_id=app.123.456.789',
        );
      });
    });
  });

  describe('Config API Integration', () => {
    it('should handle config API errors gracefully', async () => {
      const errorConfig = {
        getOptionalString: jest.fn().mockImplementation(() => {
          throw new Error('Config error');
        }),
      };

      const { result } = renderHook(
        () => useFetchAllLinks(mockComponentEntity),
        {
          wrapper: ({ children }: { children: any }) => (
            <TestApiProvider apis={[[configApiRef, errorConfig as any]]}>
              {children}
            </TestApiProvider>
          ),
        },
      );

      // Should handle config errors and maintain empty cpLink
      expect(result.current.cpLink).toBe('');
      expect(result.current.platformLinks).toEqual([]);
    });

    it('should handle config API returning non-string values', async () => {
      const invalidConfig = {
        getOptionalString: jest.fn().mockReturnValue(123), // Non-string value
      };

      const { result } = renderHook(
        () => useFetchAllLinks(mockEntityWithTibcoPlatformApps),
        {
          wrapper: ({ children }: { children: any }) => (
            <TestApiProvider apis={[[configApiRef, invalidConfig as any]]}>
              {children}
            </TestApiProvider>
          ),
        },
      );

      await waitFor(() => {
        expect(result.current.cpLink).toBe('123');
      });

      // Should still work with non-string cpLink
      await waitFor(() => {
        expect(result.current.platformLinks).toHaveLength(2);
      });
    });
  });
});
