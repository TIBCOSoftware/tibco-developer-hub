/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { configApiRef, useAnalytics, useApi } from '@backstage/core-plugin-api';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback } from 'react';
import { CardHeader } from './CardHeader';
import { usePermission } from '@backstage/plugin-permission-react';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { MarketplaceCardContent } from './MarketplaceCardContent.tsx';
import { MarketplaceCardTags } from './MarketplaceCardTags.tsx';
import { MarketplaceCardLinks } from './MarketplaceCardLinks.tsx';
import { MarketplaceCardActions } from './MarketplaceCardActions.tsx';
import React from 'react';
import {
  AdditionalLinks,
  MarketplaceEntity,
} from '../MarketplaceListPage/MarketplaceListPage.tsx';

const useStyles = makeStyles({
  actionContainer: {
    padding: 0,
    marginTop: '8px',
    flex: 1,
    alignItems: 'flex-end',
  },
  container: {
    cursor: 'pointer',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #B6B6B6',
    background: '#FFF',
    '&:hover': {
      border: '2px solid #727272',
      '& .pl-button--secondary': {
        backgroundColor: '#1774E5',
        borderColor: '#1774E5',
        color: '#ffffff',
      },
    },
  },
  containerInstalled: {
    backgroundColor: '#F4F4F4',
  },
});

export function filterTags(tags: string[]) {
  return tags.filter(tag => {
    return ![
      'devhub-marketplace',
      'mp-document',
      'mp-sample',
      'mp-template',
      'mp-import-flow',
    ].includes(tag.toLowerCase());
  });
}

/**
 * The Props for the {@link MarketplaceCard} component
 * @alpha
 */
export interface MarketplaceCardProps {
  template: MarketplaceEntity;
  additionalLinks?: AdditionalLinks[];
  onSelected?: (
    template: TemplateEntityV1beta3,
    additionalLinks?: AdditionalLinks[],
    openDetail?: boolean,
  ) => void;
  setOpenDetail?: (props: {
    template: MarketplaceEntity;
    additionalLinks?: AdditionalLinks[];
  }) => void;
}

/**
 * The `TemplateCard` component that is rendered in a list for each template
 * @alpha
 */
export const MarketplaceCard = (props: MarketplaceCardProps) => {
  const { onSelected, template, additionalLinks } = props;
  const marketPlaceData: any =
    template.metadata['tibco.developer.hub/marketplace'];
  const fullAdditionalLinks = [
    ...(additionalLinks || []),
    ...(marketPlaceData?.moreInfo || []),
  ];
  const styles = useStyles();
  const analytics = useAnalytics();
  const finalTags =
    template.metadata.tags && filterTags(template.metadata.tags);

  const hasTags = !!finalTags?.length;
  const hasLinks =
    !!fullAdditionalLinks?.length || !!template.metadata.links?.length;

  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });
  const handleChoose = useCallback(
    (openDetail?: boolean) => {
      analytics.captureEvent('click', `Template has been opened`);
      onSelected?.(template, additionalLinks, openDetail);
    },
    [analytics, onSelected, template, additionalLinks],
  );
  const config = useApi(configApiRef);
  const title = config.getOptionalString('app.title');
  document.title = `Marketplace | ${title}`;
  return (
    <Card
      data-testid={template.metadata.name}
      onClick={() => handleChoose(true)}
      className={
        template.installed
          ? `${styles.container} ${styles.containerInstalled}`
          : styles.container
      }
    >
      <CardHeader template={template} data-testid="marketplace-card-header" />
      <div data-testid="marketplace-card-content">
        <MarketplaceCardContent template={template} />
        {hasLinks && (
          <MarketplaceCardLinks
            template={template}
            additionalLinks={fullAdditionalLinks}
          />
        )}
        {hasTags && <MarketplaceCardTags template={template} />}
      </div>
      <CardActions
        className={styles.actionContainer}
        data-testid="marketplace-card-actions"
      >
        <MarketplaceCardActions
          canCreateTask={canCreateTask}
          handleChoose={handleChoose}
          template={template}
        />
      </CardActions>
    </Card>
  );
};
