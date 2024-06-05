import { genPageTheme } from '@backstage/theme';

import {
  createBaseThemeOptions,
  createUnifiedTheme,
  palettes,
} from '@backstage/theme';

export const tibcoThemeLight = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.light,
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
  }),
  defaultPageTheme: 'other',
  fontFamily: "'Source Sans Pro', 'PT Sans', Calibri, sans-serif",
  // as per TIBCO UXPL
  htmlFontSize: 16,
  pageTheme: {
    /* home: genPageTheme({ colors: ['#FAFAFA'], shape: 'none' }),
    apis: genPageTheme({ colors: ['#FAFAFA'], shape: 'none' }),
    app: genPageTheme({ colors: ['#FAFAFA'], shape: 'none' }),
    documentation: genPageTheme({ colors: ['#FAFAFA'], shape: 'none' }),
    tool: genPageTheme({ colors: ['#FAFAFA'], shape: 'none' }),*/
    service: genPageTheme({
      colors: ['#13405B'],
      shape: 'none',
    }),
    library: genPageTheme({
      colors: ['#7DC95E'],
      shape: 'none',
    }),
    website: genPageTheme({
      colors: ['#1B998B'],
      shape: 'none',
    }),
    integration: genPageTheme({
      colors: ['#259BC2'],
      shape: 'none',
    }),
    messaging: genPageTheme({
      colors: ['#A74064'],
      shape: 'none',
    }),
    other: genPageTheme({ colors: ['#0E4F9E'], shape: 'none' }),
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          whiteSpace: 'unset',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
      },
    },
    /*   MuiIconButton:{
      colorInherit:{
        color: '#212121 !important'
      }
    },*/
    CatalogReactUserListPicker: {
      styleOverrides: {
        title: {
          textTransform: 'capitalize',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        underlineHover: {
          fontWeight: 'normal',
        },
      },
    },
    OAuthRequestDialog: {
      styleOverrides: {
        actionButtons: {
          padding: '16px 16px',
        },
      },
    },
    BackstageDismissableBanner: {
      styleOverrides: {
        content: {
          color: '#fff',
        },
        // @ts-ignore
        warning: {
          backgroundColor: '#BD362F',
        },
      },
    },

    BackstageHeader: {
      styleOverrides: {
        header: {
          backgroundImage: 'none',
          boxShadow: 'none',
          '& a': {
            color: '#1774e5',
            '& div': {
              color: '#1774e5',
            },
          },
          '& button': {
            color: '#212121',
          },
        },
        leftItemsBox: {
          color: '#212121',
        },
        rightItemsBox: {
          color: '#212121',
        },
        title: {
          color: '#212121',
        },
        breadcrumb: {
          color: '#212121',
        },
        breadcrumbTitle: {
          color: '#212121',
        },
        breadcrumbType: {
          color: '#212121',
        },
        type: {
          color: '#212121',
        },
        subtitle: {
          color: '#212121',
        },
      },
    },
    BackstageHeaderLabel: {
      styleOverrides: {
        root: {
          color: '#212121',
        },
        value: {
          color: '#212121',
        },
        label: {
          color: '#212121',
        },
      },
    },
    PluginCatalogEntityContextMenu: {
      styleOverrides: {
        button: {
          color: '#212121',
        },
      },
    },

    BackstageItemCardHeader: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    BackstageSidebarPage: {
      styleOverrides: {
        root: {
          transition: 'none',
        },
      },
    },
    BackstageSidebar: {
      styleOverrides: {
        drawer: {
          transition: 'none !important',
        },
      },
    },
    BackstageSidebarItem: {
      styleOverrides: {
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
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        text: {
          textTransform: 'none',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
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
    },
  },
});
