/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { Link, Progress } from '@backstage/core-components';
import {
  configApiRef,
  errorApiRef,
  IconComponent,
  useApi,
} from '@backstage/core-plugin-api';
import { useEntityList } from '@backstage/plugin-catalog-react';
import {
  isTemplateEntityV1beta3,
  TemplateEntityV1beta3,
} from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';
import { TemplateGroup } from '@backstage/plugin-scaffolder-react/alpha';
import Typography from '@material-ui/core/Typography';
import { ComponentType, useCallback } from 'react';

import React from 'react';
import {
  AdditionalLinks,
  MarketplaceEntity,
} from '../MarketplaceListPage/MarketplaceListPage.tsx';

/**
 * @alpha
 */
export interface MarkrtplaceGroupsProps {
  groups: TemplateGroupFilter[];
  templateFilter?: (entity: TemplateEntityV1beta3) => boolean;
  TemplateCardComponent?: ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  onTemplateSelected?: (
    template: TemplateEntityV1beta3,
    additionalLinks?: AdditionalLinks[],
    openDetail?: boolean,
  ) => void;
  additionalLinksForEntity?: (template: TemplateEntityV1beta3) => {
    icon: IconComponent;
    text: string;
    url: string;
  }[];
}

/**
 * @alpha
 */
export const MarketplaceGroups = (props: MarkrtplaceGroupsProps) => {
  const { loading, error, entities } = useEntityList();
  const { groups, templateFilter, TemplateCardComponent, onTemplateSelected } =
    props;
  const errorApi = useApi(errorApiRef);
  const configApi = useApi(configApiRef);
  const docUrl: string = configApi.get('app.docUrl');
  const onSelected = useCallback(
    (
      template: TemplateEntityV1beta3,
      additionalLinks?: AdditionalLinks[],
      openDetail?: boolean,
    ) => {
      onTemplateSelected?.(template, additionalLinks, openDetail);
    },
    [onTemplateSelected],
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    errorApi.post(error);
    return null;
  }

  if (!entities || !entities.length) {
    return (
      <Typography variant="body2">
        No marketplace entries found that match your filter. Learn more about{' '}
        <Link to={docUrl}>adding marketplace entries</Link>.
      </Typography>
    );
  }
  return (
    <>
      {groups.map(({ title, filter }, index) => {
        const templates = entities
          .filter(isTemplateEntityV1beta3)
          .filter(e => (templateFilter ? templateFilter(e) : true))
          .filter(filter)
          .map(template => {
            const additionalLinks =
              props.additionalLinksForEntity?.(template) ?? [];

            return {
              template: template as MarketplaceEntity,
              additionalLinks,
            };
          })
          .sort((a, b) => {
            const aHasKey =
              a.template.metadata['tibco.developer.hub/marketplace']?.isNew;
            const bHasKey =
              b.template.metadata['tibco.developer.hub/marketplace']?.isNew;
            if (aHasKey && !bHasKey) {
              return -1;
            } else if (!aHasKey && bHasKey) {
              return 1;
            }
            return 0;
          })
          .sort((a, b) => {
            const aHasKey = a.template.installed;
            const bHasKey = b.template.installed;
            if (aHasKey && !bHasKey) {
              return 1;
            } else if (!aHasKey && bHasKey) {
              return -1;
            }
            return 0;
          });
        return (
          <TemplateGroup
            key={index}
            templates={templates}
            title={title}
            components={{ CardComponent: TemplateCardComponent }}
            onSelected={onSelected}
          />
        );
      })}
    </>
  );
};
