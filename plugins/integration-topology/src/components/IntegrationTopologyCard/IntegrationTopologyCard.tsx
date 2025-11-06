/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  getCompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { useAnalytics, useRouteRef } from '@backstage/core-plugin-api';
import {
  humanizeEntityRef,
  useEntity,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import qs from 'qs';
import { MouseEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topologyGraphRouteRef } from '../../routes';
import {
  ALL_RELATION_PAIRS,
  Direction,
  EntityNode,
  EntityRelationsGraphProps,
  EntityRelationsGraph,
} from '@backstage/plugin-catalog-graph';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';
import { TopologyGraph } from '../TopologyGraph/TopologyGraph';
import { CustomViewToggle } from '../common/CustomViewToggle';

/** @public */
export type CatalogGraphCardClassKey = 'card' | 'graph';

const useStyles = makeStyles<Theme, { height: number | undefined }>(
  {
    card: ({ height }) => ({
      display: 'flex',
      flexDirection: 'column',
      maxHeight: height,
      minHeight: height,
    }),
    graph: {
      flex: 1,
      minHeight: 0,
    },
  },
  { name: 'PluginCatalogGraphCatalogGraphCard' },
);

export const IntegrationTopologyCard = (
  props: Partial<EntityRelationsGraphProps> & {
    variant?: InfoCardVariants;
    height?: number;
    title?: string;
    action?: ReactNode;
  },
) => {
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const {
    variant = 'gridItem',
    relationPairs = ALL_RELATION_PAIRS,
    maxDepth = 1,
    unidirectional = true,
    mergeRelations = true,
    direction = Direction.LEFT_RIGHT,
    kinds,
    relations,
    entityFilter,
    height,
    className,
    action,
    rootEntityNames,
    onNodeClick,
    title = t('topologyGraphCard.title'),
    zoom = 'enable-on-click',
  } = props;

  const { entity } = useEntity();
  const entityName = useMemo(() => getCompoundEntityRef(entity), [entity]);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const topologyGraphRoute = useRouteRef(topologyGraphRouteRef);
  const navigate = useNavigate();
  const classes = useStyles({ height });
  const analytics = useAnalytics();

  const defaultOnNodeClick = useCallback(
    (node: EntityNode, _: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);
      const path = catalogEntityRoute({
        kind: nodeEntityName.kind.toLocaleLowerCase('en-US'),
        namespace: nodeEntityName.namespace.toLocaleLowerCase('en-US'),
        name: nodeEntityName.name,
      });
      analytics.captureEvent(
        'click',
        node.entity.metadata.title ?? humanizeEntityRef(nodeEntityName),
        { attributes: { to: path } },
      );
      navigate(path);
    },
    [catalogEntityRoute, navigate, analytics],
  );

  const catalogGraphParams = qs.stringify(
    {
      rootEntityRefs: [stringifyEntityRef(entity)],
      maxDepth: maxDepth,
      unidirectional,
      mergeRelations,
      selectedKinds: kinds,
      selectedRelations: relations,
      direction,
    },
    { arrayFormat: 'brackets', addQueryPrefix: true },
  );
  const catalogGraphUrl = `${topologyGraphRoute()}${catalogGraphParams}`;

  const [view, setView] = useState('topology');

  return (
    <InfoCard
      title={title}
      action={action}
      cardClassName={classes.card}
      variant={variant}
      noPadding
      deepLink={{
        title: t('topologyGraphCard.deepLinkTitle'),
        link: catalogGraphUrl,
      }}
    >
      <div
        style={{
          marginTop: '-52px',
          marginRight: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <CustomViewToggle
          view={view}
          setView={setView}
          viewOptions={['topology', 'graph']}
          size="small"
        />
      </div>
      {view === 'topology' ? (
        <TopologyGraph
          {...props}
          rootEntityNames={rootEntityNames || entityName}
          onNodeClick={onNodeClick || defaultOnNodeClick}
          className={className || classes.graph}
          maxDepth={maxDepth}
          unidirectional={unidirectional}
          mergeRelations={mergeRelations}
          direction={direction}
          relationPairs={relationPairs}
          entityFilter={entityFilter}
          zoom={zoom}
        />
      ) : (
        <EntityRelationsGraph
          {...props}
          rootEntityNames={rootEntityNames || entityName}
          onNodeClick={onNodeClick || defaultOnNodeClick}
          className={className || classes.graph}
          maxDepth={maxDepth}
          unidirectional={unidirectional}
          mergeRelations={mergeRelations}
          direction={direction}
          relationPairs={relationPairs}
          entityFilter={entityFilter}
          zoom={zoom}
        />
      )}
    </InfoCard>
  );
};
