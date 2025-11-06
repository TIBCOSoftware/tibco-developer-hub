/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { EntityIcon } from '../common/EntityIcon';
import { CustomTooltip } from '../common/CustomTooltip';
import { makeStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { CustomIconProps } from './CustomEntityNode';

export interface EntityStatusIconsCardProps {
  statusIcons: CustomIconProps[];
  iconSize?: number;
  iconPadding?: number;
  x: number;
  y: number;
}

const statusIconsCardStyles = makeStyles({
  tTooltipShow: {
    '& g': {
      display: 'none',
    },
    '&:hover g': {
      display: 'block',
    },
  },
});

const EntityStatusIconsCard = ({
  statusIcons,
  iconSize = 12,
  iconPadding = 4,
  x,
  y,
}: EntityStatusIconsCardProps) => {
  const classes = statusIconsCardStyles();

  return (
    <g x={x} y={y}>
      {statusIcons &&
        statusIcons.length > 0 &&
        statusIcons.map(({ icon, iconColor, iconTooltip }, index) => {
          // adjust icon position based on number of icons
          let iconOffsetX = 0;
          if (statusIcons.length === 3) {
            iconOffsetX = x + index * iconSize;
          } else if (statusIcons.length === 2) {
            iconOffsetX =
              index === 1
                ? x + (index + 1) * iconSize - iconPadding
                : x + index * iconSize + iconPadding;
          } else {
            iconOffsetX = x + 1 * iconSize + iconPadding;
          }

          return (
            <g className={classes.tTooltipShow} key={index}>
              <rect
                width={iconSize}
                height={iconSize}
                x={index > 0 ? iconOffsetX + index * iconPadding : iconOffsetX}
                y={y}
                fill="transparent"
                pointerEvents="fill"
              />
              <EntityIcon
                data-testid="entity-icon"
                fill={iconColor}
                icon={icon}
                fallbackIcon={InfoIcon}
                width={iconSize}
                height={iconSize}
                x={index > 0 ? iconOffsetX + index * iconPadding : iconOffsetX}
                y={y}
              />
              {iconTooltip && (
                <CustomTooltip
                  title={iconTooltip}
                  xPos={iconOffsetX - 2 * iconSize}
                  yPos={y + iconSize + 2 * iconPadding}
                />
              )}
            </g>
          );
        })}
    </g>
  );
};

export default EntityStatusIconsCard;
