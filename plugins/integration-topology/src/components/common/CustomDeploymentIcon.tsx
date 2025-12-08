/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import dev from '../../assets/icons/icon-env-dev.svg';
import testing from '../../assets/icons/icon-env-testing.svg';
import qa from '../../assets/icons/icon-env-qa.svg';
import prod from '../../assets/icons/icon-env-prod.svg';
import image from '../../assets/icons/icon-env-image.svg';
import circle from '../../assets/icons/icon-env-circle.svg';
import flogo from '../../assets/icons/icon-app-flogo.svg';
import bwce from '../../assets/icons/icon-app-bwce.svg';

import { makeStyles } from '@material-ui/core';

declare type CustomIconProps = {
  id?: string;
  height?: number;
  width?: number;
  iconName: string;
  x?: number;
  y?: number;
  to?: string;
  onClick?: () => void;
};

export const useIconStyles = makeStyles({
  linkBarIcon: {
    color: 'hsla(219, 76%, 23%, 1.00)',
    cursor: 'pointer',

    '&:hover': {
      color: 'hsla(213, 82%, 49%, 1.00)',
    },

    '&:active': {
      opacity: 0.8,
    },
  },
});

export const CustomDeploymentIcon = (props: CustomIconProps) => {
  const id = `${props?.id}`;
  const classes = useIconStyles();

  function getEnvIcon(iconName: string) {
    const env = iconName.split('-')[1]?.toLowerCase() || '';
    switch (env) {
      case 'dev':
        return dev;
      case 'testing':
        return testing;
      case 'qa':
        return qa;
      case 'prod':
        return prod;
      default:
        return '';
    }
  }

  function getAppIcon(iconName: string) {
    const app = iconName.split('-')[0]?.toLowerCase() || '';

    switch (app) {
      case 'bwce':
        return bwce;
      case 'flogo':
        return flogo;
      default:
        return image;
    }
  }

  return (
    <svg
      id={`${id}`}
      data-testid={`deployment-icon-${props.iconName}`}
      viewBox={`0 0 ${props?.width === undefined ? 24 : props.width} ${
        props?.height === undefined ? 24 : props.height
      }`}
      width={props?.width === undefined ? 24 : props.width}
      height={props?.height === undefined ? 24 : props.height}
      x={props?.x || 0}
      y={props?.y || 0}
      className={classes.linkBarIcon}
      onClick={props.onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width={props?.width || 24}
        height={props?.height || 24}
        x={0}
        y={0}
        fill="transparent"
        pointerEvents="fill"
      />
      {circle && (
        <use
          href={circle}
          x={0}
          y={0}
          width={props?.width || 24}
          height={props?.height || 24}
        />
      )}

      {getAppIcon(props.iconName) && (
        <use
          href={getAppIcon(props.iconName)}
          x={id.includes('details') ? 3 : 2}
          y={id.includes('details') ? 3 : 2}
          width={id.includes('details') ? 18 : 12}
          height={id.includes('details') ? 18 : 12}
        />
      )}

      {getEnvIcon(props.iconName) && (
        <use
          href={getEnvIcon(props.iconName)}
          x={id.includes('details') ? 14 : 10}
          y={id.includes('details') ? 14 : 10}
          width={id.includes('details') ? 10 : 6}
          height={id.includes('details') ? 10 : 6}
        />
      )}
    </svg>
  );
};
