import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CodeSnippet } from '@backstage/core-components';

const ENTITY_YAML = `metadata:
  name: example
  tags:
    - platform
  tibcoPlatformApps:
    - appType: BWCE
      appName: BWCE-app
      dataPlaneName: DP-dev
      dpId: demodpid1
      capabilityInstanceId: democapabilityInstanceid1
      appId: demoappid1
    - appType: BWCE
      appName: BWCE-app1
      dataPlaneName: DP-prod
      dpId: demodpid2
      capabilityInstanceId: democapabilityInstanceid2
      appId: demoappid2`;

/** @public */
export type DeploymentsEmptyStateClassKey = 'code';

const useStyles = makeStyles(
  theme => ({
    code: {
      borderRadius: 6,
      margin: theme.spacing(2, 0),
      background:
        theme.palette.type === 'dark' ? '#444' : theme.palette.common.white,
    },
  }),
  { name: 'PlatformDeploymentsEmptyState' },
);

export function DeploymentsEmptyState() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="body1">
        No TIBCO platform application deployments defined for this entity. You
        can add TIBCO platform application deployment to your entity YAML as
        shown in the highlighted example below:
      </Typography>
      <div className={classes.code}>
        <CodeSnippet
          text={ENTITY_YAML}
          language="yaml"
          showLineNumbers
          highlightedNumbers={[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        target="_blank"
        href="https://docs.tibco.com/go/platform-cp/1.2.0/doc/html#cshid=platform_app_deployment"
      >
        Read more
      </Button>
    </>
  );
}
