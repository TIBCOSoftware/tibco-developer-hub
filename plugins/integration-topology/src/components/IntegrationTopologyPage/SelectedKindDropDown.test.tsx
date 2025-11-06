/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { waitFor, render, within } from '@testing-library/react';
import { SelectedKindDropDown } from './SelectedKindDropDown';
import user from '@testing-library/user-event';

describe('<SelectedKindDropDown/>', () => {
  const mockEntityTypes = [
    { label: 'Component', value: 'Component' },
    { label: 'System', value: 'System' },
    { label: 'API', value: 'API' },
    { label: 'Group', value: 'Group' },
    { label: 'Template', value: 'Template' },
  ];
  it('should display default value supplied', async () => {
    const { queryByText, getByText } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={() => {}}
        items={mockEntityTypes}
      />,
    );

    expect(getByText('Select Entity Kind')).toBeInTheDocument();
    expect(getByText('Component')).toBeInTheDocument();
    // Verify dropdown is initially closed
    expect(queryByText('System')).not.toBeInTheDocument();
  });

  it('should open options menu on button click', async () => {
    const { getByText, getByRole } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={() => {}}
        items={mockEntityTypes}
      />,
    );
    const buttonElement = getByRole('button', {
      name: 'Component',
    });
    expect(buttonElement).toBeInTheDocument();
    await waitFor(() => user.click(buttonElement));
    await waitFor(() => {
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('API')).toBeInTheDocument();
      expect(getByText('Group')).toBeInTheDocument();
      expect(getByText('Template')).toBeInTheDocument();
    });
  });

  it('should be able to select new option and it gets updated into selected', async () => {
    const { getByText, getByTestId } = render(
      <SelectedKindDropDown
        label="Select Entity Kind"
        selected="Component"
        onChange={() => {}}
        items={mockEntityTypes}
      />,
    );
    const input = getByTestId('select');
    const button = within(input).getByRole('button');
    await waitFor(() => user.click(button));
    await waitFor(() => {
      expect(getByText('System')).toBeInTheDocument();
      expect(getByText('Group')).toBeInTheDocument();
      expect(getByText('API')).toBeInTheDocument();
    });
    const option = getByText('System');
    await user.click(option);
    await waitFor(() => {
      expect(input.textContent).toBe('System');
    });
  });
});
