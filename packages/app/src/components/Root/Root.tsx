import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';
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
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Link } from 'react-router-dom';

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
});
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
          <img
            src="/tibco/hub/devhub-logo.svg"
            className={classes.img}
            alt="logo"
          />
        </Link>
      </SidebarItem>
    </div>
  );
};

const SidebarCustom = () => {
  const classes = useSidebarStyles();
  const { isOpen } = useSidebarOpenState();
  const config = useApi(configApiRef);
  const configApi = useApi(configApiRef);
  const developerHubVersion = configApi.getOptional('app.developerHubVersion');
  const customDeveloperHubVersion = configApi.getOptional(
    'tibcoDeveloperHubCustomAppVersion',
  );
  let cpLink = config.getOptionalString('cpLink') as string;
  const baseURL = config.getString('app.baseUrl');
  if (cpLink) {
    const pattern = /^((http|https|ftp):\/\/)/;
    if (!pattern.test(cpLink)) {
      if (cpLink.startsWith('/')) {
        cpLink = cpLink.slice(1);
      }
      cpLink = `https://${cpLink}`;
    }
  }
  const redirectToCP = () => {
    window.location.href = `${baseURL}/oauth2/sign_out?rd=${cpLink}`;
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
          icon={() => <TibcoIcon iconName="pl-icon-home" />}
          to="/"
          text="Home"
        />
        <SidebarItem
          icon={() => <img src={CpIcon} height={24} width={24} alt="logo" />}
          to={cpLink}
          target="_blank"
          text="Control Plane"
        />
        <SidebarDivider className={classes.divider} />
        <SidebarItem icon={CategoryIcon} to="catalog" text="Catalog" />
        <SidebarItem
          icon={() => <TibcoIcon iconName="pl-icon-apis" />}
          to="api-docs"
          text="APIs"
        />
        <SidebarItem
          icon={() => <TibcoIcon iconName="pl-icon-documentation" />}
          to="docs"
          text="Docs"
        />
        <SidebarItem
          icon={() => <TibcoIcon iconName="pl-icon-add-circle" />}
          to="create"
          text="Develop..."
        />
        <SidebarItem
          icon={() => <TibcoIcon iconName="pl-icon-upload" />}
          to="import-flow"
          text="Import..."
        />
        {/* End global nav */}
      </SidebarGroup>
      <SidebarDivider className={classes.divider} />
      <SidebarGroup
        icon={<TibcoIcon iconName="pl-icon-settings" />}
        to="/settings"
        label="Settings"
      >
        <SidebarSettings />
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
  sidebarConfig.drawerWidthOpen = 264;
  sidebarConfig.drawerWidthClosed = 72;
  return (
    <SidebarPage>
      <Sidebar disableExpandOnHover>
        <SidebarCustom />
      </Sidebar>
      {children}
    </SidebarPage>
  );
};
