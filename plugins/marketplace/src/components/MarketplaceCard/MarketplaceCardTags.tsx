/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import type { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { filterTags } from './MarketplaceCard.tsx';

const useStyles = makeStyles<Theme>({
  tagContainer: {
    marginTop: '8px',
  },
  tag: {
    paddingLeft: '5px',
    marginTop: '8px',
    marginRight: '16px',
    paddingRight: '5px',
    borderRadius: '3px',
    border: '1px solid #dedede',
    color: '#000',
    fontSize: '10px',
    fontWeight: 400,
    backgroundColor: '#FFF',
  },
  linkTextMore: {
    '& button': {
      border: 'none',
      background: 'none',
      padding: 0,
      color: '#1774E5',
      textDecoration: 'underline',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '14px',
      cursor: 'pointer',
    },
  },
});

/**
 * The Props for the {@link MarketplaceCardTags} component
 * @alpha
 */
export interface TemplateCardTagsProps {
  template: TemplateEntityV1beta3;
}

export const MarketplaceCardTags = ({ template }: TemplateCardTagsProps) => {
  const styles = useStyles();
  const finalTags =
    template.metadata.tags && filterTags(template.metadata.tags);
  const tags = [];
  const extraTags = [];
  if (finalTags) {
    for (const tag of finalTags) {
      if (tags.length >= 3) {
        extraTags.push(tag);
      } else {
        tags.push(tag);
      }
    }
  }
  return (
    <>
      <Grid
        className={styles.tagContainer}
        container
        spacing={0}
        alignItems="flex-end"
        data-testid="marketplace-card-tags"
      >
        {tags?.map((tag, index) => (
          <Grid
            key={index}
            item
            data-testid={`marketplace-card-tag-item-${tag}`}
          >
            <div className={styles.tag}>{tag}</div>
          </Grid>
        ))}
        {extraTags.length > 0 && (
          <Grid
            item
            className={styles.linkTextMore}
            key="grid-more"
            data-testid="marketplace-card-tags--more"
          >
            <button>+ {extraTags.length} more</button>
          </Grid>
        )}
      </Grid>
    </>
  );
};
