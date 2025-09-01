/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { JsonValue } from '@backstage/types';
import { createTemplateFilter } from '@backstage/plugin-scaffolder-node/alpha';
import { decodeExamples, encodeExamples } from './custom-filters.examples.ts';

function decodeBase64(...args: JsonValue[]): string {
  return Buffer.from(args.join(''), 'base64').toString();
}

function encodeBase64(...args: JsonValue[]): string {
  return Buffer.from(args.join('')).toString('base64');
}

export const createDecodeBase64 = () =>
  createTemplateFilter({
    id: 'decodeBase64',
    description:
      'Decode a base64 encoded string. Accepts multiple string arguments, which are concatenated before decoding.',
    schema: z =>
      z
        .function()
        .args(z.array(z.string()).describe('Array of strings to decode'))
        .returns(z.string().describe('Decoded string from base64 input')),
    examples: decodeExamples,
    filter: decodeBase64,
  });

export const createEncodeBase64 = () =>
  createTemplateFilter({
    id: 'encodeBase64',
    description:
      'Encode a string to base64. Accepts multiple string arguments, which are concatenated before encoding.',
    schema: z =>
      z
        .function()
        .args(z.array(z.string()).describe('Array of strings to encode'))
        .returns(
          z.string().describe('Encoded base64 string from string input'),
        ),
    examples: encodeExamples,
    filter: encodeBase64,
  });
