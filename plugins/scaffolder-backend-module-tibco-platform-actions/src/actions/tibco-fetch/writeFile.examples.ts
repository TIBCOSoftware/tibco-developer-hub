/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const writeFileExamples: TemplateExample[] = [
  {
    description: 'Write content to a file with minimal inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:file:write',
          name: 'Write configuration file',
          input: {
            filePath: 'config/app.yaml',
            content: 'apiVersion: v1\nname: my-app',
          },
        },
      ],
    }),
  },
  {
    description: 'Write file with custom encoding',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:file:write',
          name: 'Write file with encoding',
          input: {
            filePath: 'data/output.txt',
            content: 'Hello, World!',
            encoding: 'utf8',
          },
        },
      ],
    }),
  },
  {
    description: 'Write file and overwrite if it exists',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:file:write',
          name: 'Overwrite existing file',
          input: {
            filePath: 'README.md',
            content: '# My Project\n\nThis is my project description.',
            overwrite: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Write file without creating parent directories',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:file:write',
          name: 'Write to existing directory',
          input: {
            filePath: 'existing-folder/file.txt',
            content: 'File content here',
            createDirectories: false,
          },
        },
      ],
    }),
  },
  {
    description: 'Write file with all available inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:file:write',
          name: 'Write file with all options',
          input: {
            filePath: 'src/config/settings.json',
            content: '{"debug": true, "logLevel": "info"}',
            encoding: 'utf8',
            overwrite: true,
            createDirectories: true,
          },
        },
      ],
    }),
  },
];
