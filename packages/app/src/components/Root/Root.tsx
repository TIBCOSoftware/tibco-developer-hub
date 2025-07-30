/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Popover, makeStyles } from '@material-ui/core';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  useSidebarOpenState,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import CategoryIcon from '@material-ui/icons/Category';
import { TibcoIcon } from '../../icons/TibcoIcon';
import CpIcon from '../../icons/cp.svg';
import MarketplaceIcon from '../../icons/marketplace.svg';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Link } from 'react-router-dom';
import DevHubLogo from './images/devhub-logo.svg';
import { Config } from '@backstage/config';
import Typography from '@material-ui/core/Typography';

const SIDE_NAV_WIDTH_OPEN = 264;
const SIDE_NAV_WIDTH_CLOSE = 72;

interface SecondaryControlPlanes {
  name: string;
  url: string;
  id?: string;
}

const useSidebarLogoStyles = makeStyles({
  logoContainer: {
    '& $menuIcon': {
      cursor: 'pointer',
    },
    '& $logo': {
      height: 'auto',
      // cursor: 'unset',
      marginBottom: '16px',
      paddingTop: '0px',
      paddingBottom: '0px',
      '&:hover': {
        background: 'none',
      },
    },
  },
  logoContainerClosed: {
    '& $logo': {
      paddingTop: '8px',
      paddingBottom: '8px',
    },
  },
  logo: {},
  menuIcon: {},
  img: {
    // width: '100%',
    height: '45px',
  },
});

const useSecondarySidebarStyles = makeStyles({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    minHeight: 'unset',
    minWidth: 'unset',
    maxHeight: 'unset',
    overflowX: 'unset',
    overflowY: 'unset',
    maxWidth: '180px',
    marginTop: '-14px',
    wordBreak: 'break-all',
    width: 'max-content',
    backgroundColor: '#0e2d65',
    boxShadow: 'unset',
    padding: '8px 24px',
    borderRadius: '4px',
    color: 'white',
    textAlign: 'center',
  },
  paperContent: {
    lineHeight: '1.5',
    fontSize: '14px',
  },
  NavBarExtendedMenu: {
    backgroundColor: '#ebf4ff',
    cursor: 'default',
    position: 'absolute',
    top: 0,
    color: '#000',
    height: '100%',
    overflowY: 'auto',
    zIndex: 1000,
    float: 'left',
    minWidth: '200px',
    textAlign: 'left',
    listStyle: 'none',
    WebkitBackgroundClip: 'padding-box',
    backgroundClip: 'padding-box',
    border: '1px solid #ccc',
    boxShadow: '0 6px 12px rgba(0,0,0,.175)',
  },
  NavBarExtendedMenuNavOpen: {
    left: `${SIDE_NAV_WIDTH_OPEN}px`,
    paddingInlineStart: 0,
    marginBlockEnd: 0,
    marginBlockStart: 0,
  },
  NavBarExtendedMenuNavClose: {
    left: `${SIDE_NAV_WIDTH_CLOSE}px`,
  },
  NavBarExtendedMenuOpen: {
    display: 'block',
  },
  NavBarExtendedMenuClose: {
    display: 'none',
  },
  NavBarExtendedMenuTitle: {
    margin: '10px',
    fontSize: '12px',
  },
  MenuSeparator: {
    borderTop: '1px solid #fff',
    margin: '16px',
  },
  NavBarExtendedMenuPointer: { cursor: 'pointer', padding: '10px' },
  NavBarExtendedMenuItemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  NavBarExtendedMenuItemContent: { marginRight: '8px' },
  NavBarExtendedMenuIcon: { color: '#0e4f9e' },
  NavBarExtendedMenuItem: {
    color: '#0e4f9e',
    fontWeight: 'bold',
    display: 'inline-block',
    width: '150px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  NavBarExtendedMenuSubText: { color: '#727272', fontSize: '14px' },
});

const useSidebarStyles = makeStyles({
  root: {
    width: '100%',
    padding: '16px 8px 16px 8px',
    '& .MuiSvgIcon-root': {
      width: '24px',
      height: '24px',
    },
    '& .MuiButton-root': {
      transition: 'none',
    },
    '& .MuiButton-label': {
      justifyContent: 'flex-start',
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
  },
  divider: {
    background: '#FFF',
    marginTop: '16px',
    marginBottom: '16px',
    width: '100%',
  },
  sidebarOpen: {
    padding: '16px',
    '& $divider': {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'calc(100% - 16px)',
    },
  },
  versionContainer: {
    position: 'absolute',
    bottom: '24px',
    left: '24px',
    width: '216px',
    color: '#C2D2E6',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    flexDirection: 'column',
  },
  itemSelected: {
    backgroundColor: '#1774E5 !important',
  },
  itemNotSelected: {
    backgroundColor: 'unset !important',
    '&:hover': {
      backgroundColor: '#0E2D65 !important',
    },
  },
});

const secondaryControlPlanesValue = (
  secondaryControlPlanes: SecondaryControlPlanes[] | undefined,
) => {
  if (!secondaryControlPlanes || !Array.isArray(secondaryControlPlanes)) {
    return undefined;
  }
  const out: SecondaryControlPlanes[] = [];
  for (const secondaryControlPlane of secondaryControlPlanes) {
    if (
      secondaryControlPlane.name &&
      typeof secondaryControlPlane.name === 'string' &&
      secondaryControlPlane.url &&
      typeof secondaryControlPlane.url === 'string'
    ) {
      out.push(secondaryControlPlane);
    }
  }
  return out;
};

const constructCplink = (config: Config) => {
  let cpLink = config.getOptionalString('cpLink') as string;
  if (cpLink) {
    const pattern = /^((http|https|ftp):\/\/)/;
    if (!pattern.test(cpLink)) {
      if (cpLink.startsWith('/')) {
        cpLink = cpLink.slice(1);
      }
      cpLink = `https://${cpLink}`;
    }
  }
  return cpLink;
};

const SecondarySidebar = ({
  isExtendedNavOpen,
  navOpen,
}: {
  isExtendedNavOpen: boolean;
  navOpen: boolean;
}) => {
  const classes = useSecondarySidebarStyles();
  const config = useApi(configApiRef);
  const cpLink = constructCplink(config);
  const secondaryControlPlanes: SecondaryControlPlanes[] =
    secondaryControlPlanesValue(config.getOptional('secondaryControlPlanes')) ||
    [];
  const cps = [
    ...[
      {
        name: 'Primary Control Plane',
        url: cpLink,
      },
    ],
    ...secondaryControlPlanes,
  ];
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [tooltipText, setTooltipText] = React.useState<string | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    name: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setTooltipText(name);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div
      className={
        isExtendedNavOpen
          ? classes.NavBarExtendedMenuOpen
          : classes.NavBarExtendedMenuClose
      }
    >
      <ul
        className={
          navOpen
            ? `${classes.NavBarExtendedMenu} ${classes.NavBarExtendedMenuNavOpen}`
            : `${classes.NavBarExtendedMenu} ${classes.NavBarExtendedMenuNavClose}`
        }
      >
        <li className={classes.NavBarExtendedMenuTitle} key={0}>
          Control Planes
        </li>
        <hr className={classes.MenuSeparator} />
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography className={classes.paperContent} component="span">
            {tooltipText}
          </Typography>
        </Popover>
        {cps.map((cp, index) => (
          <li className={classes.NavBarExtendedMenuPointer} key={index + 1}>
            <a
              className={classes.NavBarExtendedMenuItemContainer}
              href={cp.url}
              target="_blank"
            >
              <div className={classes.NavBarExtendedMenuItemContent}>
                <Typography
                  component="span"
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={e => {
                    handlePopoverOpen(e, cp.name);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  <div className={classes.NavBarExtendedMenuItem}>
                    {cp.name}
                  </div>
                </Typography>
              </div>
              <div className={classes.NavBarExtendedMenuIcon}>
                <TibcoIcon
                  height={14}
                  width={14}
                  iconName="pl-icon-new-tab-window"
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen, setOpen } = useSidebarOpenState();
  return (
    <div
      className={
        isOpen
          ? classes.logoContainer
          : `${classes.logoContainer} ${classes.logoContainerClosed}`
      }
    >
      <SidebarItem
        className={classes.logo}
        icon={() => (
          <div className={classes.menuIcon}>
            <TibcoIcon
              height={24}
              width={24}
              iconName="pl-icon-menu-hamburger"
              onClick={() => setOpen(!isOpen)}
            />
          </div>
        )}
      >
        <Link to="/">
          <img src={DevHubLogo} className={classes.img} alt="logo" />
        </Link>
      </SidebarItem>
    </div>
  );
};

const SidebarCustom = ({
  setIsExtendedNavOpen,
  setIsNavOpen,
}: {
  setIsExtendedNavOpen: Function;
  setIsNavOpen: Function;
}) => {
  const classes = useSidebarStyles();
  const { isOpen } = useSidebarOpenState();
  const config = useApi(configApiRef);
  const secondaryControlPlanes: undefined | SecondaryControlPlanes[] =
    secondaryControlPlanesValue(config.getOptional('secondaryControlPlanes'));
  const developerHubVersion = config.getOptional('app.developerHubVersion');
  const customDeveloperHubVersion = config.getOptional(
    'tibcoDeveloperHubCustomAppVersion',
  );
  useEffect(() => {
    setIsNavOpen(isOpen);
  }, [isOpen, setIsNavOpen]);
  const [cpClicked, setCpClicked] = React.useState<boolean>(false);
  const cpLink = constructCplink(config);
  const baseURL = config.getString('app.baseUrl');
  const redirectToCP = () => {
    window.location.href = `${baseURL}/oauth2/sign_out?rd=${cpLink}`;
  };

  const openSecNavBar = () => {
    setIsExtendedNavOpen(true);
    setCpClicked(true);
  };
  return (
    <div
      className={
        isOpen ? `${classes.root} ${classes.sidebarOpen}` : classes.root
      }
    >
      <SidebarLogo />
      <SidebarGroup
        label="Search"
        icon={<TibcoIcon iconName="pl-icon-search" />}
        to="/search"
      >
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider className={classes.divider} />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}

        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
          icon={() => <TibcoIcon iconName="pl-icon-home" />}
          to="/"
          text="Home"
        />
        {secondaryControlPlanes && secondaryControlPlanes.length > 0 ? (
          <SidebarItem
            className={cpClicked ? classes.itemSelected : ''}
            onClick={openSecNavBar}
            icon={() => <img src={CpIcon} height={24} width={24} alt="logo" />}
            // to="#"
            text="Control Plane"
          />
        ) : (
          <SidebarItem
            icon={() => <img src={CpIcon} height={24} width={24} alt="logo" />}
            to={cpLink}
            target="_blank"
            text="Control Plane"
          />
        )}
        <SidebarDivider className={classes.divider} />
        <SidebarItem
          icon={CategoryIcon}
          to="catalog"
          text="Catalog"
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
        />
        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
          icon={() => <TibcoIcon iconName="pl-icon-apis" />}
          to="api-docs"
          text="APIs"
        />
        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
          icon={() => <TibcoIcon iconName="pl-icon-documentation" />}
          to="docs"
          text="Docs"
        />
        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          icon={() => (
            <img src={MarketplaceIcon} height={24} width={24} alt="logo" />
          )}
          onClick={() => setCpClicked(false)}
          to="marketplace"
          text="Marketplace"
        />
        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
          icon={() => <TibcoIcon iconName="pl-icon-add-circle" />}
          to="create"
          text="Develop..."
        />
        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
          icon={() => <TibcoIcon iconName="pl-icon-upload" />}
          to="import-flow"
          text="Import..."
        />
        {/* End global nav */}
      </SidebarGroup>
      <SidebarDivider className={classes.divider} />
      <SidebarGroup>
        <SidebarItem
          className={cpClicked ? classes.itemNotSelected : ''}
          onClick={() => setCpClicked(false)}
          icon={() => <TibcoIcon iconName="pl-icon-settings" />}
          to="/settings"
          text="Settings"
        />
        <SidebarItem
          icon={() => <TibcoIcon iconName="pl-icon-sign-out" />}
          text="Sign out"
          onClick={() => redirectToCP()}
        />
        <div className={classes.versionContainer}>
          <div>
            {developerHubVersion ? `Version : ${developerHubVersion}` : ''}
          </div>
          <div>
            {customDeveloperHubVersion
              ? `Custom version : ${customDeveloperHubVersion}`
              : ''}
          </div>
        </div>
      </SidebarGroup>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  sidebarConfig.drawerWidthOpen = SIDE_NAV_WIDTH_OPEN;
  sidebarConfig.drawerWidthClosed = SIDE_NAV_WIDTH_CLOSE;
  const [extendedNavOpen, setExtendedNavOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const onMouseUp = () => {
    setExtendedNavOpen(false);
  };
  return (
    <div onMouseUp={onMouseUp} role="presentation">
      <SidebarPage>
        <Sidebar disableExpandOnHover>
          <SidebarCustom
            setIsExtendedNavOpen={setExtendedNavOpen}
            setIsNavOpen={setNavOpen}
          />
        </Sidebar>
        <SecondarySidebar
          isExtendedNavOpen={extendedNavOpen}
          navOpen={navOpen}
        />
        {children}
      </SidebarPage>
    </div>
  );
};
