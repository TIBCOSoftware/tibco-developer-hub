import React from 'react';
import './Introduction.css';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const Introduction = () => {
  return (
    <div className="tpdh-intro-container">
      <div className="tpdh-intro-title">What is the TIBCO® Developer Hub ?</div>
      <p className="tpdh-intro-desc">
        Welcome to the TIBCO® Developer Hub. This is a one-stop shop for
        developers on the TIBCO Platform, where you can find and share
        documentation and assets with other developers. Also, you can create new
        TIBCO assets from templates and manage your build pipelines and running
        components.
      </p>
      <Grid container spacing={3} className="tpdh-intro-buttons">
        <Grid item>
          <Link to="/create">
            <button
              type="button"
              className="pl-button pl-button--primary"
              id="tpdh-home-btn-get-started"
            >
              Get started
            </button>
          </Link>
        </Grid>
        <Grid item>
          <Link
            to="https://docs.tibco.com/go/platform-cp/1.2.0/doc/html#cshid=developer_hub_overview"
            target="_blank"
          >
            <button
              type="button"
              className="pl-button pl-button--secondary"
              id="tpdh-home-btn-see-how-it-works"
            >
              See how it works
            </button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};
