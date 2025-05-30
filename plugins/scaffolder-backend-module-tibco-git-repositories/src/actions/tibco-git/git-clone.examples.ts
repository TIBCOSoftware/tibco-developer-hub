/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Git clone with minimal inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:git:clone',
          name: 'Clone repository',
          input: {
            repoUrl: 'https://github.com/owner/repo.git',
          },
        },
      ],
    }),
  },
  {
    description: 'Git clone with all available inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:git:clone',
          name: 'Clone repository',
          input: {
            failOnError: true,
            sourcePath: 'source-path',
            branch: 'branch-name',
            repoUrl: 'https://github.com/owner/repo.git',
            token: 'authentication-token',
          },
        },
      ],
    }),
  },
];
