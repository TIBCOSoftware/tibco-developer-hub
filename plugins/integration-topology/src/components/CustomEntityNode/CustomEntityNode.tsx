/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { DependencyGraphTypes } from '@backstage/core-components';
import { EntityNodeData } from '@backstage/plugin-catalog-graph';
import {
  useLayoutEffect,
  useRef,
  useState,
  useContext,
  MouseEvent,
} from 'react';
import {
  EntityRefPresentationSnapshot,
  useEntityPresentation,
} from '@backstage/plugin-catalog-react';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import classNames from 'classnames';
import { IconComponent } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import { CustomIcon } from '../common/CustomIcon';
import { EntityIcon } from '../common/EntityIcon';
import { EntityDeploymentCard } from './EntityDeploymentCard';
import { Link } from 'react-router-dom';
import { CustomTooltip } from '../common/CustomTooltip';
import { useFetchAllLinks } from '../../hooks/useFetchAllLinks';
import { TopologyContext } from '../../context/TopologyContext';
import { CustomThemeProps, getCustomThemeProps } from '../../utils/theme-utils';
import {
  getCustomEntityIcon,
  getEntityStatusIcons,
} from '../../utils/icon-utils';
import EntityStatusIconsCard from './EntityStatusIconsCard';

export interface CustomIconProps {
  icon?: string;
  iconColor?: string;
  iconTooltip?: string;
}

export interface CustomEntityNodeProps {
  theme?: {
    name?: string;
    colors?: CustomThemeProps;
  };
  entityIcon?: CustomIconProps;
  statusIcons?: CustomIconProps[];
}

const useCustomNodeStyles = makeStyles(
  theme => ({
    node: {
      fill: theme.palette.grey[300],
      stroke: theme.palette.grey[300],

      '&.primary': {
        fill: theme.palette.primary.light,
        stroke: theme.palette.primary.light,
      },
      '&.secondary': {
        fill: theme.palette.secondary.light,
        stroke: theme.palette.secondary.light,
      },
    },
    text: {
      fill: theme.palette.getContrastText(theme.palette.grey[300]),
      '&.primary': {
        fill: 'hsla(0, 0%, 0%, 1.00)', // theme.palette.primary.contrastText,
      },
      '&.secondary': {
        fill: 'hsla(213, 84%, 34%, 1.00)', // theme.palette.secondary.contrastText,
      },
      '&.focused': {
        fontWeight: 'bold',
        lineHeight: '20px',
      },
    },
    clickable: {
      cursor: 'pointer',
    },

    tMainCard: {
      fill: 'hsla(0, 0%, 88%, 1.00)',

      '& $tCardContainer:has(~ $g:hover)': {
        strokeWidth: '2px',
      },

      '& $tCardContainer:has(~ $rect:hover)': {
        strokeWidth: '2px',
      },

      '& $tCardContainer:has(~ text:hover)': {
        strokeWidth: '2px',
      },
    },

    tCardContainer: (props: CustomThemeProps) => ({
      fill: 'none',
      stroke: props?.iconColor || 'hsla(0,0%,45%,1.00)',
      strokeWidth: '1px',

      '&:hover': {
        stroke: props?.iconColor || 'none',
        strokeWidth: '1px',
      },
    }),

    tCardContainerOutlined: (props: CustomThemeProps) => ({
      stroke: props?.iconColor || 'hsla(213, 82%, 49%, 1.00)',
      strokeWidth: '1px',
    }),

    tIconCard: (props: CustomThemeProps) => ({
      fill: props?.background || 'hsla(0, 0%, 88%, 1.00)',
    }),

    tCardRight: (props: CustomThemeProps) => ({
      fill: props.background
        ? 'hsla(0, 0%, 98%, 1.00)'
        : 'hsla(260, 10%, 94%, 1.00)',
    }),
    tPrimary: (props: CustomThemeProps) => ({
      fill: props?.iconColor || 'hsla(213, 80%, 59%, 1)',

      '& ~ $tSpacer': {
        fill: props?.iconColor || 'hsla(213, 80%, 59%, 1)',
      },
    }),
    tSpacer: (props: CustomThemeProps) => ({
      fill: props?.background || 'hsla(0, 0%, 88%, 1.00)',
    }),
    tIcon: (props: CustomThemeProps) => ({
      fill: props?.iconColor || 'hsla(0, 0%, 45%, 1)',
    }),
    tIconFocus: {
      fill: 'hsla(0, 0%, 100%, 1.00)',
    },
    tMainText: {
      fill: 'hsla(0, 0%, 0%, 1.00)',
      fontFamily: 'Source Sans Pro',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '18px',
      letterSpacing: '0px',
      marginBottom: '2px',
    },
    tSubText: {
      fill: 'hsla(0, 0%, 45%, 1.00)',
      textAlign: 'left',
      fontFamily: 'Source Sans Pro',
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '10px',
      letterSpacing: '0px',

      '& p': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    tDividerWrapper: {
      margin: '0 5px',
    },
    tDivider: {
      fill: 'hsla(0, 0%, 71%, 1.00)',
    },
    tLinkText: {
      color: 'hsla(0, 0%, 45%, 1.00)',
      fill: 'hsla(0, 0%, 45%, 1.00)',
      fontWeight: 600,
      fontSize: '8px',
    },
    linkGroup: {
      padding: '10px',
    },
    tTooltipShow: {
      '& g': {
        display: 'none',
      },
      '&:hover g': {
        display: 'block',
      },
    },
  }),
  { name: 'PluginCatalogGraphCustomNode' },
);

export const CustomEntityNode = ({
  node: { id, entity, color = 'default', focused, onClick },
}: DependencyGraphTypes.RenderNodeProps<EntityNodeData>) => {
  const {
    detailsLocked,
    display,
    setDisplay,
    setDetailsEntity,
    setDetailsLocked,
  } = useContext(TopologyContext);

  const styleProps: CustomThemeProps = getCustomThemeProps(entity);

  // user defined icon color overrides theme colors
  const customIcon = getCustomEntityIcon(entity);
  if (customIcon && customIcon.color) {
    styleProps.iconColor = customIcon.color;
  }

  const statusIcons = getEntityStatusIcons(entity);

  const classes = useCustomNodeStyles(styleProps);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const idRef = useRef<SVGTextElement | null>(null);
  const entityRefPresentationSnapshot = useEntityPresentation(entity, {
    defaultNamespace: DEFAULT_NAMESPACE,
  });

  const { infoLinks, externalLinks, platformLinks } = useFetchAllLinks(entity);

  useLayoutEffect(() => {
    // set the width to the length of the ID
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        idRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);

      if (renderedHeight !== height || renderedWidth !== width) {
        setWidth(renderedWidth);
        setHeight(renderedHeight);
      }
    }
  }, [width, height]);

  const hasKindIcon = !!entityRefPresentationSnapshot.Icon;
  const padding = 8;
  const iconSize = 16;
  const paddedHeight = height + padding * 2;
  const cardHeight = 92;
  const cardIconSectionWidth = 70;
  const cardTextSectionWidth = 286;
  const linksYOffset = cardHeight - padding - iconSize;
  const entityCardWidth = 350;

  const displayTitle = entityRefPresentationSnapshot.primaryTitle ?? id;
  const subTitle = entity?.metadata?.description || '';

  const onEntityNodeClicked = (
    mEvent: MouseEvent<SVGElement>,
    _entity: EntityRefPresentationSnapshot,
  ) => {
    if (onClick) {
      onClick(mEvent);
    }
  };

  const mouseEnter = (_event: MouseEvent<Element>) => {
    if (!detailsLocked && display !== 'none') {
      setDisplay('block');
      setDetailsEntity(entity);
    }
  };

  return (
    <g
      data-testid="custom-node-group"
      className={classNames(classes.tMainCard, onClick && classes.clickable)}
      onClick={e => {
        onEntityNodeClicked(e, entityRefPresentationSnapshot);
      }}
      onMouseEnter={event => {
        mouseEnter(event);
      }}
    >
      <rect
        id={`${id}-cardContainer`}
        className={classNames(
          classes.tCardContainer,
          color === 'secondary' && classes.tCardContainerOutlined,
        )}
        width={entityCardWidth}
        height={cardHeight}
        rx={4}
        ry={4}
      />
      <rect
        className={classNames(
          classes.tIconCard,
          color === 'primary' && 'primary',
          color === 'secondary' && 'secondary',
          color === 'secondary' && classes.tPrimary,
        )}
        width={cardIconSectionWidth}
        height={cardHeight}
        rx={4}
        ry={4}
      />
      <rect
        className={classNames(
          classes.tCardRight,
          color === 'primary' && 'secondary',
          color === 'secondary' && 'primary',
        )}
        x={cardIconSectionWidth - 6} // Adjusted to fit the icon section rounded borders
        width={cardTextSectionWidth}
        height={cardHeight}
        rx={4}
        ry={4}
      />
      {/* spacer rectangle to hide rounded borders */}
      <rect
        x={cardIconSectionWidth - 7} // Adjusted to fit the info section rounded borders
        width={5}
        height={cardHeight}
        className={classes.tSpacer}
      />
      {statusIcons && statusIcons.length > 0 && (
        <EntityStatusIconsCard
          statusIcons={statusIcons.slice(0, 3)}
          iconSize={12}
          iconPadding={4}
          x={padding}
          y={cardHeight - padding - 12}
        />
      )}
      <text
        ref={idRef}
        className={classNames(
          classes.tMainText,
          classes.text,
          focused && 'focused',
          color === 'primary' && 'primary',
        )}
        x={cardIconSectionWidth + 8}
        y={2 * padding}
        alignmentBaseline="middle"
      >
        {displayTitle.length > 30
          ? `${displayTitle.slice(0, 30)}...`
          : displayTitle}
      </text>
      <text
        className={classNames(
          classes.tSubText,
          focused && 'focused',
          color === 'primary' && 'primary',
          color === 'secondary' && 'secondary',
        )}
        x={cardIconSectionWidth + 8}
        y={paddedHeight / 2 + 2 * padding}
      >
        {/* Break subtitle over 60chars into two lines 
        and if length is over 100 chars trunkate text*/}
        {subTitle.length > 90 || subTitle.length > 55 ? (
          <tspan>
            <tspan x={cardIconSectionWidth + 8}>{subTitle.slice(0, 45)}</tspan>
            <tspan x={cardIconSectionWidth + 8} dy={12}>
              {subTitle.slice(45, 90) + (subTitle.length > 90 ? '...' : '')}
            </tspan>
          </tspan>
        ) : (
          subTitle
        )}
      </text>
      {display === 'none' && (
        <g
          className={classes.tTooltipShow}
          width={iconSize + 20}
          height={iconSize + 20}
          onClick={event => {
            event.stopPropagation();
            setDisplay('block');
          }}
        >
          <CustomIcon
            id="pl-icon-details"
            iconName="details"
            iconStyle="linkBarIcon"
            x={entityCardWidth - padding - iconSize}
            y={padding}
          />
          <CustomTooltip
            title="Open Details"
            xPos={entityCardWidth - padding - iconSize}
            yPos={3 * padding}
          />
        </g>
      )}
      {display === 'block' && (
        <g
          className={classes.tTooltipShow}
          width={iconSize + 20}
          height={iconSize + 20}
          onClick={event => {
            event.stopPropagation();
            setDetailsLocked(!detailsLocked);
          }}
        >
          {detailsLocked ? (
            <CustomIcon
              id="details-view-icon-collapse"
              iconName="lock"
              iconStyle="linkBarIcon"
              width={iconSize}
              height={iconSize}
              x={entityCardWidth - padding - iconSize}
              y={padding}
            />
          ) : (
            <CustomIcon
              id="details-view-icon-expand"
              iconName="unlock"
              iconStyle="linkBarIcon"
              width={iconSize}
              height={iconSize}
              x={entityCardWidth - padding - iconSize}
              y={padding}
            />
          )}
          <CustomTooltip
            title={detailsLocked ? 'Unlock Details' : 'Lock Details'}
            xPos={entityCardWidth - padding - iconSize}
            yPos={3 * padding}
          />
        </g>
      )}

      {/* Show link to deployments envs for component entities */}
      {entity && entity?.kind === 'Component' && platformLinks && (
        <EntityDeploymentCard
          platformLinks={platformLinks}
          iconSize={iconSize}
          iconOffsetX={cardIconSectionWidth + 8}
          iconOffsetY={linksYOffset}
        />
      )}
      {/* EntityIcon moved lower in sequence to make sure tooltip render is above status icons and deployment card icons  */}
      {hasKindIcon && (
        <g
          className={classes.tTooltipShow}
          width={iconSize + 16}
          height={iconSize + 16}
        >
          <EntityIcon
            data-testid="entity-icon"
            icon={customIcon && customIcon.icon ? customIcon.icon : undefined}
            fallbackIcon={entityRefPresentationSnapshot.Icon as IconComponent}
            x={2 * padding}
            y={
              statusIcons && statusIcons.length > 0
                ? padding
                : cardHeight / 2 - (iconSize + 16) / 2
            }
            width={iconSize + 16}
            height={iconSize + 16}
            className={classNames(
              focused && 'focused',
              color === 'secondary' && classes.tIconFocus,
              color === 'primary' && classes.tIcon,
            )}
          />
          {hasKindIcon && customIcon && customIcon?.tooltip && (
            <CustomTooltip
              title={customIcon.tooltip}
              xPos={0}
              yPos={2 * iconSize + padding}
            />
          )}
        </g>
      )}
      {/* Show links to entity overview details  */}
      <g className={classes.linkGroup}>
        {infoLinks &&
          Object.keys(infoLinks).map((key, index) => {
            const iconPadding = 3;
            const iconSpacing = 20;
            const isFirstItem = index === 0;
            const isLastItem = index === Object.keys(infoLinks).length - 1;

            // Calculate base position from right edge
            const baseXPosition =
              entityCardWidth - padding - (index + 1) * iconSpacing;

            // Apply padding adjustments based on position
            let iconXPosition = baseXPosition;
            if (isFirstItem) {
              iconXPosition = baseXPosition + iconPadding;
            } else if (isLastItem) {
              iconXPosition = baseXPosition - iconPadding;
            }

            const dividerXPosition = iconXPosition - iconPadding;

            return (
              <g
                key={`info-link-${index}-${id}`}
                id={`info-link-${index}-${id}`}
                // prevent event bubbling (custom node selection)
                // so on click can go directly to info link url
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                {Object.keys(infoLinks).length > 1 &&
                  index < Object.keys(infoLinks).length - 1 && (
                    <g>
                      <rect
                        className={classes.tDivider}
                        width={1}
                        height={iconSize}
                        x={dividerXPosition}
                        y={linksYOffset}
                      />
                    </g>
                  )}
                <Link
                  to={infoLinks[key as keyof typeof infoLinks] || ''}
                  target={key === 'source' ? '_blank' : '_self'}
                >
                  <g
                    className={classes.tTooltipShow}
                    width={iconSize}
                    height={iconSize}
                  >
                    <CustomIcon
                      id={`pl-icon-${key}`}
                      iconName={key}
                      iconStyle="linkBarIcon"
                      y={linksYOffset}
                      x={iconXPosition}
                    />
                    <CustomTooltip
                      title={`Open ${key}`}
                      yPos={cardHeight}
                      xPos={iconXPosition - 4 * padding}
                    />
                  </g>
                </Link>
              </g>
            );
          })}
        {externalLinks && externalLinks.length > 0 && (
          <text
            className={classes.tLinkText}
            x={
              entityCardWidth -
              padding -
              (Object.keys(infoLinks).length || 1) * (2 * iconSize) -
              externalLinks.length * (2 * padding) -
              6 // 2 * iconPadding
            }
            y={linksYOffset - 4}
          >
            External Links
          </text>
        )}
        {externalLinks &&
          externalLinks.map((l, index) => {
            const iconPadding = 3;
            const iconSpacing = 2 * padding;
            const infoLinksCount = Object.keys(infoLinks).length || 1;
            const infoLinksOffset = infoLinksCount * (2 * iconSize);

            // Calculate position from right edge, accounting for info links
            const linkXPosition =
              entityCardWidth -
              padding -
              infoLinksOffset -
              (index + 1) * iconSpacing -
              index * iconPadding;

            // Divider position is calculated once for all external links
            const dividerXPosition =
              entityCardWidth -
              padding -
              infoLinksOffset -
              externalLinks.length * iconSpacing -
              3 * iconPadding;
            return (
              <g
                key={`external-link-${index}-${id}`}
                id={`external-link-${index}-${id}`}
                // prevent event bubbling (custom node selection)
                // so on click can go directly to info link url
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <g
                  className={classes.tTooltipShow}
                  width={iconSize}
                  height={iconSize}
                  onClick={() => {
                    window.open(l.url, '_blank');
                  }}
                >
                  <CustomIcon
                    id="pl-icon-externalLink"
                    iconName="externalLink"
                    iconStyle="linkBarIcon"
                    width={iconSize}
                    height={iconSize}
                    y={linksYOffset}
                    x={linkXPosition}
                  />
                  <CustomTooltip
                    title={l.title ? l.title : 'Open Link'}
                    yPos={cardHeight}
                    xPos={linkXPosition - 4 * padding}
                  />
                </g>
                {index === 0 && (
                  <g className={classes.tDividerWrapper}>
                    <rect
                      className={classes.tDivider}
                      width={1}
                      height={iconSize}
                      y={linksYOffset}
                      x={dividerXPosition}
                    />
                  </g>
                )}
              </g>
            );
          })}
      </g>
    </g>
  );
};
