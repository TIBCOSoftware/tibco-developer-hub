/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { EntityLayout, catalogPlugin } from '@backstage/plugin-catalog';
import {
  EntityProvider,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { cicdContent } from './EntityPage';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import React from 'react';
import { githubActionsApiRef } from '@backstage-community/plugin-github-actions';

describe('EntityPage Test', () => {
  const entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'ExampleComponent',
      annotations: {
        'github.com/project-slug': 'example/project',
      },
    },
    spec: {
      owner: 'guest',
      type: 'service',
      lifecycle: 'production',
    },
  };

  const rootRouteRef = catalogPlugin.routes.catalogIndex;

  describe('cicdContent', () => {
    it('Should render GitHub Actions View', async () => {
      const rendered = await renderInTestApp(
        <TestApiProvider
          apis={[
            [starredEntitiesApiRef, new MockStarredEntitiesApi()],
            [permissionApiRef, mockApis.permission()],
            [catalogApiRef, catalogApiMock()],
            [
              githubActionsApiRef,
              { getWorkflowRun: jest.fn().mockResolvedValue([]) },
            ],
          ]}
        >
          <EntityProvider entity={entity}>
            <EntityLayout>
              <EntityLayout.Route path="/ci-cd" title="CI-CD">
                {cicdContent}
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog': rootRouteRef,
          },
        },
      );

      expect(rendered.getByText('ExampleComponent')).toBeInTheDocument();

      await expect(
        rendered.findByText('No Workflow Data'),
      ).resolves.toBeInTheDocument();
    });
  });
});
