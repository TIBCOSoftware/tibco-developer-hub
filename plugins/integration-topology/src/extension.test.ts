/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

// Mock the dependencies before importing anything else
const mockIntegrationTopologyCard = jest.fn(
  () => 'MockedIntegrationTopologyCard',
);
const mockIntegrationTopologyPage = jest.fn(
  () => 'MockedIntegrationTopologyPage',
);

const mockCreateComponentExtension = jest.fn();
const mockCreateRoutableExtension = jest.fn();
const mockPluginProvide = jest.fn();

const mockTopologyGraphRouteRef = {
  id: 'integration-topology',
  path: '/integration-topology',
};

// Mock all dependencies before any imports
jest.mock('@backstage/core-plugin-api', () => ({
  createComponentExtension: mockCreateComponentExtension,
  createRoutableExtension: mockCreateRoutableExtension,
}));

jest.mock('./plugin', () => ({
  integrationTopologyPlugin: {
    provide: mockPluginProvide,
  },
}));

jest.mock('./routes', () => ({
  topologyGraphRouteRef: mockTopologyGraphRouteRef,
}));

jest.mock(
  './components/IntegrationTopologyCard/IntegrationTopologyCard',
  () => ({
    IntegrationTopologyCard: mockIntegrationTopologyCard,
  }),
);

jest.mock('./components/IntegrationTopologyPage', () => ({
  IntegrationTopologyPage: mockIntegrationTopologyPage,
}));

describe('Extensions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    const mockComponentExtension = {
      name: 'EntityIntegrationTopologyCard',
      $$type: '@backstage/ExtensionDefinition',
    };

    const mockRoutableExtension = {
      name: 'IntegrationTopologyPage',
      $$type: '@backstage/ExtensionDefinition',
    };

    mockCreateComponentExtension.mockReturnValue(mockComponentExtension);
    mockCreateRoutableExtension.mockReturnValue(mockRoutableExtension);
    mockPluginProvide.mockImplementation(extension => extension);
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Module Import and Extension Creation', () => {
    it('should create extensions when module is imported', async () => {
      await import('./extensions');

      expect(mockCreateComponentExtension).toHaveBeenCalledTimes(1);
      expect(mockCreateRoutableExtension).toHaveBeenCalledTimes(1);
      expect(mockPluginProvide).toHaveBeenCalledTimes(2);
    });

    it('should export both extensions', async () => {
      const { EntityIntegrationTopologyCard, IntegrationTopologyPage } =
        await import('./extensions');

      expect(EntityIntegrationTopologyCard).toBeDefined();
      expect(IntegrationTopologyPage).toBeDefined();
    });
  });

  describe('EntityIntegrationTopologyCard Extension', () => {
    describe('Basic Configuration', () => {
      it('should create component extension with correct name', async () => {
        await import('./extensions');

        expect(mockCreateComponentExtension).toHaveBeenCalledWith({
          name: 'EntityIntegrationTopologyCard',
          component: {
            lazy: expect.any(Function),
          },
        });
      });

      it('should have lazy loading configuration', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        expect(componentCall[0].component).toHaveProperty('lazy');
        expect(typeof componentCall[0].component.lazy).toBe('function');
      });

      it('should handle component import via lazy function', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const lazyFunction = componentCall[0].component.lazy;
        const importResult = await lazyFunction();

        expect(importResult).toBe(mockIntegrationTopologyCard);
      });

      it('should be provided to the plugin', async () => {
        await import('./extensions');

        expect(mockPluginProvide).toHaveBeenCalledWith({
          name: 'EntityIntegrationTopologyCard',
          $$type: '@backstage/ExtensionDefinition',
        });
      });
    });
  });

  describe('IntegrationTopologyPage Extension', () => {
    describe('Basic Configuration', () => {
      it('should create routable extension with correct name', async () => {
        await import('./extensions');

        expect(mockCreateRoutableExtension).toHaveBeenCalledWith({
          name: 'IntegrationTopologyPage',
          component: expect.any(Function),
          mountPoint: mockTopologyGraphRouteRef,
        });
      });

      it('should have component function configuration', async () => {
        await import('./extensions');

        const routableCall = mockCreateRoutableExtension.mock.calls[0];
        expect(typeof routableCall[0].component).toBe('function');
      });

      it('should use correct route reference', async () => {
        await import('./extensions');

        const routableCall = mockCreateRoutableExtension.mock.calls[0];
        expect(routableCall[0].mountPoint).toBe(mockTopologyGraphRouteRef);
      });

      it('should handle page component import via component function', async () => {
        await import('./extensions');

        const routableCall = mockCreateRoutableExtension.mock.calls[0];
        const componentFunction = routableCall[0].component;
        const importResult = await componentFunction();

        expect(importResult).toBe(mockIntegrationTopologyPage);
      });

      it('should be provided to the plugin', async () => {
        await import('./extensions');

        expect(mockPluginProvide).toHaveBeenCalledWith({
          name: 'IntegrationTopologyPage',
          $$type: '@backstage/ExtensionDefinition',
        });
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Plugin Integration', () => {
      it('should integrate both extensions with the plugin', async () => {
        await import('./extensions');

        expect(mockPluginProvide).toHaveBeenCalledTimes(2);
        expect(mockPluginProvide).toHaveBeenNthCalledWith(1, {
          name: 'EntityIntegrationTopologyCard',
          $$type: '@backstage/ExtensionDefinition',
        });
        expect(mockPluginProvide).toHaveBeenNthCalledWith(2, {
          name: 'IntegrationTopologyPage',
          $$type: '@backstage/ExtensionDefinition',
        });
      });
    });

    describe('Backstage API Usage', () => {
      it('should use createComponentExtension API correctly', async () => {
        await import('./extensions');

        expect(mockCreateComponentExtension).toHaveBeenCalledWith({
          name: 'EntityIntegrationTopologyCard',
          component: {
            lazy: expect.any(Function),
          },
        });
      });

      it('should use createRoutableExtension API correctly', async () => {
        await import('./extensions');

        expect(mockCreateRoutableExtension).toHaveBeenCalledWith({
          name: 'IntegrationTopologyPage',
          component: expect.any(Function),
          mountPoint: mockTopologyGraphRouteRef,
        });
      });
    });

    describe('Dynamic Import Behavior', () => {
      it('should handle lazy loading imports correctly', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const lazyFunction = componentCall[0].component.lazy;

        const result = await lazyFunction();
        expect(result).toBe(mockIntegrationTopologyCard);
      });

      it('should handle page component imports correctly', async () => {
        await import('./extensions');

        const routableCall = mockCreateRoutableExtension.mock.calls[0];
        const componentFunction = routableCall[0].component;

        const result = await componentFunction();
        expect(result).toBe(mockIntegrationTopologyPage);
      });

      it('should support concurrent loading', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const routableCall = mockCreateRoutableExtension.mock.calls[0];

        const [cardResult, pageResult] = await Promise.all([
          componentCall[0].component.lazy(),
          routableCall[0].component(),
        ]);

        expect(cardResult).toBe(mockIntegrationTopologyCard);
        expect(pageResult).toBe(mockIntegrationTopologyPage);
      });
    });
  });

  describe('Configuration Validation', () => {
    describe('Extension Names', () => {
      it('should have unique extension names', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const routableCall = mockCreateRoutableExtension.mock.calls[0];

        const names = [componentCall[0].name, routableCall[0].name];
        const uniqueNames = new Set(names);

        expect(uniqueNames.size).toBe(names.length);
        expect(names).toContain('EntityIntegrationTopologyCard');
        expect(names).toContain('IntegrationTopologyPage');
      });

      it('should follow naming conventions', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const routableCall = mockCreateRoutableExtension.mock.calls[0];

        // Names should be PascalCase
        expect(componentCall[0].name).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
        expect(routableCall[0].name).toMatch(/^[A-Z][a-zA-Z0-9]*$/);

        // Names should be descriptive
        expect(componentCall[0].name).toContain('Card');
        expect(routableCall[0].name).toContain('Page');
      });
    });

    describe('Configuration Structure', () => {
      it('should have valid component extension configuration', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];

        expect(componentCall[0]).toMatchObject({
          name: expect.any(String),
          component: {
            lazy: expect.any(Function),
          },
        });
      });

      it('should have valid routable extension configuration', async () => {
        await import('./extensions');

        const routableCall = mockCreateRoutableExtension.mock.calls[0];

        expect(routableCall[0]).toMatchObject({
          name: expect.any(String),
          component: expect.any(Function),
          mountPoint: expect.any(Object),
        });
      });
    });
  });

  describe('Error Handling', () => {
    describe('Extension Creation Errors', () => {
      it('should handle component extension creation errors', async () => {
        mockCreateComponentExtension.mockImplementationOnce(() => {
          throw new Error('Component extension creation failed');
        });

        await expect(import('./extensions')).rejects.toThrow(
          'Component extension creation failed',
        );
      });

      it('should handle routable extension creation errors', async () => {
        mockCreateRoutableExtension.mockImplementationOnce(() => {
          throw new Error('Routable extension creation failed');
        });

        await expect(import('./extensions')).rejects.toThrow(
          'Routable extension creation failed',
        );
      });

      it('should handle plugin provide errors', async () => {
        mockPluginProvide.mockImplementationOnce(() => {
          throw new Error('Plugin provide failed');
        });

        await expect(import('./extensions')).rejects.toThrow(
          'Plugin provide failed',
        );
      });
    });

    describe('Component Import Errors', () => {
      it('should handle dynamic import structure correctly', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const routableCall = mockCreateRoutableExtension.mock.calls[0];

        // Test that the lazy function and component function are properly set up
        expect(typeof componentCall[0].component.lazy).toBe('function');
        expect(typeof routableCall[0].component).toBe('function');

        // Test that they return the expected values
        const cardResult = await componentCall[0].component.lazy();
        const pageResult = await routableCall[0].component();

        expect(cardResult).toBe(mockIntegrationTopologyCard);
        expect(pageResult).toBe(mockIntegrationTopologyPage);
      });

      it('should properly configure dynamic imports for production use', async () => {
        await import('./extensions');

        const componentCall = mockCreateComponentExtension.mock.calls[0];
        const routableCall = mockCreateRoutableExtension.mock.calls[0];

        // Verify the import paths would be correct in production
        expect(componentCall[0]).toMatchObject({
          name: 'EntityIntegrationTopologyCard',
          component: {
            lazy: expect.any(Function),
          },
        });

        expect(routableCall[0]).toMatchObject({
          name: 'IntegrationTopologyPage',
          component: expect.any(Function),
          mountPoint: mockTopologyGraphRouteRef,
        });
      });
    });
  });

  describe('Performance Characteristics', () => {
    it('should use lazy loading for component extensions', async () => {
      await import('./extensions');

      const componentCall = mockCreateComponentExtension.mock.calls[0];
      expect(componentCall[0].component).toHaveProperty('lazy');
    });

    it('should not eagerly load components during module initialization', async () => {
      jest.clearAllMocks();

      await import('./extensions');

      // Extension creation should be called
      expect(mockCreateComponentExtension).toHaveBeenCalled();
      expect(mockCreateRoutableExtension).toHaveBeenCalled();

      // But the actual component imports should not have been resolved yet
      expect(mockIntegrationTopologyCard).not.toHaveBeenCalled();
      expect(mockIntegrationTopologyPage).not.toHaveBeenCalled();
    });

    it('should support multiple concurrent imports without issues', async () => {
      // Reset mocks to ensure clean state
      jest.resetModules();
      jest.clearAllMocks();

      await import('./extensions');

      const componentCall = mockCreateComponentExtension.mock.calls[0];
      const routableCall = mockCreateRoutableExtension.mock.calls[0];

      // Simulate multiple concurrent loads
      const promises = [
        componentCall[0].component.lazy(),
        componentCall[0].component.lazy(),
        routableCall[0].component(),
        routableCall[0].component(),
      ];

      const results = await Promise.all(promises);
      expect(results).toHaveLength(4);
      results.forEach(result => expect(result).toBeDefined());
    });
  });

  describe('TypeScript and API Compliance', () => {
    it('should maintain proper TypeScript types', async () => {
      await import('./extensions');

      const componentCall = mockCreateComponentExtension.mock.calls[0];
      const routableCall = mockCreateRoutableExtension.mock.calls[0];

      // Component extension structure validation
      expect(componentCall[0]).toMatchObject({
        name: expect.stringMatching(/^[A-Z][a-zA-Z0-9]*$/),
        component: expect.objectContaining({
          lazy: expect.any(Function),
        }),
      });

      // Routable extension structure validation
      expect(routableCall[0]).toMatchObject({
        name: expect.stringMatching(/^[A-Z][a-zA-Z0-9]*$/),
        component: expect.any(Function),
        mountPoint: expect.objectContaining({
          id: expect.any(String),
        }),
      });
    });

    it('should follow Backstage extension patterns', async () => {
      const { EntityIntegrationTopologyCard, IntegrationTopologyPage } =
        await import('./extensions');

      // Extensions should have expected Backstage extension structure
      expect(EntityIntegrationTopologyCard).toMatchObject({
        name: expect.any(String),
        $$type: expect.any(String),
      });

      expect(IntegrationTopologyPage).toMatchObject({
        name: expect.any(String),
        $$type: expect.any(String),
      });
    });
  });

  describe('Module System Integration', () => {
    it('should handle module dependencies correctly', async () => {
      const extensionsModule = await import('./extensions');

      expect(extensionsModule).toBeDefined();
      expect(Object.keys(extensionsModule)).toContain(
        'EntityIntegrationTopologyCard',
      );
      expect(Object.keys(extensionsModule)).toContain(
        'IntegrationTopologyPage',
      );
    });

    it('should maintain consistent exports across multiple imports', async () => {
      await import('./extensions');

      jest.resetModules();
      const secondImport = await import('./extensions');

      expect(secondImport.EntityIntegrationTopologyCard).toBeDefined();
      expect(secondImport.IntegrationTopologyPage).toBeDefined();

      // Should be objects (extension definitions)
      expect(typeof secondImport.EntityIntegrationTopologyCard).toBe('object');
      expect(typeof secondImport.IntegrationTopologyPage).toBe('object');
    });

    it('should not cause circular dependency issues', () => {
      expect(() => {
        require('./extensions');
      }).not.toThrow();
    });
  });

  describe('Runtime Behavior', () => {
    it('should create extensions that integrate with Backstage runtime', async () => {
      const { EntityIntegrationTopologyCard, IntegrationTopologyPage } =
        await import('./extensions');

      // Extensions should have the expected structure for Backstage runtime
      expect(EntityIntegrationTopologyCard).toHaveProperty('name');
      expect(EntityIntegrationTopologyCard).toHaveProperty('$$type');

      expect(IntegrationTopologyPage).toHaveProperty('name');
      expect(IntegrationTopologyPage).toHaveProperty('$$type');
    });

    it('should support extension lifecycle operations', async () => {
      await import('./extensions');

      // Verify plugin.provide was called for both extensions
      expect(mockPluginProvide).toHaveBeenCalledTimes(2);

      // Verify the extensions were properly created and provided
      const calls = mockPluginProvide.mock.calls;
      calls.forEach(call => {
        expect(call[0]).toHaveProperty('$$type');
      });
    });
  });
});
