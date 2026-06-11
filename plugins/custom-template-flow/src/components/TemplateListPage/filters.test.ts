/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import { ExcludeTagFilter, TemplateTagFilter } from './filters';

/** Build a minimal entity fixture with optional tags. */
const makeEntity = (tags?: string[]): Entity => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: {
    name: 'test-entity',
    ...(tags !== undefined ? { tags } : {}),
  },
});

describe('TemplateTagFilter', () => {
  describe('filterEntity', () => {
    it('returns true when entity has all required tags', () => {
      const filter = new TemplateTagFilter(['react', 'typescript']);
      expect(
        filter.filterEntity(makeEntity(['react', 'typescript', 'extra'])),
      ).toBe(true);
    });

    it('returns true when entity has exactly the required tags', () => {
      const filter = new TemplateTagFilter(['react']);
      expect(filter.filterEntity(makeEntity(['react']))).toBe(true);
    });

    it('returns false when entity is missing a required tag', () => {
      const filter = new TemplateTagFilter(['react', 'typescript']);
      expect(filter.filterEntity(makeEntity(['react']))).toBe(false);
    });

    it('returns false when entity has no tags', () => {
      const filter = new TemplateTagFilter(['react']);
      expect(filter.filterEntity(makeEntity([]))).toBe(false);
    });

    it('returns false when entity has no tags property', () => {
      const filter = new TemplateTagFilter(['react']);
      expect(filter.filterEntity(makeEntity(undefined))).toBe(false);
    });

    it('returns true when the filter values list is empty', () => {
      const filter = new TemplateTagFilter([]);
      expect(filter.filterEntity(makeEntity(['react']))).toBe(true);
    });
  });

  describe('getCatalogFilters', () => {
    it('returns a metadata.tags key with the filter values', () => {
      const filter = new TemplateTagFilter(['react', 'typescript']);
      expect(filter.getCatalogFilters()).toEqual({
        'metadata.tags': ['react', 'typescript'],
      });
    });
  });

  describe('toQueryValue', () => {
    it('returns the filter values', () => {
      const filter = new TemplateTagFilter(['react', 'typescript']);
      expect(filter.toQueryValue()).toEqual(['react', 'typescript']);
    });
  });
});

describe('ExcludeTagFilter', () => {
  describe('filterEntity', () => {
    it('returns true when entity has none of the excluded tags', () => {
      const filter = new ExcludeTagFilter(['import-flow', 'internal']);
      expect(filter.filterEntity(makeEntity(['react', 'typescript']))).toBe(
        true,
      );
    });

    it('returns false when entity has one excluded tag', () => {
      const filter = new ExcludeTagFilter(['import-flow', 'internal']);
      expect(filter.filterEntity(makeEntity(['import-flow', 'react']))).toBe(
        false,
      );
    });

    it('returns false when entity has all excluded tags', () => {
      const filter = new ExcludeTagFilter(['import-flow', 'internal']);
      expect(filter.filterEntity(makeEntity(['import-flow', 'internal']))).toBe(
        false,
      );
    });

    it('is case-insensitive when matching excluded tags', () => {
      const filter = new ExcludeTagFilter(['import-flow']);
      expect(filter.filterEntity(makeEntity(['IMPORT-FLOW']))).toBe(false);
    });

    it('returns true when entity has no tags', () => {
      const filter = new ExcludeTagFilter(['import-flow']);
      expect(filter.filterEntity(makeEntity([]))).toBe(true);
    });

    it('returns true when entity has no tags property', () => {
      const filter = new ExcludeTagFilter(['import-flow']);
      expect(filter.filterEntity(makeEntity(undefined))).toBe(true);
    });

    it('returns true when the filter values list is empty', () => {
      const filter = new ExcludeTagFilter([]);
      expect(filter.filterEntity(makeEntity(['import-flow']))).toBe(true);
    });
  });

  describe('getCatalogFilters', () => {
    it('returns an empty object (server-side exclusion is not supported)', () => {
      const filter = new ExcludeTagFilter(['import-flow']);
      expect(filter.getCatalogFilters()).toEqual({});
    });
  });

  describe('toQueryValue', () => {
    it('returns the excluded values', () => {
      const filter = new ExcludeTagFilter(['import-flow', 'internal']);
      expect(filter.toQueryValue()).toEqual(['import-flow', 'internal']);
    });
  });
});
