import { ExtraInfo, HomeCardProps, HomeCardType } from '../../types';
import { Grid } from '@material-ui/core';
import SystemsIcon from '../../images/systems-icon.svg';
import Star from '../../images/star.svg';
import React from 'react';
import './HomeCard.css';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import TemplatesIcon from '../../images/templates-icon.svg';
import ComponentsIcon from '../../images/components-icon.svg';
import ApisIcon from '../../images/apis-icon.svg';
import DocumentsIcon from '../../images/documents-icon.svg';
import WalkthroughsIcon from '../../images/walkthroughs-icon.svg';
import ImportflowsIcon from '../../images/importflow-icon.svg';
import { Link } from 'react-router-dom';

const addExtraInfo = (type: HomeCardType): ExtraInfo => {
  const extraInfo: ExtraInfo = {
    subTitle: '',
    icon: '',
  };
  switch (type) {
    case HomeCardType.System:
      extraInfo.subTitle = 'Start with a system of applications';
      extraInfo.icon = SystemsIcon;
      break;
    case HomeCardType.Template:
      extraInfo.subTitle = 'Templates for Apps';
      extraInfo.icon = TemplatesIcon;
      break;
    case HomeCardType.Component:
      extraInfo.subTitle = 'Browse application components';
      extraInfo.icon = ComponentsIcon;
      break;
    case HomeCardType.API:
      extraInfo.subTitle = 'View existing and create new APIs';
      extraInfo.icon = ApisIcon;
      break;
    case HomeCardType.Document:
      extraInfo.subTitle = 'Read development documentation';
      extraInfo.icon = DocumentsIcon;
      break;
    case HomeCardType.WalkThrough:
      extraInfo.subTitle = 'Development & functionality demos';
      extraInfo.icon = WalkthroughsIcon;
      break;
    case HomeCardType.ImportFlow:
      extraInfo.subTitle = 'Import existing applications';
      extraInfo.icon = ImportflowsIcon;
      break;
    default:
  }
  return extraInfo;
};
export const HomeCard = (props: { cardData: HomeCardProps }) => {
  let data = props.cardData;
  data = { ...data, ...addExtraInfo(data.type) };
  return (
    <div className="tpdh-card-container">
      <Grid
        container
        justifyContent="space-between"
        className="tpdh-card-header"
        spacing={0}
      >
        <Grid item>
          <div className="tpdh-card-title">{`${data.type}s`}</div>
          {(data.type !== HomeCardType.WalkThrough ||
            (data.type === HomeCardType.WalkThrough && data.viewAllLink)) && (
            <Link
              target={
                data.type === HomeCardType.WalkThrough ? '_blank' : undefined
              }
              className="tpdh-card-view-link"
              id="tpdh-home-card-view-link"
              to={
                /* eslint-disable */
                data.type === HomeCardType.WalkThrough
                  ? data.viewAllLink || ''
                  : data.type === HomeCardType.Document
                  ? '/docs'
                  : data.type === HomeCardType.API
                  ? '/api-docs'
                  : data.type === HomeCardType.ImportFlow
                  ? '/import-flow'
                  : '/catalog?filters[kind]=' + data.type.toLowerCase()
              }
            >
              View all
            </Link>
          )}
        </Grid>
        <Grid item>
          <img src={data.icon} height={48} width={48} alt="logo" />
        </Grid>
      </Grid>
      <div className="tpdh-card-sub-title">{data.subTitle}</div>
      {
        /* eslint-disable */ data.loading ? (
          <Progress className="tpdh-progress-margin" />
        ) : data.itemsInfo ? (
          data.itemsInfo.length > 0 ? (
            data.itemsInfo.map((element, index) => (
              <div
                className={`tpdh-card-item ${
                  data.itemsInfo && index !== data.itemsInfo.length - 1
                    ? 'tpdh-card-item-border-bottom'
                    : ''
                }`}
                key={index}
              >
                <Grid container spacing={0} alignItems="center">
                  <Link
                    className="tpdh-card-item-title"
                    id="tpdh-home-card-item-title"
                    target={
                      data.type === HomeCardType.WalkThrough && element.link
                        ? '_blank'
                        : undefined
                    }
                    to={
                      /* eslint-disable */
                      data.type === HomeCardType.WalkThrough
                        ? element.link || '#'
                        : data.type === HomeCardType.Template ||
                          data.type === HomeCardType.ImportFlow
                        ? '/create/templates/' +
                          element.namespace +
                          '/' +
                          element.name
                        : (data.type === HomeCardType.Document
                            ? '/docs'
                            : '/catalog') +
                          '/' +
                          element.namespace +
                          '/' +
                          element.kind?.toLowerCase() +
                          '/' +
                          element.name
                    }
                  >
                    {element.title || element.name}
                  </Link>
                  {element.star ? (
                    <img src={Star} height={16} width={16} alt="logo" />
                  ) : (
                    ''
                  )}
                </Grid>
                <div className="tpdh-card-item-desc">{element.text}</div>
                <Grid container spacing={0}>
                  {element.tags &&
                    element.tags.length > 0 &&
                    element.tags!.map((tag, i) => (
                      <div className="tpdh-card-item-tag" key={i}>
                        {tag}
                      </div>
                    ))}
                </Grid>
              </div>
            ))
          ) : (
            <div className="tpdh-progress-margin">
              There are no {data.type}s
            </div>
          )
        ) : (
          <Alert severity="error" className="tpdh-progress-margin">
            Something went wrong!
          </Alert>
        )
      }
    </div>
  );
};
