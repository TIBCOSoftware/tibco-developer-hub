/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  EntityRelationsGraph,
  EntityRelationsGraphProps,
} from '@backstage/plugin-catalog-graph';
import { CustomEntityNode } from '../CustomEntityNode/CustomEntityNode';
import { CustomEntityLabel } from '../CustomEntityLabel/CustomEntityLabel';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  graph: {
    flex: 1,
    minHeight: 0,
  },
});

export const TopologyGraph = (props: EntityRelationsGraphProps) => {
  const classes = useStyles();
  return (
    <EntityRelationsGraph
      className={classes.graph}
      {...props}
      renderNode={CustomEntityNode}
      renderLabel={CustomEntityLabel}
    />
  );
};
