/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import {
  getCustomNodeThemeColors,
  getCustomThemeProps,
  topologyThemes,
  TopologyThemes,
  CustomThemeProps,
} from './theme-utils';

describe('theme-utils', () => {
  describe('topologyThemes', () => {
    it('should contain all expected theme definitions', () => {
      const expectedThemes = [
        'blue',
        'green',
        'navy',
        'orange',
        'pastelGreen',
        'pink',
        'purple',
        'yellow',
      ];

      expectedThemes.forEach(theme => {
        expect(topologyThemes).toHaveProperty(theme);
        expect(topologyThemes[theme as TopologyThemes]).toHaveProperty(
          'background',
        );
        expect(topologyThemes[theme as TopologyThemes]).toHaveProperty(
          'iconColor',
        );
      });
    });

    it('should have valid HSLA color values for all themes', () => {
      const hslaRegex = /^hsla\(\d+,\s*\d+%,\s*\d+%,\s*[\d.]+\)$/;

      Object.entries(topologyThemes).forEach(([, colors]) => {
        expect(colors.background).toMatch(hslaRegex);
        expect(colors.iconColor).toMatch(hslaRegex);
      });
    });

    it('should have distinct colors for each theme', () => {
      const themes = Object.values(topologyThemes);
      const backgrounds = themes.map(theme => theme.background);
      const iconColors = themes.map(theme => theme.iconColor);

      // Check that all backgrounds are unique
      expect(new Set(backgrounds).size).toBe(backgrounds.length);

      // Check that all icon colors are unique
      expect(new Set(iconColors).size).toBe(iconColors.length);
    });
  });

  describe('getCustomNodeThemeColors', () => {
    it('should return empty object when theme is undefined', () => {
      const result = getCustomNodeThemeColors(undefined);
      expect(result).toEqual({});
    });

    it('should return empty object when theme is null', () => {
      const result = getCustomNodeThemeColors(null as any);
      expect(result).toEqual({});
    });

    it('should return correct colors for valid theme names', () => {
      const validThemes: TopologyThemes[] = [
        'blue',
        'green',
        'navy',
        'orange',
        'pastelGreen',
        'pink',
        'purple',
        'yellow',
      ];

      validThemes.forEach(theme => {
        const result = getCustomNodeThemeColors(theme);
        expect(result).toEqual(topologyThemes[theme]);
        expect(result).toHaveProperty('background');
        expect(result).toHaveProperty('iconColor');
      });
    });

    it('should return empty object for invalid theme names', () => {
      const invalidThemes = ['red', 'black', 'invalidTheme', ''] as any[];

      invalidThemes.forEach(theme => {
        const result = getCustomNodeThemeColors(theme);
        expect(result).toEqual({});
      });
    });

    it('should handle edge cases properly', () => {
      // Test with empty string
      expect(getCustomNodeThemeColors('' as any)).toEqual({});

      // Test with numeric value
      expect(getCustomNodeThemeColors(123 as any)).toEqual({});

      // Test with boolean
      expect(getCustomNodeThemeColors(true as any)).toEqual({});

      // Test with object
      expect(getCustomNodeThemeColors({} as any)).toEqual({});
    });
  });

  describe('getCustomThemeProps', () => {
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

    it('should return empty object for entity without topology customization', () => {
      const entity = createMockEntity();
      const result = getCustomThemeProps(entity);
      expect(result).toEqual({});
    });

    it('should return empty object for entity with empty topology customization', () => {
      const entity = createMockEntity({});
      const result = getCustomThemeProps(entity);
      expect(result).toEqual({});
    });

    it('should return empty object for entity with null topology customization', () => {
      const entity = createMockEntity(null);
      const result = getCustomThemeProps(entity);
      expect(result).toEqual({});
    });

    it('should return empty object for entity with non-object topology customization', () => {
      const entity = createMockEntity('invalid');
      const result = getCustomThemeProps(entity);
      expect(result).toEqual({});
    });

    describe('Custom colors priority (highest priority)', () => {
      it('should return custom colors when both background and iconColor are provided', () => {
        const customColors = {
          background: 'hsla(100, 50%, 50%, 1)',
          iconColor: 'hsla(200, 75%, 40%, 1)',
        };

        const entity = createMockEntity({
          theme: {
            colors: customColors,
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual(customColors);
      });

      it('should prioritize custom colors over predefined theme', () => {
        const customColors = {
          background: 'hsla(100, 50%, 50%, 1)',
          iconColor: 'hsla(200, 75%, 40%, 1)',
        };

        const entity = createMockEntity({
          theme: {
            name: 'blue',
            colors: customColors,
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual(customColors);
        expect(result).not.toEqual(topologyThemes.blue);
      });
    });

    describe('Mixed theme and custom colors (medium priority)', () => {
      it('should combine predefined theme with custom background color', () => {
        const customBackground = 'hsla(100, 50%, 50%, 1)';

        const entity = createMockEntity({
          theme: {
            name: 'blue',
            colors: {
              background: customBackground,
            },
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({
          background: customBackground,
          iconColor: topologyThemes.blue.iconColor,
        });
      });

      it('should combine predefined theme with custom icon color', () => {
        const customIconColor = 'hsla(200, 75%, 40%, 1)';

        const entity = createMockEntity({
          theme: {
            name: 'green',
            colors: {
              iconColor: customIconColor,
            },
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({
          background: topologyThemes.green.background,
          iconColor: customIconColor,
        });
      });

      it('should handle invalid theme name with custom colors', () => {
        const entity = createMockEntity({
          theme: {
            name: 'invalidTheme',
            colors: {
              background: 'hsla(100, 50%, 50%, 1)',
            },
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });
    });

    describe('Predefined themes (lower priority)', () => {
      it('should return predefined theme colors for valid theme names', () => {
        const validThemes: TopologyThemes[] = [
          'blue',
          'green',
          'navy',
          'orange',
          'pastelGreen',
          'pink',
          'purple',
          'yellow',
        ];

        validThemes.forEach(themeName => {
          const entity = createMockEntity({
            theme: {
              name: themeName,
            },
          });

          const result = getCustomThemeProps(entity);
          expect(result).toEqual(topologyThemes[themeName]);
        });
      });

      it('should return empty object for invalid theme names', () => {
        const invalidThemes = ['red', 'black', 'invalidTheme', ''];

        invalidThemes.forEach(themeName => {
          const entity = createMockEntity({
            theme: {
              name: themeName,
            },
          });

          const result = getCustomThemeProps(entity);
          expect(result).toEqual({});
        });
      });
    });

    describe('Edge cases and error handling', () => {
      it('should handle entity with undefined metadata', () => {
        const entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: undefined,
        } as any;

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });

      it('should handle entity with null metadata', () => {
        const entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: null,
        } as any;

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });

      it('should handle theme object with missing properties', () => {
        const entity = createMockEntity({
          theme: {},
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });

      it('should handle theme with null name', () => {
        const entity = createMockEntity({
          theme: {
            name: null,
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });

      it('should handle theme with null colors', () => {
        const entity = createMockEntity({
          theme: {
            name: 'blue',
            colors: null,
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual(topologyThemes.blue);
      });

      it('should handle partial custom colors (only background)', () => {
        const entity = createMockEntity({
          theme: {
            colors: {
              background: 'hsla(100, 50%, 50%, 1)',
            },
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });

      it('should handle partial custom colors (only iconColor)', () => {
        const entity = createMockEntity({
          theme: {
            colors: {
              iconColor: 'hsla(200, 75%, 40%, 1)',
            },
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({});
      });
    });

    describe('Integration scenarios', () => {
      it('should work with complex entity structure', () => {
        const entity: Entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'complex-service',
            namespace: 'production',
            labels: {
              'app.kubernetes.io/name': 'complex-service',
            },
            annotations: {
              'backstage.io/source-location':
                'url:https://github.com/example/repo',
            },
            'tibco.developer.hub/topology': {
              theme: {
                name: 'purple',
                colors: {
                  background: 'hsla(120, 60%, 70%, 1)',
                },
              },
            },
          },
          spec: {
            type: 'service',
            lifecycle: 'production',
            owner: 'team-a',
          },
        };

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({
          background: 'hsla(120, 60%, 70%, 1)',
          iconColor: topologyThemes.purple.iconColor,
        });
      });

      it('should handle entities with multiple metadata properties', () => {
        const entity = createMockEntity({
          theme: {
            name: 'orange',
          },
          otherProperty: 'someValue',
        });

        // Add additional metadata
        entity.metadata!['some-other-annotation'] = 'value';
        entity.metadata!.labels = { environment: 'prod' };

        const result = getCustomThemeProps(entity);
        expect(result).toEqual(topologyThemes.orange);
      });

      it('should validate color format expectations', () => {
        const entity = createMockEntity({
          theme: {
            colors: {
              background: 'hsla(0, 0%, 100%, 1)',
              iconColor: 'hsla(0, 0%, 0%, 1)',
            },
          },
        });

        const result = getCustomThemeProps(entity);
        expect(result).toHaveProperty('background');
        expect(result).toHaveProperty('iconColor');
        expect((result as any).background).toMatch(
          /^hsla\(\d+,\s*\d+%,\s*\d+%,\s*[\d.]+\)$/,
        );
        expect((result as any).iconColor).toMatch(
          /^hsla\(\d+,\s*\d+%,\s*\d+%,\s*[\d.]+\)$/,
        );
      });
    });

    describe('Performance and type safety', () => {
      it('should handle large number of entities efficiently', () => {
        const entities = Array.from({ length: 1000 }, (_, i) =>
          createMockEntity({
            theme: {
              name: i % 2 === 0 ? 'blue' : 'green',
            },
          }),
        );

        const startTime = performance.now();
        entities.forEach(entity => getCustomThemeProps(entity));
        const endTime = performance.now();

        // Should complete within reasonable time (1 second for 1000 entities)
        expect(endTime - startTime).toBeLessThan(1000);
      });

      it('should return consistent results for identical inputs', () => {
        const entity = createMockEntity({
          theme: {
            name: 'blue',
            colors: {
              background: 'hsla(100, 50%, 50%, 1)',
            },
          },
        });

        const result1 = getCustomThemeProps(entity);
        const result2 = getCustomThemeProps(entity);
        const result3 = getCustomThemeProps(entity);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
      });

      it('should not mutate input entity', () => {
        const originalEntity = createMockEntity({
          theme: {
            name: 'blue',
          },
        });

        const entityCopy = JSON.parse(JSON.stringify(originalEntity));
        getCustomThemeProps(originalEntity);

        expect(originalEntity).toEqual(entityCopy);
      });
    });

    describe('Real-world usage patterns', () => {
      it('should handle typical Backstage entity with minimal topology config', () => {
        const entity: Entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'user-service',
            'tibco.developer.hub/topology': {
              theme: {
                name: 'blue',
              },
            },
          },
          spec: {
            type: 'service',
          },
        };

        const result = getCustomThemeProps(entity);
        expect(result).toEqual(topologyThemes.blue);
      });

      it('should handle API entity with custom branding', () => {
        const entity: Entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'API',
          metadata: {
            name: 'payments-api',
            'tibco.developer.hub/topology': {
              theme: {
                colors: {
                  background: 'hsla(45, 100%, 90%, 1)',
                  iconColor: 'hsla(45, 100%, 30%, 1)',
                },
              },
            },
          },
          spec: {
            type: 'openapi',
          },
        };

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({
          background: 'hsla(45, 100%, 90%, 1)',
          iconColor: 'hsla(45, 100%, 30%, 1)',
        });
      });

      it('should handle Resource entity with theme inheritance', () => {
        const entity: Entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Resource',
          metadata: {
            name: 'user-database',
            'tibco.developer.hub/topology': {
              theme: {
                name: 'green',
                colors: {
                  iconColor: 'hsla(140, 80%, 35%, 1)',
                },
              },
            },
          },
          spec: {
            type: 'database',
          },
        };

        const result = getCustomThemeProps(entity);
        expect(result).toEqual({
          background: topologyThemes.green.background,
          iconColor: 'hsla(140, 80%, 35%, 1)',
        });
      });
    });
  });

  describe('Type definitions', () => {
    it('should have correct TopologyThemes type', () => {
      const validThemes: TopologyThemes[] = [
        'blue',
        'green',
        'navy',
        'orange',
        'pastelGreen',
        'pink',
        'purple',
        'yellow',
      ];

      // This test ensures TypeScript compilation succeeds with correct types
      validThemes.forEach(theme => {
        expect(typeof theme).toBe('string');
        expect(topologyThemes[theme]).toBeDefined();
      });
    });

    it('should have correct CustomThemeProps type structure', () => {
      const validProps: CustomThemeProps = {
        background: 'hsla(0, 0%, 100%, 1)',
        iconColor: 'hsla(0, 0%, 0%, 1)',
      };

      const minimalProps: CustomThemeProps = {};

      const partialProps: CustomThemeProps = {
        background: 'hsla(0, 0%, 100%, 1)',
      };

      // These should all be valid CustomThemeProps
      expect(validProps).toBeDefined();
      expect(minimalProps).toBeDefined();
      expect(partialProps).toBeDefined();
    });
  });
});
