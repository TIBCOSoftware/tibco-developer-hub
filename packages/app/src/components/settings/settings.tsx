import React from 'react';
import {
  SettingsLayout,
  UserSettingsGeneral,
  UserSettingsAuthProviders,
} from '@backstage/plugin-user-settings';

export const settingsPage = (
  <SettingsLayout>
    <SettingsLayout.Route path="general" title="General">
      <UserSettingsGeneral />
    </SettingsLayout.Route>
    <SettingsLayout.Route
      path="auth-providers"
      title="Authentication Providers"
    >
      <UserSettingsAuthProviders />
    </SettingsLayout.Route>
  </SettingsLayout>
);
