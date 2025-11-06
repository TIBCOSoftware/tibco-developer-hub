/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { makeStyles } from '@material-ui/core/styles';
import { DependencyGraphTypes } from '@backstage/core-components';
import { EntityEdgeData } from '@backstage/plugin-catalog-graph';
import { CustomIcon } from '../common/CustomIcon';
import { CustomTooltip } from '../common/CustomTooltip';
import { useContext } from 'react';
import { TopologyContext } from '../../context/TopologyContext';
import { Direction } from '@backstage/plugin-catalog-graph';

const useTIBCOLabelStyles = makeStyles(
  theme => ({
    text: {
      fill: theme.palette.textContrast,
    },
    secondary: {
      fill: theme.palette.textSubtle,
    },
    tooltipShow: {
      cursor: 'pointer',
      '& g': {
        position: 'absolute',
        visibility: 'hidden',
      },
      '&:hover g': {
        visibility: 'visible',
      },
    },
  }),
  { name: 'PluginCatalogGraphCustomLabel' },
);

export const CustomEntityLabel = ({
  edge,
}: DependencyGraphTypes.RenderLabelProps<EntityEdgeData>) => {
  const classes = useTIBCOLabelStyles();
  const { graphDirection } = useContext(TopologyContext);
  if (!edge.relations || edge.relations.length === 0) return null;
  const relations = [edge.relations[0]];
  const isVertical =
    graphDirection === Direction.TOP_BOTTOM ||
    graphDirection === Direction.BOTTOM_TOP;

  return (
    <>
      {relations.map((relation, index) => (
        <g
          key={`tooltip-${relation}-${index}`}
          data-testid="custom-label"
          className={classes.tooltipShow}
          transform={isVertical ? `translate(-57, -25)` : `translate(0, -52)`}
        >
          <CustomIcon
            id={`${relation}-${index}`}
            iconName={relation.split('/')[0]}
            iconStyle="edgeLabelIcon"
            width={24}
            height={24}
          />
          <CustomTooltip
            key={`tooltip-${index}`}
            title={relation}
            xPos={isVertical ? -24 : -24}
            yPos={isVertical ? 24 : 30}
          />
        </g>
      ))}
    </>
  );
};
