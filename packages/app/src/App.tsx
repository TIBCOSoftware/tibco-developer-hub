import React from 'react';
import { Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';
import {
  AlertDisplay,
  ErrorPanel,
  OAuthRequestDialog,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import {
  AppRouter,
  ErrorBoundaryFallbackProps,
  FlatRoutes,
} from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightIcon from '@material-ui/icons/WbSunny';

import '@fontsource/source-sans-pro';

import {
  configApiRef,
  githubAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { ProxiedSignInPage } from '@backstage/core-components';

import { SignInPage } from '@backstage/core-components';

import { tibcoOIDCAuthApiRef } from './apis';

import { tibcoLightTheme } from './themes/tibcoThemeLight';
import { settingsPage } from './components/settings/settings';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from './components/catalog-import/CatalogImportPage';
import { Button } from '@material-ui/core';

export const generateProviders = (providerConfig: string[]): any[] => {
  const providers: any[] = [];

  providerConfig.forEach(element => {
    switch (element) {
      case 'github':
        providers.push({
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        });
        break;
      case 'tibco':
        providers.push({
          id: 'tibco',
          title: 'TIBCO',
          message: 'Sign in using TIBCO',
          apiRef: tibcoOIDCAuthApiRef,
        });
        break;
      case 'guest':
        providers.push('guest');
        break;
      case 'oauth2Proxy':
        providers.push('oauth2Proxy');
        break;
      default:
      // empty
    }
  });

  return providers;
};
const DefaultErrorBoundaryFallback = ({
  error,
  resetError,
  plugin,
}: ErrorBoundaryFallbackProps) => {
  error.stack = undefined;
  return (
    <ErrorPanel
      title={`Error in ${plugin?.getId()}`}
      defaultExpanded
      error={error}
    >
      <Button variant="outlined" onClick={resetError}>
        Retry
      </Button>
    </ErrorPanel>
  );
};

const app = createApp({
  apis,
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      const availableProviders = generateProviders(
        configApi.getStringArray('auth.enableAuthProviders'),
      );
      if (availableProviders.includes('oauth2Proxy')) {
        return <ProxiedSignInPage {...props} provider="oauth2Proxy" />;
      }
      return <SignInPage {...props} providers={availableProviders} />;
    },
    ErrorBoundaryFallback: DefaultErrorBoundaryFallback,
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  themes: [
    {
      id: 'tibco-theme',
      title: 'TIBCO Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <ThemeProvider theme={tibcoLightTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
  ],
});

const routes = (
  <FlatRoutes>
    {/* <Navigate key="/" to="catalog" />*/}
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    {/* <Route path="/docs" element={<TechDocsIndexPage/>}/>*/}
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />}>
      {settingsPage}
    </Route>
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
  </FlatRoutes>
);
export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
