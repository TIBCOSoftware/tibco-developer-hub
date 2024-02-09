import React from 'react';
import './JumpStart.css';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import OpenIcon from '../../images/open.svg';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#0E2D65',
    color: '#FFF',
    maxWidth: 220,
    fontSize: 14,
    fontWeight: 400,
    padding: 16,
  },
  arrow: {
    color: '#0E2D65',
  },
}))(Tooltip);

export const JumpStart = () => {
  return (
    <div className="tpdh-js-container">
      <Grid
        container
        justifyContent="space-between"
        spacing={4}
        alignItems="center"
      >
        <Grid item md={9}>
          <div className="tpdh-js-title">
            Ready to jump right in? Start developing
          </div>
          <div className="tpdh-js-desc">
            Develop TIBCO assets using templates. Choose a template and then you
            will be asked a series of questions, based on which we will generate
            <span className="tpdh-js-open-icon">
              <HtmlTooltip
                title="View existing components"
                arrow
                placement="right"
              >
                <Link
                  to="/catalog?filters[kind]=component"
                  className="tpdh-js-open-icon-link"
                >
                  <img src={OpenIcon} height={16} width={16} alt="logo" />
                </Link>
              </HtmlTooltip>
            </span>
          </div>
        </Grid>
        <Grid item>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Link to="/create">
                <button
                  type="button"
                  className="pl-button pl-button--secondary tpdh-js-btn"
                  id="tpdh-home-btn-create-new-component"
                >
                  Create new component
                </button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/catalog-import">
                <button
                  type="button"
                  className="pl-button pl-button--no-border tpdh-js-btn"
                  id="tpdh-home-btn-register-existing"
                >
                  Register existing component
                </button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
