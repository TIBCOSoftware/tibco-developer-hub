/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Extract parameters when extract type is xml',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'xml',
                filePath: '<File path relative to root>',
                xPath:
                  '<Xpath query (Refer: https://www.w3schools.com/xml/xpath_syntax.asp , https://www.npmjs.com/package/xpath)>',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is xml, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Xpath query output>'],
      },
    }),
  },
  {
    description:
      'Extract parameters when extract type is xml supporting jsonpath',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'xml',
                filePath: '<File path relative to root>',
                jsonPath:
                  '<jsonPath query (Refer: https://assertible.com/docs/guide/json-path, https://www.npmjs.com/package/jsonpath)>',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is xml supporting jsonpath, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Jsonpath query output>'],
      },
    }),
  },
  {
    description: 'Extract parameters when extract type is json',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'json',
                filePath: '<File path relative to root>',
                jsonPath:
                  '<jsonPath query (Refer: https://assertible.com/docs/guide/json-path , https://www.npmjs.com/package/jsonpath)>',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is json, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Jsonpath query output>'],
      },
    }),
  },
  {
    description:
      'Extract parameters when extract type is file and regex as string',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'file',
                filePath: '<File path relative to root>',
                regex:
                  '<String or Regular expression to match in the file content (Refer: https://www.w3schools.com/jsref/jsref_match.asp)>',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is file and regex as string, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Regular expression match output>'],
      },
    }),
  },
  {
    description:
      'Extract parameters when extract type is file and regex as object containing regexPattern and regexFlags',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'file',
                filePath: '<File path relative to root>',
                regex: {
                  regexPattern:
                    '<Regular expression pattern to match in the file content, Ex: "foo?" (Refer: https://www.w3schools.com/jsref/jsref_match.asp)>',
                  regexFlags:
                    '<Regular expression flags, Ex: "i", "gim" (Refer: https://www.w3schools.com/jsref/jsref_match.asp)>',
                },
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is file and regex as object containing regexPattern and regexFlags, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Regular expression match output>'],
      },
    }),
  },
  {
    description:
      'Extract parameters when extract type is workspace and regex as string',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'workspace',
                directoryPath: '<Directory path relative to root>',
                glob: '<Glob pattern to find the paths in the directory, optional, default is `**/*` (Refer: https://www.npmjs.com/package/glob)>',
                onlyName:
                  '<Boolean value, optional, default is false, if true will return only file or directory name instead of path>',
                regex:
                  '<String or Regular expression to match the file or directory path (Refer: https://www.w3schools.com/jsref/jsref_match.asp)>',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is workspace and regex as string, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Regular expression match output>'],
      },
    }),
  },
  {
    description:
      'Extract parameters when extract type is workspace and regex as object containing regexPattern and regexFlags',
    example: yaml.stringify({
      steps: [
        {
          action: 'tibco:extract-parameters',
          name: 'Extract parameters',
          input: {
            failOnError: true,
            sourcePath: '<Source path>',
            extractParameters: {
              extract_parameter: {
                type: 'workspace',
                directoryPath: '<Directory path relative to root>',
                glob: '<Glob pattern to find the paths in the directory, optional, default is `**/*` (Refer: https://www.npmjs.com/package/glob)>',
                onlyName:
                  '<Boolean value, optional, default is false, if true will return only file or directory name instead of path>',
                regex: {
                  regexPattern:
                    '<Regular expression pattern to match the file or directory path, Ex: "foo?" (Refer: https://www.w3schools.com/jsref/jsref_match.asp)>',
                  regexFlags:
                    '<Regular expression flags, Ex: "i", "gim" (Refer: https://www.w3schools.com/jsref/jsref_match.asp)>',
                },
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Output parameters when extract type is workspace and regex as object containing regexPattern and regexFlags, the value of output parameter key will be always an array',
    example: JSON.stringify({
      output: {
        extract_parameter: ['<Regular expression match output>'],
      },
    }),
  },
];
