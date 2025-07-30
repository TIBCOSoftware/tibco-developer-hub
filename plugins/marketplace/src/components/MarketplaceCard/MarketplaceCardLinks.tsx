/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import { CardLink } from './CardLink';
import React from 'react';
import { AdditionalLinks } from '../MarketplaceListPage/MarketplaceListPage.tsx';

const useStyles = makeStyles<Theme>({
  linkContainer: {
    marginTop: '8px',
  },
  linkTextShort: {
    marginTop: '8px',
    marginRight: '24px',
    '& svg': {
      color: '#1774E5',
      height: '16px',
      width: '16px',
    },
    '& a': {
      color: '#1774E5',
      textDecoration: 'underline',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '14px',
    },
  },
  linkTextMore: {
    marginTop: '8px',
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
 * The Props for the {@link MarketplaceCardLinks} component
 * @alpha
 */
export interface TemplateCardLinksProps {
  template: TemplateEntityV1beta3;
  additionalLinks?: AdditionalLinks[];
}

export const MarketplaceCardLinks = ({
  template,
  additionalLinks,
}: TemplateCardLinksProps) => {
  const styles = useStyles();
  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;

  const links = [];
  const extraLinks = [];
  if (additionalLinks) {
    for (const link of additionalLinks) {
      if (links.length >= 2) {
        extraLinks.push(link);
      } else {
        links.push(link);
      }
    }
  }
  if (template.metadata.links) {
    for (const link of template.metadata.links) {
      const item = {
        icon: link.icon,
        text: link.title || link.url,
        url: link.url,
      };
      if (links.length >= 2) {
        extraLinks.push(item);
      } else {
        links.push(item);
      }
    }
  }
  return (
    <>
      <Grid
        className={styles.linkContainer}
        container
        spacing={0}
        alignItems="flex-end"
        data-testid="marketplace-card-links"
      >
        {links?.map(({ icon, text, url }, index) => (
          <Grid
            className={styles.linkTextShort}
            item
            key={index}
            data-testid="marketplace-card-links--item"
          >
            <CardLink icon={iconResolver(icon)} text={text} url={url} />
          </Grid>
        ))}
        {extraLinks.length > 0 && (
          <Grid
            item
            className={styles.linkTextMore}
            key="more-links"
            data-testid="marketplace-card-links--more"
          >
            <div>
              <button>+ {extraLinks.length} more</button>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
};
