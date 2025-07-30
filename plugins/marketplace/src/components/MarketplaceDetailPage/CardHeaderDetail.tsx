/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import SuccessIcon from '../../images/success.svg';
import DocumentBgIcon from '../../images/document-bg.svg';
import DocumentIcon from '../../images/document-icon.svg';
import TemplateBgIcon from '../../images/template-bg.svg';
import TemplateIcon from '../../images/template-icon.svg';
import ImportFlowBgIcon from '../../images/import-flow-bg.svg';
import ImportFlowIcon from '../../images/import-flow-icon.svg';
import SampleBgIcon from '../../images/sample-bg.svg';
import SampleIcon from '../../images/sample-icon.svg';
import BlankBgIcon from '../../images/blank-bg.svg';
import BlankIcon from '../../images/blank-icon.svg';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage.tsx';
import Highlighter from 'react-highlight-words';
import { HighlightContext } from '../Filtering/HighlightContext.tsx';
import { UserIcon } from '@backstage/core-components';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import NewIcon from '../../images/new.svg';

const useStyles = makeStyles({
  categoryText: {
    color: '#727272',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '20px',
  },
  installedText: {
    color: '#212121',
    fontSize: '14px',
    fontWeight: 600,
    marginLeft: '6px',
    lineHeight: '14px',
  },
  headerContainer: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '88px',
    height: '100%',
    marginTop: '12px',
    marginBottom: '12px',
    borderRadius: '6px',
    color: '#fff',
    padding: '8px 16px',
    backgroundSize: 'cover',
  },
  headerImageIcon: {
    height: '64px',
    width: '64px',
    marginRight: '16px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '36px',
  },
  ownedBy: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ownedByIcon: {
    fontSize: '20px',
    height: '20px',
    width: '20px',
  },
  ownedByLink: {
    marginLeft: '4px',
    textDecoration: 'underline',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '14px',
  },
  newIcon: {
    marginLeft: '8px',
    height: '16px',
  },
});

/**
 * Props for the CardHeader component
 */
export interface CardHeaderProps {
  template: MarketplaceEntity;
}

function HeaderImage({ template }: CardHeaderProps) {
  const styles = useStyles();
  const { highlight } = useContext(HighlightContext);
  let bg: string = '';
  let icon: string = '';
  const entityType = template.spec?.type?.toLowerCase();
  switch (entityType) {
    case 'document':
      bg = DocumentBgIcon;
      icon = DocumentIcon;
      break;
    case 'sample':
      bg = SampleBgIcon;
      icon = SampleIcon;
      break;
    case 'template':
      bg = TemplateBgIcon;
      icon = TemplateIcon;
      break;
    case 'import-flow':
      bg = ImportFlowBgIcon;
      icon = ImportFlowIcon;
      break;
    default:
      bg = BlankBgIcon;
      icon = BlankIcon;
  }
  const ownedByRelations = getEntityRelations(template, RELATION_OWNED_BY);
  return (
    <div
      className={styles.headerContainer}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Grid container spacing={0} alignItems="flex-start" wrap="nowrap">
        <img className={styles.headerImageIcon} src={icon} alt={entityType} />
        <div>
          <div className={styles.headerTitle}>
            <Highlighter
              searchWords={highlight?.split(' ')}
              autoEscape
              textToHighlight={
                template.metadata?.title ?? template.metadata?.name
              }
            />
          </div>

          {ownedByRelations.length > 0 && (
            <div
              className={styles.ownedBy}
              data-testid="marketplace-card-actions--ownedby"
            >
              <div className={styles.ownedByIcon}>
                <UserIcon fontSize="inherit" />
              </div>
              <EntityRefLinks
                className={styles.ownedByLink}
                onClick={e => e.stopPropagation()}
                entityRefs={ownedByRelations}
                defaultKind="Group"
                hideIcons
              />
            </div>
          )}
        </div>
      </Grid>
    </div>
  );
}

/**
 * The Card Header with the background for the TemplateCard.
 */
export const CardHeaderDetail = (props: CardHeaderProps) => {
  const styles = useStyles();
  // const isPopular = false;
  // template.metadata['tibco.developer.hub/marketplace']?.popularity || 0 > 5;
  const isNew =
    props.template.metadata['tibco.developer.hub/marketplace']?.isNew;
  return (
    <>
      <Grid container spacing={0} justifyContent="space-between">
        <div>
          <Grid container spacing={0} alignItems="center">
            <div className={styles.categoryText}>
              {props.template.spec?.type}
            </div>
            {isNew && (
              <img className={styles.newIcon} src={NewIcon} alt="new-logo" />
            )}
          </Grid>
        </div>
        {props.template.installed && (
          <div>
            <Grid container spacing={0} alignItems="center">
              <img src={SuccessIcon} height={20} width={20} alt="logo" />
              <div className={styles.installedText}>Installed</div>
            </Grid>
          </div>
        )}
      </Grid>
      <HeaderImage template={props.template} />
    </>
  );
};
