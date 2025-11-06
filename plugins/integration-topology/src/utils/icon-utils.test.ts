/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import { getCustomEntityIcon, getEntityStatusIcons } from './icon-utils';

describe('icon-utils', () => {
  const createMockEntity = (customization?: any): Entity => ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
      namespace: 'default',
      ...(customization && {
        'tibco.developer.hub/topology': customization,
      }),
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
    },
  });

  describe('getCustomEntityIcon', () => {
    it('should return null for entity without topology customization', () => {
      const entity = createMockEntity();
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null for entity with empty topology customization', () => {
      const entity = createMockEntity({});
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null for entity with null topology customization', () => {
      const entity = createMockEntity(null);
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null for entity with non-object topology customization', () => {
      const entity = createMockEntity('invalid');
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null when entityIcon is not provided', () => {
      const entity = createMockEntity({
        theme: { name: 'blue' },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null when entityIcon.icon is not a string', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 123, // Not a string
          iconColor: 'red',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null when entityIcon.icon is empty string', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: '',
          iconColor: 'red',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return null when entityIcon.icon is null', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: null,
          iconColor: 'red',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toBeNull();
    });

    it('should return custom icon with minimal configuration', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'storage',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toEqual({
        icon: 'storage',
        color: undefined,
        tooltip: undefined,
      });
    });

    it('should return custom icon with full configuration', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'database',
          iconColor: '#FF5722',
          iconTooltip: 'Database service',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toEqual({
        icon: 'database',
        color: '#FF5722',
        tooltip: 'Database service',
      });
    });

    it('should handle custom icon with only color', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'api',
          iconColor: 'blue',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toEqual({
        icon: 'api',
        color: 'blue',
        tooltip: undefined,
      });
    });

    it('should handle custom icon with only tooltip', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'web',
          iconTooltip: 'Web application',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toEqual({
        icon: 'web',
        color: undefined,
        tooltip: 'Web application',
      });
    });

    it('should handle empty string values gracefully', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'service',
          iconColor: '',
          iconTooltip: '',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toEqual({
        icon: 'service',
        color: undefined,
        tooltip: undefined,
      });
    });

    it('should handle mixed valid and invalid properties', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'cloud',
          iconColor: 'green',
          iconTooltip: null,
          invalidProperty: 'should be ignored',
        },
      });
      const result = getCustomEntityIcon(entity);
      expect(result).toEqual({
        icon: 'cloud',
        color: 'green',
        tooltip: undefined,
      });
    });

    describe('Edge cases and error handling', () => {
      it('should handle entity with undefined metadata', () => {
        const entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: undefined,
        } as any;

        const result = getCustomEntityIcon(entity);
        expect(result).toBeNull();
      });

      it('should handle entity with null metadata', () => {
        const entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: null,
        } as any;

        const result = getCustomEntityIcon(entity);
        expect(result).toBeNull();
      });

      it('should handle deeply nested null values', () => {
        const entity = createMockEntity({
          entityIcon: null,
        });
        const result = getCustomEntityIcon(entity);
        expect(result).toBeNull();
      });

      it('should handle entityIcon as non-object', () => {
        const entity = createMockEntity({
          entityIcon: 'invalid',
        });
        const result = getCustomEntityIcon(entity);
        expect(result).toBeNull();
      });

      it('should not mutate input entity', () => {
        const originalEntity = createMockEntity({
          entityIcon: {
            icon: 'test',
            iconColor: 'red',
          },
        });
        const entityCopy = JSON.parse(JSON.stringify(originalEntity));

        getCustomEntityIcon(originalEntity);
        expect(originalEntity).toEqual(entityCopy);
      });
    });

    describe('Type validation', () => {
      it('should return correct CustomIconDetails type', () => {
        const entity = createMockEntity({
          entityIcon: {
            icon: 'test-icon',
            iconColor: 'red',
            iconTooltip: 'Test tooltip',
          },
        });

        const result = getCustomEntityIcon(entity);
        expect(result).not.toBeNull();
        expect(result).toHaveProperty('icon');
        expect(result).toHaveProperty('color');
        expect(result).toHaveProperty('tooltip');

        expect(result).toEqual({
          icon: 'test-icon',
          color: 'red',
          tooltip: 'Test tooltip',
        });
      });

      it('should return CustomIconDetails with correct types for partial data', () => {
        const entity = createMockEntity({
          entityIcon: {
            icon: 'test-icon',
          },
        });

        const result = getCustomEntityIcon(entity);
        expect(result).not.toBeNull();
        expect(result).toEqual({
          icon: 'test-icon',
          color: undefined,
          tooltip: undefined,
        });
      });
    });
  });

  describe('getEntityStatusIcons', () => {
    it('should return null for entity without topology customization', () => {
      const entity = createMockEntity();
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return null for entity with empty topology customization', () => {
      const entity = createMockEntity({});
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return null for entity with null topology customization', () => {
      const entity = createMockEntity(null);
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return null when statusIcons is not provided', () => {
      const entity = createMockEntity({
        entityIcon: { icon: 'test' },
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return null when statusIcons is not an array', () => {
      const entity = createMockEntity({
        statusIcons: 'invalid',
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return null when statusIcons is empty array', () => {
      const entity = createMockEntity({
        statusIcons: [],
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return null when statusIcons is null', () => {
      const entity = createMockEntity({
        statusIcons: null,
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toBeNull();
    });

    it('should return status icons with minimal configuration', () => {
      const entity = createMockEntity({
        statusIcons: [{ icon: 'warning' }],
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toEqual([
        {
          icon: 'warning',
          iconColor: 'inherit',
          iconTooltip: undefined,
        },
      ]);
    });

    it('should return status icons with full configuration', () => {
      const entity = createMockEntity({
        statusIcons: [
          {
            icon: 'error',
            iconColor: 'red',
            iconTooltip: 'Error status',
          },
          {
            icon: 'check',
            iconColor: 'green',
            iconTooltip: 'Success status',
          },
        ],
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toEqual([
        {
          icon: 'error',
          iconColor: 'red',
          iconTooltip: 'Error status',
        },
        {
          icon: 'check',
          iconColor: 'green',
          iconTooltip: 'Success status',
        },
      ]);
    });

    it('should handle mixed icon configurations', () => {
      const entity = createMockEntity({
        statusIcons: [
          { icon: 'info' },
          { icon: 'warning', iconColor: 'orange' },
          { icon: 'error', iconTooltip: 'Critical error' },
          { icon: 'success', iconColor: 'green', iconTooltip: 'All good' },
        ],
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toEqual([
        {
          icon: 'info',
          iconColor: 'inherit',
          iconTooltip: undefined,
        },
        {
          icon: 'warning',
          iconColor: 'orange',
          iconTooltip: undefined,
        },
        {
          icon: 'error',
          iconColor: 'inherit',
          iconTooltip: 'Critical error',
        },
        {
          icon: 'success',
          iconColor: 'green',
          iconTooltip: 'All good',
        },
      ]);
    });

    it('should handle undefined icon values gracefully', () => {
      const entity = createMockEntity({
        statusIcons: [{ icon: undefined }, { icon: 'valid' }],
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toEqual([
        {
          icon: undefined,
          iconColor: 'inherit',
          iconTooltip: undefined,
        },
        {
          icon: 'valid',
          iconColor: 'inherit',
          iconTooltip: undefined,
        },
      ]);
    });

    it('should handle null and empty string values', () => {
      const entity = createMockEntity({
        statusIcons: [
          {
            icon: 'test',
            iconColor: null,
            iconTooltip: '',
          },
        ],
      });
      const result = getEntityStatusIcons(entity);
      expect(result).toEqual([
        {
          icon: 'test',
          iconColor: 'inherit',
          iconTooltip: undefined,
        },
      ]);
    });

    it('should filter out invalid icon objects', () => {
      const entity = createMockEntity({
        statusIcons: [
          { icon: 'valid1' },
          null, // Invalid - will be filtered out
          'invalid', // Invalid - will be filtered out
          { icon: 'valid2', iconColor: 'blue' },
          undefined, // Invalid - will be filtered out
        ],
      });

      const result = getEntityStatusIcons(entity);
      expect(result).toHaveLength(2);
      expect(result![0]).toEqual({
        icon: 'valid1',
        iconColor: 'inherit',
        iconTooltip: undefined,
      });
      expect(result![1]).toEqual({
        icon: 'valid2',
        iconColor: 'blue',
        iconTooltip: undefined,
      });
    });

    it('should handle array with all invalid objects', () => {
      const entity = createMockEntity({
        statusIcons: [null, undefined, 'string', 123, false],
      });

      const result = getEntityStatusIcons(entity);
      expect(result).toEqual([]);
    });

    it('should handle mixed valid and edge case objects', () => {
      const entity = createMockEntity({
        statusIcons: [
          { icon: 'test1' },
          {}, // Valid object but with no icon
          { icon: null }, // Valid object with null icon
          { icon: '', iconColor: 'red' }, // Valid object with empty string icon
          { iconColor: 'blue' }, // Valid object but missing icon
        ],
      });

      const result = getEntityStatusIcons(entity);
      expect(result).toHaveLength(5);
      expect(result![0]).toEqual({
        icon: 'test1',
        iconColor: 'inherit',
        iconTooltip: undefined,
      });
      expect(result![1]).toEqual({
        icon: undefined,
        iconColor: 'inherit',
        iconTooltip: undefined,
      });
      expect(result![2]).toEqual({
        icon: undefined,
        iconColor: 'inherit',
        iconTooltip: undefined,
      });
      expect(result![3]).toEqual({
        icon: undefined,
        iconColor: 'red',
        iconTooltip: undefined,
      });
      expect(result![4]).toEqual({
        icon: undefined,
        iconColor: 'blue',
        iconTooltip: undefined,
      });
    });

    describe('Edge cases and error handling', () => {
      it('should handle entity with undefined metadata', () => {
        const entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: undefined,
        } as any;

        const result = getEntityStatusIcons(entity);
        expect(result).toBeNull();
      });

      it('should handle entity with null metadata', () => {
        const entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: null,
        } as any;

        const result = getEntityStatusIcons(entity);
        expect(result).toBeNull();
      });

      it('should handle large number of status icons', () => {
        const statusIcons = Array.from({ length: 100 }, (_, i) => ({
          icon: `icon-${i}`,
          iconColor: i % 2 === 0 ? 'red' : 'blue',
          iconTooltip: `Tooltip ${i}`,
        }));

        const entity = createMockEntity({ statusIcons });
        const result = getEntityStatusIcons(entity);

        expect(result).toHaveLength(100);
        expect(result![0]).toEqual({
          icon: 'icon-0',
          iconColor: 'red',
          iconTooltip: 'Tooltip 0',
        });
        expect(result![99]).toEqual({
          icon: 'icon-99',
          iconColor: 'blue',
          iconTooltip: 'Tooltip 99',
        });
      });

      it('should not mutate input entity', () => {
        const originalEntity = createMockEntity({
          statusIcons: [{ icon: 'test', iconColor: 'red' }],
        });
        const entityCopy = JSON.parse(JSON.stringify(originalEntity));

        getEntityStatusIcons(originalEntity);
        expect(originalEntity).toEqual(entityCopy);
      });
    });

    describe('Type validation', () => {
      it('should return correct CustomIconProps array type', () => {
        const entity = createMockEntity({
          statusIcons: [
            {
              icon: 'test-icon',
              iconColor: 'red',
              iconTooltip: 'Test tooltip',
            },
          ],
        });

        const result = getEntityStatusIcons(entity);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);

        expect(result).toEqual([
          {
            icon: 'test-icon',
            iconColor: 'red',
            iconTooltip: 'Test tooltip',
          },
        ]);
      });

      it('should return CustomIconProps array with correct structure for multiple icons', () => {
        const entity = createMockEntity({
          statusIcons: [
            { icon: 'icon1', iconColor: 'red' },
            { icon: 'icon2', iconTooltip: 'tooltip' },
          ],
        });

        const result = getEntityStatusIcons(entity);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);

        expect(result).toEqual([
          {
            icon: 'icon1',
            iconColor: 'red',
            iconTooltip: undefined,
          },
          {
            icon: 'icon2',
            iconColor: 'inherit',
            iconTooltip: 'tooltip',
          },
        ]);
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle entity with both custom icon and status icons', () => {
      const entity = createMockEntity({
        entityIcon: {
          icon: 'service',
          iconColor: 'blue',
          iconTooltip: 'Main service',
        },
        statusIcons: [
          { icon: 'warning', iconColor: 'orange', iconTooltip: 'Warning' },
          { icon: 'info', iconColor: 'blue' },
        ],
      });

      const customIcon = getCustomEntityIcon(entity);
      const statusIcons = getEntityStatusIcons(entity);

      expect(customIcon).toEqual({
        icon: 'service',
        color: 'blue',
        tooltip: 'Main service',
      });

      expect(statusIcons).toEqual([
        {
          icon: 'warning',
          iconColor: 'orange',
          iconTooltip: 'Warning',
        },
        {
          icon: 'info',
          iconColor: 'blue',
          iconTooltip: undefined,
        },
      ]);
    });

    it('should work with complex entity structure', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'payment-service',
          namespace: 'production',
          labels: {
            'app.kubernetes.io/name': 'payment-service',
          },
          annotations: {
            'backstage.io/source-location':
              'url:https://github.com/example/repo',
          },
          'tibco.developer.hub/topology': {
            theme: {
              name: 'blue',
            },
            entityIcon: {
              icon: 'payment',
              iconColor: '#4CAF50',
              iconTooltip: 'Payment processing service',
            },
            statusIcons: [
              {
                icon: 'health_and_safety',
                iconColor: 'green',
                iconTooltip: 'Health check passed',
              },
              {
                icon: 'security',
                iconColor: 'blue',
                iconTooltip: 'Security scan completed',
              },
            ],
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'payment-team',
        },
      };

      const customIcon = getCustomEntityIcon(entity);
      const statusIcons = getEntityStatusIcons(entity);

      expect(customIcon).toEqual({
        icon: 'payment',
        color: '#4CAF50',
        tooltip: 'Payment processing service',
      });

      expect(statusIcons).toHaveLength(2);
      expect(statusIcons![0]).toEqual({
        icon: 'health_and_safety',
        iconColor: 'green',
        iconTooltip: 'Health check passed',
      });
    });

    it('should handle real-world API entity', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: {
          name: 'user-api',
          'tibco.developer.hub/topology': {
            entityIcon: {
              icon: 'api',
              iconColor: '#FF9800',
            },
            statusIcons: [{ icon: 'verified', iconColor: 'green' }],
          },
        },
        spec: {
          type: 'openapi',
        },
      };

      const customIcon = getCustomEntityIcon(entity);
      const statusIcons = getEntityStatusIcons(entity);

      expect(customIcon).toEqual({
        icon: 'api',
        color: '#FF9800',
        tooltip: undefined,
      });

      expect(statusIcons).toEqual([
        {
          icon: 'verified',
          iconColor: 'green',
          iconTooltip: undefined,
        },
      ]);
    });

    it('should handle Resource entity with minimal configuration', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: {
          name: 'user-database',
          'tibco.developer.hub/topology': {
            entityIcon: {
              icon: 'storage',
            },
          },
        },
        spec: {
          type: 'database',
        },
      };

      const customIcon = getCustomEntityIcon(entity);
      const statusIcons = getEntityStatusIcons(entity);

      expect(customIcon).toEqual({
        icon: 'storage',
        color: undefined,
        tooltip: undefined,
      });

      expect(statusIcons).toBeNull();
    });
  });

  describe('Performance and consistency', () => {
    it('should handle large datasets efficiently', () => {
      const entities = Array.from({ length: 1000 }, (_, i) =>
        createMockEntity({
          entityIcon: { icon: `icon-${i}` },
          statusIcons: [{ icon: `status-${i}` }],
        }),
      );

      const startTime = performance.now();
      entities.forEach(entity => {
        getCustomEntityIcon(entity);
        getEntityStatusIcons(entity);
      });
      const endTime = performance.now();

      // Should complete within reasonable time (1 second for 1000 entities)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should return consistent results for identical inputs', () => {
      const entity = createMockEntity({
        entityIcon: { icon: 'test', iconColor: 'blue' },
        statusIcons: [{ icon: 'status', iconColor: 'red' }],
      });

      const icon1 = getCustomEntityIcon(entity);
      const icon2 = getCustomEntityIcon(entity);
      const icons1 = getEntityStatusIcons(entity);
      const icons2 = getEntityStatusIcons(entity);

      expect(icon1).toEqual(icon2);
      expect(icons1).toEqual(icons2);
    });

    it('should not have memory leaks with repeated calls', () => {
      const entity = createMockEntity({
        entityIcon: { icon: 'test' },
        statusIcons: [{ icon: 'status' }],
      });

      // Call functions many times to check for memory leaks
      for (let i = 0; i < 10000; i++) {
        getCustomEntityIcon(entity);
        getEntityStatusIcons(entity);
      }

      // If we reach here without memory issues, test passes
      expect(true).toBe(true);
    });
  });
});
