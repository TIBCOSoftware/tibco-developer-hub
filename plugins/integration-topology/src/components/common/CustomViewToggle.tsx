/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';
import { useState } from 'react';

const useStyles = makeStyles({
  toggleViewWrapper: {
    position: 'relative',
    display: 'flex',
    border: '1px solid #0E4F9E',
    borderRadius: '21px',

    '& input[type="radio"]': {
      display: 'none',
    },

    '& input[type="radio"]:checked + label': {
      color: '#FFFFFF',
    },

    '& input[id="topology-view-radio"]:checked ~ .tabActiveSlider': {
      transform: 'translateX(-1%)',
    },
    '& input[id="graph-view-radio"]:checked ~ .tabActiveSlider': {
      transform: 'translateX(96%)',
    },
  },
  toggleViewTabs: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    color: '#0E4F9E',
    backgroundColor: 'transparent',
    borderRadius: '21px',
    border: '1px solid #0E4F9E',

    '&:hover': {
      cursor: 'pointer',
    },

    '& *': {
      zIndex: 2,
    },
  },
  toggleViewTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderRadius: '21px',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'color 150ms ease-in',
  },
  tabActiveSlider: {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    color: '#FFFFFF',
    backgroundColor: '#0E4F9E',
    border: '1px solid #0E4F9E',
    borderRadius: '21px',
    transition: '250ms ease-out',
  },
});

export const CustomViewToggle = ({
  view,
  setView,
  viewOptions,
  size = 'large',
}: {
  view: string;
  setView: (view: string) => void;
  viewOptions: string[];
  size?: 'small' | 'large';
}) => {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogGraphTranslationRef);

  const fontSize = size === 'small' ? '12px' : '16px';
  const height = size === 'small' ? 32 : 40;
  const width = size === 'small' ? 200 : 372;
  const activeTabWidth =
    size === 'small'
      ? width / viewOptions.length + 3
      : width / viewOptions.length + 5;

  const [value, setValue] = useState(view);

  return (
    <div className={classes.toggleViewWrapper}>
      <div
        style={{ width: `${width}px`, height: `${height}px`, fontSize }}
        className={classes.toggleViewTabs}
      >
        <input
          type="radio"
          name="toggle-view"
          checked={value === viewOptions[0]}
          aria-label={t(`catalogGraphPage.${viewOptions[0]}ViewLabel`)}
          value={viewOptions[0]}
          id={`${viewOptions[0]}-view-radio`}
          onChange={event => {
            setValue(event.target.value);
            setView(event.target.value);
          }}
        />
        <label
          htmlFor={`${viewOptions[0]}-view-radio`}
          style={{
            width: `${width / viewOptions.length}px`,
            height: `${height}px`,
          }}
          className={classes.toggleViewTab}
        >
          {t(`catalogGraphPage.${viewOptions[0]}ViewLabel`)}
        </label>
        <input
          type="radio"
          name="toggle-view"
          checked={value === viewOptions[1]}
          aria-label={t(`catalogGraphPage.${viewOptions[1]}ViewLabel`)}
          value={viewOptions[1]}
          id={`${viewOptions[1]}-view-radio`}
          onChange={event => {
            setValue(event.target.value);
            setView(event.target.value);
          }}
        />
        <label
          htmlFor={`${viewOptions[1]}-view-radio`}
          style={{
            width: `${width / viewOptions.length}px`,
            height: `${height}px`,
          }}
          className={classes.toggleViewTab}
        >
          {t(`catalogGraphPage.${viewOptions[1]}ViewLabel`)}
        </label>
        <span
          style={{
            width: `${activeTabWidth}px`,
            height: `${height}px`,
          }}
          className={`${classes.tabActiveSlider} tabActiveSlider`}
        />
      </div>
    </div>
  );
};
