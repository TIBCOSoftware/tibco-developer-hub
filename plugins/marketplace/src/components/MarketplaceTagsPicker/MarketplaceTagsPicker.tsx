/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Progress } from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntityList } from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import capitalize from 'lodash/capitalize';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { filterTags } from '../MarketplaceCard/MarketplaceCard.tsx';
import { EntityTagFilter } from '../MarketplaceListPage/MarketplaceListPage.tsx';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles(
  {
    root: {},
    label: {},
  },
  { name: 'ScaffolderReactTemplateCategoryPicker' },
);

export const MarketplaceTagsPicker = () => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);

  const {
    backendEntities,
    error,
    loading,
    updateFilters,
    // @ts-ignore
    queryParameters: { extraTags: tagParameter },
  } = useEntityList();
  const [marketPlaceTags, setMarketPlaceTags] = useState<string[]>([]);
  const queryParamTagFilter = useMemo(
    () => [tagParameter].flat().filter(Boolean) as string[],
    [tagParameter],
  );
  const [selectedTags, setSelectedTags] =
    useState<string[]>(queryParamTagFilter);
  useEffect(() => {
    updateFilters({
      // @ts-ignore
      extraTags: new EntityTagFilter(selectedTags),
    });
  }, [selectedTags, setSelectedTags, updateFilters]);
  useEffect(() => {
    setMarketPlaceTags([
      ...new Set(
        filterTags(
          backendEntities
            .filter(entity => {
              const tags = entity.metadata.tags?.map(v => v.toLowerCase());
              return !!(
                tags?.includes('devhub-marketplace') &&
                !tags?.includes('devhub-internal')
              );
            })
            .map(f => f.metadata?.tags as string[])
            .flat()
            .sort(),
        ),
      ),
    ]);
  }, [backendEntities]);
  useEffect(() => {
    if (queryParamTagFilter) {
      setSelectedTags(queryParamTagFilter);
    }
  }, [queryParamTagFilter]);
  if (loading) return <Progress />;
  if (error) {
    alertApi.post({
      message: `Failed to load entity types with error: ${error}`,
      severity: 'error',
    });
    return null;
  }

  if (!setMarketPlaceTags || marketPlaceTags.length === 0) return null;

  return (
    <Box className={classes.root} pb={1} pt={1}>
      <Typography
        className={classes.label}
        variant="button"
        component="label"
        htmlFor="categories-picker"
      >
        Tags
      </Typography>
      <Autocomplete<string, true>
        PopperComponent={popperProps => (
          <div {...popperProps}>{popperProps.children as ReactNode}</div>
        )}
        multiple
        id="tags-picker"
        data-testid="tags-picker"
        options={marketPlaceTags}
        value={selectedTags}
        onChange={(_: object, value: string[]) => setSelectedTags(value)}
        renderOption={(option, { selected }) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
            }
            label={capitalize(option)}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
