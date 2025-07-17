/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { EntityDescriptionTextFilter } from './EntityDescriptionTextFilter';
import { Entity } from '@backstage/catalog-model';

describe('EntityDescriptionTextFilter test for marketplace', () => {
  const entity: Entity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      namespace: 'default',
      name: 'template1-name',
      title: 'Template1 title',
      description: 'Template1 description',
      tags: ['bwce'],
    },
    spec: {
      type: 'service',
      system: 'system1-name',
      owner: 'group:default/group1-name',
    },
  };
  it('should filter entities by name', async () => {
    const filter = new EntityDescriptionTextFilter('name');
    expect(filter.filterEntity(entity)).toEqual(true);
  });
  it('should filter entities by title', async () => {
    const filter = new EntityDescriptionTextFilter('title');
    expect(filter.filterEntity(entity)).toEqual(true);
  });
  it('should filter entities by tags', async () => {
    const filter = new EntityDescriptionTextFilter('bwce');
    expect(filter.filterEntity(entity)).toEqual(true);
  });
  it('should filter entities by description', async () => {
    const filter = new EntityDescriptionTextFilter('description');
    expect(filter.filterEntity(entity)).toEqual(true);
  });

  it('should output queary value', async () => {
    const filter = new EntityDescriptionTextFilter('value1');
    expect(filter.toQueryValue()).toEqual('value1');
  });

  it('returns true when all words match partially', async () => {
    const filter = new EntityDescriptionTextFilter('template1 title');
    expect(filter.filterEntity(entity)).toEqual(true);
  });

  it('returns false when no words match', async () => {
    const filter = new EntityDescriptionTextFilter('nonexistent');
    expect(filter.filterEntity(entity)).toEqual(false);
  });

  it('handles empty filter value gracefully', async () => {
    const filter = new EntityDescriptionTextFilter('');
    expect(filter.filterEntity(entity)).toEqual(true);
  });

  it('handles entities with undefined metadata fields', async () => {
    const entityWithUndefinedFields: Entity = {
      ...entity,
      metadata: {
        ...entity.metadata,
        title: undefined,
        description: undefined,
      },
    };
    const filter = new EntityDescriptionTextFilter('template1');
    expect(filter.filterEntity(entityWithUndefinedFields)).toEqual(true);
  });

  it('handles entities with empty tags array', async () => {
    const entityWithEmptyTags: Entity = {
      ...entity,
      metadata: {
        ...entity.metadata,
        tags: [],
      },
    };
    const filter = new EntityDescriptionTextFilter('bwce');
    expect(filter.filterEntity(entityWithEmptyTags)).toEqual(false);
  });
});
