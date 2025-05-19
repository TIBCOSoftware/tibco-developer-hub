/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { JsonValue } from '@backstage/types';

function decodeBase64(...args: JsonValue[]): string {
  return Buffer.from(args.join(''), 'base64').toString();
}

function encodeBase64(...args: JsonValue[]): string {
  return Buffer.from(args.join('')).toString('base64');
}

export const customFilters = {
  decodeBase64,
  encodeBase64,
};
