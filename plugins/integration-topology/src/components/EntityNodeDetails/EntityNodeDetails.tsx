/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as BackstageLink } from '@backstage/core-components';
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { useApi, IconComponent } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  useEntityPresentation,
} from '@backstage/plugin-catalog-react';
import { JsonObject } from '@backstage/types';

import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';

import { CustomIcon } from '../common/CustomIcon';
import { EntityIcon } from '../common/EntityIcon';
import { useFetchAllLinks } from '../../hooks/useFetchAllLinks';
import { PlatformLink } from '../../hooks/useFetchAllLinks';
import { CustomPopOver } from '../common/CustomPopOver';
import { TopologyContext } from '../../context/TopologyContext';
import { CustomThemeProps, getCustomThemeProps } from '../../utils/theme-utils';
import {
  getCustomEntityIcon,
  getEntityStatusIcons,
} from '../../utils/icon-utils';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import { CustomDeploymentIcon } from '../common/CustomDeploymentIcon';

const useNodeDetailsStyles = makeStyles({
  tFloatContainer: {
    borderRadius: '8px',
    width: '425px',
    backgroundColor: '#FFFFFF',
    opacity: '0.9',
    boxShadow: '4px 4px 4px 0px #00000040',
    color: '#212121',
    fontSize: '14px',
    cursor: 'grab',
  },
  tCardBody: {
    padding: '8px 0 0 16px',
  },
  tTitle: (props: CustomThemeProps) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#FFF',
    backgroundColor: props?.iconColor || 'rgba(14, 79, 158, 1)',
    borderRadius: '7px 7px 0px 0px',
  }),
  tTitleIconTextContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '75%',
  },
  tIcon: {
    margin: '8px 14px',
    width: '32px',
    height: '32px',
  },
  tTitleTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tTitleText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: '8px',
    fontSize: '16px',
    fontWeight: 600,
  },
  tSubTitle: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '12px',
  },
  tMenu: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    margin: '8px 14px',
  },
  tMenuIcon: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '5px',
    borderRadius: '20px',
    color: '#FFFFFF',

    '&:hover': {
      backgroundColor: 'hsla(0, 0%, 0%, 0.2)',
    },
  },
  tOwnerLink: {
    color: '#FFFFFF',
    textDecoration: 'none',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  tSectionContainer: {
    margin: '0 0 16px 0',
    overflow: 'hidden',
  },
  tSectionLabel: {
    margin: '0',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0px',
    textTransform: 'capitalize',
  },
  tDescription: {
    margin: '4px 0',
    paddingRight: '48px',
    fontWeight: 400,
    fontSize: '16px',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tSectionContent: {
    margin: '4px 0',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 24px',
    alignItems: 'center',
    paddingRight: '16px',
  },
  tSectionContentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#1774e5',
    fontSize: '14px',
    textDecoration: 'none',

    '&:hover': {
      color: 'blue',
      textDecoration: 'underline',
    },
    '&:hover svg': {
      color: 'blue',
      textDecoration: 'underline',
    },
  },
  tInfoLinkSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: '8px 0px',
  },
  tSectionButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 400,
    border: '1px solid #1774E5',
    borderRadius: '3px',
    padding: '0px 8px',
    color: '#1774e5',
    textDecoration: 'none',
    height: '24px',

    '&:hover': {
      color: 'blue',
      textDecoration: 'underline',
    },

    '&:hover svg': {
      color: 'blue',
      textDecoration: 'underline',
    },
  },
  tStatusIcon: {
    width: '24px',
    height: '24px',
  },
  tTooltip: {
    cursor: 'pointer',
  },
  tCustomTooltip: {
    backgroundColor: '#0E2D65',
    color: '#FFFFFF',
    fontSize: '12px',
  },
  TCustomArrow: {
    color: '#0E2D65',
  },
});

export const EntityNodeDetails = () => {
  const {
    detailsLocked,
    detailsEntity,
    display,
    toggleDisplay,
    setDetailsLocked,
  } = useContext(TopologyContext);

  const [expanded, setExpanded] = useState(true);
  const [ownerLink, setOwnerLink] = useState<string | null>(null);

  const catalogApi = useApi(catalogApiRef);

  const entity = detailsEntity as Entity;
  const { infoLinks, externalLinks, platformLinks } = useFetchAllLinks(entity);

  const ownerName = `${entity?.spec?.owner}`;

  if (!ownerName) {
    setOwnerLink(null);
  }

  const parseOwnerName = (owner: string) => {
    if (owner.includes('default') && owner.includes('/')) {
      const parts = owner.split('/');
      const name = parts[parts.length - 1];
      if (name && name.length > 25) {
        return `${name.slice(0, 25)}...`;
      }
      return name;
    }
    return owner.length > 25 ? `${owner.slice(0, 25)}...` : owner;
  };

  const styleProps: CustomThemeProps = getCustomThemeProps(entity);
  const classes = useNodeDetailsStyles(styleProps);

  useEffect(() => {
    // Get the owner details
    if (entity?.spec?.owner) {
      catalogApi
        .getEntityByRef(entity.spec.owner as string)
        .then(owner => {
          if (owner) {
            setOwnerLink(
              `/catalog/${
                owner?.metadata?.namespace
              }/${owner?.kind?.toLowerCase()}/${owner?.metadata?.name}`,
            );
          } else {
            setOwnerLink(null);
          }
        })
        .catch(() => {
          setOwnerLink(null);
        });
    }
  }, [entity, catalogApi]);

  let displayName = (entity?.spec?.profile as JsonObject)
    ?.displayName as string;
  if (!displayName) {
    displayName = `${entity?.metadata?.name}`;
  }

  const entityRefPresentationSnapshot = useEntityPresentation(entity, {
    defaultNamespace: DEFAULT_NAMESPACE,
  });

  const customIcon = getCustomEntityIcon(entity);

  const hasKindIcon = !!entityRefPresentationSnapshot.Icon;

  const statusIcons = getEntityStatusIcons(entity);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  const toggleLock = () => {
    setDetailsLocked(!detailsLocked);
  };
  const exitClicked = () => {
    if (detailsLocked) {
      setDetailsLocked(false);
    }
    toggleDisplay();
  };

  let expandedDisplay = '';
  if (!expanded) {
    expandedDisplay = 'none';
  }

  return (
    <div style={{ display: display }}>
      <div className={classes.tFloatContainer}>
        <div className={classes.tTitle}>
          <div className={classes.tTitleIconTextContainer}>
            {hasKindIcon && (
              <EntityIcon
                icon={
                  customIcon && customIcon.icon ? customIcon.icon : undefined
                }
                fallbackIcon={
                  entityRefPresentationSnapshot.Icon as IconComponent
                }
                y={0}
                x={0}
                width={32}
                height={32}
                className={classes.tIcon}
              />
            )}
            <div className={classes.tTitleTextContainer}>
              <Tooltip
                title={
                  displayName && displayName.length > 25 ? displayName : ''
                }
                placement="top"
                arrow
                classes={{
                  tooltip: classes.tCustomTooltip,
                  arrow: classes.TCustomArrow,
                }}
              >
                <div className={classes.tTitleText}>
                  {displayName.length > 25
                    ? `${displayName.slice(0, 25)}...`
                    : displayName}
                </div>
              </Tooltip>
              {expanded && (
                <div className={classes.tSubTitle}>
                  {ownerName && (
                    <Tooltip
                      title={
                        parseOwnerName(ownerName)?.length > 25 ? ownerName : ''
                      }
                      placement="bottom"
                      arrow
                      classes={{
                        tooltip: classes.tCustomTooltip,
                        arrow: classes.TCustomArrow,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" />
                        {ownerLink ? (
                          <Link className={classes.tOwnerLink} to={ownerLink}>
                            {parseOwnerName(ownerName)}
                          </Link>
                        ) : (
                          parseOwnerName(ownerName)
                        )}
                        &nbsp;&nbsp;|&nbsp;
                      </span>
                    </Tooltip>
                  )}

                  {entity?.metadata?.uid && (
                    <CustomPopOver
                      label="UUID"
                      popOverContent={entity?.metadata?.uid}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={classes.tMenu}>
            <button className={classes.tMenuIcon} onClick={() => toggleLock()}>
              {detailsLocked ? <LockIcon /> : <LockOpenIcon />}
            </button>
            <button
              className={classes.tMenuIcon}
              onClick={() => toggleExpansion()}
            >
              {expanded ? (
                <UnfoldLess fontSize="medium" />
              ) : (
                <UnfoldMore fontSize="medium" />
              )}
            </button>
            <button className={classes.tMenuIcon} onClick={() => exitClicked()}>
              <CustomIcon
                id="details-view-icon-close"
                iconName="close"
                iconStyle="detailsTitleIcon"
              />
            </button>
          </div>
        </div>
        <div className={classes.tCardBody}>
          <div
            style={{ display: expandedDisplay }}
            className={classes.tSectionContainer}
          >
            <p className={classes.tSectionLabel}>Description</p>
            <p className={classes.tDescription}>
              {entity?.metadata?.description}
            </p>
          </div>
          {entity &&
            entity?.kind === 'Component' &&
            platformLinks &&
            platformLinks.length > 0 && (
              <div className={classes.tSectionContainer}>
                <p className={classes.tSectionLabel}>App Deployments</p>
                <div className={classes.tSectionContent}>
                  {platformLinks &&
                    platformLinks.length > 0 &&
                    platformLinks.map((cpApp: PlatformLink, index: number) => (
                      <BackstageLink
                        key={index}
                        className={classes.tSectionContentItem}
                        to={cpApp.pLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        <CustomDeploymentIcon
                          id={`details-deployment-icon-${cpApp?.pAppType?.toLowerCase()}-${
                            cpApp?.pLabel
                          }`}
                          iconName={`${cpApp?.pAppType?.toLowerCase()}-${
                            cpApp?.pLabel && cpApp.pLabel.length > 3
                              ? cpApp.pLabel.slice(3)
                              : cpApp?.pLabel || 'default'
                          }`}
                          width={24}
                          height={24}
                          x={12}
                          y={12}
                        />
                        {cpApp.pLabel}
                      </BackstageLink>
                    ))}
                </div>
              </div>
            )}
          {entity && externalLinks && externalLinks.length > 0 && (
            <div
              style={{ display: expandedDisplay }}
              className={classes.tSectionContainer}
            >
              <p className={classes.tSectionLabel}>External Links</p>
              <div className={classes.tSectionContent} style={{ margin: '0' }}>
                {externalLinks.length > 0 &&
                  externalLinks.map((link, index) => (
                    <Link
                      key={index}
                      className={classes.tSectionContentItem}
                      to={link.url}
                      target="_blank"
                    >
                      {' '}
                      <div style={{ marginTop: '8px' }}>
                        <CustomIcon
                          id={`details-view-icon-${link.title}`}
                          iconStyle="detailsLinkIcon"
                          iconName="externalLink"
                          y={12}
                          x={12}
                        />
                      </div>
                      {link.title}
                    </Link>
                  ))}
              </div>
            </div>
          )}
          {entity?.metadata?.tags && entity?.metadata?.tags?.length > 0 && (
            <div
              style={{ display: expandedDisplay }}
              className={classes.tSectionContainer}
            >
              <div className={classes.tSectionContent}>
                {entity?.metadata?.tags?.map(tag => (
                  <span key={tag} className="tpdh-card-item-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {statusIcons && statusIcons.length > 0 && (
            <div style={{ display: expandedDisplay }}>
              <div className={classes.tSectionContent} style={{ margin: '0' }}>
                {statusIcons &&
                  statusIcons.length > 0 &&
                  statusIcons.map(({ icon, iconColor, iconTooltip }, index) => {
                    return (
                      <Tooltip
                        key={index}
                        title={iconTooltip || ''}
                        arrow
                        classes={{
                          tooltip: classes.tCustomTooltip,
                          arrow: classes.TCustomArrow,
                        }}
                      >
                        <span className={classes.tTooltip}>
                          <EntityIcon
                            className={classes.tStatusIcon}
                            fill={iconColor}
                            icon={icon}
                            fallbackIcon={InfoIcon}
                            width={24}
                            height={24}
                            x={0}
                            y={0}
                          />
                        </span>
                      </Tooltip>
                    );
                  })}
              </div>
            </div>
          )}
          {entity && infoLinks && Object.keys(infoLinks).length > 0 && (
            <div className={classes.tInfoLinkSection}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {infoLinks?.apis && (
                  <Link
                    style={{ display: `${infoLinks.apis ? 'flex' : 'none'}` }}
                    className={classes.tSectionButton}
                    to={infoLinks.apis || ''}
                  >
                    {' '}
                    <div style={{ marginTop: '12px' }}>
                      <CustomIcon
                        iconStyle="detailsLinkIcon"
                        id="pl-icon-apis"
                        iconName="apis"
                        x={0}
                        y={0}
                      />
                    </div>
                    View API Definition
                  </Link>
                )}
                {infoLinks?.docs && (
                  <Link
                    className={classes.tSectionButton}
                    to={infoLinks.docs || ''}
                  >
                    <div style={{ marginTop: '10px' }}>
                      <CustomIcon
                        iconStyle="detailsLinkIcon"
                        id="pl-icon-docs"
                        iconName="docs"
                        width={16}
                        height={16}
                        x={0}
                        y={0}
                      />
                    </div>
                    View Documentation
                  </Link>
                )}
              </div>
              <div style={{ display: 'flex' }}>
                {infoLinks?.cicd && (
                  <Link to={infoLinks.cicd || ''} target="_self">
                    <CustomIcon
                      iconStyle="detailsLinkIcon"
                      id="details-view-icon-cicd"
                      iconName="cicd"
                      width={36}
                      height={36}
                      x={12}
                      y={12}
                    />
                  </Link>
                )}
                {infoLinks?.source && (
                  <Link to={infoLinks.source || ''} target="_blank">
                    {' '}
                    <CustomIcon
                      iconStyle="detailsLinkIcon"
                      id="details-view-icon-source"
                      iconName="source"
                      width={36}
                      height={36}
                      x={12}
                      y={12}
                    />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
