/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { TemplateFilterExample } from '@backstage/plugin-scaffolder-node/alpha';

export const decodeExamples: TemplateFilterExample[] = [
  {
    example: `\
- id: log
  name: Decode base64 string
  action: debug:log
  input:
    message: \${{ parameters.base64String | decodeBase64 }}`,
    notes: ` - **Input**: \`ZGVtbyBzdHJpbmcgdG8gY29udmVydCBiYXNlNjQ=\`
  - **Output**: \`demo string to convert base64\`
`,
  },
];

export const encodeExamples: TemplateFilterExample[] = [
  {
    example: `\
- id: log
  name: Encode string to base64
  action: debug:log
  input:
    message: \${{ parameters.stringToEncode | encodeBase64 }}`,
    notes: ` - **Input**: \`demo string to convert base64\`
  - **Output**: \`ZGVtbyBzdHJpbmcgdG8gY29udmVydCBiYXNlNjQ=\`
`,
  },
];
