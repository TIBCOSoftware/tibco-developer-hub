/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  InfoCard,
  Link,
  Progress,
  ResponseErrorPanel,
  WarningPanel,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  isMcpServerApiEntity,
  McpServerRemote,
} from '@backstage/catalog-model/alpha';
import { ReactNode, useState } from 'react';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import LockIcon from '@material-ui/icons/Lock';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import {
  McpCapabilityLists,
  McpPromptInfo,
  McpResourceInfo,
  McpToolInfo,
  readDeclaredCapabilities,
} from './mcpCapabilities';
import { hasSchema, summarizeSchema } from './mcpSchema';
import { useMcpCapabilities } from './useMcpCapabilities';

const useCapabilityStyles = makeStyles(theme => ({
  card: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
  },
  cardHeader: {
    marginBottom: theme.spacing(1.5),
  },
  itemName: {
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  ioBox: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 1.5),
    height: '100%',
    boxSizing: 'border-box',
  },
  outputBox: {
    border: `1px solid ${fade(theme.palette.success.main, 0.4)}`,
    backgroundColor: fade(theme.palette.success.main, 0.08),
  },
  ioLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: theme.palette.text.secondary,
    marginBottom: 4,
  },
  ioSummary: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: theme.palette.text.primary,
    wordBreak: 'break-word',
  },
  muted: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  schemaToggle: {
    textTransform: 'none',
    marginTop: theme.spacing(1),
    paddingLeft: 0,
  },
  schemaPre: {
    margin: theme.spacing(0.5, 0, 1.5),
    padding: theme.spacing(1.5),
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
    fontSize: 12,
  },
  emptyText: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(1, 0),
  },
  livePanelSpacing: {
    marginTop: theme.spacing(2),
  },
}));

/**
 * A single tool rendered as a card: name + description, a compact INPUT
 * (and OUTPUT, when the tool declares one) schema summary, and an expandable
 * view of the full raw JSON Schema.
 */
const ToolCard = ({ tool }: { tool: McpToolInfo }) => {
  const classes = useCapabilityStyles();
  const [open, setOpen] = useState(false);

  const inputSummary = summarizeSchema(tool.inputSchema);
  const showInput = Boolean(inputSummary);
  const showOutput = hasSchema(tool.outputSchema);
  const outputSummary = showOutput ? summarizeSchema(tool.outputSchema) : '';
  const showRaw = hasSchema(tool.inputSchema) || showOutput;

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <Typography component="span" className={classes.itemName}>
          {tool.name}
        </Typography>
        {tool.description && (
          <Typography component="span" variant="body2" color="textSecondary">
            {tool.description}
          </Typography>
        )}
      </div>

      {(showInput || showOutput) && (
        <Grid container spacing={2}>
          {showInput && (
            <Grid item xs={12} md={showOutput ? 6 : 12}>
              <div className={classes.ioBox}>
                <div className={classes.ioLabel}>INPUT</div>
                <div className={classes.ioSummary}>{inputSummary}</div>
              </div>
            </Grid>
          )}
          {showOutput && (
            <Grid item xs={12} md={showInput ? 6 : 12}>
              <div className={`${classes.ioBox} ${classes.outputBox}`}>
                <div className={classes.ioLabel}>OUTPUT</div>
                <div className={classes.ioSummary}>
                  {outputSummary || <span className={classes.muted}>—</span>}
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      )}

      {showRaw && (
        <>
          <Button
            size="small"
            color="primary"
            className={classes.schemaToggle}
            endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setOpen(prev => !prev)}
          >
            {open ? 'Hide schema' : 'Show schema'}
          </Button>
          <Collapse in={open} unmountOnExit>
            {hasSchema(tool.inputSchema) && (
              <>
                <div className={classes.ioLabel}>INPUT SCHEMA</div>
                <pre className={classes.schemaPre}>
                  {JSON.stringify(tool.inputSchema, null, 2)}
                </pre>
              </>
            )}
            {showOutput && (
              <>
                <div className={classes.ioLabel}>OUTPUT SCHEMA</div>
                <pre className={classes.schemaPre}>
                  {JSON.stringify(tool.outputSchema, null, 2)}
                </pre>
              </>
            )}
          </Collapse>
        </>
      )}
    </div>
  );
};

/** A single resource rendered as a card: name (linked to its URI) + details. */
const ResourceCard = ({ resource }: { resource: McpResourceInfo }) => {
  const classes = useCapabilityStyles();
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <Link
          to={resource.uri}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.itemName}
        >
          {resource.name ?? resource.uri}
        </Link>
        {resource.mimeType && (
          <Typography component="span" variant="caption" color="textSecondary">
            {resource.mimeType}
          </Typography>
        )}
      </div>
      {resource.description && (
        <Typography variant="body2" color="textSecondary">
          {resource.description}
        </Typography>
      )}
      <div className={classes.ioSummary}>{resource.uri}</div>
    </div>
  );
};

/** A single prompt rendered as a card: name + description. */
const PromptCard = ({ prompt }: { prompt: McpPromptInfo }) => {
  const classes = useCapabilityStyles();
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <Typography component="span" className={classes.itemName}>
          {prompt.name}
        </Typography>
      </div>
      {prompt.description && (
        <Typography variant="body2" color="textSecondary">
          {prompt.description}
        </Typography>
      )}
    </div>
  );
};

/** A titled section (icon + heading) with either its cards or an empty message. */
const CapabilitySection = ({
  icon,
  title,
  isEmpty,
  emptyText,
  children,
}: {
  icon: ReactNode;
  title: string;
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
}) => {
  const classes = useCapabilityStyles();
  return (
    <InfoCard
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {icon}
          {title}
        </span>
      }
    >
      {isEmpty ? (
        <Typography variant="body2" className={classes.emptyText}>
          {emptyText}
        </Typography>
      ) : (
        children
      )}
    </InfoCard>
  );
};

/**
 * Renders the Tools / Resources / Prompts cards for a set of capability lists.
 * Tools span the full width; Resources and Prompts sit side by side below.
 */
const CapabilitySections = ({
  lists,
  source,
}: {
  lists: McpCapabilityLists;
  source: 'declared' | 'live';
}) => {
  const verb = source === 'declared' ? 'declares no' : 'exposes no';
  return (
    <>
      <Grid item xs={12}>
        <CapabilitySection
          icon={<BuildOutlinedIcon fontSize="small" />}
          title="Tools"
          isEmpty={lists.tools.length === 0}
          emptyText={`This server ${verb} tools.`}
        >
          {lists.tools.map((tool, index) => (
            <ToolCard key={index} tool={tool} />
          ))}
        </CapabilitySection>
      </Grid>

      <Grid item xs={12} md={6}>
        <CapabilitySection
          icon={<DescriptionOutlinedIcon fontSize="small" />}
          title="Resources"
          isEmpty={lists.resources.length === 0}
          emptyText={`This server ${verb} resources.`}
        >
          {lists.resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </CapabilitySection>
      </Grid>

      <Grid item xs={12} md={6}>
        <CapabilitySection
          icon={<ForumOutlinedIcon fontSize="small" />}
          title="Prompts"
          isEmpty={lists.prompts.length === 0}
          emptyText={`This server ${verb} prompts.`}
        >
          {lists.prompts.map((prompt, index) => (
            <PromptCard key={index} prompt={prompt} />
          ))}
        </CapabilitySection>
      </Grid>
    </>
  );
};

/**
 * MCP Details tab content. Shows the tools/resources/prompts declared in the
 * entity YAML by default; "Fetch live" switches to a runtime introspection of
 * the server's remotes via the `mcp-introspection` backend, and "Show declared"
 * returns to the catalog-declared view.
 */
const McpCapabilitiesContent = ({
  entity,
  entityRef,
  remotes,
}: {
  entity: Entity;
  entityRef: string;
  remotes: McpServerRemote[];
}) => {
  const classes = useCapabilityStyles();
  const [mode, setMode] = useState<'declared' | 'live'>('declared');
  const { data, loading, error, refresh } = useMcpCapabilities(entityRef);
  const [token, setToken] = useState('');
  // Arbitrary auth headers (e.g. X-API-Key) for non-bearer servers — mirrors the
  // `headers` input of the `tibco:mcp:introspect` scaffolder action.
  const [customHeaders, setCustomHeaders] = useState<
    { name: string; value: string }[]
  >([]);
  // '' means "Auto" — let the backend pick the first reachable remote.
  const [remoteChoice, setRemoteChoice] = useState('');

  const addHeader = () =>
    setCustomHeaders(prev => [...prev, { name: '', value: '' }]);
  const updateHeader = (
    index: number,
    patch: Partial<{ name: string; value: string }>,
  ) =>
    setCustomHeaders(prev =>
      prev.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    );
  const removeHeader = (index: number) =>
    setCustomHeaders(prev => prev.filter((_, i) => i !== index));

  const remoteIndex = remoteChoice === '' ? undefined : Number(remoteChoice);
  const query = () => {
    const headers = customHeaders.reduce<Record<string, string>>((acc, h) => {
      const name = h.name.trim();
      if (name) {
        acc[name] = h.value;
      }
      return acc;
    }, {});
    refresh({
      token: token || undefined,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      remoteIndex,
    });
  };

  // ---- Declared (default) view: read straight from the entity spec. ----
  if (mode === 'declared') {
    const declared = readDeclaredCapabilities(entity);
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InfoCard title="MCP Details">
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography variant="body2" color="textSecondary">
                  Tools, resources and prompts declared in the catalog. Fetch
                  live to query the running server's remotes.
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<LockIcon />}
                  onClick={() => {
                    setMode('live');
                    query();
                  }}
                  disabled={remotes.length === 0}
                >
                  Fetch live
                </Button>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>
        <CapabilitySections lists={declared} source="declared" />
      </Grid>
    );
  }

  // ---- Live view: runtime introspection controls + results. ----
  const showDeclared = (
    <Button
      size="small"
      variant="outlined"
      startIcon={<ListAltIcon />}
      onClick={() => setMode('declared')}
    >
      Show declared
    </Button>
  );

  const header = (
    <Grid container alignItems="flex-end" spacing={1}>
      <Grid item xs={12}>
        {data?.serverInfo?.name ? (
          <Typography variant="body2" color="textSecondary">
            Connected to <strong>{data.serverInfo.name}</strong>
            {data.serverInfo.version
              ? ` v${data.serverInfo.version}`
              : ''} via {data.remote.type} ({data.remote.url})
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Live tools, resources and prompts queried from the server's remotes.
          </Typography>
        )}
      </Grid>
      {remotes.length > 1 && (
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Remote"
            size="small"
            fullWidth
            value={remoteChoice}
            onChange={e => setRemoteChoice(e.target.value)}
            SelectProps={{ displayEmpty: true }}
            InputLabelProps={{ shrink: true }}
            helperText="Which transport endpoint to introspect."
          >
            <MenuItem value="">Auto (first reachable)</MenuItem>
            {remotes.map((remote, index) => (
              <MenuItem key={index} value={String(index)}>
                {remote.type} — {remote.url}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}
      <Grid item xs>
        <TextField
          label="Authorization token"
          placeholder="Paste the MCP server's token (optional)"
          type="password"
          size="small"
          fullWidth
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !loading) {
              query();
            }
          }}
          helperText="Sent as a Bearer token to the MCP server. Not stored."
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          {customHeaders.map((h, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5} sm={4}>
                  <TextField
                    label="Header name"
                    placeholder="X-API-Key"
                    size="small"
                    fullWidth
                    value={h.name}
                    onChange={e =>
                      updateHeader(index, { name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Header value"
                    placeholder="value"
                    size="small"
                    fullWidth
                    value={h.value}
                    onChange={e =>
                      updateHeader(index, { value: e.target.value })
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !loading) {
                        query();
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    size="small"
                    aria-label="Remove header"
                    onClick={() => removeHeader(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button size="small" startIcon={<AddIcon />} onClick={addHeader}>
              Add custom header
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<LockIcon />}
          onClick={query}
          disabled={loading}
        >
          Authorize
        </Button>
      </Grid>
      <Grid item>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={query}
          disabled={loading}
        >
          Refresh
        </Button>
      </Grid>
      <Grid item>{showDeclared}</Grid>
    </Grid>
  );

  if (loading) {
    return (
      <InfoCard title="MCP Details">
        {header}
        <Progress />
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard title="MCP Details">
        {header}
        <div className={classes.livePanelSpacing}>
          <ResponseErrorPanel
            title="Unable to reach the MCP server"
            error={error}
          />
        </div>
      </InfoCard>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoCard title="MCP Details">{header}</InfoCard>
      </Grid>

      {data && data.errors.length > 0 && (
        <Grid item xs={12}>
          <WarningPanel title="Some items could not be listed">
            <ul>
              {data.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </WarningPanel>
        </Grid>
      )}

      <CapabilitySections
        lists={{
          tools: data?.tools ?? [],
          resources: data?.resources ?? [],
          prompts: data?.prompts ?? [],
        }}
        source="live"
      />
    </Grid>
  );
};

/**
 * MCP Details tab: shows the tools/resources/prompts an MCP server declares in
 * the catalog, with an option to fetch them live from the server at runtime.
 */
export const McpCapabilitiesCard = () => {
  const { entity } = useEntity();

  if (entity.spec === undefined || !isMcpServerApiEntity(entity as any)) {
    return (
      <InfoCard title="MCP Details">This entity is not an MCP server.</InfoCard>
    );
  }

  const remotes = (entity.spec.remotes as McpServerRemote[] | undefined) ?? [];

  return (
    <McpCapabilitiesContent
      entity={entity}
      entityRef={stringifyEntityRef(entity)}
      remotes={remotes}
    />
  );
};
