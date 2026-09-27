/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import { CustomTemplatePage } from '@internal/backstage-plugin-custom-template-flow';
import { useRunFlowKind } from './RunFlowContext.tsx';

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
  // Tailor the run-page header to the flow the running template belongs to
  // (import flow / self service / marketplace) instead of the generic
  // "Create a new component". The flow kind is resolved once and shared by
  // RunFlowKindProvider so the header matches the sidebar and never flickers.
  const runFlowKind = useRunFlowKind();
  let headerOptions:
    | { pageTitleOverride: string; title: string; subtitle: string }
    | undefined;
  if (runFlowKind === 'import') {
    headerOptions = {
      pageTitleOverride: 'Import Flow',
      title: 'Import Flow',
      subtitle: 'Import new software components using import flows',
    };
  } else if (runFlowKind === 'self-service') {
    headerOptions = {
      pageTitleOverride: 'Self Service',
      title: 'Self Service',
      subtitle: 'Set up new software components using self service flows',
    };
  } else if (runFlowKind === 'marketplace') {
    headerOptions = {
      pageTitleOverride: 'Marketplace',
      title: 'Marketplace',
      subtitle: 'Install new software components using the marketplace',
    };
  }
  const templateGroups: undefined | TemplateGroups[] = templateGroupsValue(
    config.getOptional('templateGroups'),
  );
  let groups:
    | { title: string; filter: (entity: TemplateEntityV1beta3) => boolean }[]
    | undefined;
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
      headerOptions={headerOptions}
      components={{
        EXPERIMENTAL_TemplateListPageComponent: () => (
          <CustomTemplatePage
            templateFilter={entity => {
              const tags = entity.metadata.tags?.map(v => v.toLowerCase());
              return !(
                tags?.includes('import-flow') ||
                tags?.includes('devhub-marketplace') ||
                tags?.includes('devhub-internal') ||
                tags?.includes('self-service')
              );
            }}
            excludedTags={[
              'import-flow',
              'devhub-marketplace',
              'devhub-internal',
              'self-service',
            ]}
            groups={groups}
            headerOptions={{
              pageTitleOverride: 'Develop a new component',
              title: 'Develop a new component',
              subtitle:
                'Develop new software components using standard templates in your organization',
            }}
          />
        ),
      }}
    />
  );
};
