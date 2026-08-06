/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  SettingsLayout,
  UserSettingsAuthProviders,
  UserSettingsProfileCard,
  UserSettingsIdentityCard,
} from '@backstage/plugin-user-settings';
import Grid from '@material-ui/core/Grid';
import { CustomAppearanceCard } from './CustomAppearanceCard';
import './settings.css';

const CustomUserSettingsGeneral = () => (
  <Grid container direction="row" spacing={3}>
    <Grid item xs={12} md={6}>
      <UserSettingsProfileCard />
    </Grid>
    <Grid item xs={12} md={6}>
      <CustomAppearanceCard />
    </Grid>
    <Grid item xs={12} md={6}>
      <UserSettingsIdentityCard />
    </Grid>
  </Grid>
);

export const settingsPage = (
  <SettingsLayout>
    <SettingsLayout.Route path="general" title="General">
      <div className="th-settings-page">
        <CustomUserSettingsGeneral />
      </div>
    </SettingsLayout.Route>
    <SettingsLayout.Route
      path="auth-providers"
      title="Authentication Providers"
    >
      <UserSettingsAuthProviders />
    </SettingsLayout.Route>
  </SettingsLayout>
);
