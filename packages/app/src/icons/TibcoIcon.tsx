import React from 'react';
import icons from './uxpl.icons.svg';

declare type TibcoIconProps = {
  height?: number;
  width?: number;
  iconName: string;
  to?: string;
  onClick?: () => void;
};

export const TibcoIcon = (props: TibcoIconProps) => {
  function iconRef(iconName: string) {
    return `${icons}#${iconName}`;
  }

  return (
    <svg
      aria-hidden="true"
      role="img"
      height={props.height || '24px'}
      width={props.width || '24px'}
      onClick={props.onClick}
    >
      <use xlinkHref={iconRef(props.iconName)} />
    </svg>
  );
};
