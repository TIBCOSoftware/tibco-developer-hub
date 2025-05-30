/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Git push with minimal inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:git:push',
          name: 'Push to repository',
        },
      ],
    }),
  },
  {
    description: 'Git push with all available inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:git:push',
          name: 'Push to repository',
          input: {
            failOnError: true,
            sourcePath: 'source-path',
            commitMessage: 'Commit message',
            gitAuthorName: 'Author Name',
            gitAuthorEmail: 'Author Email',
            branch: 'branch-name',
          },
        },
      ],
    }),
  },
];
