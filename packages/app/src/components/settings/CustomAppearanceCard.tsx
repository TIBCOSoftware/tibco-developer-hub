/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { InfoCard, useSidebarPinState } from '@backstage/core-components';
import {
  UserSettingsLanguageToggle,
  UserSettingsThemeToggle,
  UserSettingsPinToggle,
} from '@backstage/plugin-user-settings';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

const ADVANCED_VIEW_KEY = 'devhub/advanced-view';
const ADVANCED_VIEW_EVENT = 'devhub-advanced-view-change';

export const useAdvancedView = () => {
  const [isAdvancedView, setIsAdvancedView] = React.useState(
    () => localStorage.getItem(ADVANCED_VIEW_KEY) === 'true',
  );

  React.useEffect(() => {
    const handler = () => {
      setIsAdvancedView(localStorage.getItem(ADVANCED_VIEW_KEY) === 'true');
    };
    window.addEventListener(ADVANCED_VIEW_EVENT, handler);
    return () => window.removeEventListener(ADVANCED_VIEW_EVENT, handler);
  }, []);

  const toggleAdvancedView = () => {
    const next = localStorage.getItem(ADVANCED_VIEW_KEY) !== 'true';
    localStorage.setItem(ADVANCED_VIEW_KEY, String(next));
    window.dispatchEvent(new Event(ADVANCED_VIEW_EVENT));
  };

  return { isAdvancedView, toggleAdvancedView };
};

const AdvancedViewToggle = () => {
  const { isAdvancedView, toggleAdvancedView } = useAdvancedView();

  return (
    <ListItem>
      <ListItemText
        primary="Advanced navigation mode"
        secondary="Effortlessly access advanced functions in the left sidebar."
      />
      <ListItemSecondaryAction>
        <Tooltip
          placement="top"
          arrow
          title={
            isAdvancedView
              ? 'Disable Advanced navigation mode'
              : 'Enable Advanced navigation mode'
          }
        >
          <Switch
            color="primary"
            checked={isAdvancedView}
            onChange={toggleAdvancedView}
            name="advancedView"
            inputProps={{ 'aria-label': 'Advanced View Switch' }}
          />
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const CustomAppearanceCard = () => {
  const { isMobile } = useSidebarPinState();

  return (
    <InfoCard title="Appearance" variant="gridItem">
      <List dense>
        <UserSettingsThemeToggle />
        <UserSettingsLanguageToggle />
        <AdvancedViewToggle />
        {!isMobile && <UserSettingsPinToggle />}
      </List>
    </InfoCard>
  );
};
