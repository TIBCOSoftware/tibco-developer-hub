import React from 'react';
import './Introduction.css';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const Introduction = () => {
  return (
    <div className="tpdh-intro-container">
      <div className="tpdh-intro-title">What is the TIBCO® Developer Hub ?</div>
      <p className="tpdh-intro-desc">
        Welcome to the TIBCO® Developer Hub. This is a one-stop shop for a
        developers on TIBCO Platform, here you can find and share documentation
        and assets with other developers. Aso you can create new TIBCO assets
        based on templates, you can manage and view your build pipelines and
        running components
      </p>
      <Grid container spacing={3} className="tpdh-intro-buttons">
        <Grid item>
          <Link to="/create">
            <button type="button" className="pl-button pl-button--primary">
              Get Started
            </button>
          </Link>
        </Grid>
        <Grid item>
          <Link to="/docs">
            <button type="button" className="pl-button pl-button--secondary">
              See how it works
            </button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};
