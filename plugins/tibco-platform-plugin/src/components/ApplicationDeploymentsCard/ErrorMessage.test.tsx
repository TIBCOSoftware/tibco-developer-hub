/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { ErrorMessage } from './ErrorMessage.tsx';

describe('<ErrorMessage> for tibco-platform-plugin', () => {
  it('should render error message', async () => {
    await renderInTestApp(<ErrorMessage text="error1" />);

    expect(screen.getByText('error1')).toBeInTheDocument();
  });
});
