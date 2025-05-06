/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { useOutlet } from 'react-router-dom';
import { DefaultImportPage } from '../DefaultImportPage';

/**
 * The whole catalog import page.
 *
 * @public
 */
export const ImportPage = () => {
  const outlet = useOutlet();

  return outlet || <DefaultImportPage />;
};
