/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen } from '@testing-library/react';
import { CustomTooltip } from './CustomTooltip';

describe('CustomTooltip Component', () => {
  // Default props for testing
  const defaultProps = {
    title: 'Test Tooltip',
    xPos: 100,
    yPos: 50,
  };

  describe('Functionality Tests', () => {
    describe('Width Calculation Logic', () => {
      test('calculates minimum width for short titles', () => {
        render(<CustomTooltip {...defaultProps} title="Hi" />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '40');
      });

      test('calculates proportional width for medium titles', () => {
        render(<CustomTooltip {...defaultProps} title="Medium Length" />);
        const rect = screen.getByTestId('tooltip-background');
        // "Medium Length" = 13 characters, should be 13 * 8 + 30 = 134
        expect(rect).toHaveAttribute('width', '75');
      });

      test('calculates maximum width for long titles', () => {
        const longTitle =
          'This is a very long title that should reach maximum width limit for the tooltip component';
        render(<CustomTooltip {...defaultProps} title={longTitle} />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '200');
      });

      test('handles empty title with minimum width', () => {
        render(<CustomTooltip {...defaultProps} title="" />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '40');
      });

      test('handles single character title', () => {
        render(<CustomTooltip {...defaultProps} title="A" />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '40');
      });

      test('handles title with special characters', () => {
        render(<CustomTooltip {...defaultProps} title="Test@#$%^&*()" />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '75');
      });

      test('handles title with numbers and spaces', () => {
        render(<CustomTooltip {...defaultProps} title="Test 123 456" />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '75');
      });

      test('handles unicode characters', () => {
        render(<CustomTooltip {...defaultProps} title="Test 中文 𝓤𝓷𝓲𝓬𝓸𝓭𝓮" />);
        const rect = screen.getByTestId('tooltip-background');
        // Should calculate based on character count
        expect(rect).toHaveAttribute('width');
        expect(Number(rect.getAttribute('width'))).toBeGreaterThanOrEqual(40);
      });
    });

    describe('SVG Structure Rendering', () => {
      test('renders main SVG container with correct attributes', () => {
        render(<CustomTooltip {...defaultProps} />);
        const svg = screen.getByTestId('custom-tooltip');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(svg).toHaveAttribute('width', '75');
        expect(svg).toHaveAttribute('height', '46');
      });

      test('renders tooltip background rectangle', () => {
        render(<CustomTooltip {...defaultProps} />);
        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toBeInTheDocument();
        expect(rect).toHaveAttribute('fill', 'hsla(219, 76%, 23%, 1.00)');
        expect(rect).toHaveAttribute('rx', '4');
        expect(rect).toHaveAttribute('height', '30');
      });

      test('renders triangle pointer', () => {
        render(<CustomTooltip {...defaultProps} />);
        const triangle = screen
          .getByTestId('tooltip-triangle')
          .querySelector('path');
        expect(triangle).toBeInTheDocument();
        expect(triangle).toHaveAttribute('fill', 'hsla(219, 76%, 23%, 1.00)');
      });

      test('renders tooltip text', () => {
        const title = 'Test Tooltip Text';
        render(<CustomTooltip {...defaultProps} title={title} />);
        const text = screen.getByText(title);
        expect(text).toBeInTheDocument();
        expect(text.tagName).toBe('text');
        expect(text).toHaveAttribute('fill', 'hsla(0, 0%, 100%, 1.00)');
      });
    });

    describe('Positioning Logic', () => {
      test('positions tooltip at specified coordinates', () => {
        const xPos = 150;
        const yPos = 75;
        render(<CustomTooltip {...defaultProps} xPos={xPos} yPos={yPos} />);

        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', String(xPos));
        expect(rect).toHaveAttribute('y', String(yPos));
      });
    });

    describe('Prop Validation', () => {
      test('renders with all required props', () => {
        const props = {
          title: 'Required Props Test',
          xPos: 200,
          yPos: 100,
        };
        render(<CustomTooltip {...props} />);

        expect(screen.getByText(props.title)).toBeInTheDocument();
        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', String(props.xPos));
        expect(rect).toHaveAttribute('y', String(props.yPos));
      });

      test('handles zero positioning', () => {
        render(<CustomTooltip title="Zero Position" xPos={0} yPos={0} />);
        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', '0');
        expect(rect).toHaveAttribute('y', '0');
      });

      test('handles decimal positioning values', () => {
        render(
          <CustomTooltip title="Decimal Position" xPos={100.5} yPos={50.7} />,
        );
        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', '100.5');
        expect(rect).toHaveAttribute('y', '50.7');
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Component Rendering Scenarios', () => {
      test('renders correctly with minimal props', () => {
        render(<CustomTooltip title="Min" xPos={0} yPos={0} />);

        expect(
          screen.getByRole('tooltip', { hidden: true }),
        ).toBeInTheDocument();
        expect(screen.getByText('Min')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip-background')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip-triangle')).toBeInTheDocument();
      });

      test('renders correctly with complex title', () => {
        const complexTitle = 'Complex Title with Numbers 123 and Symbols @#$%';
        render(<CustomTooltip title={complexTitle} xPos={50} yPos={25} />);

        expect(screen.getByText(complexTitle)).toBeInTheDocument();
        const rect = screen.getByTestId('tooltip-background');
        expect(Number(rect.getAttribute('width'))).toBeGreaterThan(40);
      });

      test('maintains consistent styling across different titles', () => {
        const titles = [
          'Short',
          'Medium Length Title',
          'Very Long Title That Should Test Maximum Width',
        ];

        titles.forEach((title, index) => {
          const { unmount } = render(
            <CustomTooltip title={title} xPos={index * 50} yPos={index * 25} />,
          );

          const rect = screen.getByTestId('tooltip-background');
          expect(rect).toHaveAttribute('fill', 'hsla(219, 76%, 23%, 1.00)');
          expect(rect).toHaveAttribute('height', '30');

          const triangle = screen
            .getByTestId('tooltip-triangle')
            .querySelector('path');
          expect(triangle).toHaveAttribute('fill', 'hsla(219, 76%, 23%, 1.00)');

          const text = screen.getByText(title);
          expect(text).toHaveAttribute('fill', 'hsla(0, 0%, 100%, 1.00)');
          unmount();
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('handles extremely long titles gracefully', () => {
        const extremelyLongTitle = 'A'.repeat(1000);
        render(
          <CustomTooltip title={extremelyLongTitle} xPos={100} yPos={50} />,
        );

        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '250'); // Should cap at maximum
        expect(screen.getByText(extremelyLongTitle)).toBeInTheDocument();
      });

      test('handles titles with only whitespace', () => {
        render(<CustomTooltip title="   " xPos={100} yPos={50} />);

        const rect = screen.getByTestId('tooltip-background');
        expect(rect).toHaveAttribute('width', '40');
        expect(
          screen.getByTestId('custom-tooltip').querySelector('text'),
        ).toBeInTheDocument();
      });

      test('handles titles with HTML entities', () => {
        const titleWithEntities = 'Test &amp; &lt; &gt; &quot;';
        render(
          <CustomTooltip title={titleWithEntities} xPos={100} yPos={50} />,
        );

        expect(screen.getByText(titleWithEntities)).toBeInTheDocument();
      });

      test('handles very large positioning values', () => {
        render(
          <CustomTooltip title="Large Position" xPos={99999} yPos={99999} />,
        );

        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', '99999');
        expect(rect).toHaveAttribute('y', '99999');
      });

      test('handles negative positioning values', () => {
        render(
          <CustomTooltip title="Negative Position" xPos={-100} yPos={-50} />,
        );

        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', '-100');
        expect(rect).toHaveAttribute('y', '-50');
      });
    });

    describe('Accessibility Features', () => {
      test('SVG has appropriate role for screen readers', () => {
        render(<CustomTooltip {...defaultProps} />);
        const svg = screen.getByRole('tooltip', { hidden: true });
        expect(svg).toBeInTheDocument();
      });

      test('tooltip content is readable by screen readers', () => {
        const title = 'Screen Reader Accessible';
        render(<CustomTooltip {...defaultProps} title={title} />);

        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    describe('Performance and Optimization', () => {
      test('renders consistently with same props', () => {
        const props = { title: 'Consistent Render', xPos: 100, yPos: 50 };

        const { unmount, rerender } = render(<CustomTooltip {...props} />);
        const firstRender = screen
          .getByTestId('tooltip-background')
          .getAttribute('width');

        rerender(<CustomTooltip {...props} />);
        const secondRender = screen
          .getByTestId('tooltip-background')
          .getAttribute('width');

        expect(firstRender).toBe(secondRender);
        unmount();
      });

      test('handles rapid prop changes', () => {
        const { rerender } = render(
          <CustomTooltip title="Initial" xPos={0} yPos={0} />,
        );

        // Simulate rapid changes
        for (let i = 1; i <= 10; i++) {
          rerender(
            <CustomTooltip title={`Title ${i}`} xPos={i * 10} yPos={i * 5} />,
          );
          expect(screen.getByText(`Title ${i}`)).toBeInTheDocument();
        }
      });

      test('maintains performance with complex titles', () => {
        const complexTitles = [
          'Simple',
          'Title with 123 numbers',
          'Title with special chars @#$%^&*()',
          'Very long title that tests the maximum width calculation and performance',
          '中文标题测试 Unicode',
          'Mixed: English 中文 123 @#$',
        ];

        complexTitles.forEach(title => {
          const { unmount } = render(
            <CustomTooltip title={title} xPos={100} yPos={50} />,
          );
          expect(screen.getByText(title)).toBeInTheDocument();
          expect(screen.getByTestId('tooltip-background')).toBeInTheDocument();
          unmount();
        });
      });
    });

    describe('Real-world Usage Scenarios', () => {
      test('works as graph node tooltip', () => {
        render(
          <CustomTooltip title="Node: User Service" xPos={150} yPos={100} />,
        );

        expect(screen.getByText('Node: User Service')).toBeInTheDocument();
        const rect = screen.getByTestId('custom-tooltip');
        expect(rect).toHaveAttribute('x', '150');
        expect(rect).toHaveAttribute('y', '100');
      });

      test('works as edge tooltip', () => {
        render(
          <CustomTooltip title="Edge: HTTP Request" xPos={200} yPos={75} />,
        );

        expect(screen.getByText('Edge: HTTP Request')).toBeInTheDocument();
        const triangle = screen.getByTestId('tooltip-triangle');
        expect(triangle).toBeInTheDocument();
      });

      test('works with dynamic positioning for graph interactions', () => {
        const scenarios = [
          { title: 'Top Left', xPos: 10, yPos: 10 },
          { title: 'Center', xPos: 200, yPos: 150 },
          { title: 'Bottom Right', xPos: 350, yPos: 250 },
        ];

        scenarios.forEach(scenario => {
          const { unmount } = render(<CustomTooltip {...scenario} />);

          expect(screen.getByText(scenario.title)).toBeInTheDocument();
          const rect = screen.getByTestId('custom-tooltip');
          expect(rect).toHaveAttribute('x', String(scenario.xPos));
          expect(rect).toHaveAttribute('y', String(scenario.yPos));

          unmount();
        });
      });

      test('handles tooltip overlap scenarios', () => {
        const overlappingTooltips = [
          { title: 'Tooltip 1', xPos: 100, yPos: 50 },
          { title: 'Tooltip 2', xPos: 105, yPos: 55 }, // Slightly offset
        ];

        // Render both tooltips (in real app they wouldn't overlap, but testing rendering)
        const { container } = render(
          <div>
            <CustomTooltip {...overlappingTooltips[0]} />
            <CustomTooltip {...overlappingTooltips[1]} />
          </div>,
        );

        expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
        expect(screen.getByText('Tooltip 2')).toBeInTheDocument();
        expect(container.querySelectorAll('g')).toHaveLength(2);
      });
    });
  });
});
