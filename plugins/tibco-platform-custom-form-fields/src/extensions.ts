/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { DataplaneSelector } from './components/DataplaneSelector';
import { CapabilitySelector } from './components/CapabilitySelector';

export const DataplaneSelectorExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'DataplaneSelector',
    component: DataplaneSelector,
    schema: {
      uiOptions: {
        type: 'object',
        properties: {},
      },
      returnValue: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the selected dataplane',
          },
          name: {
            type: 'string',
            description: 'The name of the selected dataplane',
          },
        },
      },
    },
  }),
);

export const CapabilitySelectorExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'CapabilitySelector',
    component: CapabilitySelector,
    schema: {
      uiOptions: {
        type: 'object',
        properties: {
          requiredCapabilities: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of capability names required for the dataplane',
          },
        },
      },
      returnValue: {
        type: 'object',
        properties: {
          dataplaneId: {
            type: 'string',
            description: 'ID of the selected dataplane',
          },
          dataplaneName: {
            type: 'string',
            description: 'Name of the selected dataplane',
          },
          capabilityId: {
            type: 'string',
            description: 'ID of the selected capability',
          },
          capabilityName: {
            type: 'string',
            description: 'Name of the selected capability',
          },
          capabilityType: {
            type: 'string',
            description: 'Type of the selected capability',
          },
          dataplaneUrl: {
            type: 'string',
            description: 'URL of the dataplane capability endpoint',
          },
          dataplaneHost: {
            type: 'string',
            description: 'Hostname of the dataplane',
          },
        },
      },
    },
  }),
);
