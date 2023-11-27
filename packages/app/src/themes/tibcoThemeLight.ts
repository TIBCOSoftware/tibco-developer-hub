import {
  BackstageTheme,
  createTheme,
  genPageTheme,
  lightTheme,
} from '@backstage/theme';
import { BackstageOverrides } from '@backstage/core-components';
import { BackstageOverrides as CatalogReactOverrides } from '@backstage/plugin-catalog-react';

const baseTibcoTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: '#1774e5', // Changes inactive, clickable links, buttons, icons
    },
    secondary: {
      main: '#565a6e',
    },
    error: {
      main: '#db0000', // icon that apperars in banner
    },
    warning: {
      main: '#fab632', // icon that appears in banner
    },
    info: {
      main: '#a160fb', // icon that appears in banner
    },
    success: {
      main: '#039145', // icon that appears in banner
    },
    background: {
      default: '#fafafa', // page background
      paper: '#fafafa', // cards background
    },
    banner: {
      info: '#a160fb', // Info primary
      error: '#db0000', // error primary
      text: '#0e4f9e', // *Needs change*
      link: '#565a6e', // Primary? *Needs change*
    },
    errorBackground: '#f9e1e3', // error bg
    warningBackground: '#fab632', // alert bg
    infoBackground: '#f5effe', // info bg.
    navigation: {
      // side navigation
      background: '#0e4f9e', // Currently has dark primary
      indicator: 'none',
      color: '#FAFAFA',
      selectedColor: '#FAFAFA',
      navItem: {
        hoverBackground: '#0E2D65',
      },
    },
  },

  defaultPageTheme: 'home',
  fontFamily: "'Source Sans Pro', 'PT Sans', Calibri, sans-serif",
  // as per TIBCO UXPL
  htmlFontSize: 16,
  pageTheme: {
    home: genPageTheme({ colors: ['#0e4f9e'], shape: 'none' }),
    messaging: genPageTheme({
      colors: ['#039145'],
      shape: 'none',
    }),
    /*   home: genPageTheme({ colors: ['#c2d3e7', '#0e4f9e'], shape: bgImage }),
    // home: { color: '#c2d3e7' },
    documentation: genPageTheme({
      colors: ['#c2d3e7', '#0e4f9e'],
      shape: bgImage,
    }),
    tool: genPageTheme({ colors: ['#c2d3e7', '#0e4f9e'], shape: shapes.round }),
    service: genPageTheme({
      colors: ['#c2d3e7', '#0e4f9e'],
      shape: bgImage,
    }),
    website: genPageTheme({
      colors: ['#c2d3e7', '#0e4f9e'],
      shape: shapes.wave,
    }),
    groups: genPageTheme({
      colors: ['#0e4f9e'],
      shape: 'none',
    }),
    library: genPageTheme({
      colors: ['#c2d3e7', '#0e4f9e'],
      shape: bgImage,
    }),
    other: genPageTheme({ colors: ['#c2d3e7', '#0e4f9e'], shape: shapes.wave }),
    app: genPageTheme({ colors: ['#c2d3e7', '#0e4f9e'], shape: shapes.wave }),
    apis: genPageTheme({ colors: ['#c2d3e7', '#0e4f9e'], shape: bgImage }),*/
  },
});

export const createCustomThemeOverrides = (
  _theme: BackstageTheme,
): BackstageOverrides & CatalogReactOverrides => {
  return {
    MuiMenuItem: {
      root: {
        whiteSpace: 'unset',
      },
    },
    MuiTableSortLabel: {
      root: {
        textTransform: 'capitalize',
      },
    },
    CatalogReactUserListPicker: {
      title: {
        textTransform: 'capitalize',
        fontSize: '0.875rem',
      },
    },
    MuiTableBody: {
      root: {
        fontSize: '0.875rem',
      },
    },
    MuiLink: {
      underlineHover: {
        fontWeight: 'normal',
      },
    },
    OAuthRequestDialog: {
      actionButtons: {
        padding: '16px 16px',
      },
    },
    BackstageDismissableBanner: {
      content: {
        color: '#fff',
      },
      // @ts-ignore
      warning: {
        backgroundColor: '#BD362F',
      },
    },

    BackstageHeader: {
      header: {
        backgroundPosition: 'top left',
      },
    },
    BackstageItemCardHeader: {
      root: {
        color: '#fff',
      },
    },
    BackstageSidebarPage: {
      root: {
        transition: 'none',
      },
    },
    BackstageSidebar: {
      drawer: {
        transition: 'none !important',
      },
    },
    BackstageSidebarItem: {
      open: {
        '@media (min-width: 600px)': {
          width: '100%',
        },
      },
      closed: {
        width: '100%',
      },
      root: {
        height: '40px',
        padding: '8px 16px 8px 16px',
        borderRadius: '6px',
      },
      secondaryAction: {
        width: 'auto',
        display: 'flex',
        marginRight: '0px',
      },
      label: {
        width: '100%',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '17.6px',
      },
      iconContainer: {
        width: '24px',
        height: '24px',
        marginRight: '16px',
        marginLeft: '0px',
      },
      buttonItem: {
        minWidth: 'unset',
        padding: '8px 16px 8px 16px',
      },
      closedItemIcon: {
        width: '24px',
        height: '24px',
        padding: '0px',
      },
      selected: {
        '&$closed': {
          width: 'unset',
        },
        '& $iconContainer': {
          marginLeft: 'unset',
        },
        '& $closedItemIcon': {
          marginRight: 'unset',
          paddingRight: 'unset',
        },
        backgroundColor: '#1774E5 !important',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
      text: {
        textTransform: 'none',
      },
    },
    MuiButtonBase: {
      root: {
        textTransform: 'none',
      },
    },
    MuiTypography: {
      root: {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
      },
      h1: {
        fontSize: '1.875rem',
        fontWeight: 400,
        color: '#212121',
        // paddingBottom: '8px',
        marginBottom: '0px',
      },
      // Maps to TIBCO UXPL H1
      h2: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#727272',
      },
      // Maps to TIBCO UXPL H2
      h3: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        /*   color: '#212121',*/
      },
      body2: {
        fontSize: '1rem',
        fontWeight: 400,
        color: '#727272',
      },
      button: {
        textTransform: 'none',
      },
      subtitle1: {
        fontSize: '1.125rem',
        fontWeight: 600,
        fontColor: '#0E4F9E',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        //  lineHeight: 1,
      },
    },
  };
};

export const tibcoLightTheme: BackstageTheme = {
  ...baseTibcoTheme,
  overrides: {
    ...baseTibcoTheme.overrides,
    ...createCustomThemeOverrides(baseTibcoTheme),
  },
};
