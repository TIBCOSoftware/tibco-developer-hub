/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Create yaml file with example outputStructure',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:create-yaml',
          name: 'Create yaml file',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            outputFile: '<output-file.yaml>',
            outputStructure: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component (You can change this to any TIBCO Developer Hub entity, ex: API, Resource, System)',
              metadata: {
                name: '<${{ steps.extract.output.extract_parameter_name[0]}}>',
                description:
                  '<${{ steps.extract.output.extract_parameter_desc[0] }}>',
                tags: ['<Tag1>', '<Tag2>'],
                annotations: {
                  'github.com/project-slug':
                    '<${{ "https://"  + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" +  (parameters.repoUrl | parseRepoUrl).repo }}>',
                  'backstage.io/techdocs-ref': 'dir:.',
                },
                links: [
                  {
                    title: '<Link title>',
                    url: '<Link URL>',
                  },
                ],
              },
              spec: {
                type: '<Type of the application>',
              },
              lifecycle: 'production',
              owner: '<${{ parameters.owner }}>',
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Create yaml file with example outputStructure accepting multiple catalog entity as array',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:create-yaml',
          name: 'Create yaml file with multiple catalog entity',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            outputFile: '<output-file.yaml>',
            outputStructure: [
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component1 (You can change this to any TIBCO Developer Hub entity, ex: API, Resource, System)',
                metadata: {
                  name: '<${{ steps.extract.output.extract_parameter_name[0] }}>',
                  description:
                    '<${{ steps.extract.output.extract_parameter_desc[0] }}>',
                  tags: ['<Tag1>', '<Tag2>'],
                  annotations: {
                    'github.com/project-slug':
                      '<${{ "https://"  + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" +  (parameters.repoUrl | parseRepoUrl).repo }}>',
                    'backstage.io/techdocs-ref': 'dir:.',
                  },
                  links: [
                    {
                      title: '<Link title1>',
                      url: '<Link URL1>',
                    },
                  ],
                },
                spec: {
                  type: '<Type of the application1>',
                },
                lifecycle: 'production1',
                owner: '<${{ parameters.owner1 }}>',
              },
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component2 (You can change this to any TIBCO Developer Hub entity, ex: API, Resource, System)',
                metadata: {
                  name: '<${{ steps.extract.output.extract_parameter_name[1] }}>',
                  description:
                    '<${{ steps.extract.output.extract_parameter_desc[1] }}>',
                  tags: ['<Tag3>', '<Tag4>'],
                  annotations: {
                    'github.com/project-slug':
                      '<${{ "https://"  + (parameters.repoUrl | parseRepoUrl).host + "/" + (parameters.repoUrl | parseRepoUrl).owner + "/" +  (parameters.repoUrl | parseRepoUrl).repo }}>',
                    'backstage.io/techdocs-ref': 'dir:.',
                  },
                  links: [
                    {
                      title: '<Link title2>',
                      url: '<Link URL2>',
                    },
                  ],
                },
                spec: {
                  type: '<Type of the application2>',
                },
                lifecycle: 'production2',
                owner: '<${{ parameters.owner2 }}>',
              },
            ],
          },
        },
      ],
    }),
  },
];
