/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { CustomDeploymentIcon } from '../common/CustomDeploymentIcon';
import { makeStyles } from '@material-ui/core';
import { CustomTooltip } from '../common/CustomTooltip';
import { PlatformLink } from '../../hooks/useFetchAllLinks';

const entityDeploymentCardStyles = makeStyles({
  tLinkText: {
    color: 'hsla(0, 0%, 45%, 1.00)',
    fill: 'hsla(0, 0%, 45%, 1.00)',
    fontWeight: 600,
    fontSize: '8px',
  },
  tTooltipShow: {
    '& g': {
      display: 'none',
    },
    '&:hover g': {
      display: 'block',
    },
  },
});

export const EntityDeploymentCard = ({
  platformLinks,
  iconSize = 24,
  iconOffsetX = 0,
  iconOffsetY = 0,
}: {
  platformLinks: PlatformLink[];
  iconSize?: number;
  iconOffsetX?: number;
  iconOffsetY?: number;
}) => {
  const classes = entityDeploymentCardStyles();
  const padding = 4;
  const iconPositionGap = iconSize ? iconSize : 18;

  return (
    <g data-testid="entity-deployment-card">
      {platformLinks.length > 0 && (
        <text className={classes.tLinkText} x={iconOffsetX} y={iconOffsetY - 5}>
          Deployments
        </text>
      )}
      {platformLinks &&
        platformLinks.slice(0, 3).map((link, index) => {
          return (
            <g
              className={classes.tTooltipShow}
              key={link.pLabel}
              onClick={() => {
                window.open(link.pLink, '_blank');
              }}
              width={iconSize}
              height={iconSize}
            >
              <CustomDeploymentIcon
                id={`node-deployment-icon-${link.pLabel}`}
                iconName={`${link.pAppType.toLocaleLowerCase()}-${link.pLabel.slice(
                  3,
                )}`}
                width={iconSize}
                height={iconSize}
                y={iconOffsetY}
                x={iconOffsetX + (iconPositionGap + padding) * index}
              />
              <CustomTooltip
                title={link.pLabel.slice(3)}
                yPos={iconOffsetY + 24}
                xPos={3 * iconPositionGap + (iconPositionGap + padding) * index}
              />
            </g>
          );
        })}
    </g>
  );
};
