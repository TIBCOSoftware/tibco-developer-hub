/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage.tsx';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  footer: {
    marginTop: '8px',
  },
  actionButton: {
    '&:hover': {
      backgroundColor: '#1774E5',
      borderColor: '#1774E5',
      color: '#ffffff',
    },
  },
  actionContainer: { padding: '16px', flex: 1, alignItems: 'flex-end' },
});

/**
 * The Props for the {@link MarketplaceCardActions} component
 * @alpha
 */
export interface TemplateCardActionsProps {
  canCreateTask: boolean;
  handleChoose: () => void;
  template: MarketplaceEntity;
}

export const MarketplaceCardActions = ({
  canCreateTask,
  handleChoose,
  template,
}: TemplateCardActionsProps) => {
  const styles = useStyles();
  const isMultiInstall =
    template.metadata['tibco.developer.hub/marketplace']?.isMultiInstall;
  return (
    <div
      className={styles.footer}
      data-testid="marketplace-card-actions--footer"
    >
      <div>
        {
          /* eslint-disable */ template.installedEntityRef &&
          !isMultiInstall ? (
            <Link
              to={template.installedEntityRef}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className={`pl-button pl-button--secondary ${styles.actionButton}`}
                data-testid="marketplace-card-actions--view"
              >
                Open
              </button>
            </Link>
          ) : canCreateTask && (!template.installed || isMultiInstall) ? (
            <button
              type="button"
              className={`pl-button pl-button--secondary ${styles.actionButton}`}
              data-testid="marketplace-card-actions--install"
              onClick={e => {
                e.stopPropagation();
                handleChoose();
              }}
            >
              Install
            </button>
          ) : null
        }
      </div>
    </div>
  );
};
