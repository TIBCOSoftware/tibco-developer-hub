/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { EntityDeploymentCard } from './EntityDeploymentCard';

// Mock dependencies
jest.mock('../common/CustomDeploymentIcon', () => ({
  CustomDeploymentIcon: ({ iconName, width, height, x, y, onClick }: any) => (
    <g
      data-testid={`custom-icon-${iconName}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }} // Always pointer since icons in EntityDeploymentCard are clickable
    >
      <rect
        data-icon-name={iconName}
        width={width !== undefined ? width : 16}
        height={height !== undefined ? height : 16}
        x={x !== undefined ? x : 0}
        y={y !== undefined ? y : 0}
      />
    </g>
  ),
}));

jest.mock('../common/CustomTooltip', () => ({
  CustomTooltip: ({ title, xPos, yPos }: any) => (
    <g data-testid="custom-tooltip">
      <text data-tooltip-title={title} x={xPos || 0} y={yPos || 0}>
        {title}
      </text>
    </g>
  ),
}));

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});

// Mock platform links data
const mockPlatformLinks = [
  {
    pAppType: 'WEBAPP',
    pLabel: 'DEVEnvironment',
    pLink: 'https://dev.example.com',
  },
  {
    pAppType: 'SERVICE',
    pLabel: 'DEVEnvironment',
    pLink: 'https://staging.example.com',
  },
  {
    pAppType: 'DATABASE',
    pLabel: 'DEVEnvironment',
    pLink: 'https://prod.example.com',
  },
];

describe('EntityDeploymentCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      platformLinks: mockPlatformLinks,
      iconSize: 16,
      iconOffsetX: 78,
      iconOffsetY: 68,
      ...props,
    };

    return render(
      <svg>
        <EntityDeploymentCard {...defaultProps} />
      </svg>,
    );
  };

  describe('Functionality Tests', () => {
    describe('Basic Rendering', () => {
      test('renders deployment card with test id', () => {
        renderComponent();
        expect(
          screen.getByTestId('entity-deployment-card'),
        ).toBeInTheDocument();
      });

      test('renders "Deployments" text when platform links exist', () => {
        renderComponent();
        expect(screen.getByText('Deployments')).toBeInTheDocument();
      });

      test('does not render "Deployments" text when no platform links', () => {
        renderComponent({ platformLinks: [] });
        expect(screen.queryByText('Deployments')).not.toBeInTheDocument();
      });

      test('renders all platform links up to maximum of 3', () => {
        renderComponent();

        // Should render all 3 mock platform links
        expect(
          screen.getByTestId('custom-icon-webapp-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-service-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-database-Environment'),
        ).toBeInTheDocument();
      });

      test('limits platform links to maximum of 3 items', () => {
        const manyPlatformLinks = [
          ...mockPlatformLinks,
          {
            pAppType: 'API',
            pLabel: 'DEVEnvironment',
            pLink: 'https://api.example.com',
          },
        ];

        renderComponent({ platformLinks: manyPlatformLinks });

        // Should only render first 3 links
        expect(
          screen.getByTestId('custom-icon-webapp-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-service-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-database-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('custom-icon-api-Environment'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Platform Link Rendering', () => {
      test('renders correct icon names based on platform link data', () => {
        renderComponent();

        // Icon names should be: pAppType.toLowerCase() + pLabel.slice(3)
        expect(
          screen.getByTestId('custom-icon-webapp-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-service-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-database-Environment'),
        ).toBeInTheDocument();
      });

      test('renders icons with correct positioning', () => {
        const iconSize = 20;
        const iconOffsetX = 100;
        const iconOffsetY = 50;
        const padding = 5;
        const iconPositionGap = iconSize;

        renderComponent({ iconSize, iconOffsetX, iconOffsetY });

        // Check first icon position
        const firstIcon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .querySelector('rect');
        expect(firstIcon).toHaveAttribute(
          'x',
          (iconOffsetX + (iconPositionGap + padding) * 0).toString(),
        );
        expect(firstIcon).toHaveAttribute('y', iconOffsetY.toString());
        expect(firstIcon).toHaveAttribute('width', iconSize.toString());
        expect(firstIcon).toHaveAttribute('height', iconSize.toString());
      });

      test('renders tooltips with correct labels', () => {
        renderComponent();

        // Tooltips should show label.slice(3)
        expect(screen.getAllByText('Environment')).toHaveLength(3); // DEVEnvironment -> Environment

        const tooltips = screen.getAllByTestId('custom-tooltip');
        expect(tooltips).toHaveLength(3);

        tooltips.forEach(tooltip => {
          const text = tooltip.querySelector(
            'text[data-tooltip-title="Environment"]',
          );
          expect(text).toBeInTheDocument();
        });
      });

      test('positions tooltips correctly', () => {
        const iconOffsetX = 78;
        const iconSize = 16;
        const iconPositionGap = 16; // Should match iconSize for default

        renderComponent({ iconOffsetX, iconSize });

        const tooltips = screen.getAllByTestId('custom-tooltip');
        tooltips.forEach((tooltip, index) => {
          const text = tooltip.querySelector('text');
          // Tooltip positioning logic from component: xPos = 3 * iconPositionGap + (iconPositionGap + padding) * index
          const padding = 4; // from component
          const expectedX =
            3 * iconPositionGap + (iconPositionGap + padding) * index;
          expect(text).toHaveAttribute('x', expectedX.toString());
        });
      });
    });

    describe('User Interactions', () => {
      test('opens correct platform link when icon is clicked', () => {
        renderComponent();

        const firstIcon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .closest('g');
        fireEvent.click(firstIcon!);

        expect(mockWindowOpen).toHaveBeenCalledWith(
          'https://dev.example.com',
          '_blank',
        );
      });

      test('opens different links for different icons', () => {
        renderComponent();

        const secondIcon = screen
          .getByTestId('custom-icon-service-Environment')
          .closest('g');
        fireEvent.click(secondIcon!);

        expect(mockWindowOpen).toHaveBeenCalledWith(
          'https://staging.example.com',
          '_blank',
        );
      });

      test('handles multiple clicks correctly', () => {
        renderComponent();

        const firstIcon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .closest('g');

        fireEvent.click(firstIcon!);
        fireEvent.click(firstIcon!);

        expect(mockWindowOpen).toHaveBeenCalledTimes(2);
        expect(mockWindowOpen).toHaveBeenCalledWith(
          'https://dev.example.com',
          '_blank',
        );
      });
    });

    describe('Default Props Handling', () => {
      test('uses correct default icon size', () => {
        renderComponent();

        const icon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .querySelector('rect');
        expect(icon).toHaveAttribute('width', '16'); // Passed iconSize
        expect(icon).toHaveAttribute('height', '16');
      });

      test('uses correct default offsets', () => {
        renderComponent();

        const deploymentText = screen.getByText('Deployments');
        expect(deploymentText).toHaveAttribute('x', '78'); // iconOffsetX passed to component
        expect(deploymentText).toHaveAttribute('y', '63'); // iconOffsetY - 5

        const icon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .querySelector('rect');
        const padding = 4; // from component, not 5
        const iconPositionGap = 24; // default iconSize when passed as 24, not 16
        expect(icon).toHaveAttribute(
          'x',
          (78 + (iconPositionGap + padding) * 0).toString(),
        ); // iconOffsetX + position calc
        expect(icon).toHaveAttribute('y', '68'); // iconOffsetY
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Component Structure Integration', () => {
      test('integrates correctly with CustomIcon component', () => {
        renderComponent();

        const icons = screen.getAllByTestId(/custom-icon-/);
        expect(icons).toHaveLength(3);

        icons.forEach(icon => {
          expect(icon.closest('g')).toHaveStyle('cursor: pointer');
        });
      });

      test('integrates correctly with CustomTooltip component', () => {
        renderComponent();

        const tooltips = screen.getAllByTestId('custom-tooltip');
        expect(tooltips).toHaveLength(3);

        tooltips.forEach(tooltip => {
          expect(tooltip.querySelector('text')).toHaveAttribute(
            'data-tooltip-title',
          );
        });
      });

      test('maintains proper SVG structure', () => {
        renderComponent();

        const card = screen.getByTestId('entity-deployment-card');
        expect(card.tagName).toBe('g');

        const deploymentText = screen.getByText('Deployments');
        expect(deploymentText.tagName).toBe('text');
      });
    });

    describe('Real-world Scenarios', () => {
      test('handles typical enterprise deployment environment setup', () => {
        const enterpriseLinks = [
          {
            pAppType: 'WEBAPP',
            pLabel: 'PRODEnvironment',
            pLink: 'https://app.company.com',
          },
          {
            pAppType: 'SERVICE',
            pLabel: 'PRODEnvironment',
            pLink: 'https://api.company.com',
          },
          {
            pAppType: 'DATABASE',
            pLabel: 'PRODEnvironment',
            pLink: 'https://db.company.com',
          },
        ];

        renderComponent({ platformLinks: enterpriseLinks });

        expect(
          screen.getByTestId('custom-icon-webapp-DEnvironment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-service-DEnvironment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-database-DEnvironment'),
        ).toBeInTheDocument();
        expect(screen.getByText('Deployments')).toBeInTheDocument();
      });

      test('handles single deployment environment', () => {
        const singleLink = [
          {
            pAppType: 'WEBAPP',
            pLabel: 'DEVEnvironment',
            pLink: 'https://dev.example.com',
          },
        ];

        renderComponent({ platformLinks: singleLink });

        expect(
          screen.getByTestId('custom-icon-webapp-Environment'),
        ).toBeInTheDocument();
        expect(screen.getAllByTestId(/custom-icon-/)).toHaveLength(1);
        expect(screen.getByText('Deployments')).toBeInTheDocument();
      });

      test('handles deployment environments with complex naming', () => {
        const complexLinks = [
          {
            pAppType: 'KUBERNETES',
            pLabel: 'DEVDevelopment',
            pLink: 'https://k8s-dev.example.com',
          },
          {
            pAppType: 'CONTAINER',
            pLabel: 'QAATesting',
            pLink: 'https://qa.example.com',
          },
        ];

        renderComponent({ platformLinks: complexLinks });

        expect(
          screen.getByTestId('custom-icon-kubernetes-Development'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-container-Testing'),
        ).toBeInTheDocument();
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('handles empty platform links array gracefully', () => {
        renderComponent({ platformLinks: [] });

        expect(
          screen.getByTestId('entity-deployment-card'),
        ).toBeInTheDocument();
        expect(screen.queryByText('Deployments')).not.toBeInTheDocument();
        expect(screen.queryByTestId(/custom-icon-/)).not.toBeInTheDocument();
      });

      test('handles platform links with empty or undefined properties', () => {
        const invalidLinks = [
          {
            pAppType: '',
            pLabel: 'DEVEnvironment',
            pLink: 'https://example.com',
          },
          { pAppType: 'WEBAPP', pLabel: '', pLink: 'https://example.com' },
          { pAppType: 'WEBAPP', pLabel: 'DEVEnvironment', pLink: '' },
        ];

        renderComponent({ platformLinks: invalidLinks });

        // Should handle gracefully - test that it doesn't crash
        expect(
          screen.getByTestId('entity-deployment-card'),
        ).toBeInTheDocument();
      });

      test('handles platform links with special app types', () => {
        const specialTypeLinks = [
          {
            pAppType: 'MICROSERVICE-API',
            pLabel: 'DEVEnvironment',
            pLink: 'https://example.com',
          },
          {
            pAppType: 'ML_MODEL',
            pLabel: 'DEVEnvironment',
            pLink: 'https://example.com',
          },
        ];

        renderComponent({ platformLinks: specialTypeLinks });

        expect(
          screen.getByTestId('custom-icon-microservice-api-Environment'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-ml_model-Environment'),
        ).toBeInTheDocument();
      });

      test('handles zero or negative icon sizes gracefully', () => {
        renderComponent({ iconSize: 0 });

        const icon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .querySelector('rect');
        expect(icon).toHaveAttribute('width', '0');
        expect(icon).toHaveAttribute('height', '0');
      });

      test('handles negative offset positions', () => {
        renderComponent({ iconOffsetX: -10, iconOffsetY: -5 });

        const icon = screen
          .getByTestId('custom-icon-webapp-Environment')
          .querySelector('rect');
        // Calculation: iconOffsetX + ((iconPositionGap + padding) * index)
        // = -10 + ((24 + 4) * 0) = -10 + 0 = -10
        expect(icon).toHaveAttribute('x', '-10');
        expect(icon).toHaveAttribute('y', '-5');
      });
    });
  });
});
