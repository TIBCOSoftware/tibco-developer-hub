import {
  createTranslationMessages,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import { TranslationBlueprint } from '@backstage/plugin-app-react';
import { catalogTranslationRef } from '@backstage/plugin-catalog';

export const catalogTranslations = createFrontendModule({
  pluginId: 'app',
  extensions: [
    TranslationBlueprint.make({
      name: 'catalog-overrides',
      params: {
        resource: createTranslationMessages({
          ref: catalogTranslationRef,
          messages: {
            'indexPage.createButtonTitle': 'Develop',
          },
        }),
      },
    }),
  ],
});
