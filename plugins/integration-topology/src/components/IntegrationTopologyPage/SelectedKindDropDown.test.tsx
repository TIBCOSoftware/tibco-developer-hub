/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { waitFor, render, fireEvent } from '@testing-library/react';
import { SelectedKindDropDown } from './SelectedKindDropDown';

describe('SelectedKindDropDown', () => {
  const mockEntityTypes = [
    { label: 'Component', value: 'Component' },
    { label: 'System', value: 'System' },
    { label: 'API', value: 'API' },
    { label: 'Group', value: 'Group' },
    { label: 'Template', value: 'Template' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with label', () => {
    const { getByText } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    expect(getByText('Select Entity Kind')).toBeInTheDocument();
  });

  it('should render without label when showLabel is false', () => {
    const { queryByText } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
        showLabel={false}
      />,
    );

    expect(queryByText('Select Entity Kind')).not.toBeInTheDocument();
  });

  it('should render with wrapper by default', () => {
    const { container } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    const wrapper = container.querySelector('[class*="MuiBox-root"]');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render without wrapper when showWrapper is false', () => {
    const { container } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
        showWrapper={false}
      />,
    );

    const formControl = container.querySelector('[class*="formControl"]');
    expect(formControl).toBeInTheDocument();
  });

  it('should render icon for selected kind', () => {
    const { container } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should open dropdown menu on click', async () => {
    const { container, getByRole } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    const button = container.querySelector('[role="button"]');
    expect(button).toBeInTheDocument();

    if (button) {
      fireEvent.mouseDown(button);
    }

    await waitFor(() => {
      const listbox = getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
  });

  it('should call onChange when option is selected', async () => {
    const { container, getByRole } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    const button = container.querySelector('[role="button"]');
    if (button) {
      fireEvent.mouseDown(button);
    }

    await waitFor(() => {
      const listbox = getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    const options = getByRole('listbox').querySelectorAll('[role="option"]');
    expect(options.length).toBe(mockEntityTypes.length);

    // Click second option (System)
    fireEvent.click(options[1]);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should render all items in dropdown', async () => {
    const { container, getByRole } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    const button = container.querySelector('[role="button"]');
    if (button) {
      fireEvent.mouseDown(button);
    }

    await waitFor(() => {
      const listbox = getByRole('listbox');
      const options = listbox.querySelectorAll('[role="option"]');
      expect(options.length).toBe(mockEntityTypes.length);
    });
  });

  it('should display icons with tooltips', async () => {
    const { container } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    // Should have icon in selected value
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();

    // Icon should be inside a span element
    const iconParent = icon?.parentElement;
    expect(iconParent?.tagName.toLowerCase()).toBe('span');
  });

  it('should handle empty items array', () => {
    const { container } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected=""
        onChange={mockOnChange}
        items={[]}
      />,
    );

    const formControl = container.querySelector('[class*="formControl"]');
    expect(formControl).toBeInTheDocument();
  });

  it('should apply custom styling classes', () => {
    const { container } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={mockOnChange}
        items={mockEntityTypes}
      />,
    );

    const formControl = container.querySelector('[class*="formControl"]');
    expect(formControl).toBeInTheDocument();

    const select = container.querySelector('[class*="select"]');
    expect(select).toBeInTheDocument();
  });
});
