/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  SearchBar,
  SearchContextProvider,
  SearchResult,
} from '@backstage/plugin-search-react';
import { List, ListItem, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

const useStyles = makeStyles(
  theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
    },
    label: {
      transform: 'initial',
      fontWeight: 'bold',
      fontSize: theme.typography.body2.fontSize,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.text.primary,
      },
    },
    dropdown: {
      margin: theme.spacing(1, 0),
    },
    dropdownMenu: {
      maxHeight: '300px',
      overflowY: 'auto',
      backgroundColor: theme.palette.background.paper,
      zIndex: theme.zIndex.modal,
      boxShadow: theme.shadows[5],
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
    },
    dropdownListItem: {
      padding: theme.spacing(1),
      wordBreak: 'break-word',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
  { name: 'PluginIntegrationTopologySearchableDropdown' },
);

export const SearchByEntityName = ({
  label,
  rootEntityNames,
  onSelected,
}: {
  label?: string;
  rootEntityNames: CompoundEntityRef[];
  onSelected: (name: string, callback: () => void) => void;
}) => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const classes = useStyles();

  return (
    <SearchContextProvider>
      <FormControl className={classes.formControl} fullWidth>
        <div className={classes.label}>{label}</div>
        <SearchBar
          className={classes.dropdown}
          placeholder={
            (rootEntityNames && rootEntityNames[0]?.name) || 'Search...'
          }
          value={searchQuery}
          onChange={event => {
            setSearchQuery(event);
            if (event.length < 0) {
              setShowSearchResults(false);
            }
          }}
          onFocus={() => setShowSearchResults(true)}
          onKeyDown={() => setShowSearchResults(true)}
          onClear={() => setShowSearchResults(false)}
        />
        {showSearchResults && (
          <SearchResult>
            {({ results }) => (
              <List className={classes.dropdownMenu}>
                {results.map(({ document }) => {
                  return (
                    <ListItem
                      className={classes.dropdownListItem}
                      key={document.location}
                      onClick={() => {
                        onSelected(document.title, () => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                        });
                      }}
                    >
                      {document.title}
                    </ListItem>
                  );
                })}
              </List>
            )}
          </SearchResult>
        )}
      </FormControl>
    </SearchContextProvider>
  );
};
