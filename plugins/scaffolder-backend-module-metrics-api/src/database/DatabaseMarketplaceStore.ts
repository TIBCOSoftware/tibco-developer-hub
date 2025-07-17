/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { MarketplaceStore } from './MarketplaceStore.ts';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-scaffolder-backend',
  'migrations',
);

/**
 * @public
 export type RawDbTaskRow = {
 id: string;
 spec: string;
 status: TaskStatus;
 state?: string;
 last_heartbeat_at?: string;
 created_at: string;
 created_by: string | null;
 secrets?: string | null;
 workspace?: Buffer;
 };
 */
/**
 * DatabaseTaskStore
 *
 * @public
 */
export type DatabaseMarketplaceStoreOptions = {
  database: DatabaseService | Knex;
};

/**
 * Type guard to help DatabaseTaskStore understand when database is DatabaseService vs. when database is a Knex instance.
 *
 * * @public
 */
function isDatabaseService(
  opt: DatabaseService | Knex,
): opt is DatabaseService {
  return (opt as DatabaseService).getClient !== undefined;
}

/**
 * Store to manage the marketplace.
 *
 * @public
 */
export class DatabaseMarketplaceStore implements MarketplaceStore {
  static async create(
    options: DatabaseMarketplaceStoreOptions,
  ): Promise<DatabaseMarketplaceStore> {
    const { database } = options;
    const client = await this.getClient(database);
    await this.runMigrations(database, client);
    return new DatabaseMarketplaceStore(client);
  }

  private constructor(private readonly db: Knex) {}

  private static async runMigrations(
    database: DatabaseService | Knex,
    client: Knex,
  ): Promise<void> {
    if (!isDatabaseService(database)) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
      return;
    }
    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }
  }

  private static async getClient(
    database: DatabaseService | Knex,
  ): Promise<Knex> {
    if (isDatabaseService(database)) {
      return database.getClient();
    }
    return database;
  }

  async get(): Promise<any> {
    const knex: Knex = this.db;
    return (
      knex<{ name: string; namespace: string }[]>('tasks')
        .where(function a() {
          this.where('status', '=', 'completed').whereExists(function b() {
            this.select(knex.raw(1))
              .from(
                knex.raw(
                  'jsonb_array_elements(spec::jsonb -> ? -> ? -> ? -> ?) AS tag',
                  ['templateInfo', 'entity', 'metadata', 'tags'],
                ),
              )
              .whereRaw('LOWER(tag::text) = ?', ['"devhub-marketplace"']);
          });
        })
        .andWhere('task_events.event_type', '=', 'completion')
        /*  .where(function() {
                    this.where('status', '=', 'completed')
                        .andWhereRaw("(spec::jsonb -> 'templateInfo' -> 'entity' -> 'metadata' ->'tags')  @> ?::jsonb", ['["tibco"]'])
                  })*/
        .select(
          knex.raw(
            "tasks.spec::json -> 'templateInfo' -> 'entity' -> 'metadata' ->> 'name' as name",
          ),
          knex.raw(
            "tasks.spec::json -> 'templateInfo' -> 'entity' -> 'metadata' ->> 'namespace' as namespace",
          ),
          knex.raw(
            "json_agg(json_build_object('id',tasks.id,'created_at',tasks.created_at, 'output', task_events.body::json -> 'output') order by tasks.created_at DESC) as data",
          ),
        )
        .join('task_events', 'tasks.id', '=', 'task_events.task_id')
        .groupBy('tasks.spec')
    );
  }
}
