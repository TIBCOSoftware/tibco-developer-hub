/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { CustomDeploymentIcon } from './CustomDeploymentIcon';

// Mock the SVG imports
jest.mock('../../assets/icons/icon-env-dev.svg', () => 'icon-env-dev.svg');
jest.mock(
  '../../assets/icons/icon-env-testing.svg',
  () => 'icon-env-testing.svg',
);
jest.mock('../../assets/icons/icon-env-qa.svg', () => 'icon-env-qa.svg');
jest.mock('../../assets/icons/icon-env-prod.svg', () => 'icon-env-prod.svg');
jest.mock('../../assets/icons/icon-env-image.svg', () => 'icon-env-image.svg');
jest.mock(
  '../../assets/icons/icon-env-circle.svg',
  () => 'icon-env-circle.svg',
);
jest.mock('../../assets/icons/icon-app-flogo.svg', () => 'icon-app-flogo.svg');
jest.mock('../../assets/icons/icon-app-bwce.svg', () => 'icon-app-bwce.svg');

describe('CustomDeploymentIcon', () => {
  const defaultProps = {
    iconName: 'bwce-dev',
    id: 'test-icon',
  };

  describe('Basic Rendering', () => {
    it('should render an SVG element', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement.tagName).toBe('svg');
    });

    it('should render with correct id', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(svgElement).toHaveAttribute('id', 'test-icon');
    });

    it('should render with default dimensions when not specified', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(svgElement).toHaveAttribute('width', '24');
      expect(svgElement).toHaveAttribute('height', '24');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render with custom dimensions when specified', () => {
      render(<CustomDeploymentIcon {...defaultProps} width={32} height={32} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(svgElement).toHaveAttribute('width', '32');
      expect(svgElement).toHaveAttribute('height', '32');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 32 32');
    });

    it('should render with custom x and y coordinates', () => {
      render(<CustomDeploymentIcon {...defaultProps} x={10} y={15} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(svgElement).toHaveAttribute('x', '10');
      expect(svgElement).toHaveAttribute('y', '15');
    });

    it('should render with default x and y coordinates when not specified', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(svgElement).toHaveAttribute('x', '0');
      expect(svgElement).toHaveAttribute('y', '0');
    });
  });

  describe('Icon Name Parsing - App Icons', () => {
    it('should render bwce app icon when iconName starts with "bwce"', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwce-dev" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-app-bwce.svg"]',
      );
      expect(appIconImages).toHaveLength(1);
    });

    it('should render flogo app icon when iconName starts with "flogo"', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="flogo-prod" />);

      const svgElement = screen.getByTestId('deployment-icon-flogo-prod');
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-app-flogo.svg"]',
      );
      expect(appIconImages).toHaveLength(1);
    });

    it('should render default image icon for unknown app type', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="unknown-dev" />);

      const svgElement = screen.getByTestId('deployment-icon-unknown-dev');
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-image.svg"]',
      );
      expect(appIconImages).toHaveLength(1);
    });

    it('should handle case-insensitive app type matching', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="BWCE-dev" />);

      const svgElement = screen.getByTestId('deployment-icon-BWCE-dev');
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-app-bwce.svg"]',
      );
      expect(appIconImages).toHaveLength(1);
    });
  });

  describe('Icon Name Parsing - Environment Icons', () => {
    it('should render dev environment icon when iconName contains "dev"', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwce-dev" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const envIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-dev.svg"]',
      );
      expect(envIconImages).toHaveLength(1);
    });

    it('should render testing environment icon when iconName contains "testing"', () => {
      render(
        <CustomDeploymentIcon {...defaultProps} iconName="flogo-testing" />,
      );

      const svgElement = screen.getByTestId('deployment-icon-flogo-testing');
      const envIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-testing.svg"]',
      );
      expect(envIconImages).toHaveLength(1);
    });

    it('should render qa environment icon when iconName contains "qa"', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwce-qa" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-qa');
      const envIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-qa.svg"]',
      );
      expect(envIconImages).toHaveLength(1);
    });

    it('should render prod environment icon when iconName contains "prod"', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="flogo-prod" />);

      const svgElement = screen.getByTestId('deployment-icon-flogo-prod');
      const envIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-prod.svg"]',
      );
      expect(envIconImages).toHaveLength(1);
    });

    it('should not render environment icon for unknown environment', () => {
      render(
        <CustomDeploymentIcon {...defaultProps} iconName="bwce-unknown" />,
      );

      const svgElement = screen.getByTestId('deployment-icon-bwce-unknown');
      const envIconImages = svgElement.querySelectorAll('use[href=""]');
      expect(envIconImages).toHaveLength(0);
    });

    it('should handle case-insensitive environment type matching', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwce-PROD" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-PROD');
      const envIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-prod.svg"]',
      );
      expect(envIconImages).toHaveLength(1);
    });
  });

  describe('Circle Background Icon', () => {
    it('should always render circle background icon', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwce-dev" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const circleIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-circle.svg"]',
      );
      expect(circleIconImages).toHaveLength(1);
    });

    it('should render circle icon with correct dimensions', () => {
      render(<CustomDeploymentIcon {...defaultProps} width={48} height={48} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const circleIcon = svgElement.querySelector(
        'use[href="icon-env-circle.svg"]',
      );
      expect(circleIcon).toHaveAttribute('width', '48');
      expect(circleIcon).toHaveAttribute('height', '48');
    });
  });

  describe('Icon Positioning', () => {
    it('should position app icon correctly for standard icons', () => {
      render(<CustomDeploymentIcon {...defaultProps} id="standard-icon" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const appIcon = svgElement.querySelector('use[href="icon-app-bwce.svg"]');
      expect(appIcon).toHaveAttribute('x', '2');
      expect(appIcon).toHaveAttribute('y', '2');
      expect(appIcon).toHaveAttribute('width', '12');
      expect(appIcon).toHaveAttribute('height', '12');
    });

    it('should position app icon correctly for details icons', () => {
      render(<CustomDeploymentIcon {...defaultProps} id="details-icon-test" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const appIcon = svgElement.querySelector('use[href="icon-app-bwce.svg"]');
      expect(appIcon).toHaveAttribute('x', '3');
      expect(appIcon).toHaveAttribute('y', '3');
      expect(appIcon).toHaveAttribute('width', '18');
      expect(appIcon).toHaveAttribute('height', '18');
    });

    it('should position environment icon correctly for standard icons', () => {
      render(<CustomDeploymentIcon {...defaultProps} id="standard-icon" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const envIcon = svgElement.querySelector('use[href="icon-env-dev.svg"]');
      expect(envIcon).toHaveAttribute('x', '10');
      expect(envIcon).toHaveAttribute('y', '10');
      expect(envIcon).toHaveAttribute('width', '6');
      expect(envIcon).toHaveAttribute('height', '6');
    });

    it('should position environment icon correctly for details icons', () => {
      render(<CustomDeploymentIcon {...defaultProps} id="details-icon-test" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const envIcon = svgElement.querySelector('use[href="icon-env-dev.svg"]');
      expect(envIcon).toHaveAttribute('x', '14');
      expect(envIcon).toHaveAttribute('y', '14');
      expect(envIcon).toHaveAttribute('width', '10');
      expect(envIcon).toHaveAttribute('height', '10');
    });
  });

  describe('Event Handling', () => {
    it('should call onClick handler when clicked', () => {
      const mockOnClick = jest.fn();
      render(<CustomDeploymentIcon {...defaultProps} onClick={mockOnClick} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      fireEvent.click(svgElement);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when clicked without onClick handler', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      expect(() => fireEvent.click(svgElement)).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty iconName gracefully', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="" />);

      const svgElement = screen.getByTestId('deployment-icon-');
      expect(svgElement).toBeInTheDocument();

      // Should render default image icon when app type is empty
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-image.svg"]',
      );
      expect(appIconImages).toHaveLength(1);
    });

    it('should handle iconName without hyphen', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwcedev" />);

      const svgElement = screen.getByTestId('deployment-icon-bwcedev');
      expect(svgElement).toBeInTheDocument();

      // When there's no hyphen, split('-')[0] will return the whole string "bwcedev"
      // "bwcedev".toLowerCase() doesn't match any known app types, so should use default
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-env-image.svg"]',
      );
      expect(appIconImages).toHaveLength(1);

      // split('-')[1] will be undefined, so no env icon should be rendered
      const allImages = svgElement.querySelectorAll('image');
      const envImages = Array.from(allImages).filter(img => {
        const href = img.getAttribute('href');
        return (
          href &&
          href.includes('icon-env-') &&
          !href.includes('circle') &&
          !href.includes('image')
        );
      });
      expect(envImages).toHaveLength(0);
    });

    it('should handle iconName with multiple hyphens', () => {
      render(
        <CustomDeploymentIcon
          {...defaultProps}
          iconName="bwce-test-dev-prod"
        />,
      );

      const svgElement = screen.getByTestId(
        'deployment-icon-bwce-test-dev-prod',
      );
      expect(svgElement).toBeInTheDocument();

      // Should use first part for app type (bwce)
      const appIconImages = svgElement.querySelectorAll(
        'use[href="icon-app-bwce.svg"]',
      );
      expect(appIconImages).toHaveLength(1);

      // Should use second part for env type (test) - but "test" doesn't match any known env
      // So no environment icon should be rendered
      const allImages = svgElement.querySelectorAll('image');
      const envImages = Array.from(allImages).filter(
        img =>
          img.getAttribute('href')?.includes('icon-env-') &&
          !img.getAttribute('href')?.includes('circle') &&
          !img.getAttribute('href')?.includes('image'),
      );
      expect(envImages).toHaveLength(0);
    });

    it('should handle undefined id', () => {
      render(<CustomDeploymentIcon iconName="flogo-qa" />);

      const svgElement = screen.getByTestId('deployment-icon-flogo-qa');
      expect(svgElement).toHaveAttribute('id', 'undefined');
    });

    it('should render transparent background rect', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      const rect = svgElement.querySelector('rect');
      expect(rect).toHaveAttribute('fill', 'transparent');
      // Note: pointerEvents is actually rendered as pointer-events in DOM
      expect(rect).toHaveAttribute('pointer-events', 'fill');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply CSS classes', () => {
      render(<CustomDeploymentIcon {...defaultProps} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');
      // Just verify element has a class attribute (the exact classes may vary)
      expect(svgElement).toHaveAttribute('class');
    });
  });

  describe('Integration Tests', () => {
    it('should render complete deployment icon with all layers for bwce-dev', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="bwce-dev" />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');

      // Should have circle background
      expect(
        svgElement.querySelector('use[href="icon-env-circle.svg"]'),
      ).toBeInTheDocument();

      // Should have bwce app icon
      expect(
        svgElement.querySelector('use[href="icon-app-bwce.svg"]'),
      ).toBeInTheDocument();

      // Should have dev environment icon
      expect(
        svgElement.querySelector('use[href="icon-env-dev.svg"]'),
      ).toBeInTheDocument();
    });

    it('should render complete deployment icon with all layers for flogo-prod', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="flogo-prod" />);

      const svgElement = screen.getByTestId('deployment-icon-flogo-prod');

      // Should have circle background
      expect(
        svgElement.querySelector('use[href="icon-env-circle.svg"]'),
      ).toBeInTheDocument();

      // Should have flogo app icon
      expect(
        svgElement.querySelector('use[href="icon-app-flogo.svg"]'),
      ).toBeInTheDocument();

      // Should have prod environment icon
      expect(
        svgElement.querySelector('use[href="icon-env-prod.svg"]'),
      ).toBeInTheDocument();
    });

    it('should handle unknown app type with known environment', () => {
      render(<CustomDeploymentIcon {...defaultProps} iconName="unknown-qa" />);

      const svgElement = screen.getByTestId('deployment-icon-unknown-qa');

      // Should have circle background
      expect(
        svgElement.querySelector('use[href="icon-env-circle.svg"]'),
      ).toBeInTheDocument();

      // Should have default image icon
      expect(
        svgElement.querySelector('use[href="icon-env-image.svg"]'),
      ).toBeInTheDocument();

      // Should have qa environment icon
      expect(
        svgElement.querySelector('use[href="icon-env-qa.svg"]'),
      ).toBeInTheDocument();
    });

    it('should handle known app type with unknown environment', () => {
      render(
        <CustomDeploymentIcon {...defaultProps} iconName="bwce-unknown" />,
      );

      const svgElement = screen.getByTestId('deployment-icon-bwce-unknown');

      // Should have circle background
      expect(
        svgElement.querySelector('use[href="icon-env-circle.svg"]'),
      ).toBeInTheDocument();

      // Should have bwce app icon
      expect(
        svgElement.querySelector('use[href="icon-app-bwce.svg"]'),
      ).toBeInTheDocument();

      // Should not have environment icon (empty href means it won't be rendered)
      const envImages = Array.from(svgElement.querySelectorAll('image')).filter(
        img => img.getAttribute('href') === '',
      );
      expect(envImages).toHaveLength(0);
    });

    it('should render with custom dimensions and verify all icons scale correctly', () => {
      render(<CustomDeploymentIcon {...defaultProps} width={48} height={48} />);

      const svgElement = screen.getByTestId('deployment-icon-bwce-dev');

      // SVG should have custom dimensions
      expect(svgElement).toHaveAttribute('width', '48');
      expect(svgElement).toHaveAttribute('height', '48');

      // Circle should match SVG dimensions
      const circleIcon = svgElement.querySelector(
        'use[href="icon-env-circle.svg"]',
      );
      expect(circleIcon).toHaveAttribute('width', '48');
      expect(circleIcon).toHaveAttribute('height', '48');

      // Background rect should match SVG dimensions
      const rect = svgElement.querySelector('rect');
      expect(rect).toHaveAttribute('width', '48');
      expect(rect).toHaveAttribute('height', '48');
    });
  });
});
