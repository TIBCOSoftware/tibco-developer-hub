/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import {
  configApiRef,
  useApi,
  useApp,
  useRouteRef,
} from '@backstage/core-plugin-api';

import { Content, DocsIcon, Page } from '@backstage/core-components';
import {
  EntityListProvider,
  CatalogFilterLayout,
  catalogApiRef,
  useEntityList,
  EntityKindFilter,
  EntityFilter,
} from '@backstage/plugin-catalog-react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  Entity,
  EntityMeta,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';
import { makeStyles } from '@material-ui/core/styles';
import { MarketplaceHeader } from '../MarketplaceHeader/MarketplaceHeader.tsx';
import { MarketplaceCard } from '../MarketplaceCard';
import { FullTextSearchFilter } from '../Filtering/FullTextSearchFilter.tsx';
import { HighlightProvider } from '../Filtering/HighlightContext.tsx';
import { MarketplaceCategoryPicker } from '../MarketplaceCategoryPicker';
import { MarketplaceGroups } from '../MarketplaceGroups';
import { MarketplaceDetailPage } from '../MarketplaceDetailPage';
import { MarketplaceTagsPicker } from '../MarketplaceTagsPicker';

export class EntityTypeFilterCopy implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    if (!this.values || this.values.length === 0) {
      return true;
    }
    if (
      !entity.spec ||
      !entity.spec.type ||
      typeof entity.spec.type !== 'string'
    ) {
      return false;
    }
    return this.values.includes(entity.spec.type);
  }
  getTypes(): string[] {
    return this.values;
  }
  getCatalogFilters(): Record<string, string | string[]> {
    return {};
  }
  toQueryValue(): string[] {
    return this.getTypes();
  }
}

export class EntityTagFilterCopy implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    return this.values.every(v => (entity.metadata.tags ?? []).includes(v));
  }
  getCatalogFilters(): Record<string, string | string[]> {
    return { 'metadata.tags': this.values };
  }
  toQueryValue(): string[] {
    return this.values;
  }
}
export class EntityTagFilter implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    return this.values.every(v => (entity.metadata.tags ?? []).includes(v));
  }
  getCatalogFilters(): Record<string, string | string[]> {
    return {};
  }
  toQueryValue(): string[] {
    return this.values;
  }
}

const useStyles = makeStyles({
  pageContainer: {
    overflowX: 'hidden',
  },
  contentHeader: {
    marginBottom: '16px',
  },
  groupsContainer: {
    '& [data-testid="header-title"]': {
      color: '#212121',
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '30px',
    },
    '& article > div:nth-child(2)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(354px, 354px))',
    },
  },
  titleContainer: {
    '& article > div:nth-child(1)': {
      display: 'none',
    },
  },
});

export type MarketplaceMetadata = {
  isNew?: boolean;
  popularity?: boolean;
  isMultiInstall?: boolean;
  imageURL?: string;
  moreInfo?: AdditionalLinks[];
};

export interface MarketplaceEntityMetadata extends EntityMeta {
  'tibco.developer.hub/marketplace'?: MarketplaceMetadata;
}

export interface MarketplaceEntity extends TemplateEntityV1beta3 {
  metadata: MarketplaceEntityMetadata;
  installedEntityRef?: string;
  installed?: boolean;
}
export interface MarketplaceApiData {
  name: string;
  namespace: string;
  data: {
    id: string;
    createdAt: string;
    output?: {
      links?: {
        title: string;
        icon: string;
        type?: string;
        entityRef?: string;
        url?: string;
      }[];
    };
  }[];
}

/**
 * @alpha
 */
export type MarketplaceListPageProps = {
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

export type AdditionalLinks = {
  icon: string;
  text: string;
  url: string;
};

const defaultGroup: TemplateGroupFilter = {
  title: 'Marketplace',
  filter: () => true,
};

const createGroupsWithOther = (
  groups: TemplateGroupFilter[],
): TemplateGroupFilter[] => [
  ...groups,
  {
    title: 'Other Marketplace Entries',
    filter: e => ![...groups].some(({ filter }) => filter(e)),
  },
];
export function convertEntityRefToCatalogUrl(entityRef: string): string {
  const { kind, namespace, name } = parseEntityRef(entityRef);
  return `/catalog/${namespace}/${kind.toLowerCase()}/${name}`;
}

const MarketPlaceKindPicker = () => {
  const { updateFilters } = useEntityList();

  useEffect(() => {
    updateFilters({
      kind: new EntityKindFilter('template', 'template'),
      tags: new EntityTagFilterCopy(['devhub-marketplace']),
    });
  }, [updateFilters]);

  return null;
};
/**
 * @alpha
 */
export const MarketplaceListPage = (props: MarketplaceListPageProps) => {
  const { groups: givenGroups = [], templateFilter } = props;
  const navigate = useNavigate();
  const viewTechDocsLink = useRouteRef(
    scaffolderPlugin.externalRoutes.viewTechDoc,
  );
  const templateRoute = useRouteRef(scaffolderPlugin.routes.selectedTemplate);
  const app = useApp();
  const defaultTitle = givenGroups.length === 0;
  const groups = givenGroups.length
    ? createGroupsWithOther(givenGroups)
    : [defaultGroup];
  const [tasks, setTasks] = useState<MarketplaceApiData[] | undefined>(
    undefined,
  );
  const [detailPageTemplate, setDetailPageTemplate] = useState<
    | { template: MarketplaceEntity; additionalLinks?: AdditionalLinks[] }
    | undefined
  >(undefined);
  const additionalLinksForEntity = useCallback(
    (template: MarketplaceEntity) => {
      if (tasks && tasks.length > 0) {
        const task = tasks.find(
          t =>
            t.name === template.metadata.name &&
            t.namespace === template.metadata.namespace,
        );
        if (task) {
          template.installed = true;
        }
        if (
          task &&
          task.data[0]?.output?.links &&
          task.data[0]?.output?.links?.length > 0
        ) {
          const entityRef = task.data[0]?.output?.links.find(
            l => l.type === 'catalog' && l.entityRef,
          )?.entityRef;
          template.installedEntityRef =
            entityRef && convertEntityRefToCatalogUrl(entityRef);
        }
      }
      const { kind, namespace, name } = parseEntityRef(
        stringifyEntityRef(template),
      );
      return template.metadata.annotations?.['backstage.io/techdocs-ref'] &&
        viewTechDocsLink
        ? [
            {
              icon: app.getSystemIcon('docs') ?? DocsIcon,
              // icon: 'docs',
              text: 'View TechDocs',
              url: viewTechDocsLink({ kind, namespace, name }),
            },
          ]
        : [];
    },
    [app, viewTechDocsLink, tasks],
  );

  const onTemplateSelected = useCallback(
    (
      template: TemplateEntityV1beta3,
      additionalLinks?: AdditionalLinks[],
      openDetail?: boolean,
    ) => {
      if (openDetail) {
        setDetailPageTemplate({ template, additionalLinks });
        return;
      }
      const { namespace, name } = parseEntityRef(stringifyEntityRef(template));
      navigate(templateRoute({ namespace, templateName: name }));
    },
    [navigate, templateRoute],
  );
  const styles = useStyles();
  const config = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  useEffect(
    () => {
      async function fetchData() {
        const backendUrl = config.getString('backend.baseUrl');
        try {
          const res = await fetch(
            `${backendUrl}/api/scaffolder/marketplace/v1/tasks`,
          );
          if (!res.ok) throw new Error(res.statusText);
          const payload: MarketplaceApiData[] = await res.json();
          const entityRefs: string[] = payload
            .map(e => {
              return (
                e.data[0]?.output?.links?.find(
                  l => l.type === 'catalog' && l.entityRef,
                )?.entityRef || ''
              );
            })
            .filter(v => v !== '');
          let out: string[] = [];
          if (entityRefs.length > 0) {
            try {
              const entRes = await catalogApi.getEntitiesByRefs({ entityRefs });
              if (entRes && entRes.items.length > 0) {
                out = entRes.items
                  .map(ent => {
                    return (ent && stringifyEntityRef(ent)) || '';
                  })
                  .filter(v => v !== '');
              }
            } catch (err) {
              throw err;
            }
          }
          setTasks(
            payload.filter(load => {
              const entityRef =
                load.data[0]?.output?.links?.find(
                  l => l.type === 'catalog' && l.entityRef,
                )?.entityRef || '';
              return out.includes(entityRef);
            }),
          );
        } catch (err) {
          throw err;
        }
      }
      fetchData();
    },
    /* eslint-disable */ [],
  );
  const onCloseDetailPage = () => {
    setDetailPageTemplate(undefined);
  };
  return (
    <EntityListProvider pagination={false}>
      <Page themeId="marketplace">
        {detailPageTemplate && (
          <MarketplaceDetailPage
            {...detailPageTemplate}
            onTemplateSelected={onTemplateSelected}
            onCloseDetailPage={onCloseDetailPage}
          ></MarketplaceDetailPage>
        )}
        <div className={styles.pageContainer}>
          <MarketplaceHeader />
          <Content>
            {tasks && (
              <>
                <div className={`th-title ${styles.contentHeader}`}>
                  Explore marketplace entries
                </div>
                <HighlightProvider>
                  <CatalogFilterLayout>
                    <CatalogFilterLayout.Filters>
                      <FullTextSearchFilter />
                      <MarketPlaceKindPicker />
                      <MarketplaceCategoryPicker />
                      <MarketplaceTagsPicker />
                    </CatalogFilterLayout.Filters>
                    <CatalogFilterLayout.Content>
                      <div
                        className={
                          defaultTitle
                            ? `${styles.titleContainer} ${styles.groupsContainer}`
                            : styles.groupsContainer
                        }
                      >
                        <MarketplaceGroups
                          groups={groups}
                          templateFilter={templateFilter}
                          TemplateCardComponent={MarketplaceCard}
                          onTemplateSelected={onTemplateSelected}
                          additionalLinksForEntity={additionalLinksForEntity}
                        />
                      </div>
                    </CatalogFilterLayout.Content>
                  </CatalogFilterLayout>
                </HighlightProvider>
              </>
            )}
          </Content>
        </div>
      </Page>
    </EntityListProvider>
  );
};
