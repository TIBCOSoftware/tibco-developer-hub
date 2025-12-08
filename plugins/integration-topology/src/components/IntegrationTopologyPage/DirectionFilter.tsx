/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { Select, SelectedItems } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import { useCallback, useContext } from 'react';
import { Direction } from '@backstage/plugin-catalog-graph';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';
import { TopologyContext } from '../..';

export type Props = {
  value: Direction;
  onChange: (value: Direction) => void;
};

export const DirectionFilter = ({ value, onChange }: Props) => {
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const DIRECTION_DISPLAY_NAMES = {
    [Direction.LEFT_RIGHT]: t('catalogGraphPage.directionFilter.leftToRight'),
    [Direction.RIGHT_LEFT]: t('catalogGraphPage.directionFilter.rightToLeft'),
    [Direction.TOP_BOTTOM]: t('catalogGraphPage.directionFilter.topToBottom'),
    [Direction.BOTTOM_TOP]: t('catalogGraphPage.directionFilter.bottomToTop'),
  };
  const { setGraphDirection } = useContext(TopologyContext);
  const handleChange = useCallback(
    (v: SelectedItems) => {
      onChange(v as Direction);
      setGraphDirection?.(v as Direction);
    },
    [onChange, setGraphDirection],
  );

  return (
    <Box pb={1} pt={1}>
      <Select
        label={t('catalogGraphPage.directionFilter.title')}
        selected={value}
        items={Object.values(Direction).map(v => ({
          label: DIRECTION_DISPLAY_NAMES[v],
          value: v,
        }))}
        onChange={handleChange}
      />
    </Box>
  );
};
