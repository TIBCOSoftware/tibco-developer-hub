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
];
