/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomEntityLabel } from './CustomEntityLabel';
import { EntityEdgeData } from '@backstage/plugin-catalog-graph';
import { DependencyGraphTypes } from '@backstage/core-components';
import {
  TopologyContext,
  TopologyContextType,
} from '../../context/TopologyContext';
import { Direction } from '@backstage/plugin-catalog-graph';
import { ReactElement } from 'react';

describe('CustomEntityLabel', () => {
  const createMockEdge = (
    relations: string[],
  ): DependencyGraphTypes.RenderLabelProps<EntityEdgeData> => ({
    edge: {
      relations,
    } as EntityEdgeData & { from: string; to: string; label?: string },
  });

  const createMockContextValue = (
    graphDirection: Direction = Direction.LEFT_RIGHT,
  ): TopologyContextType => ({
    display: 'block',
    rootEntity: null,
    detailsEntity: null,
    detailsLocked: false,
    graphDirection,
    toggleDisplay: jest.fn(),
    setDisplay: jest.fn(),
    setRootEntity: jest.fn(),
    setDetailsEntity: jest.fn(),
    setDetailsLocked: jest.fn(),
    setGraphDirection: jest.fn(),
  });

  const renderWithContext = (
    component: ReactElement,
    contextValue?: TopologyContextType,
  ) => {
    const defaultContextValue = createMockContextValue();
    return render(
      <TopologyContext.Provider value={contextValue || defaultContextValue}>
        {component}
      </TopologyContext.Provider>,
    );
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const customLabel = screen.getByTestId('custom-label');

      expect(customLabel).toBeInTheDocument();
      expect(customLabel).toHaveTextContent('ownerOf/component');
    });

    it('should render the correct icon based on relation type', () => {
      const mockEdge = createMockEdge(['dependencyOf/component']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const icon = screen.getByTestId('custom-label').querySelector('use');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('href', 'icon-edge-dependency-of.svg');
    });

    it('should render with correct icon properties', () => {
      const mockEdge = createMockEdge(['consumedBy/api']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const svgGroup = screen.getByTestId('custom-label');
      expect(svgGroup).toBeInTheDocument();
      const consumedByIcon = within(svgGroup).getByTestId(`icon-consumedBy`);
      expect(consumedByIcon).toHaveAttribute('width', '24');
      expect(consumedByIcon).toHaveAttribute('height', '24');
      expect(consumedByIcon).toHaveAttribute('y', '0');
    });

    it('should render tooltip with correct title', () => {
      const relation = 'childOf/component';
      const mockEdge = createMockEdge([relation]);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(relation);
    });

    it('should render tooltip with correct positioning for horizontal direction', () => {
      const mockEdge = createMockEdge(['memberOf/group']);
      const contextValue = createMockContextValue(Direction.LEFT_RIGHT);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('x', '-24');
      expect(tooltip).toHaveAttribute('y', '30');
    });
  });

  describe('TopologyContext Integration', () => {
    it('should render with horizontal transform for LEFT_RIGHT direction', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);
      const contextValue = createMockContextValue(Direction.LEFT_RIGHT);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const customLabel = screen.getByTestId('custom-label');
      expect(customLabel).toHaveAttribute('transform', 'translate(0, -52)');
    });

    it('should render with horizontal transform for RIGHT_LEFT direction', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);
      const contextValue = createMockContextValue(Direction.RIGHT_LEFT);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const customLabel = screen.getByTestId('custom-label');
      expect(customLabel).toHaveAttribute('transform', 'translate(0, -52)');
    });

    it('should render with vertical transform for TOP_BOTTOM direction', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);
      const contextValue = createMockContextValue(Direction.TOP_BOTTOM);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const customLabel = screen.getByTestId('custom-label');
      expect(customLabel).toHaveAttribute('transform', 'translate(-57, -25)');
    });

    it('should render with vertical transform for BOTTOM_TOP direction', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);
      const contextValue = createMockContextValue(Direction.BOTTOM_TOP);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const customLabel = screen.getByTestId('custom-label');
      expect(customLabel).toHaveAttribute('transform', 'translate(-57, -25)');
    });

    it('should position tooltip correctly for vertical graph direction', () => {
      const mockEdge = createMockEdge(['memberOf/group']);
      const contextValue = createMockContextValue(Direction.TOP_BOTTOM);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('x', '-24');
      expect(tooltip).toHaveAttribute('y', '24');
    });

    it('should position tooltip correctly for horizontal graph direction', () => {
      const mockEdge = createMockEdge(['memberOf/group']);
      const contextValue = createMockContextValue(Direction.LEFT_RIGHT);

      renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue);

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('x', '-24');
      expect(tooltip).toHaveAttribute('y', '30');
    });

    it('should handle missing graphDirection gracefully', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);
      const contextValue = createMockContextValue();
      delete contextValue.graphDirection;

      expect(() =>
        renderWithContext(<CustomEntityLabel {...mockEdge} />, contextValue),
      ).not.toThrow();
    });
  });

  describe('Relation Handling', () => {
    it('should handle single relation correctly', () => {
      const mockEdge = createMockEdge(['partOf/system']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      expect(screen.getByTestId('icon-partOf')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip')).toHaveTextContent(
        'partOf/system',
      );
    });

    it('should only render the first relation when multiple relations exist', () => {
      const mockEdge = createMockEdge([
        'ownerOf/component',
        'dependencyOf/api',
        'consumedBy/service',
      ]);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const svgGroup = screen.getByTestId('custom-label');
      expect(svgGroup).toBeInTheDocument();

      // Should only render one icon and tooltip for the first relation
      expect(screen.getByTestId('icon-ownerOf')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip')).toHaveTextContent(
        'ownerOf/component',
      );

      // Should not render icons for other relations
      expect(screen.queryByTestId('icon-dependencyOf')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-consumedBy')).not.toBeInTheDocument();
    });

    it('should extract icon name correctly from relation string', () => {
      const relations = [
        'ownerOf/component',
        'dependencyOf/api',
        'consumedBy/service',
        'childOf/system',
        'memberOf/group',
        'partOf/domain',
      ];

      relations.forEach(relation => {
        const expectedIconName = relation.split('/')[0];
        const mockEdge = createMockEdge([relation]);

        const { unmount } = renderWithContext(
          <CustomEntityLabel {...mockEdge} />,
        );

        const icon = screen.getByTestId(`icon-${expectedIconName}`);
        expect(icon).toBeInTheDocument();
        const use = icon.querySelector('use');
        expect(use).toHaveAttribute(
          'href',
          `icon-edge-${expectedIconName
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()}.svg`,
        );
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty relations array gracefully', () => {
      const mockEdge = createMockEdge([]);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      // Should not render any icons or tooltips
      expect(screen.queryByTestId(/custom-icon-/)).not.toBeInTheDocument();
      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });

    it('should handle relation without slash separator', () => {
      const mockEdge = createMockEdge(['invalidrelation']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      // Should still render with the whole string as icon name
      expect(screen.getByTestId('icon-invalidrelation')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip')).toHaveTextContent(
        'invalidrelation',
      );
    });

    it('should handle relation with multiple slashes', () => {
      const mockEdge = createMockEdge(['complex/relation/type/component']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      // Should use only the first part before the first slash
      const icon = screen.getByTestId('icon-complex');
      expect(icon).toBeInTheDocument();
      // not custom icon provided for relation so href will be empty
      expect(icon.querySelector('use')).toHaveAttribute('href', '');
      expect(screen.getByTestId('custom-tooltip')).toHaveTextContent(
        'complex/relation/type/component',
      );
    });
  });

  describe('Props Validation', () => {
    it('should handle edge prop with correct structure', () => {
      const mockEdge: DependencyGraphTypes.RenderLabelProps<EntityEdgeData> = {
        edge: {
          relations: ['ownerOf/component'],
        } as EntityEdgeData & { from: string; to: string; label?: string },
      };

      expect(() =>
        renderWithContext(<CustomEntityLabel {...mockEdge} />),
      ).not.toThrow();
    });

    it('should generate unique IDs for icons', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const icon = screen.getByTestId('icon-ownerOf');
      expect(icon).toHaveAttribute('id', 'ownerOf/component-0-image');
    });
  });

  describe('Accessibility', () => {
    it('should provide accessible content through icon titles', () => {
      const mockEdge = createMockEdge(['ownerOf/component']);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      const tooltip = screen.getByRole('tooltip', {
        name: '',
        hidden: true,
      });
      expect(tooltip).toHaveTextContent('ownerOf/component');
    });

    it('should provide tooltip information for screen readers', () => {
      const relation = 'dependencyOf/api';
      const mockEdge = createMockEdge([relation]);

      renderWithContext(<CustomEntityLabel {...mockEdge} />);

      expect(screen.getByText(relation)).toBeInTheDocument();
    });
  });

  describe('CustomEntityLabel Integration Tests', () => {
    const renderComponent = (relations: string[]) => {
      const mockProps = {
        edge: {
          relations,
        } as any, // Using any to avoid complex type issues in simple tests
      };

      return renderWithContext(<CustomEntityLabel {...mockProps} />);
    };

    it('should render without crashing with valid relation', () => {
      expect(() => renderComponent(['ownerOf/component'])).not.toThrow();
    });

    it('should render without crashing with empty relations', () => {
      expect(() => renderComponent([])).not.toThrow();
    });

    it('should render without crashing with multiple relations', () => {
      expect(() =>
        renderComponent(['ownerOf/component', 'dependencyOf/api']),
      ).not.toThrow();
    });

    it('should render SVG elements correctly', () => {
      const { container } = renderComponent(['ownerOf/component']);

      // Should render a main group element
      const gElement = container.querySelector('g');
      expect(gElement).toBeInTheDocument();
    });

    it('should handle various relation types', () => {
      const relationTypes = [
        'ownerOf/component',
        'dependencyOf/api',
        'consumedBy/service',
        'childOf/system',
        'memberOf/group',
        'partOf/domain',
      ];

      relationTypes.forEach(relationType => {
        expect(() => renderComponent([relationType])).not.toThrow();
      });
    });

    it('should handle malformed relations gracefully', () => {
      const malformedRelations = [
        'invalidrelation',
        'relation/',
        '/component',
        'relation/type/extra/parts',
        '',
      ];

      malformedRelations.forEach(relation => {
        expect(() => renderComponent([relation])).not.toThrow();
      });
    });
  });
});
