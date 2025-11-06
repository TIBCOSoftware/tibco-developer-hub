/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomPopOver } from './CustomPopOver';

// Mock Material-UI components
jest.mock('@mui/material/Popover', () => {
  return function MockPopover({
    children,
    open,
    slotProps,
    className,
    id,
  }: any) {
    return open ? (
      <div
        data-testid="mui-popover"
        onMouseLeave={slotProps?.paper?.onMouseLeave}
        className={className}
        id={id}
      >
        {children}
      </div>
    ) : null;
  };
});

jest.mock('@mui/material/Typography', () => {
  return function MockTypography({ children, onMouseEnter, ...props }: any) {
    return (
      <span data-testid="mui-typography" onMouseEnter={onMouseEnter} {...props}>
        {children}
      </span>
    );
  };
});

jest.mock('@material-ui/core', () => ({
  Paper: function MockPaper({ children, className }: any) {
    return (
      <div data-testid="mui-paper" className={className}>
        {children}
      </div>
    );
  },
  makeStyles: () => () => ({
    popover: 'mock-popover-class',
    paper: 'mock-paper-class',
  }),
}));

// Mock CustomIcon component
jest.mock('./CustomIcon', () => ({
  CustomIcon: function MockCustomIcon({ onClick, id }: any) {
    return (
      <button data-testid="custom-icon" onClick={onClick} id={id}>
        Copy Icon
      </button>
    );
  },
}));

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('CustomPopOver Component', () => {
  const defaultProps = {
    label: 'Test Label',
    popOverContent: 'Test popover content',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  describe('Functionality Tests', () => {
    describe('Basic Rendering', () => {
      test('renders with required props', () => {
        render(<CustomPopOver {...defaultProps} />);

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
      });

      test('renders label correctly', () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('aria-haspopup', 'true');
      });

      test('initially popover is closed', () => {
        render(<CustomPopOver {...defaultProps} />);

        expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Test popover content'),
        ).not.toBeInTheDocument();
      });

      test('renders with different label text', () => {
        render(
          <CustomPopOver label="Different Label" popOverContent="Content" />,
        );

        expect(screen.getByText('Different Label')).toBeInTheDocument();
        expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
      });
    });

    describe('Popover State Management', () => {
      test('opens popover on mouse enter', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });
      });

      test('closes popover on mouse leave from paper', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        const popover = screen.getByTestId('mui-popover');
        fireEvent.mouseLeave(popover);

        await waitFor(() => {
          expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        });
      });

      test('shows popover content when open', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByText('Test popover content')).toBeInTheDocument();
        });
      });

      test('handles multiple open/close cycles', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');

        // First cycle
        fireEvent.mouseEnter(label);
        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        fireEvent.mouseLeave(screen.getByTestId('mui-popover'));
        await waitFor(() => {
          expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        });

        // Second cycle
        fireEvent.mouseEnter(label);
        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });
      });
    });

    describe('Accessibility', () => {
      test('has correct aria attributes when closed', () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        expect(label).toHaveAttribute('aria-haspopup', 'true');
        expect(label).not.toHaveAttribute('aria-owns');
      });

      test('has correct aria attributes when open', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(label).toHaveAttribute('aria-owns', 'mouse-over-popover');
        });
      });

      test('popover has correct id', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const popover = screen.getByTestId('mui-popover');
          expect(popover).toHaveAttribute('id', 'mouse-over-popover');
        });
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Clipboard Functionality', () => {
      test('copies content to clipboard when copy icon is clicked', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        // Click copy icon
        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledWith('Test popover content');
      });

      test('closes popover after copy operation', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        // Click copy icon
        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        await waitFor(() => {
          expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        });
      });

      test('handles clipboard write operation', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        // Click copy icon
        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledWith('Test popover content');

        // Popover should close after copy
        await waitFor(() => {
          expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        });
      });
    });

    describe('CustomIcon Integration', () => {
      test('renders CustomIcon with correct props', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const copyIcon = screen.getByTestId('custom-icon');
          expect(copyIcon).toBeInTheDocument();
          expect(copyIcon).toHaveAttribute('id', 'details-copy-icon');
        });
      });

      test('CustomIcon click triggers clipboard and close', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        // Click copy icon
        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        });
      });
    });

    describe('Material-UI Integration', () => {
      test('applies custom styles to components', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const popover = screen.getByTestId('mui-popover');
          expect(popover).toHaveClass('mock-popover-class');

          const paper = screen.getByTestId('mui-paper');
          expect(paper).toHaveClass('mock-paper-class');
        });
      });

      test('handles Popover positioning props', async () => {
        render(<CustomPopOver {...defaultProps} />);

        // Open popover
        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const popover = screen.getByTestId('mui-popover');
          expect(popover).toBeInTheDocument();
          // The positioning props are handled by Material-UI internally
          expect(popover).toHaveAttribute('id', 'mouse-over-popover');
        });
      });
    });
  });

  describe('Real-world Scenarios', () => {
    describe('Common Use Cases', () => {
      test('handles long content strings', async () => {
        const longContent =
          'This is a very long popover content that might wrap multiple lines and should be handled gracefully by the component.';

        render(
          <CustomPopOver label="Long Content" popOverContent={longContent} />,
        );

        const label = screen.getByText('Long Content');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByText(longContent)).toBeInTheDocument();
        });

        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledWith(longContent);
      });

      test('handles multiple CustomPopOver instances', async () => {
        render(
          <div>
            <CustomPopOver label="First" popOverContent="First content" />
            <CustomPopOver label="Second" popOverContent="Second content" />
          </div>,
        );

        const firstLabel = screen.getByText('First');
        const secondLabel = screen.getByText('Second');

        expect(firstLabel).toBeInTheDocument();
        expect(secondLabel).toBeInTheDocument();

        // Test first popover
        fireEvent.mouseEnter(firstLabel);
        await waitFor(() => {
          expect(screen.getByText('First content')).toBeInTheDocument();
        });
      });

      test('handles rapid mouse enter/leave events', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');

        // Rapid events
        fireEvent.mouseEnter(label);
        fireEvent.mouseLeave(label);
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });
      });
    });

    describe('Error Handling and Edge Cases', () => {
      test('handles empty label', () => {
        render(<CustomPopOver label="" popOverContent="Content" />);

        const typography = screen.getByTestId('mui-typography');
        expect(typography).toBeInTheDocument();
      });

      test('handles empty popover content', async () => {
        render(<CustomPopOver label="Label" popOverContent="" />);

        const label = screen.getByText('Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledWith('');
      });

      test('handles special characters in content', async () => {
        const specialContent = 'Special chars: !@#$%^&*()[]{}|;":,.<>?/~`';

        render(
          <CustomPopOver label="Special" popOverContent={specialContent} />,
        );

        const label = screen.getByText('Special');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByText(specialContent)).toBeInTheDocument();
        });

        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledWith(specialContent);
      });

      test('handles unicode and emoji content', async () => {
        const unicodeContent = '🚀 Unicode test: 测试 🎉 العربية';

        render(
          <CustomPopOver label="Unicode" popOverContent={unicodeContent} />,
        );

        const label = screen.getByText('Unicode');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByText(unicodeContent)).toBeInTheDocument();
        });

        const copyIcon = screen.getByTestId('custom-icon');
        fireEvent.click(copyIcon);

        expect(mockWriteText).toHaveBeenCalledWith(unicodeContent);
      });

      test('tests clipboard API availability', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        const copyIcon = screen.getByTestId('custom-icon');

        // Component requires clipboard API to function properly
        expect(navigator.clipboard).toBeDefined();
        expect(navigator.clipboard.writeText).toBeDefined();

        // Normal operation should work
        fireEvent.click(copyIcon);
        expect(mockWriteText).toHaveBeenCalledWith('Test popover content');
      });

      test('handles very long labels', () => {
        const longLabel =
          'This is a very long label that might cause layout issues if not handled properly';

        render(<CustomPopOver label={longLabel} popOverContent="Content" />);

        expect(screen.getByText(longLabel)).toBeInTheDocument();
      });
    });

    describe('Performance and User Experience', () => {
      test('maintains popover state during rapid interactions', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');

        // Simulate rapid mouse movements
        for (let i = 0; i < 5; i++) {
          fireEvent.mouseEnter(label);
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });
      });

      test('handles multiple copy operations', async () => {
        render(<CustomPopOver {...defaultProps} />);

        for (let i = 0; i < 3; i++) {
          const label = screen.getByText('Test Label');
          fireEvent.mouseEnter(label);

          await waitFor(() => {
            expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
          });

          const copyIcon = screen.getByTestId('custom-icon');
          fireEvent.click(copyIcon);

          await waitFor(() => {
            expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
          });

          // Small delay to ensure state is clean between operations
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        expect(mockWriteText).toHaveBeenCalledTimes(3);
      });

      test('does not interfere with other page interactions', async () => {
        render(
          <div>
            <CustomPopOver {...defaultProps} />
            <button data-testid="external-button">External Button</button>
          </div>,
        );

        const externalButton = screen.getByTestId('external-button');
        const label = screen.getByText('Test Label');

        // Open popover
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        // External button should still be clickable
        fireEvent.click(externalButton);
        expect(externalButton).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure and Architecture', () => {
    describe('Component Composition', () => {
      test('maintains proper component hierarchy', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const popover = screen.getByTestId('mui-popover');
          const paper = screen.getByTestId('mui-paper');
          const content = screen.getByText('Test popover content');
          const copyIcon = screen.getByTestId('custom-icon');

          expect(popover).toContainElement(paper);
          expect(paper).toContainElement(content);
          expect(paper).toContainElement(copyIcon);
        });
      });

      test('applies correct CSS classes', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const popover = screen.getByTestId('mui-popover');
          const paper = screen.getByTestId('mui-paper');

          expect(popover).toHaveClass('mock-popover-class');
          expect(paper).toHaveClass('mock-paper-class');
        });
      });
    });

    describe('Props Flow and Event Handling', () => {
      test('correctly passes props to child components', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');
        fireEvent.mouseEnter(label);

        await waitFor(() => {
          const copyIcon = screen.getByTestId('custom-icon');
          expect(copyIcon).toHaveAttribute('id', 'details-copy-icon');
        });
      });

      test('handles state updates correctly', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');

        // Initially closed
        expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();

        // Open
        fireEvent.mouseEnter(label);
        await waitFor(() => {
          expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
        });

        // Close via mouse leave
        const popover = screen.getByTestId('mui-popover');
        fireEvent.mouseLeave(popover);
        await waitFor(() => {
          expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
        });
      });

      test('maintains state consistency during interactions', async () => {
        render(<CustomPopOver {...defaultProps} />);

        const label = screen.getByText('Test Label');

        // Multiple open/close cycles should work consistently
        for (let i = 0; i < 3; i++) {
          fireEvent.mouseEnter(label);
          await waitFor(() => {
            expect(screen.getByTestId('mui-popover')).toBeInTheDocument();
          });

          fireEvent.mouseLeave(screen.getByTestId('mui-popover'));
          await waitFor(() => {
            expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument();
          });
        }
      });
    });
  });
});
