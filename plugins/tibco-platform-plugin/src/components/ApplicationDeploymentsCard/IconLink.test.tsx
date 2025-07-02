/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { IconLink } from './IconLink.tsx';

describe('<IconLink> for tibco-platform-plugin', () => {
  it('should render icon link', async () => {
    await renderInTestApp(
      <IconLink href="https://test.com" text="text1" Icon="icon1" />,
    );

    expect(screen.getByText('text1')).toHaveAttribute(
      'href',
      'https://test.com',
    );
  });
});
