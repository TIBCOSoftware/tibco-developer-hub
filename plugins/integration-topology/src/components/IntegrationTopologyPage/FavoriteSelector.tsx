/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useCallback, useMemo } from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useUrlFavorites } from '../../hooks/useUrlFavourites';

const useStyles = makeStyles(
  {
    formControl: {
      width: '100%',
      maxWidth: 300,
    },
  },
  { name: 'PluginIntegrationTopologyFavoriteSelector' },
);

export interface FavoriteSelectorProps {
  onFavoriteSelected: (url: string) => void;
  currentUrl?: string;
}

export const FavoriteSelector = ({
  onFavoriteSelected,
  currentUrl,
}: FavoriteSelectorProps) => {
  const classes = useStyles();
  const { favorites } = useUrlFavorites();

  // Find the current favorite that matches the current URL
  const currentFavorite = useMemo(() => {
    if (!currentUrl) return '';
    const matchingFavorite = favorites.find(
      f => Object.values(f)[0] === currentUrl,
    );
    return matchingFavorite ? Object.values(matchingFavorite)[0] : '';
  }, [favorites, currentUrl]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const selectedUrl = event.target.value as string;
      if (selectedUrl && selectedUrl !== '') {
        onFavoriteSelected(selectedUrl);
      }
    },
    [onFavoriteSelected],
  );

  // Only render if there is at least one favorite
  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <Box pb={1} pt={1}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Typography variant="button" style={{ fontWeight: 'bold' }}>
          Select from Favorites
        </Typography>
        <Select
          value={currentFavorite}
          onChange={handleChange}
          variant="outlined"
          displayEmpty
          IconComponent={ExpandMoreIcon}
          renderValue={(value: unknown): React.ReactNode => {
            if (!value || value === '') {
              return (
                <span style={{ color: '#757575' }}>
                  Select a favorite topology view
                </span>
              );
            }
            // Find the entity name for the selected URL
            const selectedFavorite = favorites.find(
              f => Object.values(f)[0] === value,
            );
            const entityName = selectedFavorite
              ? Object.keys(selectedFavorite)[0]
              : (value as string);
            return <span>{entityName}</span>;
          }}
        >
          <MenuItem value="" disabled>
            <em>Select a favorite topology view</em>
          </MenuItem>
          {favorites.map((favorite, index) => {
            const entityName = Object.keys(favorite)[0];
            const url = Object.values(favorite)[0];
            return (
              <MenuItem key={`${entityName}-${index}`} value={url}>
                {entityName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
