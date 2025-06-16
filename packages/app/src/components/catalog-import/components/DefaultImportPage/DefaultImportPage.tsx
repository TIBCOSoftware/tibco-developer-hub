/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Grid, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import {
  ImportInfoCard,
  ImportStepper,
} from '@backstage/plugin-catalog-import';

/**
 * The default catalog import page.
 *
 * @public
 */
export const DefaultImportPage = () => {
  const theme = useTheme();
  const configApi = useApi(configApiRef);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appTitle: string = configApi.getOptional('app.title') || 'Backstage';

  const contentItems = [
    <Grid item xs={12} md={4} lg={6} xl={8} key={1}>
      <ImportInfoCard
        exampleLocationUrl="https://github.com/TIBCOSoftware/tibco-developer-hub/blob/main/tibco-examples/tibco-examples.yaml"
        exampleRepositoryUrl="https://github.com/TIBCOSoftware/tibco-developer-hub"
      />
    </Grid>,

    <Grid item xs={12} md={8} lg={6} xl={4} key={2}>
      <ImportStepper />
    </Grid>,
  ];
  const reverseContentItems = [...contentItems].reverse();
  return (
    <Page themeId="home">
      <Header title="Register an existing component" />
      <Content>
        <ContentHeader title={`Start tracking your component in ${appTitle}`}>
          <SupportButton>
            Start tracking your component in {appTitle} by adding it to the
            software catalog.
          </SupportButton>
        </ContentHeader>

        <Grid container spacing={2}>
          {isMobile ? contentItems : reverseContentItems}
        </Grid>
      </Content>
    </Page>
  );
};
