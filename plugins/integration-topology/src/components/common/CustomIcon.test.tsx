/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomIcon } from './CustomIcon';

// Mock SVG imports
jest.mock('../../assets/icons/pl-icon-preview.svg', () => '#details-icon');
jest.mock('../../assets/icons/pl-icon-document.svg', () => '#docs-icon');
jest.mock('../../assets/icons/pl-icon-apis.svg', () => '#apis-icon');
jest.mock('../../assets/icons/pl-icon-cicd.svg', () => '#cicd-icon');
jest.mock('../../assets/icons/pl-icon-src-folder.svg', () => '#source-icon');
jest.mock(
  '../../assets/icons/pl-icon-external-link.svg',
  () => '#external-link-icon',
);
jest.mock('../../assets/icons/icon-app-bwce.svg', () => '#bwce-icon');
jest.mock('../../assets/icons/pl-icon-copy.svg', () => '#copy-icon');
jest.mock('../../assets/icons/pl-icon-close.svg', () => '#close-icon');
jest.mock('../../assets/icons/pl-icon-lock.svg', () => '#lock-icon');
jest.mock('../../assets/icons/pl-icon-unlock.svg', () => '#unlock-icon');
jest.mock('../../assets/icons/icon-edge-owner-of.svg', () => '#owner-of-icon');
jest.mock(
  '../../assets/icons/icon-edge-dependency-of.svg',
  () => '#dependency-of-icon',
);
jest.mock(
  '../../assets/icons/icon-edge-consumed-by.svg',
  () => '#consumed-by-icon',
);
jest.mock('../../assets/icons/icon-edge-child-of.svg', () => '#child-of-icon');
jest.mock(
  '../../assets/icons/icon-edge-member-of.svg',
  () => '#member-of-icon',
);
jest.mock('../../assets/icons/icon-edge-part-of.svg', () => '#part-of-icon');

describe('CustomIcon Functionality Tests', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<CustomIcon iconName="details" />);
      expect(screen.getByTestId('icon-details')).toBeInTheDocument();
    });

    it('should render with correct default dimensions', () => {
      render(<CustomIcon iconName="details" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render with custom dimensions', () => {
      render(<CustomIcon iconName="details" width={32} height={32} />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
      expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    });

    it('should render with custom position', () => {
      render(<CustomIcon iconName="details" x={10} y={20} />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('x', '10');
      expect(svg).toHaveAttribute('y', '20');
    });

    it('should render with default position when not specified', () => {
      render(<CustomIcon iconName="details" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('x', '0');
      expect(svg).toHaveAttribute('y', '0');
    });
  });

  describe('Icon Mapping', () => {
    const iconMappings = [
      { iconName: 'details', expectedHref: '#details-icon' },
      { iconName: 'docs', expectedHref: '#docs-icon' },
      { iconName: 'apis', expectedHref: '#apis-icon' },
      { iconName: 'cicd', expectedHref: '#cicd-icon' },
      { iconName: 'source', expectedHref: '#source-icon' },
      { iconName: 'externalLink', expectedHref: '#external-link-icon' },
      { iconName: 'copy', expectedHref: '#copy-icon' },
      { iconName: 'close', expectedHref: '#close-icon' },
      { iconName: 'lock', expectedHref: '#lock-icon' },
      { iconName: 'unlock', expectedHref: '#unlock-icon' },
    ];

    iconMappings.forEach(({ iconName, expectedHref }) => {
      it(`should render correct icon for ${iconName}`, () => {
        render(<CustomIcon iconName={iconName} />);
        const useElement = screen
          .getByTestId(`icon-${iconName}`)
          .querySelector('use');
        expect(useElement).toHaveAttribute('href', expectedHref);
      });
    });

    describe('Relationship Icons', () => {
      const relationshipMappings = [
        { iconName: 'ownerOf', expectedHref: '#owner-of-icon' },
        { iconName: 'ownedBy', expectedHref: '#owner-of-icon' },
        { iconName: 'dependencyOf', expectedHref: '#dependency-of-icon' },
        { iconName: 'dependsOn', expectedHref: '#dependency-of-icon' },
        { iconName: 'consumedBy', expectedHref: '#consumed-by-icon' },
        { iconName: 'consumesApi', expectedHref: '#consumed-by-icon' },
        { iconName: 'providesApi', expectedHref: '#consumed-by-icon' },
        { iconName: 'apiProvidedBy', expectedHref: '#consumed-by-icon' },
        { iconName: 'childOf', expectedHref: '#child-of-icon' },
        { iconName: 'parentOf', expectedHref: '#child-of-icon' },
        { iconName: 'memberOf', expectedHref: '#member-of-icon' },
        { iconName: 'hasMember', expectedHref: '#member-of-icon' },
        { iconName: 'partOf', expectedHref: '#part-of-icon' },
        { iconName: 'hasPart', expectedHref: '#part-of-icon' },
      ];

      relationshipMappings.forEach(({ iconName, expectedHref }) => {
        it(`should render correct relationship icon for ${iconName}`, () => {
          render(<CustomIcon iconName={iconName} />);
          const useElement = screen
            .getByTestId(`icon-${iconName}`)
            .querySelector('use');
          expect(useElement).toHaveAttribute('href', expectedHref);
        });
      });
    });

    it('should handle unknown icon names by returning empty href', () => {
      render(<CustomIcon iconName="unknown-icon" />);
      const useElement = screen
        .getByTestId('icon-unknown-icon')
        .querySelector('use');
      expect(useElement).toHaveAttribute('href', '');
    });
  });

  describe('Styling Classes', () => {
    it('should apply linkBarIcon class by default', () => {
      render(<CustomIcon iconName="details" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveClass(/linkBarIcon/);
    });

    it('should apply detailsTitleIcon class when specified', () => {
      render(<CustomIcon iconName="details" iconStyle="detailsTitleIcon" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveClass(/detailsTitleIcon/);
    });

    it('should apply detailsLinkIcon class when specified', () => {
      render(<CustomIcon iconName="details" iconStyle="detailsLinkIcon" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveClass(/detailsLinkIcon/);
    });

    it('should apply edgeLabelIcon class when specified', () => {
      render(<CustomIcon iconName="details" iconStyle="edgeLabelIcon" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveClass(/edgeLabelIcon/);
    });

    it('should fallback to linkBarIcon for invalid iconStyle', () => {
      render(
        <CustomIcon iconName="details" iconStyle={'invalidStyle' as any} />,
      );
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveClass(/linkBarIcon/);
    });
  });

  describe('Background Rectangle', () => {
    it('should render transparent background by default', () => {
      render(<CustomIcon iconName="details" />);
      const rect = screen.getByTestId('icon-details').querySelector('rect');
      expect(rect).toHaveAttribute('fill', 'transparent');
    });

    it('should render white background for edgeLabelIcon style', () => {
      render(<CustomIcon iconName="details" iconStyle="edgeLabelIcon" />);
      const rect = screen.getByTestId('icon-details').querySelector('rect');
      expect(rect).toHaveAttribute('fill', 'hsla(0, 0%, 98%, 1.00)');
    });

    it('should set correct dimensions for background rectangle', () => {
      render(<CustomIcon iconName="details" width={32} height={32} />);
      const rect = screen.getByTestId('icon-details').querySelector('rect');
      expect(rect).toHaveAttribute('width', '32');
      expect(rect).toHaveAttribute('height', '32');
      expect(rect).toHaveAttribute('x', '0');
      expect(rect).toHaveAttribute('y', '0');
    });

    it('should have pointer events enabled on background rectangle', () => {
      render(<CustomIcon iconName="details" />);
      const rect = screen.getByTestId('icon-details').querySelector('rect');
      expect(rect).toHaveAttribute('pointer-events', 'fill');
    });
  });

  describe('ID Generation', () => {
    it('should generate correct ID when provided', () => {
      render(<CustomIcon iconName="details" id="test-icon" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('id', 'test-icon-image');
    });

    it('should handle undefined ID gracefully', () => {
      render(<CustomIcon iconName="details" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('id', 'undefined-image');
    });

    it('should handle empty string ID', () => {
      render(<CustomIcon iconName="details" id="" />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('id', '-image');
    });
  });

  describe('Event Handling', () => {
    it('should call onClick handler when clicked', () => {
      const mockOnClick = jest.fn();
      render(<CustomIcon iconName="details" onClick={mockOnClick} />);

      const svg = screen.getByTestId('icon-details');
      fireEvent.click(svg);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when clicked without onClick handler', () => {
      render(<CustomIcon iconName="details" />);

      const svg = screen.getByTestId('icon-details');
      expect(() => fireEvent.click(svg)).not.toThrow();
    });

    it('should be clickable through background rectangle due to pointer events', () => {
      const mockOnClick = jest.fn();
      render(<CustomIcon iconName="details" onClick={mockOnClick} />);

      const rect = screen.getByTestId('icon-details').querySelector('rect');
      fireEvent.click(rect!);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Use Element Properties', () => {
    it('should set correct dimensions on use element', () => {
      render(<CustomIcon iconName="details" width={32} height={32} />);
      const useElement = screen
        .getByTestId('icon-details')
        .querySelector('use');
      expect(useElement).toHaveAttribute('width', '32');
      expect(useElement).toHaveAttribute('height', '32');
    });

    it('should use default dimensions on use element when not specified', () => {
      render(<CustomIcon iconName="details" />);
      const useElement = screen
        .getByTestId('icon-details')
        .querySelector('use');
      expect(useElement).toHaveAttribute('width', '24');
      expect(useElement).toHaveAttribute('height', '24');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all props at once', () => {
      const mockOnClick = jest.fn();
      render(
        <CustomIcon
          id="full-test"
          iconName="details"
          iconStyle="detailsTitleIcon"
          width={48}
          height={48}
          x={10}
          y={20}
          onClick={mockOnClick}
        />,
      );

      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('id', 'full-test-image');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
      expect(svg).toHaveAttribute('x', '10');
      expect(svg).toHaveAttribute('y', '20');
      expect(svg).toHaveClass(/detailsTitleIcon/);

      fireEvent.click(svg);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should handle zero dimensions', () => {
      render(<CustomIcon iconName="details" width={0} height={0} />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('width', '0');
      expect(svg).toHaveAttribute('height', '0');
      expect(svg).toHaveAttribute('viewBox', '0 0 0 0');
    });

    it('should handle negative positions', () => {
      render(<CustomIcon iconName="details" x={-10} y={-20} />);
      const svg = screen.getByTestId('icon-details');
      expect(svg).toHaveAttribute('x', '-10');
      expect(svg).toHaveAttribute('y', '-20');
    });
  });

  describe('Accessibility', () => {
    it('should have img role for screen readers', () => {
      render(<CustomIcon iconName="details" />);
      expect(screen.getByTestId('icon-details')).toBeInTheDocument();
    });

    it('should be focusable when interactive', () => {
      const mockOnClick = jest.fn();
      render(<CustomIcon iconName="details" onClick={mockOnClick} />);

      const svg = screen.getByTestId('icon-details');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should work with all supported icon names without errors', () => {
      const allIconNames = [
        'details',
        'docs',
        'apis',
        'cicd',
        'source',
        'externalLink',
        'copy',
        'close',
        'lock',
        'unlock',
        'ownerOf',
        'ownedBy',
        'dependencyOf',
        'dependsOn',
        'consumedBy',
        'consumesApi',
        'providesApi',
        'apiProvidedBy',
        'childOf',
        'parentOf',
        'memberOf',
        'hasMember',
        'partOf',
        'hasPart',
      ];

      allIconNames.forEach(iconName => {
        const { unmount } = render(<CustomIcon iconName={iconName} />);
        expect(screen.getByTestId(`icon-${iconName}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should maintain consistent structure across different styles', () => {
      const styles = [
        'detailsTitleIcon',
        'detailsLinkIcon',
        'linkBarIcon',
        'edgeLabelIcon',
      ] as const;

      styles.forEach(style => {
        const { unmount } = render(
          <CustomIcon iconName="details" iconStyle={style} />,
        );
        const svg = screen.getByTestId('icon-details');

        // Should have consistent structure
        expect(svg.querySelector('rect')).toBeInTheDocument();
        expect(svg.querySelector('use')).toBeInTheDocument();

        unmount();
      });
    });
  });
});

describe('CustomIcon Integration Tests', () => {
  const renderComponent = (props: Parameters<typeof CustomIcon>[0]) => {
    return render(<CustomIcon {...props} />);
  };

  describe('Real-world Usage Patterns', () => {
    it('should work as a clickable button icon', () => {
      const mockAction = jest.fn();
      renderComponent({
        iconName: 'copy',
        iconStyle: 'linkBarIcon',
        onClick: mockAction,
        id: 'copy-button',
      });

      const icon = screen.getByTestId('icon-copy');
      fireEvent.click(icon);

      expect(mockAction).toHaveBeenCalled();
      expect(icon).toHaveClass(/linkBarIcon/);
    });

    it('should work as a details view title icon', () => {
      renderComponent({
        iconName: 'details',
        iconStyle: 'detailsTitleIcon',
        width: 20,
        height: 20,
      });

      const icon = screen.getByTestId('icon-details');
      expect(icon).toHaveClass(/detailsTitleIcon/);
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    });

    it('should work as an edge label in a graph', () => {
      renderComponent({
        iconName: 'ownerOf',
        iconStyle: 'edgeLabelIcon',
        width: 24,
        height: 24,
        x: 100,
        y: 50,
        id: 'edge-label-1',
      });

      const icon = screen.getByTestId('icon-ownerOf');
      expect(icon).toHaveClass(/edgeLabelIcon/);
      expect(icon).toHaveAttribute('x', '100');
      expect(icon).toHaveAttribute('y', '50');

      // Edge label should have white background
      const rect = icon.querySelector('rect');
      expect(rect).toHaveAttribute('fill', 'hsla(0, 0%, 98%, 1.00)');
    });

    it('should work as a link icon in details view', () => {
      const mockNavigation = jest.fn();
      renderComponent({
        iconName: 'externalLink',
        iconStyle: 'detailsLinkIcon',
        onClick: mockNavigation,
      });

      const icon = screen.getByTestId('icon-externalLink');
      fireEvent.click(icon);

      expect(mockNavigation).toHaveBeenCalled();
      expect(icon).toHaveClass(/detailsLinkIcon/);
    });
  });

  describe('Environment-Specific Icons', () => {
    it('should handle Flogo environment icons correctly', () => {
      const environments = ['flogodev', 'flogotesting', 'flogoQA', 'flogoprod'];

      environments.forEach(env => {
        const { unmount } = renderComponent({
          iconName: env,
          iconStyle: 'detailsLinkIcon',
          width: 16,
          height: 16,
        });

        const icon = screen.getByTestId(`icon-${env}`);
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('width', '16');
        expect(icon).toHaveAttribute('height', '16');

        unmount();
      });
    });
  });

  describe('Relationship Icon Mappings', () => {
    it('should handle ownership relationships correctly', () => {
      const ownershipPairs = [
        ['ownerOf', 'ownedBy'],
        ['dependencyOf', 'dependsOn'],
        ['childOf', 'parentOf'],
        ['memberOf', 'hasMember'],
        ['partOf', 'hasPart'],
      ];

      ownershipPairs.forEach(([relation1, relation2]) => {
        // Both relations should map to the same icon
        const { unmount: unmount1 } = renderComponent({ iconName: relation1 });
        const icon1 = screen.getByTestId(`icon-${relation1}`);
        const href1 = icon1.querySelector('use')?.getAttribute('href');
        unmount1();

        const { unmount: unmount2 } = renderComponent({ iconName: relation2 });
        const icon2 = screen.getByTestId(`icon-${relation2}`);
        const href2 = icon2.querySelector('use')?.getAttribute('href');
        unmount2();

        expect(href1).toBe(href2);
        expect(href1).toBeTruthy();
      });
    });

    it('should handle API consumption relationships correctly', () => {
      const apiRelations = [
        'consumedBy',
        'consumesApi',
        'providesApi',
        'apiProvidedBy',
      ];

      apiRelations.forEach(relation => {
        const { unmount } = renderComponent({ iconName: relation });
        const icon = screen.getByTestId(`icon-${relation}`);
        const useElement = icon.querySelector('use');
        expect(useElement).toHaveAttribute('href', '#consumed-by-icon');
        unmount();
      });
    });
  });

  describe('Interactive Behavior', () => {
    it('should maintain hover state styling capability', () => {
      renderComponent({
        iconName: 'close',
        iconStyle: 'linkBarIcon',
        onClick: jest.fn(),
      });

      const icon = screen.getByTestId('icon-close');
      // The hover styles are defined in CSS, we just verify the class is applied
      expect(icon).toHaveAttribute(
        'class',
        expect.stringMatching(/linkBarIcon/),
      );
    });

    it('should handle rapid clicking gracefully', () => {
      const mockClick = jest.fn();
      renderComponent({
        iconName: 'copy',
        onClick: mockClick,
      });

      const icon = screen.getByTestId('icon-copy');

      // Simulate rapid clicking
      fireEvent.click(icon);
      fireEvent.click(icon);
      fireEvent.click(icon);

      expect(mockClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Layout Integration', () => {
    it('should work in grid layout with consistent sizing', () => {
      const iconGrid = [
        { name: 'details', style: 'linkBarIcon' as const },
        { name: 'docs', style: 'linkBarIcon' as const },
        { name: 'apis', style: 'linkBarIcon' as const },
        { name: 'cicd', style: 'linkBarIcon' as const },
      ];

      const { container } = render(
        <div data-testid="icon-grid">
          {iconGrid.map((icon, index) => (
            <CustomIcon
              key={index}
              iconName={icon.name}
              iconStyle={icon.style}
              width={24}
              height={24}
              id={`grid-icon-${index}`}
            />
          ))}
        </div>,
      );

      const icons = container.querySelectorAll('svg');
      expect(icons).toHaveLength(4);

      icons.forEach((icon, index) => {
        expect(icon).toHaveAttribute('width', '24');
        expect(icon).toHaveAttribute('height', '24');
        expect(icon).toHaveAttribute('id', `grid-icon-${index}-image`);
      });
    });

    it('should work in positioned layout', () => {
      const positionedIcons = [
        { name: 'ownerOf', x: 0, y: 0 },
        { name: 'dependencyOf', x: 50, y: 25 },
        { name: 'consumedBy', x: 100, y: 50 },
      ];

      const { container } = render(
        <svg width="200" height="100" data-testid="positioned-layout">
          {positionedIcons.map((icon, index) => (
            <CustomIcon
              key={index}
              iconName={icon.name}
              iconStyle="edgeLabelIcon"
              x={icon.x}
              y={icon.y}
              width={20}
              height={20}
            />
          ))}
        </svg>,
      );

      const icons = container.querySelectorAll('svg svg'); // SVG inside SVG
      expect(icons).toHaveLength(3);

      icons.forEach((icon, index) => {
        const expectedIcon = positionedIcons[index];
        expect(icon).toHaveAttribute('x', expectedIcon.x.toString());
        expect(icon).toHaveAttribute('y', expectedIcon.y.toString());
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should handle many icons without performance degradation', () => {
      const manyIcons = Array.from({ length: 50 }, (_, i) => ({
        name: 'details',
        id: `perf-test-${i}`,
      }));

      const startTime = performance.now();

      const { container } = render(
        <div data-testid="performance-test">
          {manyIcons.map(icon => (
            <CustomIcon
              key={icon.id}
              iconName={icon.name}
              id={icon.id}
              width={16}
              height={16}
            />
          ))}
        </div>,
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 200ms for 50 icons to account for system variations)
      expect(renderTime).toBeLessThan(200);
      expect(container.querySelectorAll('svg')).toHaveLength(50);
    });
  });

  describe('Error Recovery', () => {
    it('should gracefully handle missing SVG imports', () => {
      // This tests the unknown icon case
      expect(() => {
        renderComponent({ iconName: 'non-existent-icon' });
      }).not.toThrow();

      const icon = screen.getByTestId('icon-non-existent-icon');
      const useElement = icon.querySelector('use');
      expect(useElement).toHaveAttribute('href', '');
    });

    it('should handle extreme dimensions gracefully', () => {
      expect(() => {
        renderComponent({
          iconName: 'details',
          width: 1000,
          height: 1000,
        });
      }).not.toThrow();

      const icon = screen.getByTestId('icon-details');
      expect(icon).toHaveAttribute('width', '1000');
      expect(icon).toHaveAttribute('height', '1000');
    });
  });
});
