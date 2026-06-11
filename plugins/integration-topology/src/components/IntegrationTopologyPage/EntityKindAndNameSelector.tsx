/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Box, Typography, makeStyles } from '@material-ui/core';
import { SelectedKindDropDown } from './SelectedKindDropDown';
import {
  SearchableDropDown,
  SearchableDropDownProps,
} from './SearchableDropDown';

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    label: {
      marginBottom: theme.spacing(1),
      fontWeight: 'bold',
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    kindSelector: {
      flexShrink: 0,
    },
    nameSelector: {
      flex: 1,
      minWidth: 0,
    },
  }),
  { name: 'PluginIntegrationTopologyEntityKindAndNameSelector' },
);

export interface EntityKindAndNameSelectorProps {
  label?: string;
  kindDropdownProps: {
    selected: string;
    items: { label: string; value: string }[];
    onChange: (value: string) => void;
  };
  nameDropdownProps: Omit<SearchableDropDownProps, 'showLabel'>;
}

export const EntityKindAndNameSelector = ({
  label = 'Select Entity Kind and Name',
  kindDropdownProps,
  nameDropdownProps,
}: EntityKindAndNameSelectorProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography variant="button" className={classes.label}>
        {label}
      </Typography>
      <div className={classes.controlsRow}>
        <div className={classes.kindSelector}>
          <SelectedKindDropDown
            {...kindDropdownProps}
            showLabel={false}
            showWrapper={false}
          />
        </div>
        <div className={classes.nameSelector}>
          <SearchableDropDown {...nameDropdownProps} showLabel={false} />
        </div>
      </div>
    </Box>
  );
};
