/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';

import {
  Content,
  ContentHeader,
  DocsIcon,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import {
  EntityKindPicker,
  EntityListProvider,
  EntitySearchBar,
  EntityTagPicker,
  CatalogFilterLayout,
  UserListPicker,
  EntityOwnerPicker,
} from '@backstage/plugin-catalog-react';
import {
  ScaffolderPageContextMenu,
  TemplateCategoryPicker,
  TemplateGroups,
} from '@backstage/plugin-scaffolder-react/alpha';

import { RegisterExistingButton } from './RegisterExistingButton';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';

/**
 * @alpha
 */
export type TemplateListPageProps = {
  TemplateCardComponent?: React.ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  groups?: TemplateGroupFilter[];
  templateFilter?: (entity: TemplateEntityV1beta3) => boolean;
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
    title: 'Other Import Flows',
    filter: e => ![...groups].some(({ filter }) => filter(e)),
  },
];

/**
 * @alpha
 */
export const TemplateListPage = (props: TemplateListPageProps) => {
  const registerComponentLink = useRouteRef(
    scaffolderPlugin.externalRoutes.registerComponent,
  );
  const {
    TemplateCardComponent,
    groups: givenGroups = [],
    templateFilter,
    headerOptions,
  } = props;
  const navigate = useNavigate();
  const editorLink = useRouteRef(scaffolderPlugin.routes.edit);
  const actionsLink = useRouteRef(scaffolderPlugin.routes.actions);
  const tasksLink = useRouteRef(scaffolderPlugin.routes.listTasks);
  const viewTechDocsLink = useRouteRef(
    scaffolderPlugin.externalRoutes.viewTechDoc,
  );
  const templateRoute = useRouteRef(scaffolderPlugin.routes.selectedTemplate);
  const app = useApp();

  const groups = givenGroups.length
    ? createGroupsWithOther(givenGroups)
    : [defaultGroup];

  const scaffolderPageContextMenuProps = {
    onEditorClicked:
      props?.contextMenu?.editor !== false
        ? () => navigate(editorLink())
        : undefined,
    onActionsClicked:
      props?.contextMenu?.actions !== false
        ? () => navigate(actionsLink())
        : undefined,
    onTasksClicked:
      props?.contextMenu?.tasks !== false
        ? () => navigate(tasksLink())
        : undefined,
  };

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

  return (
    <EntityListProvider>
      <Page themeId="import-flow">
        <Header
          pageTitleOverride="Create a new component"
          title="Create a new component"
          subtitle="Create new software components using standard templates in your organization"
          {...headerOptions}
        >
          <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
        </Header>
        <Content>
          <ContentHeader>
            <RegisterExistingButton
              title="Register Existing Import Flow"
              to={registerComponentLink && registerComponentLink()}
            />
            <SupportButton>
              Import new software components using import flows
            </SupportButton>
          </ContentHeader>

          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntitySearchBar />
              <EntityKindPicker initialFilter="template" hidden />
              <UserListPicker
                initialFilter="all"
                availableFilters={['all', 'starred']}
              />
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
