/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useEffect, useMemo, useState } from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { StarIcon } from '@backstage/core-components';
import {
  EntityUserFilter,
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
    boxShadow: 'none',
    margin: theme.spacing(1, 0, 1, 0),
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listIcon: {
    minWidth: 30,
    color: theme.palette.text.primary,
  },
  menuItem: {
    minHeight: theme.spacing(6),
  },
  groupWrapper: {
    margin: theme.spacing(1, 1, 2, 1),
  },
}));

/**
 * A sidebar picker that lets users switch between "All" and "Starred" templates.
 * Used in place of the default {@link UserListPicker} when an `excludedTags`
 * filter is active, since the default picker does not compose with custom filters.
 */
export const TemplateUserListPicker = () => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';

  const { starredEntities } = useStarredEntities();
  const { updateFilters, entities } = useEntityList();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'starred'>(
    'all',
  );

  const allCount = entities.length;

  const starredRefs = useMemo(
    () => Array.from(starredEntities),
    [starredEntities],
  );

  const starredCount = useMemo(
    () =>
      entities.filter(entity => starredEntities.has(stringifyEntityRef(entity)))
        .length,
    [entities, starredEntities],
  );

  // Reset to "all" if the last starred template is un-starred.
  useEffect(() => {
    if (selectedFilter === 'starred' && starredCount === 0) {
      setSelectedFilter('all');
    }
  }, [selectedFilter, starredCount]);

  // Sync the selected filter into the entity list whenever it changes.
  useEffect(() => {
    const filter =
      selectedFilter === 'starred'
        ? EntityUserFilter.starred(starredRefs)
        : EntityUserFilter.all();
    updateFilters({ user: filter });
  }, [selectedFilter, starredRefs, updateFilters]);

  return (
    <Card data-testid="template-user-list-picker" className={classes.root}>
      <Typography
        variant="subtitle2"
        component="span"
        className={classes.title}
      >
        Personal
      </Typography>
      <Card className={classes.groupWrapper}>
        <List disablePadding dense>
          <MenuItem
            className={classes.menuItem}
            onClick={() => setSelectedFilter('starred')}
            selected={selectedFilter === 'starred'}
            disabled={starredCount === 0}
            data-testid="user-picker-starred"
          >
            <ListItemIcon className={classes.listIcon}>
              <StarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1">Starred</Typography>
            </ListItemText>
            <ListItemSecondaryAction>{starredCount}</ListItemSecondaryAction>
          </MenuItem>
        </List>
      </Card>
      <Typography
        variant="subtitle2"
        component="span"
        className={classes.title}
      >
        {orgName}
      </Typography>
      <Card className={classes.groupWrapper}>
        <List disablePadding dense>
          <MenuItem
            className={classes.menuItem}
            onClick={() => setSelectedFilter('all')}
            selected={selectedFilter === 'all'}
            data-testid="user-picker-all"
          >
            <ListItemText>
              <Typography variant="body1">All</Typography>
            </ListItemText>
            <ListItemSecondaryAction>{allCount}</ListItemSecondaryAction>
          </MenuItem>
        </List>
      </Card>
    </Card>
  );
};
