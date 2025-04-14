/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { Box } from '@material-ui/core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export function BuildInfo() {
  const configApi = useApi(configApiRef);
  const buildInfoConf: string | undefined =
    configApi.getOptional('app.buildVersion');
  const showBuildVersion = configApi.getOptionalBoolean('app.showBuildVersion');
  const showBuildNumber = buildInfoConf && showBuildVersion;

  if (showBuildNumber) {
    return <Box sx={{ color: 'text.secondary' }}>Build: {buildInfoConf}</Box>;
  }
  return null;
}
