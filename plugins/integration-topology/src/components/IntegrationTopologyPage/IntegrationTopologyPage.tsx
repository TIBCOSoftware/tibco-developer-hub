/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  parseEntityRef,
  stringifyEntityRef,
  Entity,
} from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  Page,
  SupportButton,
  useSidebarOpenState,
} from '@backstage/core-components';
import {
  useAnalytics,
  useRouteRef,
  useApi,
  configApiRef,
} from '@backstage/core-plugin-api';
import {
  entityRouteRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import ToggleButton from '@material-ui/lab/ToggleButton';
import {
  MouseEvent,
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ALL_RELATION_PAIRS,
  Direction,
  EntityNode,
  EntityRelationsGraph,
  EntityRelationsGraphProps,
} from '@backstage/plugin-catalog-graph';
import { CurveFilter } from './CurveFilter';
import { DirectionFilter } from './DirectionFilter';
import { MaxDepthFilter } from './MaxDepthFilter';
import { SelectedKindsFilter } from './SelectedKindsFilter';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';
import { SwitchFilter } from './SwitchFilter';
import { useCatalogGraphPage } from './useCatalogGraphPage';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';
import { useFetchAllEntities } from '../../hooks/useFetchAllEntities';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { SearchableDropDown } from './SearchableDropDown';
import { SearchByEntityName } from './SearchByEntityName';
import { TopologyGraph } from '../TopologyGraph/TopologyGraph';
import { EntityNodeDetails } from '../EntityNodeDetails/EntityNodeDetails';
import Draggable from 'react-draggable';
import {
  TopologyContext,
  TopologyProvider,
} from '../../context/TopologyContext';
import { CustomViewToggle } from '../common/CustomViewToggle';
import { SelectedKindDropDown } from './SelectedKindDropDown';

/** @public */
export type CatalogGraphPageClassKey =
  | 'content'
  | 'container'
  | 'fullHeight'
  | 'graphWrapper'
  | 'graph'
  | 'legend'
  | 'filters';

const useStyles = makeStyles(
  theme => ({
    contentHeaderContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    filterToggleButtonWrapper: {
      flexGrow: 0,
      maxWidth: '16.666667%',
      flexBasis: '16.666667%',
      marginRight: '16px',
    },
    toggleViewWrapper: {
      position: 'relative',
      display: 'flex',
      border: '1px solid #0E4F9E',
      borderRadius: '21px',

      '& input[type="radio"]': {
        display: 'none',
      },

      '& input[type="radio"]:checked + label': {
        color: '#FFFFFF',
      },

      '& input[id="topology-view-radio"]:checked ~ .tabActiveSlider': {
        transform: 'translateX(-1%)',
      },
      '& input[id="graph-view-radio"]:checked ~ .tabActiveSlider': {
        transform: 'translateX(96%)',
      },
    },
    toggleViewTabs: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'row',
      width: '372px',
      height: '40px',
      color: '#0E4F9E',
      backgroundColor: 'transparent',
      borderRadius: '21px',
      border: '1px solid #0E4F9E',

      '&:hover': {
        cursor: 'pointer',
      },

      '& *': {
        zIndex: 2,
      },
    },
    toggleViewTab: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '186px',
      height: '40px',
      borderWidth: '1px',
      borderRadius: '21px',
      fontWeight: 400,
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'color 150ms ease-in',
    },
    tabActiveSlider: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      width: '190px',
      height: '40px',
      color: '#FFFFFF',
      backgroundColor: '#0E4F9E',
      border: '1px solid #0E4F9E',
      borderRadius: '21px',
      transition: '250ms ease-out',
    },

    content: {
      minHeight: 0,
    },
    container: {
      height: '100%',
      maxHeight: '100%',
      minHeight: 0,
    },
    fullHeight: {
      maxHeight: '100%',
      display: 'flex',
      minHeight: 0,
    },
    graphWrapper: {
      position: 'relative',
      flex: 1,
      minHeight: 0,
      display: 'flex',
    },
    graph: {
      flex: 1,
      minHeight: 0,
    },
    legend: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: theme.spacing(1),
      '& .icon': {
        verticalAlign: 'bottom',
      },
    },
    filters: {
      display: 'grid',
      gridGap: theme.spacing(1),
      gridAutoRows: 'auto',
      [theme.breakpoints.up('lg')]: {
        display: 'block',
      },
      [theme.breakpoints.only('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
      [theme.breakpoints.only('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: 'repeat(1, 1fr)',
      },
    },
    dragClass: {
      zIndex: 10000,
      position: 'absolute',
    },
  }),
  { name: 'PluginCatalogGraphCatalogGraphPage' },
);

export const TopologyPage = (
  props: {
    initialState?: {
      selectedRelations?: string[];
      selectedKinds?: string[];
      rootEntityRefs?: string[];
      maxDepth?: number;
      unidirectional?: boolean;
      mergeRelations?: boolean;
      direction?: Direction;
      showFilters?: boolean;
      curve?: 'curveStepBefore' | 'curveMonotoneX';
    };
  } & Partial<EntityRelationsGraphProps>,
) => {
  const {
    relationPairs = ALL_RELATION_PAIRS,
    initialState,
    entityFilter,
  } = props;
  const config = useApi(configApiRef);
  const title = config.getOptionalString('app.title');
  document.title = ` Topology | ${title}`;
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const navigate = useNavigate();
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const [view, setView] = useState<string>('topology');
  const {
    maxDepth,
    setMaxDepth,
    selectedKinds,
    setSelectedKinds,
    selectedRelations,
    setSelectedRelations,
    unidirectional,
    setUnidirectional,
    mergeRelations,
    setMergeRelations,
    direction,
    setDirection,
    curve,
    setCurve,
    rootEntityNames,
    setRootEntityNames,
    showFilters,
    toggleShowFilters,
  } = useCatalogGraphPage({ initialState });
  const { entities, kinds } = useFetchAllEntities();
  const [entityListForCurrentKind, setEntityListForCurrentKind] = useState<
    Entity[]
  >([]);
  const {
    display,
    detailsEntity,
    setDetailsEntity,
    setRootEntity,
    setGraphDirection,
  } = useContext(TopologyContext);
  const analytics = useAnalytics();
  const onNodeClick = useCallback(
    (node: EntityNode, event: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);

      if (event.shiftKey) {
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
      } else {
        analytics.captureEvent(
          'click',
          node.entity.metadata.title ?? humanizeEntityRef(nodeEntityName),
        );
        setRootEntityNames([nodeEntityName]);
      }
      setEntityListForCurrentKind(
        entities.filter(e => e.kind === node.entity.kind),
      );
      setRootEntity(node.entity);
    },
    [
      catalogEntityRoute,
      navigate,
      setRootEntityNames,
      analytics,
      entities,
      setEntityListForCurrentKind,
      setRootEntity,
    ],
  );

  const paperRef = useRef<HTMLDivElement>(null);
  const [detailsDefaultPos, setDetailsDefaultPos] = useState<{
    x: number;
    y: number;
  }>({ x: 10, y: 10 });
  const { isOpen: isSidebarOpen } = useSidebarOpenState();
  const [sidebarState, setSidebarState] = useState(isSidebarOpen);

  useLayoutEffect(() => {
    const calculatePosition = () => {
      if (paperRef.current) {
        const paperRect = paperRef.current.getBoundingClientRect();
        const draggableRectWidth = 425;

        // Calculate position to place draggable in top-right corner with padding
        const x = Math.max(paperRect.width - draggableRectWidth - 20, 10);
        const y = 20;
        setDetailsDefaultPos({ x, y });
      }
    };
    calculatePosition();

    const handleResize = () => setTimeout(calculatePosition, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Detect sidebar state via DOM observation as fallback
    const detectSidebarState = () => {
      const sidebarElement =
        document.querySelector('[data-testid="sidebar"]') ||
        document.querySelector('.MuiDrawer-paper') ||
        document.querySelector('[class*="sidebar"]');

      if (sidebarElement) {
        const rect = sidebarElement.getBoundingClientRect();
        const isOpen = rect.width > 250;
        setSidebarState(isOpen);
      } else {
        setSidebarState(isSidebarOpen);
      }
    };

    // Initial detection
    detectSidebarState();

    // Listen for potential sidebar changes (only if ResizeObserver is available)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        detectSidebarState();
      });

      const sidebarElement =
        document.querySelector('[data-testid="sidebar"]') ||
        document.querySelector('.MuiDrawer-paper') ||
        document.querySelector('[class*="sidebar"]');

      if (sidebarElement) {
        resizeObserver.observe(sidebarElement);
      }
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isSidebarOpen]);

  // Recalculate draggable position on sidebar toggle or window resize
  const showFiltersRef = useRef(showFilters);
  const sidebarStateRef = useRef(sidebarState);
  useEffect(() => {
    if (
      showFiltersRef.current !== showFilters ||
      sidebarStateRef.current !== sidebarState
    ) {
      showFiltersRef.current = showFilters;
      sidebarStateRef.current = sidebarState;
      setTimeout(() => {
        if (paperRef.current) {
          const paperRect = paperRef.current.getBoundingClientRect();
          const draggableRectWidth = 425;
          // Calculate position to place draggable in top-right corner with padding
          const x = Math.max(paperRect.width - draggableRectWidth - 20, 10);
          const y = 20;
          setDetailsDefaultPos({ x, y });
        }
      }, 300);
    }
  }, [showFilters, sidebarState]);

  useEffect(() => {
    if (rootEntityNames.length === 0 && entities.length > 0) {
      // If no root is selected, set the first component available in the list
      const componentEntities = entities.filter(e => e.kind === 'Component');
      const firstEntity = componentEntities.sort((a, b) =>
        a.metadata.name.localeCompare(b.metadata.name),
      )?.[0];
      setRootEntityNames([parseEntityRef(stringifyEntityRef(firstEntity))]);
      setEntityListForCurrentKind(
        entities.filter(e => e.kind === firstEntity.kind),
      );
    }

    if (rootEntityNames.length > 0) {
      const rootEntity = entities.find(
        e => stringifyEntityRef(e) === stringifyEntityRef(rootEntityNames[0]),
      );
      if (rootEntity) {
        setEntityListForCurrentKind(
          entities.filter(e => e.kind === rootEntity.kind),
        );
        setRootEntity(rootEntity);
        setDetailsEntity(rootEntity);
      }
    }

    setGraphDirection?.(direction || Direction.LEFT_RIGHT);
  }, [
    entities,
    rootEntityNames,
    direction,
    setDetailsEntity,
    setRootEntityNames,
    setEntityListForCurrentKind,
    setRootEntity,
    setGraphDirection,
  ]);

  return (
    <Page themeId="home">
      <Content stretch className={classes.content}>
        <ContentHeader
          titleComponent={
            <div className={classes.contentHeaderContainer}>
              <div className={classes.filterToggleButtonWrapper}>
                <ToggleButton
                  value="show filters"
                  selected={showFilters}
                  onChange={() => toggleShowFilters()}
                >
                  <FilterListIcon />
                  {t('catalogGraphPage.filterToggleButtonTitle')}
                </ToggleButton>
              </div>
              <CustomViewToggle
                view={view}
                setView={setView}
                viewOptions={['topology', 'graph']}
              />
            </div>
          }
        >
          <SupportButton>
            {t('catalogGraphPage.supportButtonDescription')}
          </SupportButton>
        </ContentHeader>
        <Grid container alignItems="stretch" className={classes.container}>
          {showFilters && (
            <Grid item xs={12} lg={2} className={classes.filters}>
              <SelectedKindDropDown
                label="Select Entity Kind"
                selected={
                  rootEntityNames &&
                  rootEntityNames
                    .map(e =>
                      e.kind === 'api'
                        ? e.kind.toLocaleUpperCase()
                        : e.kind[0].toLocaleUpperCase() + e.kind.slice(1),
                    )
                    .join(', ')
                }
                items={kinds.map(v => ({
                  label: v,
                  value: v,
                }))}
                onChange={currentKind => {
                  const newRootEntities = entities.filter(
                    e => e.kind === currentKind,
                  );
                  if (newRootEntities.length > 0) {
                    newRootEntities.sort((a, b) =>
                      a.metadata.name.localeCompare(b.metadata.name),
                    );
                    const newRootEntity = newRootEntities[0];
                    const newRootEntityName = humanizeEntityRef(newRootEntity);
                    setRootEntityNames([parseEntityRef(newRootEntityName)]);
                    setEntityListForCurrentKind(
                      entities.filter(e => e.kind === newRootEntity.kind),
                    );
                  }
                }}
              />
              <SearchContextProvider>
                <SearchableDropDown
                  name="entityName"
                  label="Select Entity Name"
                  multiple={false}
                  rootEntityNames={rootEntityNames}
                  defaultValue={rootEntityNames && rootEntityNames[0]?.name}
                  givenValues={entityListForCurrentKind.map(
                    v => v.metadata.name,
                  )}
                  onSelected={(name: string) => {
                    const newRootEntity = entityListForCurrentKind.find(
                      e => e.metadata.name === name,
                    );
                    if (newRootEntity) {
                      const newRootEntityName =
                        humanizeEntityRef(newRootEntity);
                      setRootEntityNames([parseEntityRef(newRootEntityName)]);
                    }
                  }}
                />
              </SearchContextProvider>
              <SearchByEntityName
                label="Search Entities by Name"
                rootEntityNames={rootEntityNames}
                onSelected={(name, callback) => {
                  const newRootEntity = entities.find(
                    e => e.metadata.name === name,
                  );
                  if (newRootEntity) {
                    const newRootEntityName = humanizeEntityRef(newRootEntity);
                    setRootEntityNames([parseEntityRef(newRootEntityName)]);
                    setEntityListForCurrentKind(
                      entities.filter(e => e.kind === newRootEntity.kind),
                    );
                  }
                  callback();
                }}
              />
              <MaxDepthFilter value={maxDepth} onChange={setMaxDepth} />
              <SelectedKindsFilter
                value={selectedKinds}
                onChange={setSelectedKinds}
              />
              <SelectedRelationsFilter
                value={selectedRelations}
                onChange={setSelectedRelations}
                relationPairs={relationPairs}
              />
              <DirectionFilter value={direction} onChange={setDirection} />
              <CurveFilter value={curve} onChange={setCurve} />
              <SwitchFilter
                value={unidirectional}
                onChange={setUnidirectional}
                label={t('catalogGraphPage.simplifiedSwitchLabel')}
              />
              <SwitchFilter
                value={mergeRelations}
                onChange={setMergeRelations}
                label={t('catalogGraphPage.mergeRelationsSwitchLabel')}
              />
            </Grid>
          )}
          <Grid item xs className={classes.fullHeight}>
            <Paper className={classes.graphWrapper} ref={paperRef}>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                className={classes.legend}
                data-testid="graph-zoom-description"
              >
                <ZoomOutMap className="icon" />{' '}
                {t('catalogGraphPage.zoomOutDescription')}
              </Typography>
              {view === 'topology' ? (
                <>
                  {entities &&
                    rootEntityNames &&
                    rootEntityNames.length > 0 &&
                    detailsEntity &&
                    detailsDefaultPos && (
                      <Draggable
                        key={`${detailsDefaultPos.x}-${detailsDefaultPos.y}-${showFilters}-${sidebarState}`}
                        defaultClassName={classes.dragClass}
                        defaultPosition={detailsDefaultPos}
                      >
                        <div style={{ display }}>
                          <EntityNodeDetails />
                        </div>
                      </Draggable>
                    )}
                  <TopologyGraph
                    {...props}
                    rootEntityNames={rootEntityNames}
                    maxDepth={maxDepth}
                    kinds={
                      selectedKinds && selectedKinds.length > 0
                        ? selectedKinds
                        : undefined
                    }
                    relations={
                      selectedRelations && selectedRelations.length > 0
                        ? selectedRelations
                        : undefined
                    }
                    mergeRelations={mergeRelations}
                    unidirectional={unidirectional}
                    onNodeClick={onNodeClick}
                    direction={direction}
                    relationPairs={relationPairs}
                    entityFilter={entityFilter}
                    className={classes.graph}
                    zoom="enabled"
                    curve={curve}
                    showArrowHeads
                  />
                </>
              ) : (
                <EntityRelationsGraph
                  {...props}
                  rootEntityNames={rootEntityNames}
                  maxDepth={maxDepth}
                  kinds={
                    selectedKinds && selectedKinds.length > 0
                      ? selectedKinds
                      : undefined
                  }
                  relations={
                    selectedRelations && selectedRelations.length > 0
                      ? selectedRelations
                      : undefined
                  }
                  mergeRelations={mergeRelations}
                  unidirectional={unidirectional}
                  onNodeClick={onNodeClick}
                  direction={direction}
                  relationPairs={relationPairs}
                  entityFilter={entityFilter}
                  className={classes.graph}
                  zoom="enabled"
                  curve={curve}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const IntegrationTopologyPage = () => {
  return (
    <TopologyProvider>
      <TopologyPage />
    </TopologyProvider>
  );
};
