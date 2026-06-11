/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const fetchPlatformApiExamples: TemplateExample[] = [
  {
    description: 'Call platform API with minimal inputs (GET request)',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Fetch data from platform',
          input: {
            endpoint: '/api/v1/resources',
          },
        },
      ],
    }),
  },
  {
    description: 'Call platform API with custom base URL',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Fetch from custom endpoint',
          input: {
            baseUrl: 'https://api.example.com',
            endpoint: '/v1/users',
            method: 'GET',
          },
        },
      ],
    }),
  },
  {
    description: 'POST request with inline body',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Create resource',
          input: {
            endpoint: '/api/v1/resources',
            method: 'POST',
            body: {
              name: 'new-resource',
              type: 'application',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'POST request with body from file',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Create resource from file',
          input: {
            endpoint: '/api/v1/resources',
            method: 'POST',
            filePath: 'payload/request-body.json',
          },
        },
      ],
    }),
  },
  {
    description: 'Call API with custom headers',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Fetch with custom headers',
          input: {
            endpoint: '/api/v1/data',
            method: 'GET',
            headers: {
              'X-Custom-Header': 'custom-value',
              Accept: 'application/json',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Call API without authentication',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Fetch public endpoint',
          input: {
            baseUrl: 'https://public-api.example.com',
            endpoint: '/health',
            method: 'GET',
            requireAuth: false,
          },
        },
      ],
    }),
  },
  {
    description: 'PUT request with all available inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Update resource',
          input: {
            baseUrl: 'https://api.tibco.com',
            endpoint: '/api/v1/resources/123',
            method: 'PUT',
            body: {
              name: 'updated-resource',
              status: 'active',
            },
            headers: {
              'X-Request-Id': '${{ parameters.requestId }}',
            },
            requireAuth: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Upload a ZIP file using multipart/form-data',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Upload build package',
          input: {
            baseUrl: 'https://dataplane.example.com',
            endpoint: '/public/v1/dp/builds',
            method: 'PUT',
            filePath: 'build.zip',
            contentType: 'formData',
            formFieldName: 'buildZipFile',
            headers: {
              accept: 'application/json',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Upload a ZIP file with explicit MIME type',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Upload artifact with MIME type',
          input: {
            baseUrl: 'https://api.example.com',
            endpoint: '/api/v1/artifacts',
            method: 'POST',
            filePath: 'artifacts/my-package.zip',
            fileMimeType: 'application/zip',
            contentType: 'formData',
            formFieldName: 'artifact',
          },
        },
      ],
    }),
  },
  {
    description: 'Upload a JSON file using multipart/form-data',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Upload configuration file',
          input: {
            baseUrl: 'https://api.example.com',
            endpoint: '/api/v1/configs',
            method: 'POST',
            filePath: 'config/app-config.json',
            contentType: 'formData',
            formFieldName: 'configFile',
          },
        },
      ],
    }),
  },
  {
    description: 'Upload file with additional form fields',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Upload with metadata',
          input: {
            baseUrl: 'https://api.example.com',
            endpoint: '/api/v1/upload',
            method: 'POST',
            filePath: 'data/export.csv',
            contentType: 'formData',
            formFieldName: 'dataFile',
            body: {
              description: 'Monthly export data',
              category: 'reports',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Upload Flogo application build',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:call-platform-api',
          name: 'Deploy Flogo build',
          input: {
            baseUrl: '${{ parameters.dataplane_url }}',
            endpoint: '/public/v1/dp/builds',
            method: 'PUT',
            filePath: 'build.zip',
            contentType: 'formData',
            formFieldName: 'buildZipFile',
            headers: {
              accept: 'application/json',
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Use appBaseUrl and cpBrowserUrl outputs for production-ready links',
    example: yaml.stringify({
      steps: [
        {
          id: 'test_connection',
          action: 'tibco:call-platform-api',
          name: 'Check DP Flogo Versions',
          input: {
            baseUrl: '${{ parameters.deploymentTarget.dataplaneUrl }}',
            endpoint: 'public/v1/dp/flogoversions',
          },
        },
        {
          id: 'link-deployed-app',
          action: 'tibco:call-platform-api',
          name: 'Link App',
          input: {
            endpoint:
              '/tp-cp-ws/v1/data-planes/${{ parameters.deploymentTarget.dataplaneId }}/capabilities/${{ parameters.deploymentTarget.capabilityId }}/apps',
            method: 'PUT',
            body: {
              appId: '${{ steps.deploy_app.output.data.appId }}',
              appName: '${{ parameters.app_name }}',
              appLinks: [
                {
                  linkName: '${{ parameters.app_name }}',
                  linkType: 'developer_hub',
                  href: '${{ steps.test_connection.output.appBaseUrl + "/catalog/default/component/" + parameters.app_name }}',
                },
              ],
            },
          },
        },
      ],
      output: {
        links: [
          {
            title: 'Dataplane Details',
            url: '${{ steps.test_connection.output.cpBrowserUrl + "/cp/app/data-plane?dp_id=" + parameters.deploymentTarget.dataplaneId }}',
          },
        ],
      },
    }),
  },
];
