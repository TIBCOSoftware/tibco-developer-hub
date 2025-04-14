/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createTranslationResource } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

export const catalogMessages = createTranslationResource({
  ref: catalogTranslationRef,
  translations: {
    en: () =>
      // @ts-ignore
      Promise.resolve({
        default: {
          'indexPage.createButtonTitle': 'Develop',
        },
      }),
  },
});
