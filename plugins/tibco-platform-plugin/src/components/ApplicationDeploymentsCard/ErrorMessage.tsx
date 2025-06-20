/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  error: {
    color: '#db0000',
  },
});

export function ErrorMessage(props: { text: string }) {
  const { text } = props;
  const classes = useStyles();

  return <div className={classes.error}>{text}</div>;
}
