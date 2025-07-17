/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { IconComponent } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

export interface CardLinkProps {
  icon: IconComponent;
  text: string;
  url: string;
}

const useStyles = makeStyles(() => ({
  linkText: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const CardLink = ({ icon: Icon, text, url }: CardLinkProps) => {
  const styles = useStyles();
  return (
    <div className={styles.linkText}>
      <Icon fontSize="small" />
      <Link
        style={{ marginLeft: '8px' }}
        to={url}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {text || url}
      </Link>
    </div>
  );
};
