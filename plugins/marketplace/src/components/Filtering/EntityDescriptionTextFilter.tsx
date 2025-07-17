/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { EntityFilter } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

export class EntityDescriptionTextFilter implements EntityFilter {
  constructor(readonly value: string) {}

  filterEntity(entity: Entity): boolean {
    const words = this.toUpperArray(this.value.split(/\s/));
    const exactMatch = this.toUpperArray([entity.metadata.tags]);
    const partialMatch = this.toUpperArray([
      entity.metadata.name,
      entity.metadata.title,
      entity.metadata.description,
      (entity.spec?.profile as { displayName?: string })?.displayName,
    ]);

    for (const word of words) {
      if (
        exactMatch.every(m => m !== word) &&
        partialMatch.every(m => !m.includes(word))
      ) {
        return false;
      }
    }

    return true;
  }

  toQueryValue() {
    return this.value;
  }

  private toUpperArray(
    value: Array<string | string[] | undefined>,
  ): Array<string> {
    return value
      .flat()
      .filter((m): m is string => Boolean(m))
      .map(m => m.toLocaleUpperCase('en-US'));
  }
}
