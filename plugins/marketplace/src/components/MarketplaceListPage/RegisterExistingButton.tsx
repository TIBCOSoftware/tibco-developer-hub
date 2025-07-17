/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { usePermission } from '@backstage/plugin-permission-react';
import { Theme } from '@material-ui/core/styles';

/**
 * Properties for {@link RegisterExistingButton}
 *
 * @alpha
 */
export type RegisterExistingButtonProps = {
  title: string;
} & Partial<Pick<LinkProps, 'to'>>;

/**
 * A button that helps users to register an existing component.
 * @alpha
 */
export const RegisterExistingButton = (props: RegisterExistingButtonProps) => {
  const { title, to } = props;
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission,
  });
  const isXSScreen = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down('xs'),
  );

  if (!to || !allowed) {
    return null;
  }

  return isXSScreen ? (
    <IconButton
      component={RouterLink}
      color="primary"
      title={title}
      size="small"
      to={to}
    >
      <AddCircleOutline />
    </IconButton>
  ) : (
    <Button component={RouterLink} variant="contained" color="primary" to={to}>
      {title}
    </Button>
  );
};
