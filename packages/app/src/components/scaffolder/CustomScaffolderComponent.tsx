/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import React from 'react';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';

export interface TemplateGroups {
  name: string;
  tagFilters: string[];
}
export const templateGroupsValue = (
  templateGroups: TemplateGroups[] | undefined,
) => {
  if (!templateGroups || !Array.isArray(templateGroups)) {
    return undefined;
  }
  const out = [];
  for (const templateGroup of templateGroups) {
    if (
      templateGroup.name &&
      typeof templateGroup.name === 'string' &&
      templateGroup.tagFilters &&
      Array.isArray(templateGroup.tagFilters)
    ) {
      let valid = true;
      for (const tagFilter of templateGroup.tagFilters) {
        if (typeof tagFilter !== 'string') {
          valid = false;
          break;
        }
      }
      if (valid) {
        out.push(templateGroup);
      }
    }
  }
  return out;
};

export const CustomScaffolderComponent = () => {
  const config = useApi(configApiRef);
  const templateGroups: undefined | TemplateGroups[] = templateGroupsValue(
    config.getOptional('templateGroups'),
  );
  let groups;
  if (templateGroups) {
    groups = [];
    for (const templateGroup of templateGroups) {
      groups.push({
        title: templateGroup.name,
        filter: (entity: TemplateEntityV1beta3) => {
          for (const tag of templateGroup.tagFilters) {
            if (entity.metadata?.tags?.includes(tag)) {
              return true;
            }
          }
          return false;
        },
      });
    }
  }
  return (
    <ScaffolderPage
      templateFilter={entity => {
        const tags = entity.metadata.tags?.map(v => v.toLowerCase());
        return !(
          tags?.includes('import-flow') ||
          tags?.includes('devhub-marketplace') ||
          tags?.includes('devhub-internal')
        );
      }}
      groups={groups}
      headerOptions={{
        pageTitleOverride: 'Develop a new component',
        title: 'Develop a new component',
        subtitle:
          'Develop new software components using standard templates in your organization',
      }}
    />
  );
};
