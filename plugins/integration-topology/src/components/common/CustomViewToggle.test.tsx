/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { CustomViewToggle } from './CustomViewToggle';
import { renderInTestApp } from '@backstage/test-utils';

describe('<CustomViewToggle />', () => {
  it('renders correctly', async () => {
    await renderInTestApp(
      <CustomViewToggle
        view="topology"
        setView={() => {}}
        viewOptions={['topology', 'graph']}
      />,
    );

    expect(screen.getByText('Topology View')).toBeInTheDocument();
    expect(screen.getByText('Graph View')).toBeInTheDocument();
  });

  it('toggles view on click', async () => {
    await renderInTestApp(
      <CustomViewToggle
        view="topology"
        setView={() => {}}
        viewOptions={['topology', 'graph']}
      />,
    );
    const input = screen.getByLabelText('Graph View');
    await user.click(input);
    expect(input).toBeChecked();
    expect(screen.getByLabelText('Topology View')).not.toBeChecked();
  });
});
