import { makeStyles, Box } from '@material-ui/core';
import React from 'react';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  svgIcon: {
    display: 'block',
    marginRight: '8px',
  },
});

export function IconLink(props: { href: string; text?: string; Icon?: any }) {
  const { href, text, Icon } = props;
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <img
        src={Icon}
        alt="Icon"
        height={24}
        width={24}
        className={classes.svgIcon}
      />
      <Link to={href} target="_blank" rel="noopener">
        {text || href}
      </Link>
    </Box>
  );
}
