/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { IconComponent } from '@backstage/core-plugin-api';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CategoryIcon from '@material-ui/icons/Category';
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExtensionIcon from '@material-ui/icons/Extension';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MemoryIcon from '@material-ui/icons/Memory';
import PeopleIcon from '@material-ui/icons/People';
import StorageIcon from '@material-ui/icons/Storage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  Box,
  FormControl,
  MenuItem,
  Select as MuiSelect,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles(
  {
    formControl: {
      width: 'fit-content',
      minWidth: 80,
    },
    select: {
      display: 'flex',
      alignItems: 'center',
      height: 56,
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 48,
    },
  },
  { name: 'PluginIntegrationTopologySelectedKindDropDown' },
);

// Map entity kinds to their corresponding Material-UI icons
const kindIconMap: Record<string, IconComponent> = {
  Component: MemoryIcon,
  System: CategoryIcon,
  API: ExtensionIcon,
  Resource: StorageIcon,
  Group: PeopleIcon,
  User: PersonIcon,
  Template: FeaturedPlayListIcon,
  Domain: ApartmentIcon,
  Location: LocationOnIcon,
};

// Get icon for a given kind, with fallback
function getKindIcon(kind: string): IconComponent {
  return kindIconMap[kind] || DashboardIcon;
}

export const SelectedKindDropDown = ({
  label,
  selected,
  items,
  onChange,
  showLabel = true,
  showWrapper = true,
}: {
  label?: string;
  selected: string;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
  showLabel?: boolean;
  showWrapper?: boolean;
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleChange = (event: any) => {
    onChange(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const selectControl = (
    <FormControl variant="outlined" className={classes.formControl}>
      {showLabel && label && (
        <Typography variant="button" style={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
      )}
      <MuiSelect
        value={selected}
        onChange={handleChange}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        variant="outlined"
        className={classes.select}
        IconComponent={ExpandMoreIcon}
        renderValue={value => {
          const item = items.find(i => i.value === value);
          if (!item) return null;
          const Icon = getKindIcon(item.value);
          return (
            <Tooltip title={item.label} placement="top">
              <span
                style={{ fontSize: 24, display: 'flex', alignItems: 'center' }}
              >
                <Icon fontSize="inherit" />
              </span>
            </Tooltip>
          );
        }}
      >
        {items.map(item => {
          const Icon = getKindIcon(item.value);
          return (
            <MenuItem
              key={item.value}
              value={item.value}
              className={classes.menuItem}
            >
              <Tooltip title={item.label} placement="right">
                <span
                  style={{
                    fontSize: 24,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon fontSize="inherit" />
                </span>
              </Tooltip>
            </MenuItem>
          );
        })}
      </MuiSelect>
    </FormControl>
  );

  if (!showWrapper) {
    return selectControl;
  }

  return (
    <Box pb={1} pt={1}>
      {selectControl}
    </Box>
  );
};
