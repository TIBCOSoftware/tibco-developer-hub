/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { RegisterExistingButton } from './RegisterExistingButton';
import { usePermission } from '@backstage/plugin-permission-react';

jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: jest.fn(),
}));

describe('RegisterExistingButton for import flow', () => {
  beforeEach(() => {
    (usePermission as jest.Mock).mockClear();
  });

  it('should not render if to is unset', async () => {
    (usePermission as jest.Mock).mockReturnValue({ allowed: true });

    await renderInTestApp(<RegisterExistingButton title="Pick me" />);

    expect(screen.queryByText('Pick me')).not.toBeInTheDocument();
  });

  it('should not render if permissions are not allowed', async () => {
    (usePermission as jest.Mock).mockReturnValue({ allowed: false });
    await renderInTestApp(<RegisterExistingButton title="Pick me" to="blah" />);

    expect(screen.queryByText('Pick me')).not.toBeInTheDocument();
  });

  it('should render the button with the text', async () => {
    (usePermission as jest.Mock).mockReturnValue({ allowed: true });
    await renderInTestApp(<RegisterExistingButton title="Pick me" to="blah" />);

    expect(screen.getByText('Pick me')).toBeInTheDocument();
  });
});
