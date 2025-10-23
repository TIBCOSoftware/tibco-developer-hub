/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import Keyv from 'keyv';
import KeyvPostgres from '@keyv/postgres';

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = process.env.POSTGRES_PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB =
  process.env.POSTGRES_DB || 'backstage_plugin_tibco_hub_cache';

export class KeyvStore {
  public static keyv: Keyv;
  public static keyvMemory: Keyv;
  public static initialize() {
    if (
      !(
        POSTGRES_HOST &&
        POSTGRES_PORT &&
        POSTGRES_USER &&
        POSTGRES_PASSWORD &&
        POSTGRES_DB
      )
    ) {
      throw new Error('Missing POSTGRES configurations required for Keyv');
    }
    KeyvStore.keyv = new Keyv(
      new KeyvPostgres(
        `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
      ),
    );
    KeyvStore.keyvMemory = new Keyv();
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
