/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen } from '@testing-library/react';
import { TopologyGraph } from './TopologyGraph';
import { EntityRelationsGraphProps } from '@backstage/plugin-catalog-graph';

// Mock ResizeObserver for D3/SVG components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the EntityRelationsGraph component from Backstage
jest.mock('@backstage/plugin-catalog-graph', () => ({
  EntityRelationsGraph: jest.fn(
    ({ className, renderNode, renderLabel, ...props }) => (
      <div
        data-testid="entity-relations-graph"
        className={className}
        data-render-node={renderNode ? 'custom-node' : 'default'}
        data-render-label={renderLabel ? 'custom-label' : 'default'}
        data-props={JSON.stringify(props)}
      >
        EntityRelationsGraph Mock
      </div>
    ),
  ),
  Direction: {
    LEFT_RIGHT: 'LR',
    RIGHT_LEFT: 'RL',
    TOP_BOTTOM: 'TB',
    BOTTOM_TOP: 'BT',
  },
}));

// Mock the custom components
jest.mock('../CustomEntityNode/CustomEntityNode', () => ({
  CustomEntityNode: jest.fn(() => (
    <div data-testid="custom-entity-node">CustomEntityNode</div>
  )),
}));

jest.mock('../CustomEntityLabel/CustomEntityLabel', () => ({
  CustomEntityLabel: jest.fn(() => (
    <div data-testid="custom-entity-label">CustomEntityLabel</div>
  )),
}));

// Mock Material-UI makeStyles
jest.mock('@material-ui/core', () => ({
  makeStyles: jest.fn(() => () => ({
    graph: 'mocked-graph-class',
  })),
}));

// Get the mocked Direction from the mocked module
const { Direction } = require('@backstage/plugin-catalog-graph');

describe('TopologyGraph', () => {
  // Sample test data
  const defaultProps: EntityRelationsGraphProps = {
    rootEntityNames: [
      { kind: 'Component', namespace: 'default', name: 'test-component' },
    ],
    maxDepth: 2,
    unidirectional: false,
    mergeRelations: true,
    kinds: ['Component', 'API', 'Resource'],
    relations: ['dependsOn', 'providesApi', 'consumesApi'],
    direction: Direction.LEFT_RIGHT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<TopologyGraph {...defaultProps} />);

      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
    });

    it('renders with minimal props', () => {
      const minimalProps: EntityRelationsGraphProps = {
        rootEntityNames: [
          { kind: 'Component', namespace: 'default', name: 'test' },
        ],
      };

      render(<TopologyGraph {...minimalProps} />);

      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
    });

    it('applies custom CSS class to EntityRelationsGraph', () => {
      render(<TopologyGraph {...defaultProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      expect(graphElement).toHaveClass('mocked-graph-class');
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all props to EntityRelationsGraph', () => {
      const customProps: EntityRelationsGraphProps = {
        ...defaultProps,
        maxDepth: 5,
        unidirectional: true,
        mergeRelations: false,
        curve: 'curveMonotoneX',
        direction: Direction.TOP_BOTTOM,
      };

      render(<TopologyGraph {...customProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      const propsData = JSON.parse(
        graphElement.getAttribute('data-props') || '{}',
      );

      expect(propsData.maxDepth).toBe(5);
      expect(propsData.unidirectional).toBe(true);
      expect(propsData.mergeRelations).toBe(false);
      expect(propsData.curve).toBe('curveMonotoneX');
      expect(propsData.direction).toBe(Direction.TOP_BOTTOM);
    });

    it('forwards rootEntityNames correctly', () => {
      const multipleEntities: EntityRelationsGraphProps = {
        rootEntityNames: [
          { kind: 'Component', namespace: 'default', name: 'service-a' },
          { kind: 'Component', namespace: 'default', name: 'service-b' },
          { kind: 'API', namespace: 'default', name: 'api-v1' },
        ],
      };

      render(<TopologyGraph {...multipleEntities} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      const propsData = JSON.parse(
        graphElement.getAttribute('data-props') || '{}',
      );

      expect(propsData.rootEntityNames).toHaveLength(3);
      expect(propsData.rootEntityNames).toEqual(
        multipleEntities.rootEntityNames,
      );
    });

    it('forwards filter properties correctly', () => {
      const filterProps: EntityRelationsGraphProps = {
        ...defaultProps,
        kinds: ['Component', 'API'],
        relations: ['dependsOn', 'providesApi'],
      };

      render(<TopologyGraph {...filterProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      const propsData = JSON.parse(
        graphElement.getAttribute('data-props') || '{}',
      );

      expect(propsData.kinds).toEqual(['Component', 'API']);
      expect(propsData.relations).toEqual(['dependsOn', 'providesApi']);
    });
  });

  describe('Custom Renderers', () => {
    it('sets CustomEntityNode as the renderNode prop', () => {
      render(<TopologyGraph {...defaultProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      expect(graphElement).toHaveAttribute('data-render-node', 'custom-node');
    });

    it('sets CustomEntityLabel as the renderLabel prop', () => {
      render(<TopologyGraph {...defaultProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      expect(graphElement).toHaveAttribute('data-render-label', 'custom-label');
    });

    it('overrides any renderNode prop passed from parent', () => {
      const propsWithCustomNode = {
        ...defaultProps,
        renderNode: jest.fn(),
      };

      render(<TopologyGraph {...propsWithCustomNode} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      expect(graphElement).toHaveAttribute('data-render-node', 'custom-node');
    });

    it('overrides any renderLabel prop passed from parent', () => {
      const propsWithCustomLabel = {
        ...defaultProps,
        renderLabel: jest.fn(),
      };

      render(<TopologyGraph {...propsWithCustomLabel} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      expect(graphElement).toHaveAttribute('data-render-label', 'custom-label');
    });
  });

  describe('Integration Tests', () => {
    it('renders with complex entity configuration', () => {
      const complexProps: EntityRelationsGraphProps = {
        rootEntityNames: [
          { kind: 'Component', namespace: 'backend', name: 'user-service' },
          { kind: 'Component', namespace: 'frontend', name: 'web-app' },
        ],
        maxDepth: 3,
        unidirectional: false,
        mergeRelations: true,
        kinds: ['Component', 'API', 'Resource', 'System'],
        relations: ['dependsOn', 'providesApi', 'consumesApi', 'ownedBy'],
        direction: Direction.LEFT_RIGHT,
        curve: 'curveMonotoneX',
        zoom: 'enabled',
      };

      render(<TopologyGraph {...complexProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      expect(graphElement).toBeInTheDocument();
      expect(graphElement).toHaveClass('mocked-graph-class');

      const propsData = JSON.parse(
        graphElement.getAttribute('data-props') || '{}',
      );
      expect(propsData.maxDepth).toBe(3);
      expect(propsData.rootEntityNames).toHaveLength(2);
      expect(propsData.kinds).toHaveLength(4);
      expect(propsData.relations).toHaveLength(4);
    });

    it('handles empty rootEntityNames array', () => {
      const emptyProps: EntityRelationsGraphProps = {
        rootEntityNames: [],
      };

      render(<TopologyGraph {...emptyProps} />);

      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
    });

    it('handles single entity with minimal configuration', () => {
      const singleEntityProps: EntityRelationsGraphProps = {
        rootEntityNames: [
          { kind: 'Component', namespace: 'default', name: 'solo-service' },
        ],
        maxDepth: 1,
      };

      render(<TopologyGraph {...singleEntityProps} />);

      const graphElement = screen.getByTestId('entity-relations-graph');
      const propsData = JSON.parse(
        graphElement.getAttribute('data-props') || '{}',
      );

      expect(propsData.rootEntityNames).toHaveLength(1);
      expect(propsData.maxDepth).toBe(1);
    });

    it('handles different direction configurations', () => {
      const directions = [
        Direction.LEFT_RIGHT,
        Direction.RIGHT_LEFT,
        Direction.TOP_BOTTOM,
        Direction.BOTTOM_TOP,
      ];

      directions.forEach(direction => {
        const { unmount } = render(
          <TopologyGraph {...defaultProps} direction={direction} />,
        );

        const graphElement = screen.getByTestId('entity-relations-graph');
        const propsData = JSON.parse(
          graphElement.getAttribute('data-props') || '{}',
        );
        expect(propsData.direction).toBe(direction);

        unmount();
      });
    });

    it('handles different curve types', () => {
      const curves = ['curveMonotoneX', 'curveStepBefore'] as const;

      curves.forEach(curve => {
        const { unmount } = render(
          <TopologyGraph {...defaultProps} curve={curve} />,
        );

        const graphElement = screen.getByTestId('entity-relations-graph');
        const propsData = JSON.parse(
          graphElement.getAttribute('data-props') || '{}',
        );
        expect(propsData.curve).toBe(curve);

        unmount();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles component unmounting gracefully', () => {
      const { unmount } = render(<TopologyGraph {...defaultProps} />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('renders efficiently with large number of entities', () => {
      const manyEntities: EntityRelationsGraphProps = {
        rootEntityNames: Array.from({ length: 100 }, (_, i) => ({
          kind: 'Component',
          namespace: 'default',
          name: `service-${i}`,
        })),
        maxDepth: 1,
      };

      const startTime = performance.now();
      render(<TopologyGraph {...manyEntities} />);
      const endTime = performance.now();

      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
    });
  });

  describe('Component Interface', () => {
    it('accepts all valid EntityRelationsGraphProps', () => {
      const allProps: EntityRelationsGraphProps = {
        rootEntityNames: [
          { kind: 'Component', namespace: 'default', name: 'test' },
        ],
        maxDepth: 2,
        unidirectional: true,
        mergeRelations: false,
        kinds: ['Component'],
        relations: ['dependsOn'],
        direction: Direction.TOP_BOTTOM,
        curve: 'curveMonotoneX',
        zoom: 'enabled',
        renderNode: jest.fn(),
        renderLabel: jest.fn(),
      };

      expect(() => {
        render(<TopologyGraph {...allProps} />);
      }).not.toThrow();

      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
    });

    it('has correct TypeScript type annotations', () => {
      // This test ensures our component correctly implements the interface
      const validProps: EntityRelationsGraphProps = {
        rootEntityNames: [
          { kind: 'Component', namespace: 'default', name: 'test' },
        ],
      };

      // If this compiles without TypeScript errors, the types are correct
      const component = <TopologyGraph {...validProps} />;
      expect(component).toBeDefined();
    });
  });
});
