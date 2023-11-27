import React from 'react';
import { Box } from '@material-ui/core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export function BuildInfo() {
  const configApi = useApi(configApiRef);
  const buildInfoConf = configApi.getOptionalConfig('app.buildInfo');
  const showBuildNumber =
    buildInfoConf &&
    buildInfoConf.getOptionalBoolean('show') !== false &&
    buildInfoConf.has('version');
  if (showBuildNumber) {
    return (
      <Box sx={{ color: 'text.secondary' }}>
        Build: {buildInfoConf.getOptional<string | number>('version')}
      </Box>
    );
  }
  return null;
}
