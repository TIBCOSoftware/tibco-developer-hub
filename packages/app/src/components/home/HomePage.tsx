import { Box, Grid } from '@material-ui/core';
import {
  configApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import {
  CATALOG_FILTER_EXISTS,
  catalogApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { JumpStart } from './components/JumpStart/JumpStart';
import { Welcome } from './components/Welcome/Welcome';
import { BuildInfo } from './BuildInfo';
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { HomeCardProps, HomeCardType } from './types';
import { HomeCard } from './components/HomeCard/HomeCard';
import { Introduction } from './components/Introduction/Introduction';
import HomeHeaderImg from './images/home-image.svg';
import useAsync from 'react-use/lib/useAsync';
import { Content, Page } from '@backstage/core-components';

const ITEMS_PER_CARD = 3;
const getIndex = (item: any, stars: string[]) => {
  const val =
    `${item.kind}:${item.metadata?.namespace}/${item.metadata?.name}`.toLowerCase();
  return stars.indexOf(val);
};
export const HomePage = () => {
  const initialState: HomeCardProps[] = [];
  const config = useApi(configApiRef);
  const walkthrough: any = config.getOptional('walkThrough');
  const homeCardTypes: HomeCardType[] = Object.values(HomeCardType);
  if (!walkthrough) {
    homeCardTypes.splice(homeCardTypes.indexOf(HomeCardType.WalkThrough), 1);
  }
  for (const cardType of homeCardTypes) {
    initialState.push({
      type: cardType,
      loading: true,
      subTitle: '',
      icon: '',
    });
  }
  const [cards, setCards] = useState(initialState);
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const starredApi = useApi(starredEntitiesApiRef);
  const { value, loading, error } = useAsync(async () => {
    try {
      const data = await identityApi.getProfileInfo();
      return data.displayName;
    } catch (err) {
      throw error;
    }
  });
  const title = config.getOptionalString('app.title');
  useEffect(
    () => {
      document.title = `Home | ${title}`;
      const sub = starredApi.starredEntitie$().subscribe(
        entries => {
          const stars: string[] = Array.from(entries);
          (async () => {
            const apiCalls = [];
            for (const type of homeCardTypes) {
              if (type !== HomeCardType.WalkThrough) {
                let filter: any = {
                  kind: [type],
                };
                const fields = [
                  'kind',
                  'metadata.name',
                  'metadata.title',
                  'metadata.tags',
                  'metadata.description',
                  'metadata.namespace',
                ];
                if (type === HomeCardType.ImportFlow) {
                  filter = {
                    kind: [HomeCardType.Template],
                    'metadata.tags': 'import-flow',
                  };
                } else if (type === HomeCardType.Document) {
                  filter = {
                    'metadata.annotations.backstage.io/techdocs-ref':
                      CATALOG_FILTER_EXISTS,
                  };
                }
                apiCalls.push(
                  catalogApi
                    .getEntities({
                      filter,
                      fields,
                    })
                    .catch(err => {
                      return err;
                    }),
                );
              }
            }
            try {
              const result: any[] = await Promise.all(apiCalls);
              const newCards = [];
              for (const [index, card] of cards.entries()) {
                card.loading = false;
                if (card.type === HomeCardType.WalkThrough) {
                  card.viewAllLink = walkthrough.viewAllLink;
                  card.itemsInfo = walkthrough.items || [];
                } else {
                  let items = result[index]?.items;
                  if (card.type === HomeCardType.Template) {
                    items = items.filter(
                      (item: any) =>
                        !item.metadata.tags
                          ?.map((v: any) => v.toLowerCase())
                          .includes('import-flow'),
                    );
                  }
                  if (items) {
                    let itemsInfo = [];
                    if (stars && stars.length > 0) {
                      for (const item of items) {
                        const inx = getIndex(item, stars);
                        if (inx > -1) {
                          item.star = true;
                          itemsInfo.push(item);
                        }
                        if (itemsInfo.length >= 3) {
                          break;
                        }
                      }
                      for (const item of items) {
                        if (itemsInfo.length >= 3) {
                          break;
                        }
                        const ind = getIndex(item, stars);
                        if (ind > -1) {
                          continue;
                        }
                        itemsInfo.push(item);
                      }
                    } else {
                      itemsInfo = result[index]?.items?.slice(
                        0,
                        ITEMS_PER_CARD,
                      );
                    }
                    card.itemsInfo = itemsInfo.map((item: any) => {
                      return {
                        title: item.metadata?.title,
                        name: item.metadata?.name,
                        kind: item.kind,
                        star: item.star,
                        namespace: item.metadata?.namespace,
                        tags: item.metadata?.tags?.slice(0, 3),
                        text: `${item.metadata?.description}`,
                      };
                    });
                  }
                }
                newCards.push(card);
              }
              setCards(newCards);
            } catch (err) {
              throw err;
            }
          })();
        },
        err => {
          throw err;
        },
      );
      return () => {
        sub.unsubscribe();
      };
    },
    /* eslint-disable */ [],
  );

  // @ts-ignore
  return (
    <Page themeId="home">
      <Content className="tpdh-home-content">
        <div className="tpdh-home-container">
          <Grid container spacing={4}>
            <Grid item md={6}>
              <Welcome
                name={/* eslint-disable */ loading ? '' : error ? '' : value}
                title={title}
              />
              <Introduction />
            </Grid>
            <Grid item md={6}>
              <img
                src={HomeHeaderImg}
                className="tpdh-home-header-img"
                alt="logo"
              />
            </Grid>
          </Grid>
          <JumpStart />
          <Grid
            container
            className="tpdh-home-grid"
            // justifyContent="space-between"
            alignItems="stretch"
            spacing={3}
          >
            {cards.map((card, i) => (
              <Grid item key={i} md={4} sm={12}>
                <HomeCard cardData={card} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
            <BuildInfo />
          </Box>
        </div>
      </Content>
    </Page>
  );
};
