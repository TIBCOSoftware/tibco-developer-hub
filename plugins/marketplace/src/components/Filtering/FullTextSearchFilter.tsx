/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import {
  EntityTextFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { EntityDescriptionTextFilter } from './EntityDescriptionTextFilter';

const useStyles = makeStyles(
  _theme => ({
    searchToolbar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    input: {},
  }),
  { name: 'CatalogReactEntitySearchBar' },
);

import { HighlightContext } from './HighlightContext';

export const FullTextSearchFilter = () => {
  const classes = useStyles();
  const {
    updateFilters,
    queryParameters: { text: textParameter },
  } = useEntityList();

  const queryParamTextFilter = useMemo(
    () => [textParameter].flat()[0],
    [textParameter],
  );

  const [search, setSearch] = useState(queryParamTextFilter ?? '');
  const { setHighlight } = useContext(HighlightContext);

  useDebounce(
    () => {
      setHighlight(search);
      updateFilters({
        text: search.length
          ? (new EntityDescriptionTextFilter(
              search,
            ) as unknown as EntityTextFilter)
          : undefined,
      });
    },
    250,
    [search, updateFilters],
  );

  useEffect(() => {
    if (queryParamTextFilter) {
      setSearch(queryParamTextFilter);
    }
  }, [queryParamTextFilter]);

  return (
    <Toolbar className={classes.searchToolbar}>
      <FormControl>
        <Input
          aria-label="search"
          id="input-with-icon-adornment"
          className={classes.input}
          placeholder="Search"
          autoComplete="off"
          onChange={event => setSearch(event.target.value)}
          value={search}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => setSearch('')}
                edge="end"
                disabled={search.length === 0}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Toolbar>
  );
};
