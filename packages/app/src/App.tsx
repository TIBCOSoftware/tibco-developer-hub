/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Route } from 'react-router';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import { CatalogEntityPage, CatalogIndexPage } from '@backstage/plugin-catalog';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis, platformOIDCAuthApiRef } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';
import {
  AlertDisplay,
  ErrorPanel,
  OAuthRequestDialog,
} from '@backstage/core-components';
import { createApp } from '@backstage/frontend-defaults';
import {
  convertLegacyAppOptions,
  convertLegacyAppRoot,
} from '@backstage/core-compat-api';
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
import LightIcon from '@material-ui/icons/WbSunny';
import {
  configApiRef,
  githubAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { ProxiedSignInPage } from '@backstage/core-components';

import { SignInPage } from '@backstage/core-components';

import { tibcoThemeLight } from './themes/tibcoThemeLight';
import { settingsPage } from './components/settings/settings';
import { CatalogImportPage } from './components/catalog-import/CatalogImportPage';
import { Button } from '@material-ui/core';
import { UnifiedThemeProvider } from '@backstage/theme';
import { CustomTemplatePage } from '@internal/backstage-plugin-custom-template-flow';
import {
  DataplaneSelectorExtension,
  CapabilitySelectorExtension,
} from '@internal/plugin-tibco-platform-custom-form-fields';
import { catalogTranslations } from './translations/catalogIndex';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import {
  TemplateGroups,
  templateGroupsValue,
} from './components/scaffolder/CustomScaffolderComponent.tsx';
import { CustomScaffolderPage } from './components/scaffolder/plugin.ts';
import { MarketplacePage } from '@internal/plugin-marketplace';
import { IntegrationTopologyPage } from '@internal/plugin-integration-topology';
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';

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
      case 'guest':
        providers.push('guest');
        break;
      case 'tibco-control-plane':
        providers.push('tibco-control-plane');
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

const convertedOptionsModule = convertLegacyAppOptions({
  /* legacy options such as apis, icons, plugins, components, themes and featureFlags */
  apis,
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      const availableProviders = generateProviders(
        configApi.getStringArray('auth.enableAuthProviders'),
      );
      if (availableProviders.includes('tibco-control-plane')) {
        return (
          <SignInPage
            {...props}
            provider={{
              id: 'tibco-control-plane',
              title: 'TIBCO® Control Plane',
              message: 'Sign in using TIBCO® Control Plane',
              apiRef: platformOIDCAuthApiRef,
            }}
            auto
          />
        );
      }
      if (availableProviders.includes('oauth2Proxy')) {
        return <ProxiedSignInPage {...props} provider="oauth2Proxy" />;
      }
      return <SignInPage {...props} providers={availableProviders} />;
    },
    ErrorBoundaryFallback: DefaultErrorBoundaryFallback,
  },
  themes: [
    {
      id: 'tibco-theme',
      title: 'TIBCO Theme',
      variant: 'light',
      icon: <LightIcon />,
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={tibcoThemeLight} children={children} />
      ),
    },
  ],
});

const CustomImportFlowPage = () => {
  const config = useApi(configApiRef);
  const importFlowGroups: undefined | TemplateGroups[] = templateGroupsValue(
    config.getOptional('importFlowGroups'),
  );

  const groups = importFlowGroups
    ? importFlowGroups.map(importFlowGroup => ({
        title: importFlowGroup.name,
        filter: (entity: TemplateEntityV1beta3) =>
          importFlowGroup.tagFilters.some(tag =>
            entity.metadata?.tags?.includes(tag),
          ),
      }))
    : [
        {
          title: 'Import Flows',
          filter: () => true,
        },
      ];

  return (
    <ScaffolderPage
      components={{
        EXPERIMENTAL_TemplateListPageComponent: () => (
          <CustomTemplatePage
            templateFilter={entity => {
              const tags = entity.metadata.tags?.map(v => v.toLowerCase());
              return !!(
                tags?.includes('import-flow') &&
                !tags?.includes('devhub-internal')
              );
            }}
            requiredTags={['import-flow']}
            excludedTags={['devhub-internal']}
            groups={groups}
            headerOptions={{
              pageTitleOverride: 'Import Flow',
              title: 'Import Flow',
              subtitle: 'Import new software components using import flows',
            }}
          />
        ),
      }}
    />
  );
};

const CustomSelfServicePage = () => {
  const config = useApi(configApiRef);
  const selfServiceGroups: undefined | TemplateGroups[] = templateGroupsValue(
    config.getOptional('selfServiceGroups'),
  );

  const groups = selfServiceGroups
    ? selfServiceGroups.map(selfServiceGroup => ({
        title: selfServiceGroup.name,
        filter: (entity: TemplateEntityV1beta3) =>
          selfServiceGroup.tagFilters.some(tag =>
            entity.metadata?.tags?.includes(tag),
          ),
      }))
    : [
        {
          title: 'Self Service Flows',
          filter: () => true,
        },
      ];

  return (
    <ScaffolderPage
      components={{
        EXPERIMENTAL_TemplateListPageComponent: () => (
          <CustomTemplatePage
            templateFilter={entity => {
              const tags = entity.metadata.tags?.map(v => v.toLowerCase());
              return !!(
                tags?.includes('self-service') &&
                !tags?.includes('devhub-marketplace')
              );
            }}
            requiredTags={['self-service']}
            excludedTags={['devhub-marketplace']}
            groups={groups}
            headerOptions={{
              pageTitleOverride: 'Self Service',
              title: 'Self Service',
              subtitle:
                'Setup new software components using self service flows',
            }}
          />
        ),
      }}
    />
  );
};

const CustomMarketPlacePage = () => {
  const config = useApi(configApiRef);
  const marketplaceGroups: undefined | TemplateGroups[] = templateGroupsValue(
    config.getOptional('marketplaceGroups'),
  );
  let groups: any[] = [];
  if (marketplaceGroups) {
    groups = [];
    for (const marketplaceGroup of marketplaceGroups) {
      groups.push({
        title: marketplaceGroup.name,
        filter: (entity: TemplateEntityV1beta3) => {
          for (const tag of marketplaceGroup.tagFilters) {
            if (entity.metadata?.tags?.includes(tag)) {
              return true;
            }
          }
          return false;
        },
      });
    }
  }
  return (
    <ScaffolderPage
      templateFilter={entity => {
        const tags = entity.metadata.tags?.map(v => v.toLowerCase());
        return !!(
          tags?.includes('devhub-marketplace') &&
          !tags?.includes('devhub-internal')
        );
      }}
      groups={groups}
      components={{
        EXPERIMENTAL_TemplateListPageComponent: MarketplacePage,
      }}
      headerOptions={{
        pageTitleOverride: 'Marketplace',
        title: 'Marketplace',
        subtitle: 'Install new software components using marketplace',
      }}
    />
  );
};

export const routes = (
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
    <Route path="/import-flow" element={<CustomImportFlowPage />} />
    <Route path="/self-service-flow" element={<CustomSelfServicePage />} />
    <Route path="/create" element={<CustomScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <DataplaneSelectorExtension />
        <CapabilitySelectorExtension />
      </ScaffolderFieldExtensions>
    </Route>
    <Route path="/api-docs" element={<ApiExplorerPage />} />
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
    <Route path="/marketplace" element={<CustomMarketPlacePage />} />
    <Route path="/integration-topology" element={<IntegrationTopologyPage />} />
  </FlatRoutes>
);

const convertedRootFeatures = convertLegacyAppRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

const app = createApp({
  features: [
    convertedOptionsModule,
    ...convertedRootFeatures,
    catalogTranslations,
  ],
});

export default app.createRoot();
