/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const fetchApiFileExamples: TemplateExample[] = [
  {
    description: 'Fetch API definition with minimal inputs (entity name only)',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:fetch-api-file',
          name: 'Fetch API definition',
          input: {
            name: 'my-api',
            path: 'api-spec.yaml',
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch API definition from a specific namespace',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:fetch-api-file',
          name: 'Fetch API definition',
          input: {
            name: 'my-api',
            namespace: 'production',
            path: 'specs/api-definition.yaml',
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch API definition from a Component entity',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:fetch-api-file',
          name: 'Fetch API from Component',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'my-service',
            path: 'api/openapi.yaml',
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch API definition from a Component with preferred API type',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:fetch-api-file',
          name: 'Fetch OpenAPI spec from Component',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'my-multi-api-service',
            path: 'specs/openapi.yaml',
            preferredApiType: 'openapi',
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch GraphQL API definition with preferred type',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:fetch-api-file',
          name: 'Fetch GraphQL schema',
          input: {
            kind: 'Component',
            name: 'graphql-service',
            path: 'schema/schema.graphql',
            preferredApiType: 'graphql',
          },
        },
      ],
    }),
  },
  {
    description: 'Fetch API definition with all available inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:fetch-api-file',
          name: 'Fetch API definition',
          input: {
            kind: 'API',
            namespace: 'production',
            name: 'payment-api',
            path: 'generated/api-spec.json',
            preferredApiType: 'openapi',
          },
        },
      ],
    }),
  },
];
