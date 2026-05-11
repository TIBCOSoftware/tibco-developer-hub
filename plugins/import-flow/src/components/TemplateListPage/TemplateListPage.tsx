/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { type ComponentType, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  DocsIcon,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';
import {
  CatalogFilterLayout,
  EntityKindPicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntitySearchBar,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderPageContextMenu,
  TemplateCategoryPicker,
  TemplateGroups,
} from '@backstage/plugin-scaffolder-react/alpha';

import { RegisterExistingButton } from './RegisterExistingButton';
import { TemplateTypeFilter } from './TemplateTypeFilter';
import { TemplateUserListPicker } from './TemplateUserListPicker';

/**
 * @alpha
 */
export type TemplateListPageProps = {
  TemplateCardComponent?: ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  groups?: TemplateGroupFilter[];
  templateFilter?: (entity: TemplateEntityV1beta3) => boolean;
  requiredTags?: string[];
  excludedTags?: string[];
  contextMenu?: {
    editor?: boolean;
    actions?: boolean;
    tasks?: boolean;
  };
  headerOptions?: {
    pageTitleOverride?: string;
    title?: string;
    subtitle?: string;
  };
};

const defaultGroup: TemplateGroupFilter = {
  title: 'Import Flows',
  filter: () => true,
};

const createGroupsWithOther = (
  groups: TemplateGroupFilter[],
): TemplateGroupFilter[] => [
  ...groups,
  {
    title: 'Other Templates',
    filter: e => !groups.some(({ filter }) => filter(e)),
  },
];

/** Builds context-menu props for {@link ScaffolderPageContextMenu}. */
function useScaffolderContextMenu(
  contextMenu: TemplateListPageProps['contextMenu'],
) {
  const navigate = useNavigate();
  const editorLink = useRouteRef(scaffolderPlugin.routes.edit);
  const actionsLink = useRouteRef(scaffolderPlugin.routes.actions);
  const tasksLink = useRouteRef(scaffolderPlugin.routes.listTasks);

  return {
    onEditorClicked:
      contextMenu?.editor !== false ? () => navigate(editorLink()) : undefined,
    onActionsClicked:
      contextMenu?.actions !== false
        ? () => navigate(actionsLink())
        : undefined,
    onTasksClicked:
      contextMenu?.tasks !== false ? () => navigate(tasksLink()) : undefined,
  };
}

/**
 * @alpha
 */
export const TemplateListPage = (props: TemplateListPageProps) => {
  const {
    TemplateCardComponent,
    groups: givenGroups = [],
    templateFilter,
    requiredTags,
    excludedTags,
    headerOptions,
    contextMenu,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const app = useApp();

  const templateType = location.pathname.split('/')[1] || '';
  const groups = givenGroups.length
    ? createGroupsWithOther(givenGroups)
    : [defaultGroup];

  const registerComponentLink = useRouteRef(
    scaffolderPlugin.externalRoutes.registerComponent,
  );
  const templateRoute = useRouteRef(scaffolderPlugin.routes.selectedTemplate);
  const viewTechDocsLink = useRouteRef(
    scaffolderPlugin.externalRoutes.viewTechDoc,
  );

  const scaffolderContextMenuProps = useScaffolderContextMenu(contextMenu);

  const additionalLinksForEntity = useCallback(
    (template: TemplateEntityV1beta3) => {
      const { kind, namespace, name } = parseEntityRef(
        stringifyEntityRef(template),
      );
      return template.metadata.annotations?.['backstage.io/techdocs-ref'] &&
        viewTechDocsLink
        ? [
            {
              icon: app.getSystemIcon('docs') ?? DocsIcon,
              text: 'View TechDocs',
              url: viewTechDocsLink({ kind, namespace, name }),
            },
          ]
        : [];
    },
    [app, viewTechDocsLink],
  );

  const onTemplateSelected = useCallback(
    (template: TemplateEntityV1beta3) => {
      const { namespace, name } = parseEntityRef(stringifyEntityRef(template));
      navigate(templateRoute({ namespace, templateName: name }));
    },
    [navigate, templateRoute],
  );

  const registerButtonTitle =
    templateType && templateType !== 'create'
      ? `Register Existing ${templateType
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}`
      : 'Register Existing Component';

  const supportButtonText = `Create new software components using ${
    templateType ? templateType.split('-').join(' ') : 'templates'
  }`;

  return (
    <EntityListProvider>
      <Page themeId={templateType || 'scaffolder'}>
        <Header
          pageTitleOverride="Create a new component"
          title="Create a new component"
          subtitle="Create new software components using standard templates in your organization"
          {...headerOptions}
        >
          <ScaffolderPageContextMenu {...scaffolderContextMenuProps} />
        </Header>

        <Content>
          <ContentHeader>
            <RegisterExistingButton
              title={registerButtonTitle}
              to={registerComponentLink && registerComponentLink()}
            />
            <SupportButton>{supportButtonText}</SupportButton>
          </ContentHeader>

          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntitySearchBar />
              <EntityKindPicker initialFilter="template" hidden />
              <TemplateTypeFilter
                requiredTags={requiredTags}
                excludedTags={excludedTags}
              />
              {excludedTags?.length ? (
                <TemplateUserListPicker />
              ) : (
                <UserListPicker
                  initialFilter="all"
                  availableFilters={['all', 'starred']}
                />
              )}
              <TemplateCategoryPicker />
              <EntityTagPicker />
              <EntityOwnerPicker />
            </CatalogFilterLayout.Filters>

            <CatalogFilterLayout.Content>
              <TemplateGroups
                groups={groups}
                templateFilter={templateFilter}
                TemplateCardComponent={TemplateCardComponent}
                onTemplateSelected={onTemplateSelected}
                additionalLinksForEntity={additionalLinksForEntity}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </Content>
      </Page>
    </EntityListProvider>
  );
};
