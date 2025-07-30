/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { TibcoIcon } from '../../Icons/TibcoIcon.tsx';
import {
  AdditionalLinks,
  MarketplaceEntity,
} from '../MarketplaceListPage/MarketplaceListPage.tsx';
import { CardHeaderDetail } from './CardHeaderDetail.tsx';
import DocumentDetailIcon from '../../images/document-detail-image.svg';
import SampleDetailIcon from '../../images/sample-detail-image.svg';
import TemplateDetailIcon from '../../images/template-detail-image.svg';
import ImportFlowDetailIcon from '../../images/import-flow-detail-image.svg';
import BlankDetailIcon from '../../images/blank-detail-image.svg';
import { MarkdownContent } from '@backstage/core-components';
import { filterTags } from '../MarketplaceCard/MarketplaceCard.tsx';
import {
  IconComponent,
  useAnalytics,
  useApp,
} from '@backstage/core-plugin-api';
import LanguageIcon from '@material-ui/icons/Language';
import Grid from '@material-ui/core/Grid';
import { CardLink } from '../MarketplaceCard/CardLink.tsx';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { usePermission } from '@backstage/plugin-permission-react';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  detailContainer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '544px',
    borderRadius: '8px',
    border: '2px solid #B6B6B6',
    background: '#FFF',
    boxShadow: '-6px 4px 7px 0px rgba(0, 0, 0, 0.20)',
    zIndex: 1000,
  },
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0px 24px',
  },
  contentDetail: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 24px 0px 24px',
  },
  footer: {
    padding: '0px 24px 24px 24px',
  },
  closeIcon: {
    cursor: 'pointer',
    marginLeft: 'auto',
    color: '#727272',
    marginBottom: '18px',
    border: 'none',
    background: 'none',
    padding: 0,
  },
  defaultImage: {
    width: '100%',
    height: '112px',
  },
  userImage: {
    //  width: '496px',
    // height: '248px',
    borderRadius: '6px',
    maxWidth: '100%',
    maxHeight: '248px',
    // maxHeight: '100%',
    // maxHeight:'95px',
    width: 'auto',
    margin: 'auto',
    height: 'auto',
  },
  markdown: {
    '& p': {
      wordBreak: 'break-word',
      marginTop: '12px',
      marginBottom: '12px',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 'normal',
    },
  },
  externalLink: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 'normal',
  },
  linkTextShort: {
    marginTop: '12px',
    marginBottom: '12px',
    marginRight: '56px',
    '& svg': {
      color: '#1774E5',
      height: '24px',
      width: '24px',
    },
    '& a': {
      color: '#1774E5',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '16px',
    },
  },
  tag: {
    paddingLeft: '5px',
    marginTop: '12px',
    marginBottom: '12px',
    marginRight: '24px',
    paddingRight: '5px',
    borderRadius: '3px',
    border: '1px solid #dedede',
    color: '#000',
    fontSize: '10px',
    fontWeight: 400,
    backgroundColor: '#FFF',
  },
  actionButton: {
    width: '100%',
  },
});

/**
 * @alpha
 */
export interface MarketplaceDetailPageProps {
  template: MarketplaceEntity;
  additionalLinks?: AdditionalLinks[];
  onCloseDetailPage: () => void;
  onTemplateSelected?: (
    template: TemplateEntityV1beta3,
    additionalLinks?: AdditionalLinks[],
    openDetail?: boolean,
  ) => void;
}

/**
 * @alpha
 */
export const MarketplaceDetailPage = (props: MarketplaceDetailPageProps) => {
  const styles = useStyles();
  const { onCloseDetailPage, template, additionalLinks, onTemplateSelected } =
    props;
  let defaultIcon: string = '';
  const imageUrl =
    template.metadata['tibco.developer.hub/marketplace']?.imageURL;
  if (!imageUrl) {
    const entityType = template.spec?.type?.toLowerCase();
    switch (entityType) {
      case 'document':
        defaultIcon = DocumentDetailIcon;
        break;
      case 'sample':
        defaultIcon = SampleDetailIcon;
        break;
      case 'template':
        defaultIcon = TemplateDetailIcon;
        break;
      case 'import-flow':
        defaultIcon = ImportFlowDetailIcon;
        break;
      default:
        defaultIcon = BlankDetailIcon;
    }
  }
  const marketPlaceData: any =
    template.metadata['tibco.developer.hub/marketplace'];
  const fullAdditionalLinks = [
    ...(additionalLinks || []),
    ...(marketPlaceData?.moreInfo || []),
  ];
  const hasLinks =
    !!fullAdditionalLinks?.length || !!template.metadata.links?.length;
  const finalTags =
    template.metadata.tags && filterTags(template.metadata.tags);
  const hasTags = !!finalTags?.length;
  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;
  const analytics = useAnalytics();
  const handleChoose = useCallback(
    (openDetail?: boolean) => {
      analytics.captureEvent('click', `Template has been opened`);
      onTemplateSelected?.(template, additionalLinks, openDetail);
    },
    [analytics, onTemplateSelected, template, additionalLinks],
  );
  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });
  const isMultiInstall =
    template.metadata['tibco.developer.hub/marketplace']?.isMultiInstall;
  return (
    <div className={styles.detailContainer} data-testid="detail-container">
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <button
            className={styles.closeIcon}
            data-testid="close-detail-icon"
            onClick={onCloseDetailPage}
          >
            <TibcoIcon height={24} width={24} iconName="pl-icon-close" />
          </button>
          <CardHeaderDetail
            template={template}
            data-testid="marketplace-card-header"
          />
        </div>
        <div className={styles.content}>
          {imageUrl ? (
            <img
              data-testid="detail-custom-image"
              src={imageUrl}
              className={styles.userImage}
              alt="logo"
            />
          ) : (
            <img
              data-testid="detail-default-image"
              src={defaultIcon}
              className={styles.defaultImage}
              alt="logo"
            />
          )}
          <div className={styles.contentDetail}>
            <MarkdownContent
              className={styles.markdown}
              content={template.metadata.description ?? 'No description'}
            />
            <div className={styles.externalLink}>External Links</div>
            {hasLinks && (
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                data-testid="marketplace-detail-links"
              >
                {fullAdditionalLinks?.map(({ icon, text, url }, index) => (
                  <Grid
                    className={styles.linkTextShort}
                    item
                    key={index}
                    data-testid="marketplace-detail-links--item"
                  >
                    <CardLink icon={iconResolver(icon)} text={text} url={url} />
                  </Grid>
                ))}
                {template.metadata.links?.map(({ url, icon, title }, index) => (
                  <Grid
                    className={styles.linkTextShort}
                    item
                    key={index + fullAdditionalLinks.length}
                    data-testid="marketplace-detail-links--metalink"
                  >
                    <CardLink
                      icon={iconResolver(icon)}
                      text={title || url}
                      url={url}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            {hasTags && (
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                data-testid="marketplace-detail-tags"
              >
                {finalTags?.map((tag, index) => (
                  <Grid
                    key={index}
                    item
                    data-testid={`marketplace-detail-tag-item-${tag}`}
                  >
                    <div className={styles.tag}>{tag}</div>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        </div>

        <div
          data-testid="marketplace-detail-actions--footer"
          className={styles.footer}
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
                    className={`pl-button pl-button--primary ${styles.actionButton}`}
                    data-testid="marketplace-detail-actions--view"
                  >
                    Open
                  </button>
                </Link>
              ) : canCreateTask && (!template.installed || isMultiInstall) ? (
                <button
                  type="button"
                  className={`pl-button pl-button--primary ${styles.actionButton}`}
                  data-testid="marketplace-detail-actions--install"
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
      </div>
    </div>
  );
};
