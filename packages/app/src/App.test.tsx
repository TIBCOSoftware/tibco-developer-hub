/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render', async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: { title: 'Test', developerHubVersion: '1.7.0' },
            backend: { baseUrl: 'http://localhost:7007' },
            techdocs: {
              storageUrl: 'http://localhost:7007/api/techdocs/static/docs',
            },
            auth: {
              enableAuthProviders: ['oauth2Proxy'],
            },
            cpLink: 'https://ptdev.cp1-my.cp-platform.dataplanes.pro',
            tibcoDeveloperHubCustomAppVersion: 'test',
          },
          context: 'test',
        },
      ] as any,
    };

    const rendered = render(<App />);
    await waitFor(() => {
      expect(rendered.baseElement).toBeInTheDocument();
    });
  });
});
