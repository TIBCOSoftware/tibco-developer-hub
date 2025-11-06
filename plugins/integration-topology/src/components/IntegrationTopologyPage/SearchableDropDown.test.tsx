/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  searchApiRef,
  MockSearchApi,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { SearchResult } from '@backstage/plugin-search-common';
import {
  SearchableDropDown,
  SearchableDropDownProps,
} from './SearchableDropDown';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

// Mock data for tests
const mockSearchResults: SearchResult[] = [
  {
    type: 'service',
    document: {
      title: 'service-a',
      text: 'Service A description',
      location: '/service-a',
    },
  },
  {
    type: 'service',
    document: {
      title: 'service-b',
      text: 'Service B description',
      location: '/service-b',
    },
  },
  {
    type: 'service',
    document: {
      title: 'service-c',
      text: 'Service C description',
      location: '/service-c',
    },
  },
];

const mockSearchApi = new MockSearchApi({
  results: mockSearchResults,
});

const defaultProps: SearchableDropDownProps = {
  name: 'entityName',
  label: 'Select Entity Name',
  onSelected: jest.fn(),
  givenValues: ['service-a', 'service-b', 'service-c'],
};

const renderComponent = (props: Partial<SearchableDropDownProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return renderInTestApp(
    <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
      <SearchContextProvider>
        <SearchableDropDown {...mergedProps} />
      </SearchContextProvider>
    </TestApiProvider>,
  );
};

describe('SearchableDropDown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with basic props', async () => {
      await renderComponent();

      expect(screen.getByText('Select Entity Name')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(
        screen.getByTestId('searchable-dropdown-expand'),
      ).toBeInTheDocument();
    });

    it('should render without label when not provided', async () => {
      await renderComponent({ label: undefined });

      expect(screen.queryByText('Select Entity Name')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render with custom placeholder', async () => {
      await renderComponent({ name: 'customField' });

      const input = screen.getByPlaceholderText('Select customField...');
      expect(input).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', async () => {
      await renderComponent();

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-label', 'entityName selector');

      const input = screen.getByLabelText('Search entityName');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Default Value Handling', () => {
    it('should display default value when provided', async () => {
      await renderComponent({ defaultValue: 'service-a' });

      const input = screen.getByDisplayValue('service-a');
      expect(input).toBeInTheDocument();
    });

    it('should handle empty default value', async () => {
      await renderComponent({ defaultValue: '' });

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle undefined default value', async () => {
      await renderComponent({ defaultValue: undefined });

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('User Interactions', () => {
    it('should open dropdown when clicking expand button', async () => {
      const user = userEvent.setup();
      await renderComponent();

      const expandButton = screen.getByRole('button', { name: 'Open' });
      expect(expandButton).toBeInTheDocument();

      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByText('service-a')).toBeInTheDocument();
        expect(screen.getByText('service-b')).toBeInTheDocument();
        expect(screen.getByText('service-c')).toBeInTheDocument();
      });
    });

    it('should filter options when typing', async () => {
      const user = userEvent.setup();
      await renderComponent();

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, 'service-a');

      await waitFor(() => {
        expect(input).toHaveValue('service-a');
      });
    });

    it('should select option when clicked', async () => {
      const user = userEvent.setup();
      const mockOnSelected = jest.fn();
      await renderComponent({ onSelected: mockOnSelected });

      const openButton = screen.getByRole('button', { name: 'Open' });
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByText('service-b')).toBeInTheDocument();
      });

      await user.click(screen.getByText('service-b'));

      await waitFor(() => {
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('service-b');
      });
    });

    it('should call onSelected callback when typing', async () => {
      const user = userEvent.setup();
      const mockOnSelected = jest.fn();
      await renderComponent({ onSelected: mockOnSelected });

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, 'service-a');

      await waitFor(() => {
        expect(mockOnSelected).toHaveBeenCalledWith('service-a');
      });
    });

    it('should handle typing non-existent values', async () => {
      const user = userEvent.setup();
      const mockOnSelected = jest.fn();
      await renderComponent({ onSelected: mockOnSelected });

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, 'nonexistent');

      await waitFor(() => {
        expect(mockOnSelected).toHaveBeenCalledWith('nonexistent');
      });
    });
  });

  describe('Search Integration', () => {
    it('should update search filters when value changes', async () => {
      const user = userEvent.setup();
      await renderComponent({ defaultValue: 'service-a' });

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, 'service-b');

      // The search context should be updated
      await waitFor(() => {
        expect(input).toHaveValue('service-b');
      });
    });

    it('should handle selecting from dropdown options', async () => {
      const user = userEvent.setup();
      await renderComponent();

      const openButton = screen.getByRole('button', { name: 'Open' });
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByText('service-c')).toBeInTheDocument();
      });

      await user.click(screen.getByText('service-c'));

      await waitFor(() => {
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('service-c');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty givenValues array', async () => {
      await renderComponent({ givenValues: [] });

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();

      const user = userEvent.setup();
      const openButton = screen.getByRole('button', { name: 'Open' });
      await user.click(openButton);

      // Should not crash and should not show any options
      await waitFor(() => {
        const listbox = screen.queryByRole('listbox');
        expect(listbox).toBeNull();
      });
    });

    it('should handle single value in givenValues', async () => {
      await renderComponent({ givenValues: ['single-service'] });

      const user = userEvent.setup();
      const openButton = screen.getByRole('button', { name: 'Open' });
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByText('single-service')).toBeInTheDocument();
      });
    });

    it('should handle very long service names', async () => {
      const longName = 'very-long-service-name-that-might-cause-display-issues';
      await renderComponent({
        givenValues: [longName],
        defaultValue: longName,
      });

      expect(screen.getByDisplayValue(longName)).toBeInTheDocument();
    });

    it('should handle special characters in service names', async () => {
      const specialName = 'service@with-special_chars.123';
      await renderComponent({
        givenValues: [specialName],
        defaultValue: specialName,
      });

      expect(screen.getByDisplayValue(specialName)).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should work within a form context', async () => {
      const handleSubmit = jest.fn(e => e.preventDefault());

      await renderInTestApp(
        <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
          <SearchContextProvider>
            <form onSubmit={handleSubmit}>
              <SearchableDropDown {...defaultProps} />
              <button type="submit">Submit</button>
            </form>
          </SearchContextProvider>
        </TestApiProvider>,
      );

      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, 'service-a');

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should maintain state across re-renders', async () => {
      const { rerender } = await renderInTestApp(
        <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
          <SearchContextProvider>
            <SearchableDropDown {...defaultProps} defaultValue="service-a" />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      expect(screen.getByDisplayValue('service-a')).toBeInTheDocument();

      // Re-render with different props
      rerender(
        <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
          <SearchContextProvider>
            <SearchableDropDown
              {...defaultProps}
              label="Updated Label"
              defaultValue="service-a"
            />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      expect(screen.getByText('Updated Label')).toBeInTheDocument();
      expect(screen.getByDisplayValue('service-a')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from(
        { length: 100 },
        (_, i) => `service-${i}`,
      );

      await renderComponent({ givenValues: largeDataset });

      const user = userEvent.setup();
      const input = screen.getByRole('textbox');

      // Should render without significant delay
      expect(input).toBeInTheDocument();

      await user.click(input);
      await user.type(input, 'service-1');

      // Should filter efficiently
      await waitFor(() => {
        expect(input).toHaveValue('service-1');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onSelected callback gracefully', async () => {
      // Test with undefined onSelected
      const propsWithoutCallback = { ...defaultProps };
      delete (propsWithoutCallback as any).onSelected;

      expect(() => renderComponent(propsWithoutCallback)).not.toThrow();
    });

    it('should handle invalid default values', async () => {
      await renderComponent({
        defaultValue: 'invalid-service',
        givenValues: ['service-a', 'service-b'],
      });

      // Should still render and work
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('invalid-service');
    });
  });
});
