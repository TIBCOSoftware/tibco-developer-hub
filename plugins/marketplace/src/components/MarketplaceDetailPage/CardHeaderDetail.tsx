/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { makeStyles } from '@material-ui/core/styles';
import { useContext, useState } from 'react';
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
  catalogApiRef,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import NewIcon from '../../images/new.svg';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { TibcoIcon } from '../../Icons/TibcoIcon.tsx';

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
  uninstallButton: {
    marginLeft: '16px',
  },
  dialogActions: {
    display: 'inline-block',
  },
});

/**
 * Props for the CardHeader component
 */
export interface CardHeaderProps {
  template: MarketplaceEntity;
  onSetTemplate?: () => any;
  onCloseDetailPage?: () => void;
}

export type UninstallMarketplaceDialogProps = {
  open: boolean;
  onConfirm: () => any;
  onClose: () => any;
};

const HeaderImage = ({ template }: CardHeaderProps) => {
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
};

const getRegLocsByTemplate = (template: MarketplaceEntity): string[] => {
  const locs: string[] = [];
  for (const step of template?.spec?.steps) {
    if (step?.action === 'catalog:register' && step?.input?.catalogInfoUrl) {
      locs.push(step?.input?.catalogInfoUrl as string);
    }
  }
  return locs;
};

export const UninstallMarketplaceDialog = (
  props: UninstallMarketplaceDialogProps,
) => {
  const { open, onConfirm, onClose } = props;
  const styles = useStyles();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Are you sure you want to uninstall this marketplace entry?
      </DialogTitle>
      <DialogContent>
        <>
          <button
            onClick={onConfirm}
            type="button"
            className="pl-button pl-button--primary"
            data-testid="marketplac-uninstall--confirm-button"
          >
            Uninstall
          </button>
          <DialogActions className={styles.dialogActions}>
            <button
              onClick={onClose}
              type="button"
              className="pl-button pl-button--no-border"
              data-testid="marketplac-uninstall--cancel-button"
            >
              Cancel
            </button>
          </DialogActions>
        </>
      </DialogContent>
    </Dialog>
  );
};

/**
 * The Card Header with the background for the TemplateCard.
 */
export const CardHeaderDetail = (props: CardHeaderProps) => {
  const styles = useStyles();
  // const isPopular = false;
  // template.metadata['tibco.developer.hub/marketplace']?.popularity || 0 > 5;
  const isNew =
    props.template.metadata['tibco.developer.hub/marketplace']?.isNew;
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const [open, setOpen] = useState(false);

  const uninstall = async () => {
    const locs = getRegLocsByTemplate(props.template);
    if (locs.length === 0) {
      setOpen(false);
      alertApi.post({
        message:
          'Unable to find registered catalogInfoUrl for the marketplace entry.',
        severity: 'error',
        display: 'transient',
      });
      return;
    }
    try {
      const locations = await catalogApi.getLocations();
      const ids = [];
      for (const location of locations?.items) {
        if (location.type === 'url' && locs.includes(location.target)) {
          ids.push(location.id);
        }
      }
      if (ids.length === 0) {
        setOpen(false);
        alertApi.post({
          message: 'Unable to find locations for the marketplace entry.',
          severity: 'error',
          display: 'transient',
        });
        return;
      }
      for (const id of ids) {
        await catalogApi.removeLocationById(id);
      }
      props.onCloseDetailPage?.();
      setOpen(false);
      alertApi.post({
        message: 'Marketplace entry uninstalled successfully',
        severity: 'success',
        display: 'transient',
      });
      props.template.installed = false;
      props.onSetTemplate?.();
    } catch (err) {
      setOpen(false);
      alertApi.post({
        message:
          (err as Error).message || 'Error uninstalling marketplace entry',
        severity: 'error',
        display: 'transient',
      });
    }
  };
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="space-between"
        alignItems="center"
      >
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
              <div>
                <Grid container spacing={0} alignItems="center">
                  <img src={SuccessIcon} height={20} width={20} alt="logo" />
                  <div className={styles.installedText}>Installed</div>
                </Grid>
              </div>
              {props.template.entityRef && (
                <button
                  onClick={() => setOpen(true)}
                  data-testid="marketplace-uninstall-button"
                  type="button"
                  className={`pl-button pl-button--secondary ${styles.uninstallButton}`}
                >
                  <Grid container spacing={0} alignItems="center">
                    <div className="pl-button__icon">
                      <TibcoIcon
                        height={20}
                        width={20}
                        iconName="pl-icon-delete"
                      />
                    </div>
                    <span className="pl-button__label">Uninstall</span>
                  </Grid>
                </button>
              )}
            </Grid>
          </div>
        )}
      </Grid>
      <HeaderImage template={props.template} />
      <UninstallMarketplaceDialog
        open={open}
        onConfirm={uninstall}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
