/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { HighlightContext } from '../Filtering/HighlightContext.tsx';
import Highlighter from 'react-highlight-words';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage.tsx';
import markdownToTxt from 'markdown-to-txt';

const useStyles = makeStyles(() => ({
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
  },
  highlight: {
    color: '#212121',
    wordBreak: 'break-word',
    fontSize: '14px',
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 4,
  },
  /*  markdown: {
    '& :first-child': {
      margin: 0,
    },
    overflow: 'hidden',
    color: '#212121',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    fontSize: '14px',
    fontWeight: 400,
  },*/
  titleContainer: {
    marginTop: '16px',
  },
  title: {
    color: '#000',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '28px',
  },
  newIcon: {
    marginLeft: '8px',
    display: 'inline-block',
    height: '16px',
  },
  newImg: {
    display: 'block',
  },
}));

/**
 * The Props for the {@link MarketplaceCardContent} component
 * @alpha
 */
export interface TemplateCardContentProps {
  template: MarketplaceEntity;
}

export const MarketplaceCardContent = ({
  template,
}: TemplateCardContentProps) => {
  const styles = useStyles();
  const { highlight } = useContext(HighlightContext);
  return (
    <>
      <Grid
        item
        xs={12}
        data-testid="marketplace-card-content-grid"
        className={styles.titleContainer}
      >
        <Highlighter
          data-testid="marketplace-card-content-container"
          className={styles.highlight}
          searchWords={highlight?.split(' ')}
          autoEscape
          textToHighlight={markdownToTxt(
            template.metadata.description ?? 'No description',
          )}
        />
        {/*   <MarkdownContent className={styles.markdown}
            content={template.metadata.description ?? 'No description'}
          />*/}
      </Grid>
    </>
  );
};
