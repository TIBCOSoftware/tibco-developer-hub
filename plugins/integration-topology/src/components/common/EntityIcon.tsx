/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { MouseEventHandler, ComponentType } from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import SvgIcon, {
  SvgIconTypeMap,
  SvgIconProps,
} from '@material-ui/core/SvgIcon';
import { IconComponent } from '@backstage/core-plugin-api';
import { Icon } from '@material-ui/core';
// eslint-disable-next-line
import * as MuiIcons from '@material-ui/icons';

interface EntityIconProps extends SvgIconProps {
  icon?: string | IconComponent;
  fallbackIcon?: IconComponent;
}

const IconResolver = ({ icon, fallbackIcon, ...props }: EntityIconProps) => {
  const CustomIconComponent = (MuiIcons as Record<string, ComponentType<any>>)[
    icon as string
  ];

  if (!CustomIconComponent) {
    const EIcon =
      (fallbackIcon as OverridableComponent<SvgIconTypeMap>) ?? SvgIcon;
    return <EIcon {...props} />;
  }

  return (
    <Icon
      component={CustomIconComponent}
      style={{
        fontSize: props.width,
        width: props.width,
        height: props.height,
        color: props.fill,
      }}
      {...props}
    />
  );
};

export function EntityIcon({
  icon,
  fallbackIcon,
  ...props
}: {
  icon?: IconComponent | string;
  fallbackIcon: IconComponent;
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) {
  if (typeof icon === 'string') {
    if (icon && icon.includes('http')) {
      return (
        <svg className={props?.className} onClick={props.onClick}>
          <image
            href={icon}
            width={props.width}
            height={props.height}
            x={props.x}
            y={props.y}
          />
        </svg>
      );
    }
    const iconName = `${icon[0].toUpperCase()}${icon.slice(1)}`;
    return (
      <IconResolver icon={iconName} fallbackIcon={fallbackIcon} {...props} />
    );
  }
  const EIcon =
    (fallbackIcon as OverridableComponent<SvgIconTypeMap>) ?? SvgIcon;
  return <EIcon {...props} />;
}
