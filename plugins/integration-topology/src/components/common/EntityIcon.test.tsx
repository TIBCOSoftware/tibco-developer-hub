/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { EntityIcon } from './EntityIcon';
import { IconComponent } from '@backstage/core-plugin-api';

// Mock Material-UI icons
jest.mock('@material-ui/icons', () => ({
  Info: jest.fn(({ ...props }) => (
    <svg data-testid="info-icon" {...props}>
      <path d="info-icon-path" />
    </svg>
  )),
  Warning: jest.fn(({ ...props }) => (
    <svg data-testid="warning-icon" {...props}>
      <path d="warning-icon-path" />
    </svg>
  )),
  Error: jest.fn(({ ...props }) => (
    <svg data-testid="error-icon" {...props}>
      <path d="error-icon-path" />
    </svg>
  )),
  Home: jest.fn(({ ...props }) => (
    <svg data-testid="home-icon" {...props}>
      <path d="home-icon-path" />
    </svg>
  )),
  AccountCircle: jest.fn(({ ...props }) => (
    <svg data-testid="account-circle-icon" {...props}>
      <path d="account-circle-icon-path" />
    </svg>
  )),
}));

// Mock Material-UI Icon component
jest.mock('@material-ui/core', () => ({
  Icon: jest.fn(({ component: Component, style, ...props }) => (
    <div
      data-testid="mui-icon-wrapper"
      data-component={Component?.displayName || 'Component'}
      style={{
        fontSize: style?.fontSize || props.width,
        width: style?.width || props.width,
        height: style?.height || props.height,
        color: style?.color || props.fill,
      }}
      {...props}
    >
      {Component && <Component {...props} />}
    </div>
  )),
  SvgIcon: jest.fn(({ ...props }) => (
    <svg data-testid="svg-icon-fallback" {...props}>
      <path d="fallback-icon-path" />
    </svg>
  )),
}));

// Mock fallback icons
const MockFallbackIcon: IconComponent = props => (
  <svg data-testid="mock-fallback-icon" {...props}>
    <path d="mock-fallback-path" />
  </svg>
);

const AnotherFallbackIcon: IconComponent = props => (
  <svg data-testid="another-fallback-icon" {...props}>
    <path d="another-fallback-path" />
  </svg>
);

describe('EntityIcon Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Functionality Tests', () => {
    describe('Basic Rendering', () => {
      test('renders with required fallbackIcon prop', () => {
        render(<EntityIcon fallbackIcon={MockFallbackIcon} />);

        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });

      test('renders fallback icon when no icon prop provided', () => {
        render(
          <EntityIcon
            fallbackIcon={MockFallbackIcon}
            width={24}
            height={24}
            fill="#000000"
          />,
        );

        const fallbackIcon = screen.getByTestId('mock-fallback-icon');
        expect(fallbackIcon).toBeInTheDocument();
        expect(fallbackIcon).toHaveAttribute('width', '24');
        expect(fallbackIcon).toHaveAttribute('height', '24');
        expect(fallbackIcon).toHaveAttribute('fill', '#000000');
      });

      test('renders fallback icon when icon prop is undefined', () => {
        render(<EntityIcon icon={undefined} fallbackIcon={MockFallbackIcon} />);

        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });

      test('renders fallback icon when icon prop is null', () => {
        render(
          <EntityIcon icon={null as any} fallbackIcon={MockFallbackIcon} />,
        );

        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });
    });

    describe('String Icon Handling', () => {
      test('renders HTTP URL as SVG image', () => {
        const imageUrl = 'https://example.com/icon.png';

        render(
          <EntityIcon
            icon={imageUrl}
            fallbackIcon={MockFallbackIcon}
            width={32}
            height={32}
            x={10}
            y={20}
            className="custom-svg-class"
          />,
        );

        const svg = document.querySelector('svg');
        expect(svg?.tagName).toBe('svg');
        expect(svg).toHaveClass('custom-svg-class');

        const image = svg?.querySelector('image');
        expect(image).toHaveAttribute('href', imageUrl);
        expect(image).toHaveAttribute('width', '32');
        expect(image).toHaveAttribute('height', '32');
        expect(image).toHaveAttribute('x', '10');
        expect(image).toHaveAttribute('y', '20');
      });

      test('renders HTTPS URL as SVG image', () => {
        const imageUrl = 'https://secure.example.com/secure-icon.svg';

        render(
          <EntityIcon
            icon={imageUrl}
            fallbackIcon={MockFallbackIcon}
            width={48}
            height={48}
          />,
        );

        const svg = document.querySelector('svg');
        const image = svg?.querySelector('image');
        expect(image).toHaveAttribute('href', imageUrl);
        expect(image).toHaveAttribute('width', '48');
        expect(image).toHaveAttribute('height', '48');
      });

      test('capitalizes string icon name and passes to IconResolver', () => {
        render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            width={24}
            height={24}
            fill="#0066cc"
          />,
        );

        // Should find the Material-UI Info icon (capitalized from "info")
        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toBeInTheDocument();
        expect(iconWrapper).toHaveStyle({
          fontSize: '24px',
          width: '24px',
          height: '24px',
          color: '#0066cc',
        });
      });

      test('handles multi-word icon names with proper capitalization', () => {
        render(
          <EntityIcon icon="accountCircle" fallbackIcon={MockFallbackIcon} />,
        );

        // Should capitalize to "AccountCircle" and find the Material-UI icon
        expect(screen.getByTestId('mui-icon-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('account-circle-icon')).toBeInTheDocument();
      });
    });

    describe('Icon Component Handling', () => {
      test('renders custom icon component', () => {
        const CustomIcon: IconComponent = props => (
          <svg data-testid="custom-icon-component" {...props}>
            <circle cx="12" cy="12" r="10" />
          </svg>
        );

        render(
          <EntityIcon
            icon={CustomIcon}
            fallbackIcon={MockFallbackIcon}
            width={24}
            height={24}
          />,
        );

        // When icon is a component, EntityIcon falls back to the fallbackIcon
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });

      test('renders Material-UI icon component directly', () => {
        const InfoIconComponent: IconComponent = props => (
          <svg data-testid="info-icon-component" {...props}>
            <path d="info-icon-path" />
          </svg>
        );

        render(
          <EntityIcon
            icon={InfoIconComponent}
            fallbackIcon={MockFallbackIcon}
            width={20}
            height={20}
            fill="#ff0000"
          />,
        );

        // When passing an IconComponent directly, it should render the fallback
        // (based on the component logic)
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });
    });

    describe('Props Handling', () => {
      test('passes all props to rendered components', () => {
        const handleClick = jest.fn();

        render(
          <EntityIcon
            icon="warning"
            fallbackIcon={MockFallbackIcon}
            width={32}
            height={32}
            x={5}
            y={10}
            fill="#ff9800"
            className="test-class"
            onClick={handleClick}
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toHaveStyle({
          fontSize: '32px',
          width: '32px',
          height: '32px',
          color: '#ff9800',
        });
        expect(iconWrapper).toHaveClass('test-class');

        fireEvent.click(iconWrapper);
        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      test('handles undefined props gracefully', () => {
        render(
          <EntityIcon
            icon="home"
            fallbackIcon={MockFallbackIcon}
            width={undefined}
            height={undefined}
            fill={undefined}
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toBeInTheDocument();
        // When undefined props are passed, component should still render without errors
        expect(iconWrapper).toHaveAttribute('data-testid', 'mui-icon-wrapper');
      });

      test('handles zero values for dimensions', () => {
        render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            width={0}
            height={0}
            x={0}
            y={0}
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toHaveStyle({
          fontSize: '0px',
          width: '0px',
          height: '0px',
        });
      });
    });
  });

  describe('Integration Tests', () => {
    describe('IconResolver Integration', () => {
      test('IconResolver finds existing Material-UI icons', () => {
        render(<EntityIcon icon="error" fallbackIcon={MockFallbackIcon} />);

        // Should find Error icon in Material-UI icons
        expect(screen.getByTestId('mui-icon-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      });

      test('IconResolver falls back when icon not found', () => {
        render(
          <EntityIcon icon="nonExistentIcon" fallbackIcon={MockFallbackIcon} />,
        );

        // Should fall back to provided fallback icon
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });

      test('IconResolver uses SvgIcon when no fallback provided', () => {
        render(
          <EntityIcon icon="unknownIcon" fallbackIcon={undefined as any} />,
        );

        // Should fall back to Material-UI SvgIcon - check for MuiSvgIcon class
        const svgIcon = document.querySelector('.MuiSvgIcon-root');
        expect(svgIcon).toBeInTheDocument();
      });
    });

    describe('Fallback Icon Integration', () => {
      test('uses different fallback icons correctly', () => {
        const { rerender } = render(
          <EntityIcon icon="nonExistent" fallbackIcon={MockFallbackIcon} />,
        );

        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();

        rerender(
          <EntityIcon
            icon="stillNonExistent"
            fallbackIcon={AnotherFallbackIcon}
          />,
        );

        expect(screen.getByTestId('another-fallback-icon')).toBeInTheDocument();
        expect(
          screen.queryByTestId('mock-fallback-icon'),
        ).not.toBeInTheDocument();
      });

      test('passes props to fallback icon', () => {
        render(
          <EntityIcon
            fallbackIcon={MockFallbackIcon}
            width={48}
            height={48}
            fill="#purple"
            className="fallback-class"
          />,
        );

        const fallbackIcon = screen.getByTestId('mock-fallback-icon');
        expect(fallbackIcon).toHaveAttribute('width', '48');
        expect(fallbackIcon).toHaveAttribute('height', '48');
        expect(fallbackIcon).toHaveAttribute('fill', '#purple');
        expect(fallbackIcon).toHaveClass('fallback-class');
      });
    });

    describe('Material-UI Icons Integration', () => {
      test('integrates with Material-UI Icon component', () => {
        render(
          <EntityIcon
            icon="warning"
            fallbackIcon={MockFallbackIcon}
            width={36}
            height={36}
            fill="#ff5722"
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toHaveStyle({
          fontSize: '36px',
          width: '36px',
          height: '36px',
          color: 'rgb(255, 87, 34)',
        });

        // Verify the actual Material-UI icon is rendered inside
        expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      });

      test('handles case-sensitive icon names', () => {
        render(<EntityIcon icon="INFO" fallbackIcon={MockFallbackIcon} />);

        // Should capitalize properly: "INFO" -> "INFO" (already caps)
        // But this might not match Material-UI icon name exactly
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });
    });

    describe('SVG Image Integration', () => {
      test('creates proper SVG structure for HTTP images', () => {
        render(
          <EntityIcon
            icon="http://example.com/test.png"
            fallbackIcon={MockFallbackIcon}
            className="image-container"
          />,
        );

        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.tagName).toBe('svg');
        expect(svg).toHaveClass('image-container');

        const image = svg?.querySelector('image');
        expect(image).toBeInTheDocument();
        expect(image?.tagName).toBe('image');
      });

      test('handles complex URLs with parameters', () => {
        const complexUrl =
          'https://api.example.com/icon?size=64&format=svg&color=blue';

        render(
          <EntityIcon
            icon={complexUrl}
            fallbackIcon={MockFallbackIcon}
            width={64}
            height={64}
          />,
        );

        const image = document.querySelector('svg image');
        expect(image).toHaveAttribute('href', complexUrl);
        expect(image).toHaveAttribute('width', '64');
        expect(image).toHaveAttribute('height', '64');
      });
    });

    describe('Event Handling Integration', () => {
      test('handles click events on fallback icons', () => {
        const handleClick = jest.fn();

        render(
          <EntityIcon fallbackIcon={MockFallbackIcon} onClick={handleClick} />,
        );

        const fallbackIcon = screen.getByTestId('mock-fallback-icon');
        fireEvent.click(fallbackIcon);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
      });

      test('handles click events on Material-UI icons', () => {
        const handleClick = jest.fn();

        render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            onClick={handleClick}
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        fireEvent.click(iconWrapper);

        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      test('handles click events on SVG images', () => {
        const handleClick = jest.fn();

        render(
          <EntityIcon
            icon="https://example.com/clickable.svg"
            fallbackIcon={MockFallbackIcon}
            onClick={handleClick}
          />,
        );

        const svg = document.querySelector('svg');
        fireEvent.click(svg!);

        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Real-world Scenarios', () => {
    describe('Common Use Cases', () => {
      test('handles typical application icons', () => {
        const icons = ['home', 'info', 'warning', 'error'];

        icons.forEach(iconName => {
          const { unmount } = render(
            <EntityIcon
              icon={iconName}
              fallbackIcon={MockFallbackIcon}
              width={24}
              height={24}
            />,
          );

          // Each should render through Material-UI Icon component
          expect(screen.getByTestId('mui-icon-wrapper')).toBeInTheDocument();

          unmount();
        });
      });

      test('handles service logos from URLs', () => {
        const serviceLogos = [
          'https://cdn.example.com/service-a.png',
          'http://internal.company.com/service-b.svg',
          'https://api.github.com/repos/user/repo/contents/logo.png',
        ];

        serviceLogos.forEach(logoUrl => {
          const { unmount } = render(
            <EntityIcon
              icon={logoUrl}
              fallbackIcon={MockFallbackIcon}
              width={40}
              height={40}
            />,
          );

          const svg = document.querySelector('svg');
          const image = svg?.querySelector('image');
          expect(image).toHaveAttribute('href', logoUrl);

          unmount();
        });
      });

      test('handles mixed icon types in sequence', () => {
        // Test info icon
        const { unmount: unmount1 } = render(
          <EntityIcon icon="info" fallbackIcon={MockFallbackIcon} />,
        );
        expect(screen.getByTestId('mui-icon-wrapper')).toBeInTheDocument();
        unmount1();

        // Test URL icon
        const { unmount: unmount2 } = render(
          <EntityIcon
            icon="https://example.com/logo.png"
            fallbackIcon={MockFallbackIcon}
          />,
        );
        expect(document.querySelector('svg')).toBeInTheDocument();
        unmount2();

        // Test undefined icon
        const { unmount: unmount3 } = render(
          <EntityIcon icon={undefined} fallbackIcon={MockFallbackIcon} />,
        );
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
        unmount3();

        // Test non-existent icon
        const { unmount: unmount4 } = render(
          <EntityIcon icon="nonExistent" fallbackIcon={MockFallbackIcon} />,
        );
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
        unmount4();
      });
    });

    describe('Error Handling and Edge Cases', () => {
      test('handles malformed URLs gracefully', () => {
        // Test non-URL string that contains "http" - still treated as URL
        const { unmount: unmount1 } = render(
          <EntityIcon icon="httpnot-a-url" fallbackIcon={MockFallbackIcon} />,
        );
        expect(document.querySelector('svg')).toBeInTheDocument();
        unmount1();

        // Test broken URL with space
        const { unmount: unmount2 } = render(
          <EntityIcon
            icon="ht tp://broken-space.com"
            fallbackIcon={MockFallbackIcon}
          />,
        );
        expect(document.querySelector('svg')).toBeInTheDocument();
        unmount2();

        // Test potentially unsafe URL
        const { unmount: unmount3 } = render(
          <EntityIcon
            icon="data:text/html,<script>alert('test')</script>"
            fallbackIcon={MockFallbackIcon}
          />,
        );
        expect(document.querySelector('svg')).toBeInTheDocument();
        unmount3();
      });

      test('handles special characters in icon names', () => {
        const specialNames = [
          'icon-with-dash',
          'icon_with_underscore',
          'icon.with.dots',
        ];

        specialNames.forEach(iconName => {
          const { unmount } = render(
            <EntityIcon icon={iconName} fallbackIcon={MockFallbackIcon} />,
          );

          // These should fall back since they won't match Material-UI icon names
          expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();

          unmount();
        });
      });

      test('handles extremely large dimensions', () => {
        render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            width={9999}
            height={9999}
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toHaveStyle({
          fontSize: '9999px',
          width: '9999px',
          height: '9999px',
        });
      });

      test('handles negative dimensions', () => {
        render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            width={-10}
            height={-20}
            x={-5}
            y={-15}
          />,
        );

        const iconWrapper = screen.getByTestId('mui-icon-wrapper');
        expect(iconWrapper).toHaveStyle({
          fontSize: '-10px',
          width: '-10px',
          height: '-20px',
        });
      });
    });

    describe('Performance and Optimization', () => {
      test('renders efficiently with multiple re-renders', () => {
        const { rerender } = render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            width={24}
            height={24}
          />,
        );

        // Re-render with different props
        for (let i = 0; i < 5; i++) {
          rerender(
            <EntityIcon
              icon={`icon-${i}`}
              fallbackIcon={MockFallbackIcon}
              width={24 + i}
              height={24 + i}
              fill={`#${i}${i}${i}${i}${i}${i}`}
            />,
          );
        }

        // Should still render without issues
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();
      });

      test('handles rapid icon type changes', () => {
        const { rerender } = render(
          <EntityIcon icon="info" fallbackIcon={MockFallbackIcon} />,
        );

        // Change to URL
        rerender(
          <EntityIcon
            icon="https://example.com/icon.svg"
            fallbackIcon={MockFallbackIcon}
          />,
        );
        expect(document.querySelector('svg')).toBeInTheDocument();

        // Change to undefined
        rerender(
          <EntityIcon icon={undefined} fallbackIcon={MockFallbackIcon} />,
        );
        expect(screen.getByTestId('mock-fallback-icon')).toBeInTheDocument();

        // Change back to string
        rerender(<EntityIcon icon="warning" fallbackIcon={MockFallbackIcon} />);
        expect(screen.getByTestId('mui-icon-wrapper')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure and Architecture', () => {
    describe('Component Composition', () => {
      test('maintains proper component hierarchy for Material-UI icons', () => {
        render(<EntityIcon icon="info" fallbackIcon={MockFallbackIcon} />);

        const wrapper = screen.getByTestId('mui-icon-wrapper');
        const materialIcon = screen.getByTestId('info-icon');

        expect(wrapper).toContainElement(materialIcon);
      });

      test('maintains proper SVG structure for URL icons', () => {
        render(
          <EntityIcon
            icon="https://example.com/test.svg"
            fallbackIcon={MockFallbackIcon}
          />,
        );

        const svg = document.querySelector('svg');
        const image = svg?.querySelector('image');

        expect(svg).toContainElement(image || null);
        expect(svg?.tagName).toBe('svg');
        expect(image?.tagName).toBe('image');
      });

      test('maintains clean component structure for fallback icons', () => {
        render(<EntityIcon fallbackIcon={MockFallbackIcon} />);

        const fallbackIcon = screen.getByTestId('mock-fallback-icon');
        expect(fallbackIcon.tagName).toBe('svg');
      });
    });

    describe('Props Flow and Inheritance', () => {
      test('correctly spreads props to different rendering paths', () => {
        const commonProps = {
          width: 30,
          height: 30,
          fill: '#123456',
          className: 'shared-class',
        };

        // Test Material-UI icon path
        const { rerender } = render(
          <EntityIcon
            icon="info"
            fallbackIcon={MockFallbackIcon}
            {...commonProps}
          />,
        );

        let element = screen.getByTestId('mui-icon-wrapper');
        expect(element).toHaveClass('shared-class');
        expect(element).toHaveStyle({
          fontSize: '30px',
          width: '30px',
          height: '30px',
          color: '#123456',
        });

        // Test fallback icon path
        rerender(
          <EntityIcon fallbackIcon={MockFallbackIcon} {...commonProps} />,
        );

        element = screen.getByTestId('mock-fallback-icon');
        expect(element).toHaveAttribute('width', '30');
        expect(element).toHaveAttribute('height', '30');
        expect(element).toHaveAttribute('fill', '#123456');
        expect(element).toHaveClass('shared-class');

        // Test SVG image path
        rerender(
          <EntityIcon
            icon="https://example.com/icon.png"
            fallbackIcon={MockFallbackIcon}
            {...commonProps}
          />,
        );

        const svg = document.querySelector('svg');
        const image = svg?.querySelector('image');
        expect(svg).toHaveClass('shared-class');
        expect(image).toHaveAttribute('width', '30');
        expect(image).toHaveAttribute('height', '30');
      });
    });
  });
});
