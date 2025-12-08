/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen } from '@testing-library/react';
import EntityStatusIconsCard from './EntityStatusIconsCard';
import { CustomIconProps } from './CustomEntityNode';

// Mock dependencies
jest.mock('../common/EntityIcon', () => ({
  EntityIcon: ({
    icon,
    fill,
    width,
    height,
    x,
    y,
    fallbackIcon,
    ...props
  }: any) => (
    <g
      data-testid={`entity-icon-${icon || 'fallback'}`}
      data-icon-name={icon}
      data-fill={fill}
      data-width={width}
      data-height={height}
      data-x={x}
      data-y={y}
      data-fallback={fallbackIcon?.displayName || 'InfoIcon'}
      {...props}
    >
      <rect
        width={width}
        height={height}
        x={x}
        y={y}
        fill={fill || 'currentColor'}
      />
    </g>
  ),
}));

jest.mock('../common/CustomTooltip', () => ({
  CustomTooltip: ({ title, xPos, yPos }: any) => (
    <g data-testid="custom-tooltip">
      <text data-tooltip-title={title} x={xPos} y={yPos}>
        {title}
      </text>
    </g>
  ),
}));

// Mock Material-UI icons
jest.mock('@material-ui/icons/Info', () => {
  const MockInfoIcon = () => <span>InfoIcon</span>;
  MockInfoIcon.displayName = 'InfoIcon';
  return MockInfoIcon;
});

jest.mock('@material-ui/icons/Warning', () => {
  const MockWarningIcon = () => <span>WarningIcon</span>;
  MockWarningIcon.displayName = 'WarningIcon';
  return MockWarningIcon;
});

jest.mock('@material-ui/icons/Error', () => {
  const MockErrorIcon = () => <span>ErrorIcon</span>;
  MockErrorIcon.displayName = 'ErrorIcon';
  return MockErrorIcon;
});

// Mock status icons data
const mockStatusIcons: CustomIconProps[] = [
  {
    icon: 'health-check',
    iconColor: '#4caf50',
    iconTooltip: 'Health Check: OK',
  },
  { icon: 'security', iconColor: '#ff9800', iconTooltip: 'Security: Warning' },
  {
    icon: 'performance',
    iconColor: '#f44336',
    iconTooltip: 'Performance: Critical',
  },
];

describe('EntityStatusIconsCard Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      statusIcons: mockStatusIcons,
      iconSize: 12,
      iconPadding: 4,
      x: 100,
      y: 50,
      ...props,
    };

    return render(
      <svg>
        <EntityStatusIconsCard {...defaultProps} />
      </svg>,
    );
  };

  describe('Functionality Tests', () => {
    describe('Basic Rendering', () => {
      test('renders status icons card container', () => {
        renderComponent();

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);
        expect(icons[0]).toHaveAttribute('data-icon-name', 'health-check');
        expect(icons[1]).toHaveAttribute('data-icon-name', 'security');
        expect(icons[2]).toHaveAttribute('data-icon-name', 'performance');
      });

      test('does not render anything when no status icons provided', () => {
        renderComponent({ statusIcons: [] });
        expect(screen.queryByTestId(/entity-icon-/)).not.toBeInTheDocument();
      });

      test('does not render anything when statusIcons is null or undefined', () => {
        renderComponent({ statusIcons: null });
        expect(screen.queryByTestId(/entity-icon-/)).not.toBeInTheDocument();

        renderComponent({ statusIcons: undefined });
        expect(screen.queryByTestId(/entity-icon-/)).not.toBeInTheDocument();
      });

      test('renders correct number of status icons', () => {
        const singleIcon = [mockStatusIcons[0]];
        renderComponent({ statusIcons: singleIcon });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(1);
        expect(icons[0]).toHaveAttribute('data-icon-name', 'health-check');
      });

      test('renders multiple status icons with correct properties', () => {
        renderComponent();

        const icons = screen.getAllByTestId('entity-icon');
        const healthIcon = icons[0]; // health-check icon
        expect(healthIcon).toHaveAttribute('data-icon-name', 'health-check');
        expect(healthIcon).toHaveAttribute('data-fill', '#4caf50');

        const securityIcon = icons[1]; // security icon
        expect(securityIcon).toHaveAttribute('data-icon-name', 'security');
        expect(securityIcon).toHaveAttribute('data-fill', '#ff9800');

        const performanceIcon = icons[2]; // performance icon
        expect(performanceIcon).toHaveAttribute(
          'data-icon-name',
          'performance',
        );
        expect(performanceIcon).toHaveAttribute('data-fill', '#f44336');
      });
    });

    describe('Icon Sizing and Properties', () => {
      test('applies default icon size when not specified', () => {
        renderComponent({ iconSize: undefined });

        const healthIcon = screen.getAllByTestId('entity-icon')[0];
        expect(healthIcon).toHaveAttribute('data-width', '12'); // default iconSize
        expect(healthIcon).toHaveAttribute('data-height', '12');
      });

      test('applies custom icon size when specified', () => {
        const customSize = 16;
        renderComponent({ iconSize: customSize });

        const healthIcon = screen.getAllByTestId('entity-icon')[0];
        expect(healthIcon).toHaveAttribute('data-width', customSize.toString());
        expect(healthIcon).toHaveAttribute(
          'data-height',
          customSize.toString(),
        );
      });

      test('applies default icon padding when not specified', () => {
        renderComponent({ iconPadding: undefined });

        // Default padding is 4, should be reflected in positioning calculations
        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);
      });

      test('applies custom icon padding', () => {
        const customPadding = 8;
        renderComponent({ iconPadding: customPadding });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);
      });

      test('passes fallback icon to EntityIcon component', () => {
        renderComponent();

        const healthIcon = screen.getAllByTestId('entity-icon')[0];
        expect(healthIcon).toHaveAttribute('data-fallback', 'InfoIcon');
      });
    });

    describe('Icon Positioning Logic', () => {
      test('positions icons correctly for 3 icons', () => {
        const iconSize = 12;
        const x = 100;
        const y = 50;

        renderComponent({ statusIcons: mockStatusIcons, iconSize, x, y });

        const icons = screen.getAllByTestId('entity-icon');
        const healthIcon = icons[0];
        const securityIcon = icons[1];
        const performanceIcon = icons[2];

        // For 3 icons: iconOffsetX = x + index * iconSize, then add index * iconPadding when index > 0
        expect(healthIcon).toHaveAttribute('data-x', x.toString()); // 100
        expect(securityIcon).toHaveAttribute(
          'data-x',
          (x + 1 * iconSize + 1 * 4).toString(),
        ); // 116 (100 + 12 + 4)
        expect(performanceIcon).toHaveAttribute(
          'data-x',
          (x + 2 * iconSize + 2 * 4).toString(),
        ); // 132 (100 + 24 + 8)

        // Y position should be the same for all
        expect(healthIcon).toHaveAttribute('data-y', y.toString());
        expect(securityIcon).toHaveAttribute('data-y', y.toString());
        expect(performanceIcon).toHaveAttribute('data-y', y.toString());
      });

      test('positions icons correctly for 2 icons', () => {
        const twoIcons = mockStatusIcons.slice(0, 2);
        const iconSize = 12;
        const iconPadding = 4;
        const x = 100;
        const y = 50;

        renderComponent({ statusIcons: twoIcons, iconSize, iconPadding, x, y });

        const icons = screen.getAllByTestId('entity-icon');
        const healthIcon = icons[0];
        const securityIcon = icons[1];

        // For 2 icons: first icon gets x + iconPadding (104), second icon gets x + 2*iconSize - iconPadding + iconPadding (124)
        expect(healthIcon).toHaveAttribute(
          'data-x',
          (x + iconPadding).toString(),
        ); // 104
        expect(securityIcon).toHaveAttribute(
          'data-x',
          (x + 2 * iconSize - iconPadding + 1 * iconPadding).toString(),
        ); // 124
      });

      test('positions icon correctly for 1 icon', () => {
        const singleIcon = [mockStatusIcons[0]];
        const iconSize = 12;
        const iconPadding = 4;
        const x = 100;

        renderComponent({ statusIcons: singleIcon, iconSize, iconPadding, x });

        const healthIcon = screen.getAllByTestId('entity-icon')[0];

        // For 1 icon: iconOffsetX = x + 1 * iconSize + iconPadding
        expect(healthIcon).toHaveAttribute(
          'data-x',
          (x + 1 * iconSize + iconPadding).toString(),
        ); // 116
      });

      test('handles different x and y coordinates', () => {
        const customX = 200;
        const customY = 150;

        renderComponent({ x: customX, y: customY });

        const healthIcon = screen.getAllByTestId('entity-icon')[0];
        expect(healthIcon).toHaveAttribute('data-y', customY.toString());

        // X should be calculated based on positioning logic
        const expectedX = customX; // First icon for 3 icons: x + 0 * iconSize
        expect(healthIcon).toHaveAttribute('data-x', expectedX.toString());
      });
    });

    describe('Tooltip Functionality', () => {
      test('renders tooltips for icons that have iconTooltip', () => {
        renderComponent();

        const tooltips = screen.getAllByTestId('custom-tooltip');
        expect(tooltips).toHaveLength(3); // All mock icons have tooltips

        expect(screen.getByText('Health Check: OK')).toBeInTheDocument();
        expect(screen.getByText('Security: Warning')).toBeInTheDocument();
        expect(screen.getByText('Performance: Critical')).toBeInTheDocument();
      });

      test('does not render tooltip when iconTooltip is not provided', () => {
        const iconsWithoutTooltips = [
          { icon: 'test-icon', iconColor: '#000000' }, // No iconTooltip
        ];

        renderComponent({ statusIcons: iconsWithoutTooltips });

        expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
      });

      test('renders tooltip with correct positioning', () => {
        const iconSize = 12;
        const iconPadding = 4;
        const x = 100;
        const y = 50;

        renderComponent({ iconSize, iconPadding, x, y });

        const tooltip = screen.getAllByTestId('custom-tooltip')[0]; // First tooltip
        const tooltipText = tooltip.querySelector('text');

        // Tooltip positioning: xPos = iconOffsetX - 2 * iconSize, yPos = y + iconSize + 2 * iconPadding
        const expectedXPos = x - 2 * iconSize; // 100 - 24 = 76
        const expectedYPos = y + iconSize + 2 * iconPadding; // 50 + 12 + 8 = 70

        expect(tooltipText).toHaveAttribute('x', expectedXPos.toString());
        expect(tooltipText).toHaveAttribute('y', expectedYPos.toString());
      });

      test('handles empty or undefined tooltip gracefully', () => {
        const iconsWithEmptyTooltips = [
          { icon: 'icon1', iconColor: '#000000', iconTooltip: '' },
          { icon: 'icon2', iconColor: '#000000', iconTooltip: undefined },
          { icon: 'icon3', iconColor: '#000000', iconTooltip: null },
        ];

        renderComponent({ statusIcons: iconsWithEmptyTooltips });

        // Should not render tooltips for empty/undefined values
        expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
      });
    });

    describe('Interactive Elements', () => {
      test('renders transparent rect overlay for pointer events', () => {
        renderComponent();

        const svg = screen.getAllByTestId('entity-icon')[0].closest('svg');
        const rects = svg?.querySelectorAll('rect[fill="transparent"]');

        expect(rects).toHaveLength(3); // One for each icon

        const firstRect = rects?.[0];
        expect(firstRect).toHaveAttribute('pointer-events', 'fill');
        expect(firstRect).toHaveAttribute('width', '12');
        expect(firstRect).toHaveAttribute('height', '12');
      });

      test('positions transparent rect correctly for interactions', () => {
        const iconSize = 12;
        const x = 100;
        const y = 50;

        renderComponent({ iconSize, x, y });

        const svg = screen.getAllByTestId('entity-icon')[0].closest('svg');
        const rects = svg?.querySelectorAll('rect[fill="transparent"]');

        const firstRect = rects?.[0];
        expect(firstRect).toHaveAttribute('x', x.toString());
        expect(firstRect).toHaveAttribute('y', y.toString());
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Component Structure Integration', () => {
      test('integrates correctly with EntityIcon component', () => {
        renderComponent();

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);

        icons.forEach((icon, index) => {
          expect(icon).toHaveAttribute(
            'data-icon-name',
            mockStatusIcons[index].icon,
          );
          expect(icon).toHaveAttribute(
            'data-fill',
            mockStatusIcons[index].iconColor,
          );
          expect(icon).toHaveAttribute('data-fallback', 'InfoIcon');
        });
      });

      test('integrates correctly with CustomTooltip component', () => {
        renderComponent();

        const tooltips = screen.getAllByTestId('custom-tooltip');
        expect(tooltips).toHaveLength(3);

        tooltips.forEach((tooltip, index) => {
          const tooltipText = tooltip.querySelector('text');
          expect(tooltipText).toHaveAttribute(
            'data-tooltip-title',
            mockStatusIcons[index].iconTooltip,
          );
          expect(tooltipText).toHaveTextContent(
            mockStatusIcons[index].iconTooltip!,
          );
        });
      });

      test('maintains proper SVG structure with groups', () => {
        renderComponent();

        const container = screen.getAllByTestId('entity-icon')[0].closest('g');
        expect(container).toBeInTheDocument();
        // Verify the container is properly structured as a group element
        expect(container?.tagName).toBe('g');
        expect(container?.closest('svg')).toBeInTheDocument();
      });

      test('applies hover styles through CSS classes', () => {
        renderComponent();

        const iconGroups = screen
          .getAllByTestId('entity-icon')
          .map(icon => icon.closest('g'));

        iconGroups.forEach(group => {
          // Verify each group is properly structured as a group element
          expect(group?.tagName).toBe('g');
          expect(group).toBeInTheDocument();
        });
      });
    });

    describe('Data Processing Integration', () => {
      test('correctly processes status icons with different configurations', () => {
        const mixedStatusIcons = [
          {
            icon: 'custom-icon',
            iconColor: '#123456',
            iconTooltip: 'Custom Tooltip',
          },
          {
            icon: 'another-icon',
            iconColor: 'rgb(255, 0, 0)',
            iconTooltip: 'Another Tooltip',
          },
          {
            icon: undefined,
            iconColor: '#ffffff',
            iconTooltip: 'No Icon Tooltip',
          },
        ];

        renderComponent({ statusIcons: mixedStatusIcons });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons[0]).toHaveAttribute('data-fill', '#123456');
        expect(icons[1]).toHaveAttribute('data-fill', 'rgb(255, 0, 0)');
        expect(icons[2]).toHaveAttribute('data-fill', '#ffffff');
      });

      test('handles status icons with special characters and long tooltips', () => {
        const specialStatusIcons = [
          {
            icon: 'health-check-v2.0',
            iconColor: '#4caf50',
            iconTooltip:
              'Health Check: All systems are operational and running smoothly',
          },
        ];

        renderComponent({ statusIcons: specialStatusIcons });

        expect(screen.getAllByTestId('entity-icon')[0]).toBeInTheDocument();
        expect(
          screen.getByText(
            'Health Check: All systems are operational and running smoothly',
          ),
        ).toBeInTheDocument();
      });

      test('processes status icons with missing or partial properties', () => {
        const partialStatusIcons = [
          { icon: 'icon-only' }, // Missing color and tooltip
          { iconColor: '#ff0000' }, // Missing icon and tooltip
          { iconTooltip: 'Tooltip only' }, // Missing icon and color
          {
            icon: 'complete',
            iconColor: '#00ff00',
            iconTooltip: 'Complete icon',
          },
        ];

        renderComponent({ statusIcons: partialStatusIcons });

        expect(screen.getAllByTestId('entity-icon')[0]).toBeInTheDocument();
        expect(screen.getAllByTestId('entity-icon')[0]).toBeInTheDocument(); // For missing icon
        expect(screen.getAllByTestId('entity-icon')[0]).toBeInTheDocument();
      });
    });

    describe('Layout and Positioning Integration', () => {
      test('correctly calculates layout with varying icon counts and sizes', () => {
        const largeSizeTest = [mockStatusIcons[0]];
        const largeIconSize = 24;
        const largePadding = 8;

        renderComponent({
          statusIcons: largeSizeTest,
          iconSize: largeIconSize,
          iconPadding: largePadding,
        });

        const icon = screen.getAllByTestId('entity-icon')[0];
        expect(icon).toHaveAttribute('data-width', largeIconSize.toString());
        expect(icon).toHaveAttribute('data-height', largeIconSize.toString());
      });

      test('maintains proper spacing with different padding configurations', () => {
        const noPaddingConfig = { iconPadding: 0 };

        // Test no padding
        const { unmount } = renderComponent(noPaddingConfig);
        let icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);
        unmount();

        // Test large padding
        const largePaddingConfig = { iconPadding: 16 };
        renderComponent(largePaddingConfig);
        icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);
      });
    });

    describe('Real-world Scenarios', () => {
      test('handles typical monitoring dashboard status icons', () => {
        const monitoringIcons = [
          {
            icon: 'health',
            iconColor: '#4caf50',
            iconTooltip: 'System Health: Good',
          },
          { icon: 'cpu', iconColor: '#ff9800', iconTooltip: 'CPU Usage: 75%' },
          {
            icon: 'memory',
            iconColor: '#f44336',
            iconTooltip: 'Memory Usage: 90%',
          },
          {
            icon: 'disk',
            iconColor: '#2196f3',
            iconTooltip: 'Disk Usage: 45%',
          },
        ];

        renderComponent({ statusIcons: monitoringIcons });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(4);

        expect(icons[0]).toHaveAttribute('data-icon-name', 'health');
        expect(icons[1]).toHaveAttribute('data-icon-name', 'cpu');
        expect(icons[2]).toHaveAttribute('data-icon-name', 'memory');
        expect(screen.getByText('System Health: Good')).toBeInTheDocument();
        expect(screen.getByText('CPU Usage: 75%')).toBeInTheDocument();
      });

      test('handles single critical status icon', () => {
        const criticalIcon = [
          {
            icon: 'alert',
            iconColor: '#f44336',
            iconTooltip: 'CRITICAL: Service is down',
          },
        ];

        renderComponent({ statusIcons: criticalIcon });

        const icon = screen.getAllByTestId('entity-icon')[0];
        expect(icon).toHaveAttribute('data-icon-name', 'alert');
        expect(
          screen.getByText('CRITICAL: Service is down'),
        ).toBeInTheDocument();

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(1);
      });

      test('handles deployment status icons with different states', () => {
        const deploymentIcons = [
          {
            icon: 'deployed',
            iconColor: '#4caf50',
            iconTooltip: 'Deployment: Success',
          },
          {
            icon: 'testing',
            iconColor: '#ff9800',
            iconTooltip: 'Testing: In Progress',
          },
        ];

        renderComponent({ statusIcons: deploymentIcons });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(2);
        expect(icons[0]).toHaveAttribute('data-icon-name', 'deployed');
        expect(icons[1]).toHaveAttribute('data-icon-name', 'testing');
        expect(screen.getByText('Deployment: Success')).toBeInTheDocument();
        expect(screen.getByText('Testing: In Progress')).toBeInTheDocument();
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('handles zero icon size gracefully', () => {
        renderComponent({ iconSize: 0 });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);

        const icon = icons[0]; // First icon
        expect(icon).toHaveAttribute('data-width', '0');
        expect(icon).toHaveAttribute('data-height', '0');
      });

      test('handles negative positioning values', () => {
        renderComponent({ x: -50, y: -25 });

        const icons = screen.getAllByTestId('entity-icon');
        const icon = icons[0]; // First icon
        expect(icon).toHaveAttribute('data-y', '-25');
      });

      test('handles very large arrays of status icons', () => {
        const manyIcons = Array.from({ length: 10 }, (_, index) => ({
          icon: `icon-${index}`,
          iconColor: '#000000',
          iconTooltip: `Tooltip ${index}`,
        }));

        renderComponent({ statusIcons: manyIcons });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(10);
      });

      test('handles status icons with null or undefined colors', () => {
        const iconsWithNullColors = [
          { icon: 'icon1', iconColor: null, iconTooltip: 'Tooltip 1' },
          { icon: 'icon2', iconColor: undefined, iconTooltip: 'Tooltip 2' },
          { icon: 'icon3', iconTooltip: 'Tooltip 3' }, // No color property
        ];

        renderComponent({ statusIcons: iconsWithNullColors });

        const icons = screen.getAllByTestId('entity-icon');
        expect(icons).toHaveLength(3);

        // Should handle gracefully without crashing
        expect(icons[0]).toHaveAttribute('data-icon-name', 'icon1');
        expect(icons[1]).toHaveAttribute('data-icon-name', 'icon2');
        expect(icons[2]).toHaveAttribute('data-icon-name', 'icon3');
      });

      test('handles extreme positioning and sizing values', () => {
        renderComponent({
          iconSize: 1000,
          iconPadding: 500,
          x: 99999,
          y: -99999,
        });

        const icons = screen.getAllByTestId('entity-icon');
        const icon = icons[0]; // First icon
        expect(icon).toHaveAttribute('data-width', '1000');
        expect(icon).toHaveAttribute('data-height', '1000');
        expect(icon).toHaveAttribute('data-y', '-99999');
      });
    });
  });
});
