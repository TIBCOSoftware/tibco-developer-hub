/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { InfoCard, Table, TableColumn, Link } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  isMcpServerApiEntity,
  McpServerRemote,
} from '@backstage/catalog-model/alpha';

const columns: TableColumn<McpServerRemote>[] = [
  {
    title: 'Transport',
    field: 'type',
    width: '30%',
  },
  {
    title: 'URL',
    field: 'url',
    render: remote => (
      <Link to={remote.url} target="_blank" rel="noopener noreferrer">
        {remote.url}
      </Link>
    ),
  },
];

/**
 * Renders the `spec.remotes` connections of an MCP server API entity.
 */
export const McpRemotesCard = () => {
  const { entity } = useEntity();

  if (entity.spec === undefined || !isMcpServerApiEntity(entity as any)) {
    return (
      <InfoCard title="Connections">This entity is not an MCP server.</InfoCard>
    );
  }

  const remotes = (entity.spec.remotes as McpServerRemote[] | undefined) ?? [];

  return (
    <Table<McpServerRemote>
      title="Connections"
      subtitle="MCP server transport endpoints (spec.remotes)"
      options={{ paging: false, search: false, padding: 'dense' }}
      columns={columns}
      data={remotes}
      emptyContent={
        <div style={{ padding: '16px' }}>
          No remotes are defined for this MCP server.
        </div>
      }
    />
  );
};
