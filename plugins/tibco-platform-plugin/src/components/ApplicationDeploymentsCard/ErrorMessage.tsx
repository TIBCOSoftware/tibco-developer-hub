/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main,
  },
}));

export function ErrorMessage(props: { text: string }) {
  const { text } = props;
  const classes = useStyles();

  return <div className={classes.error}>{text}</div>;
}
