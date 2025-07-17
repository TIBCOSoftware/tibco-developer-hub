/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import MarketplaceHeaderImage from '../../images/mp-header.svg';
import { Link } from 'react-router-dom';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  container: {
    padding: '48px 24px 32px 24px',
    position: 'relative',
    display: 'flex',
    zIndex: 100,
    gridArea: 'pageHeader',
  },
  headerTitle: {
    fontSize: '30px',
  },
  headerDesc: {
    marginTop: '8px',
  },
  headerImage: {
    marginTop: '21px',
    marginLeft: '66px',
    height: 'auto',
  },
  introTitle: {
    marginTop: '42px',
  },
  introDesc: {
    color: '#212121',
    marginTop: '11px',
  },
  learnMore: {
    marginTop: '56px',
  },
});

export const MarketplaceHeader = () => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const docUrl: string = configApi.get('app.docUrl');
  return (
    <div className={classes.container}>
      <Grid container spacing={8}>
        <Grid item md={6}>
          <div
            className={`th-title ${classes.headerTitle}`}
            data-testid="mp-page-header-title"
          >
            Welcome to the TIBCO® Developer Hub Marketplace
          </div>
          <div
            className={`th-subtitle ${classes.headerDesc}`}
            data-testid="mp-page-header-desc"
          >
            TIBCO® Developer Hub is the center for building the apps for
            empowering your organization
          </div>
          <div
            className={`th-title ${classes.introTitle}`}
            data-testid="mp-page-intro-title"
          >
            What is the TIBCO® Developer Hub Marketplace ?
          </div>
          <div
            className={`th-subtitle ${classes.introDesc}`}
            data-testid="mp-page-intro-desc"
          >
            Welcome to the TIBCO® Developer Hub Marketplace, from here you can
            install additional entities into your TIBCO® Developer Hub instance.
            From here you can install documents & examples into your TIBCO®
            Developer Hub. This will help you accelerate your development
            process by adding pre-built templates. This will help you get
            complete insight into your Integration landscape & topology by
            adding import flows to bring in existing TIBCO® code into your
            TIBCO® Developer Hub.
          </div>
          <div className={classes.learnMore}>
            <Link to={docUrl} target="_blank">
              <button type="button" className="pl-button pl-button--primary">
                Learn more
              </button>
            </Link>
          </div>
        </Grid>
        <Grid item md={6}>
          <img
            src={MarketplaceHeaderImage}
            className={classes.headerImage}
            alt="logo"
          />
        </Grid>
      </Grid>
    </div>
  );
};
