/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import { EntityFilter } from '@backstage/plugin-catalog-react';

/**
 * Filters entities to those that have ALL of the specified tags.
 */
export class TemplateTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    return this.values.every(v => (entity.metadata.tags ?? []).includes(v));
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { 'metadata.tags': this.values };
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Filters entities to those that have NONE of the specified tags.
 */
export class ExcludeTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}

  filterEntity(entity: Entity): boolean {
    const tags = entity.metadata.tags?.map(v => v.toLowerCase()) ?? [];
    return !this.values.some(v => tags.includes(v.toLowerCase()));
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return {};
  }

  toQueryValue(): string[] {
    return this.values;
  }
}
