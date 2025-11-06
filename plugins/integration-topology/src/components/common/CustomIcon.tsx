/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import details from '../../assets/icons/pl-icon-preview.svg';
import docs from '../../assets/icons/pl-icon-document.svg';
import apis from '../../assets/icons/pl-icon-apis.svg';
import cicd from '../../assets/icons/pl-icon-cicd.svg';
import srcFolder from '../../assets/icons/pl-icon-src-folder.svg';
import externalLink from '../../assets/icons/pl-icon-external-link.svg';
import copy from '../../assets/icons/pl-icon-copy.svg';
import close from '../../assets/icons/pl-icon-close.svg';
import lock from '../../assets/icons/pl-icon-lock.svg';
import unlock from '../../assets/icons/pl-icon-unlock.svg';
import ownerOf from '../../assets/icons/icon-edge-owner-of.svg';
import dependencyOf from '../../assets/icons/icon-edge-dependency-of.svg';
import consumedBy from '../../assets/icons/icon-edge-consumed-by.svg';
import childOf from '../../assets/icons/icon-edge-child-of.svg';
import memberOf from '../../assets/icons/icon-edge-member-of.svg';
import partOf from '../../assets/icons/icon-edge-part-of.svg';
import { makeStyles } from '@material-ui/core';

declare type IconStyleClass =
  | 'detailsTitleIcon'
  | 'detailsLinkIcon'
  | 'linkBarIcon'
  | 'edgeLabelIcon';

declare type CustomIconProps = {
  id?: string;
  height?: number;
  width?: number;
  iconName: string;
  iconStyle?: IconStyleClass;
  x?: number;
  y?: number;
  to?: string;
  onClick?: () => void;
};

export const useIconStyles = makeStyles({
  linkBarIcon: {
    padding: '20px',
    color: 'hsla(0, 0%, 45%, 1.00)',
    fill: 'none',
    cursor: 'pointer',

    '&:hover': {
      color: 'hsla(213, 82%, 49%, 1.00)',
      fill: 'hsla(213, 82%, 49%, 1.00)',
      strokeWidth: '0.5',
    },

    '&:active': {
      opacity: 0.8,
      fill: 'hsla(219, 76%, 23%, 1.00)',
      strokeWidth: '0.5',
    },

    '&:focus': {
      fill: 'hsla(0, 0%, 100%, 1.00)',
    },
  },
  detailsTitleIcon: {
    cursor: 'pointer',
    color: 'white',
  },
  detailsLinkIcon: {
    cursor: 'pointer',
    color: 'hsla(213, 82%, 49%, 1.00)',
    '&:hover': {
      color: 'blue',
      fill: 'blue',
      strokeWidth: '0.5',
    },
  },
  edgeLabelIcon: {
    fill: 'hsla(0, 0%, 98%, 1.00)',
    color: 'hsla(0, 0%, 45%, 1.00)',
  },
});

export const CustomIcon = (props: CustomIconProps) => {
  const id = `${props?.id}`;
  const classes = useIconStyles();

  function getIcon(iconName: string) {
    switch (iconName) {
      case 'details':
        return details;
      case 'docs':
        return docs;
      case 'apis':
        return apis;
      case 'cicd':
        return cicd;
      case 'source':
        return srcFolder;
      case 'externalLink':
        return externalLink;
      case 'copy':
        return copy;
      case 'close':
        return close;
      case 'lock':
        return lock;
      case 'unlock':
        return unlock;
      case 'ownerOf':
      case 'ownedBy':
        return ownerOf;
      case 'dependencyOf':
      case 'dependsOn':
        return dependencyOf;
      case 'consumedBy':
      case 'consumesApi':
      case 'providesApi':
      case 'apiProvidedBy':
        return consumedBy;
      case 'childOf':
      case 'parentOf':
        return childOf;
      case 'memberOf':
      case 'hasMember':
        return memberOf;
      case 'partOf':
      case 'hasPart':
        return partOf;
      default:
        return '';
    }
  }

  return (
    <svg
      id={`${id}-image`}
      data-testid={`icon-${props.iconName}`}
      viewBox={`0 0 ${props?.width === undefined ? 24 : props.width} ${
        props?.height === undefined ? 24 : props.height
      }`}
      width={props?.width === undefined ? 24 : props.width}
      height={props?.height === undefined ? 24 : props.height}
      x={props?.x || 0}
      y={props?.y || 0}
      className={
        props.iconStyle && classes[props.iconStyle]
          ? classes[props.iconStyle]
          : classes.linkBarIcon
      }
      onClick={props.onClick}
    >
      <rect
        width={props?.width || 24}
        height={props?.height || 24}
        x={0}
        y={0}
        fill={
          props.iconStyle === 'edgeLabelIcon'
            ? 'hsla(0, 0%, 98%, 1.00)'
            : 'transparent'
        }
        pointerEvents="fill"
      />
      <use
        href={getIcon(props.iconName)}
        width={props?.width || 24}
        height={props?.height || 24}
      />
    </svg>
  );
};
