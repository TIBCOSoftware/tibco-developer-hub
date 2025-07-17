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
  installedText: {
    color: '#212121',
    fontSize: '12px',
    fontWeight: 400,
    marginLeft: '6px',
  },
  headerContainer: {
    display: 'flex',
    height: '74px',
    marginTop: '8px',
    padding: '8px 16px',
    borderRadius: '6px',
    color: '#fff',
    backgroundSize: 'cover',
  },
  headerImageIcon: {
    height: '44px',
    width: '44px',
    marginRight: '8px',
  },
  headerTitle: {
    fontSize: '18px',
    height: '27px',
    width: '244px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 600,
    lineHeight: '27px',
  },
  ownedBy: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ownedByIcon: {
    fontSize: '16px',
    height: '16px',
    width: '16px',
  },
  ownedByLink: {
    marginLeft: '4px',
    textDecoration: 'underline',
    color: '#fff',
    fontSize: '14px',
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
    <Grid
      container
      spacing={0}
      className={styles.headerContainer}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Grid container spacing={0} alignItems="center" wrap="nowrap">
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
    </Grid>
  );
}

/**
 * The Card Header with the background for the TemplateCard.
 */
export const CardHeader = (props: CardHeaderProps) => {
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
            <div className="th-font-small">{props.template.spec?.type}</div>
            {isNew && (
              <img
                data-testid="new-image"
                className={styles.newIcon}
                src={NewIcon}
                alt="logo"
              />
            )}
          </Grid>
        </div>
        {props.template.installed && (
          <div>
            <Grid container spacing={0} alignItems="center">
              <img src={SuccessIcon} height={16} width={16} alt="logo" />
              <div className={`th-font-small ${styles.installedText}`}>
                Installed
              </div>
            </Grid>
          </div>
        )}
      </Grid>
      <HeaderImage template={props.template} />
    </>
  );
};
