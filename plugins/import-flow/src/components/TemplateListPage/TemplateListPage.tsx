/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
  title: 'Templates',
  filter: () => true,
};

const createGroupsWithOther = (
  groups: TemplateGroupFilter[],
): TemplateGroupFilter[] => [
  ...groups,
  {
    title: 'Other Templates',
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
      <Page themeId="home">
        <Header
          pageTitleOverride="Create a new component"
          title="Create a new component"
          subtitle="Create new software components using standard templates in your organization"
          {...headerOptions}
        >
          <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
        </Header>
        <Content>
          <ContentHeader title="Available Import Flows">
            <RegisterExistingButton
              title="Register Existing Import Flow"
              to={registerComponentLink && registerComponentLink()}
            />
            <SupportButton>
              Create new software components using standard templates. Different
              templates create different kinds of components (services,
              websites, documentation, ...).
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
