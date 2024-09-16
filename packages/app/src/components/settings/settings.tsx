import React from 'react';
import {
  SettingsLayout,
  UserSettingsGeneral,
  UserSettingsAuthProviders,
} from '@backstage/plugin-user-settings';
import './settings.css';

export const settingsPage = (
  <SettingsLayout>
    <SettingsLayout.Route path="general" title="General">
      <div className="th-settings-page">
        <UserSettingsGeneral />
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
