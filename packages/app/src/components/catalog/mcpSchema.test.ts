/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { hasSchema, summarizeSchema } from './mcpSchema';

describe('summarizeSchema', () => {
  it('lists properties with required/optional markers', () => {
    const schema = {
      type: 'object',
      properties: {
        source: { type: 'string' },
        filters: { type: 'object' },
      },
      required: ['source'],
    };

    expect(summarizeSchema(schema)).toBe('source: string, filters?: object');
  });

  it('renders enum values joined by a pipe', () => {
    const schema = {
      type: 'object',
      properties: {
        format: { enum: ['csv', 'json', 'parquet'] },
      },
      required: ['format'],
    };

    expect(summarizeSchema(schema)).toBe('format: csv|json|parquet');
  });

  it('joins anyOf member types with a pipe', () => {
    const schema = {
      type: 'object',
      properties: {
        value: { anyOf: [{ type: 'string' }, { type: 'number' }] },
      },
    };

    expect(summarizeSchema(schema)).toBe('value?: string|number');
  });

  it('returns an empty string for an object schema with no properties', () => {
    expect(summarizeSchema({ type: 'object', properties: {} })).toBe('');
  });

  it('returns an empty string for non-object input', () => {
    expect(summarizeSchema(undefined)).toBe('');
    expect(summarizeSchema('nope')).toBe('');
    expect(summarizeSchema(null)).toBe('');
  });

  it('infers object for a property that has nested properties but no type', () => {
    const schema = {
      type: 'object',
      properties: {
        nested: { properties: { a: { type: 'string' } } },
      },
      required: ['nested'],
    };

    expect(summarizeSchema(schema)).toBe('nested: object');
  });
});

describe('hasSchema', () => {
  it('is true for a non-empty object', () => {
    expect(hasSchema({ type: 'object' })).toBe(true);
  });

  it('is false for an empty object, null, and non-objects', () => {
    expect(hasSchema({})).toBe(false);
    expect(hasSchema(null)).toBe(false);
    expect(hasSchema(undefined)).toBe(false);
    expect(hasSchema('string')).toBe(false);
    expect(hasSchema([])).toBe(false);
  });
});
