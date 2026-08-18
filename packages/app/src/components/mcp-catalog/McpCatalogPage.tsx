/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useEffect } from 'react';
import {
  Content,
  LinkButton,
  Page,
  Progress,
  TableColumn,
  Link,
} from '@backstage/core-components';
import { CatalogTable, CatalogTableRow } from '@backstage/plugin-catalog';
import {
  CatalogFilterLayout,
  EntityKindFilter,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypeFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { Chip, Grid, Typography } from '@material-ui/core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { TibcoIcon } from '../../icons/TibcoIcon';
import { constructCplink } from '../Root/Root';
import CpMcpHubIcon from '../../icons/subtract.svg';
import {
  countDeclaredCapabilities,
  readDeclaredCapabilities,
} from '../catalog/mcpCapabilities';
import McpHeaderImg from '../../icons/mcpintro.svg';
import McpEmptyImg from '../../icons/no_resource.svg';

/**
 * Locks the entity list to MCP servers: `kind: API` with `spec.type: mcp-server`.
 * The kind/type pickers are intentionally not rendered — this page always shows
 * MCP servers only.
 */
const LockMcpServerFilters = () => {
  const { updateFilters } = useEntityList();
  useEffect(() => {
    updateFilters({
      kind: new EntityKindFilter('api', 'API'),
      type: new EntityTypeFilter('mcp-server'),
    });
  }, [updateFilters]);
  return null;
};

// Route to the scaffolder template that drives the MCP import flow.
const IMPORT_MCP_DEFINITION_PATH =
  '/create/templates/default/import-mcp-definition';

const useStyles = makeStyles(theme => ({
  hero: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(1.5),
  },
  description: {
    color: theme.palette.text.secondary,
    maxWidth: 640,
    marginBottom: theme.spacing(2.5),
  },
  learnMore: {
    textTransform: 'none',
  },
  heroImg: {
    width: '100%',
    maxWidth: 560,
    display: 'block',
    marginLeft: 'auto',
  },
  actionsRow: {
    marginBottom: theme.spacing(2),
  },
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  pill: {
    borderColor: theme.palette.divider,
    fontWeight: 400,
  },
  pillCount: {
    fontWeight: 700,
    marginRight: 4,
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
  },
  actionButton: {
    textTransform: 'none',
  },
  emptyHeaderTitle: {
    marginBottom: theme.spacing(0.5),
  },
  emptyHeaderSubtitle: {
    color: theme.palette.text.secondary,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(8, 2),
  },
  emptyImg: {
    width: 240,
    maxWidth: '80%',
    marginBottom: theme.spacing(3),
  },
  emptyTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  emptyDescription: {
    color: theme.palette.text.secondary,
    maxWidth: 420,
    marginBottom: theme.spacing(3),
  },
  emptyActions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
  },
}));

const StatPill = ({ count, label }: { count: number; label: string }) => {
  const classes = useStyles();
  return (
    <Chip
      variant="outlined"
      className={classes.pill}
      label={
        <span>
          <span className={classes.pillCount}>{count}</span>
          {label}
        </span>
      }
    />
  );
};

/**
 * Hero header for the MCP Catalog list page: title + description + illustration,
 * a row of summary stat pills, and the primary "Import" / "Register" actions.
 * Rendered inside the EntityListProvider so the "servers" count reflects the
 * live (filtered) list.
 */
const McpCatalogHeader = () => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const docUrl: string = configApi.get('app.docUrl');
  // CP MCP Hub button: shown when `tibco.mcpHub` is configured and not explicitly
  // disabled (`enabled: false` hides it). The link is `baseUrl + path`, falling
  // back to the Control Plane link (cpLink) when `baseUrl` is not set.
  const mcpHubConfig = configApi.getOptionalConfig('tibco.mcpHub');
  const cpMcpHubUrl = (() => {
    if (!mcpHubConfig) {
      return undefined;
    }
    if (mcpHubConfig.getOptionalBoolean('enabled') === false) {
      return undefined;
    }
    const base = (
      mcpHubConfig.getOptionalString('baseUrl') ||
      constructCplink(configApi) ||
      ''
    ).replace(/\/$/, '');
    if (!base) {
      return undefined;
    }
    return `${base}${mcpHubConfig.getOptionalString('path') ?? ''}`;
  })();
  const { entities } = useEntityList();

  const servers = entities.length;
  const totals = entities.reduce(
    (acc, entity) => {
      const counts = countDeclaredCapabilities(entity);
      acc.tools += counts.tools;
      acc.resources += counts.resources;
      acc.prompts += counts.prompts;
      return acc;
    },
    { tools: 0, resources: 0, prompts: 0 },
  );
  const { tools, resources, prompts } = totals;

  return (
    <>
      <Grid container spacing={3} className={classes.hero} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h1" className={classes.title}>
            MCP Catalog
          </Typography>
          <Typography variant="body1" className={classes.description}>
            The MCP Server Registry serves as a comprehensive catalog,
            showcasing a variety of MCP definitions across multiple platforms.
            It offers an array of resources, tools, and prompts to enhance user
            experience and streamline access to essential information.
          </Typography>
          <LinkButton
            to={docUrl}
            target="_blank"
            variant="outlined"
            color="primary"
            className={classes.learnMore}
          >
            Learn More
          </LinkButton>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={McpHeaderImg}
            alt="MCP Catalog"
            className={classes.heroImg}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        className={classes.actionsRow}
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <div className={classes.pillGroup}>
            <StatPill count={servers} label="servers" />
            <StatPill count={tools} label="tools" />
            <StatPill count={resources} label="resources" />
            <StatPill count={prompts} label="prompts" />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.actionButtons}>
            {cpMcpHubUrl && (
              <LinkButton
                to={cpMcpHubUrl}
                target="_blank"
                variant="outlined"
                color="primary"
                className={classes.actionButton}
                startIcon={
                  <img src={CpMcpHubIcon} height={20} width={20} alt="" />
                }
              >
                CP MCP Hub
              </LinkButton>
            )}
            <LinkButton
              to={IMPORT_MCP_DEFINITION_PATH}
              variant="outlined"
              color="primary"
              className={classes.actionButton}
              startIcon={
                <TibcoIcon iconName="pl-icon-upload" height={20} width={20} />
              }
            >
              Import MCP Definition
            </LinkButton>
            <LinkButton
              to="/catalog-import"
              variant="contained"
              color="primary"
              className={classes.actionButton}
              startIcon={<AddIcon />}
            >
              Register MCP Server
            </LinkButton>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

/**
 * Empty-state view shown when no MCP servers are registered yet. Replaces the
 * hero + table with a compact header, a centered illustration and the primary
 * "Register" / "Import" calls to action (per the MCP Catalog design).
 */
const McpCatalogEmptyState = () => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h1" className={classes.emptyHeaderTitle}>
        MCP Catalog
      </Typography>
      <Typography variant="body2" className={classes.emptyHeaderSubtitle}>
        MCP Server Registry
      </Typography>
      <div className={classes.emptyState}>
        <img src={McpEmptyImg} alt="" className={classes.emptyImg} />
        <Typography variant="h6" className={classes.emptyTitle}>
          No MCP servers registered yet
        </Typography>
        <Typography variant="body2" className={classes.emptyDescription}>
          Register your first MCP server to start exposing tools, resources, and
          prompts to your Developer Hub.
        </Typography>
        <div className={classes.emptyActions}>
          <LinkButton
            to="/catalog-import"
            variant="contained"
            color="primary"
            className={classes.actionButton}
            startIcon={<AddIcon />}
          >
            Register MCP Server
          </LinkButton>
          <LinkButton
            to={IMPORT_MCP_DEFINITION_PATH}
            variant="outlined"
            color="primary"
            className={classes.actionButton}
            startIcon={
              <TibcoIcon iconName="pl-icon-upload" height={20} width={20} />
            }
          >
            Import MCP Definition
          </LinkButton>
        </div>
      </div>
    </>
  );
};

const remotesColumn: TableColumn<CatalogTableRow> = {
  title: 'Connections',
  field: 'entity.spec.remotes',
  render: ({ entity }) => {
    const remotes = (entity.spec as { remotes?: unknown[] } | undefined)
      ?.remotes;
    return Array.isArray(remotes) ? remotes.length : 0;
  },
};

const toolsColumn: TableColumn<CatalogTableRow> = {
  title: 'Tools',
  field: 'entity.spec.tools',
  render: ({ entity }) => readDeclaredCapabilities(entity).tools.length,
};

const resourcesColumn: TableColumn<CatalogTableRow> = {
  title: 'Resources',
  field: 'entity.spec.resources',
  render: ({ entity }) => readDeclaredCapabilities(entity).resources.length,
};

const promptsColumn: TableColumn<CatalogTableRow> = {
  title: 'Prompts',
  field: 'entity.spec.prompts',
  render: ({ entity }) => readDeclaredCapabilities(entity).prompts.length,
};

const columns: TableColumn<CatalogTableRow>[] = [
  CatalogTable.columns.createNameColumn(),
  CatalogTable.columns.createSystemColumn(),
  CatalogTable.columns.createOwnerColumn(),
  CatalogTable.columns.createSpecLifecycleColumn(),
  remotesColumn,
  toolsColumn,
  resourcesColumn,
  promptsColumn,
  CatalogTable.columns.createTagsColumn(),
];

// Shown by the table when MCP servers exist but the active owner/lifecycle/tag
// filters exclude them all. The whole-catalog "no servers yet" case is handled
// separately by McpCatalogEmptyState.
const emptyContent = (
  <div style={{ textAlign: 'center', padding: '32px' }}>
    <p>No MCP servers match the selected filters.</p>
    <p>
      Register a Model Context Protocol server as an <code>API</code> entity
      with <code>spec.type: mcp-server</code> using{' '}
      <Link to="/catalog-import">Register...</Link>.
    </p>
  </div>
);

/**
 * Body of the MCP Catalog page. Shows the dedicated empty state when no MCP
 * servers are registered at all; otherwise the hero + filterable server table.
 * Reads the pre-filter list (`backendEntities`) so owner/tag/lifecycle filters
 * that narrow the list to zero don't trip the "no servers yet" view.
 */
const McpCatalogBody = () => {
  const { backendEntities, loading } = useEntityList();

  // Wait for the initial load before deciding what to render, otherwise the
  // full hero + table briefly flashes before flipping to the empty state.
  if (loading) {
    return <Progress />;
  }

  if (backendEntities.length === 0) {
    return <McpCatalogEmptyState />;
  }

  return (
    <>
      <McpCatalogHeader />
      <CatalogFilterLayout>
        <CatalogFilterLayout.Filters>
          <EntityOwnerPicker />
          <EntityLifecyclePicker />
          <EntityTagPicker />
        </CatalogFilterLayout.Filters>
        <CatalogFilterLayout.Content>
          <CatalogTable
            title="MCP Servers/Definitions"
            columns={columns}
            emptyContent={emptyContent}
          />
        </CatalogFilterLayout.Content>
      </CatalogFilterLayout>
    </>
  );
};

export const McpCatalogPage = () => (
  <Page themeId="home">
    <Content>
      <EntityListProvider>
        <LockMcpServerFilters />
        <McpCatalogBody />
      </EntityListProvider>
    </Content>
  </Page>
);
