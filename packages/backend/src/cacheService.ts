/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import Keyv from 'keyv';
import KeyvPostgres from '@keyv/postgres';
import { Knex } from 'knex';

export class KeyvStore {
  public static keyv: Keyv;
  public static keyvMemory: Keyv;
  public static initialize(
    knex: Knex,
    pluginDivisionMode: string,
    PLUGIN_ID: string,
  ) {
    if (knex.client.driverName === 'pg') {
      const cfg = knex.client.config.connection;
      const connectionString =
        typeof cfg === 'string'
          ? cfg
          : `postgres://${cfg.user}:${cfg.password}@${cfg.host}:${
              cfg.port ?? 5432
            }${cfg.database ? `/${cfg.database}` : ''}`;
      let schema = 'public';
      if (typeof cfg !== 'string' && pluginDivisionMode !== 'database') {
        schema = PLUGIN_ID;
      }
      KeyvStore.keyv = new Keyv(
        new KeyvPostgres({
          uri: connectionString,
          schema,
        }),
      );
    } else {
      KeyvStore.keyv = new Keyv();
    }
    KeyvStore.keyvMemory = new Keyv();
    KeyvStore.keyv.on('error', err => {
      throw new Error(`Error while initializing KeyvStore ${err as Error}`);
    });
    KeyvStore.keyv.on('error', err => {
      throw new Error(`Error while initializing KeyvStore ${err as Error}`);
    });
    KeyvStore.keyvMemory.on('error', err => {
      throw new Error(
        `Error while initializing in memory KeyvStore ${err as Error}`,
      );
    });
  }
}
