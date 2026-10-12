/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { waitFor } from '@testing-library/react';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { configApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { ConfigReader } from '@backstage/core-app-api';
import { Root } from './Root';

const ADVANCED_VIEW_KEY = 'devhub/advanced-view';

const baseConfig = new ConfigReader({
  app: { title: 'test app', baseUrl: 'http://localhost:3000' },
  cpLink: '/cp-url.com',
  backend: { baseUrl: 'http://localhost:7007' },
});

// The run-page routes (/create/templates/:namespace/:name) look up the running
// template's tags to decide which sidebar entry to highlight. Resolve tags from
// the requested name so tests can drive each flow.
const TEMPLATE_TAGS: Record<string, string[]> = {
  'import-tpl': ['import-flow'],
  'selfservice-tpl': ['self-service'],
  'marketplace-tpl': ['devhub-marketplace'],
  'plain-tpl': ['some-other-tag'],
};
const catalogApi = {
  getEntityByRef: async (ref: any) => {
    const name = typeof ref === 'string' ? ref.split('/').pop() : ref.name;
    // Simulate an entity that can't be found: the catalog resolves to undefined
    // (rather than throwing), which must still fall back to a sensible highlight.
    if (name === 'missing-tpl') {
      return undefined;
    }
    return {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name,
        namespace: 'default',
        tags: TEMPLATE_TAGS[name] ?? [],
      },
      spec: {},
    };
  },
};

const baseApis: any[] = [
  [configApiRef, baseConfig],
  [identityApiRef, mockApis.identity()],
  [catalogApiRef, catalogApi],
];

const renderSidebar = (routeEntry = '/') =>
  renderInTestApp(
    <TestApiProvider apis={baseApis}>
      <Root>
        <div />
      </Root>
    </TestApiProvider>,
    { routeEntries: [routeEntry] },
  );

describe('Root sidebar - Advanced View toggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Advanced View disabled (default)', () => {
    it('shows "Develop..." item linking to /create', async () => {
      const { getByText } = await renderSidebar();
      await waitFor(() => {
        expect(getByText('Develop...').closest('a')).toHaveAttribute(
          'href',
          '/create',
        );
      });
    });

    it('does not show advanced nav items', async () => {
      const { queryByText } = await renderSidebar();
      await waitFor(() => {
        expect(queryByText('Templates')).not.toBeInTheDocument();
        expect(queryByText('Task list')).not.toBeInTheDocument();
        expect(queryByText('Self Service')).not.toBeInTheDocument();
        expect(queryByText('Import...')).not.toBeInTheDocument();
        expect(queryByText('Register...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Advanced View enabled', () => {
    beforeEach(() => {
      localStorage.setItem(ADVANCED_VIEW_KEY, 'true');
    });

    it('does not show "Develop..." item', async () => {
      const { queryByText } = await renderSidebar();
      await waitFor(() => {
        expect(queryByText('Develop...')).not.toBeInTheDocument();
      });
    });

    it('shows "Templates" item linking to /create', async () => {
      const { getByText } = await renderSidebar();
      await waitFor(() => {
        expect(getByText('Templates').closest('a')).toHaveAttribute(
          'href',
          '/create',
        );
      });
    });

    it('shows "Task list" item linking to /create/tasks', async () => {
      const { getByText } = await renderSidebar();
      await waitFor(() => {
        expect(getByText('Task list').closest('a')).toHaveAttribute(
          'href',
          '/create/tasks',
        );
      });
    });

    it('shows "Self Service" item linking to /self-service-flow', async () => {
      const { getByText } = await renderSidebar();
      await waitFor(() => {
        expect(getByText('Self Service').closest('a')).toHaveAttribute(
          'href',
          '/self-service-flow',
        );
      });
    });

    it('shows "Import..." item linking to /import-flow', async () => {
      const { getByText } = await renderSidebar();
      await waitFor(() => {
        expect(getByText('Import...').closest('a')).toHaveAttribute(
          'href',
          '/import-flow',
        );
      });
    });

    it('shows "Register..." item linking to /catalog-import', async () => {
      const { getByText } = await renderSidebar();
      await waitFor(() => {
        expect(getByText('Register...').closest('a')).toHaveAttribute(
          'href',
          '/catalog-import',
        );
      });
    });
  });

  describe('Route-based highlighting with Advanced View enabled', () => {
    beforeEach(() => {
      localStorage.setItem(ADVANCED_VIEW_KEY, 'true');
    });

    it('on /create/tasks - "Task list" is not suppressed (no itemNotSelected class)', async () => {
      const { getByText } = await renderSidebar('/create/tasks');
      await waitFor(() => {
        const taskListAnchor = getByText('Task list').closest('a');
        expect(taskListAnchor?.className).not.toMatch(/itemNotSelected/);
      });
    });

    it('on /create/tasks - "Templates" has itemNotSelected class to suppress its highlight', async () => {
      const { getByText } = await renderSidebar('/create/tasks');
      await waitFor(() => {
        const templatesAnchor = getByText('Templates').closest('a');
        expect(templatesAnchor?.className).toMatch(/itemNotSelected/);
      });
    });

    it('on /create - "Templates" does not have itemNotSelected class', async () => {
      const { getByText } = await renderSidebar('/create');
      await waitFor(() => {
        const templatesAnchor = getByText('Templates').closest('a');
        expect(templatesAnchor?.className).not.toMatch(/itemNotSelected/);
      });
    });

    it('on /create - "Task list" has itemNotSelected class to suppress its highlight', async () => {
      const { getByText } = await renderSidebar('/create');
      await waitFor(() => {
        const taskListAnchor = getByText('Task list').closest('a');
        expect(taskListAnchor?.className).toMatch(/itemNotSelected/);
      });
    });

    it('on /create/edit - "Templates" does not have itemNotSelected class (prefix match)', async () => {
      const { getByText } = await renderSidebar('/create/edit');
      await waitFor(() => {
        const templatesAnchor = getByText('Templates').closest('a');
        expect(templatesAnchor?.className).not.toMatch(/itemNotSelected/);
      });
    });

    it('on /create/edit - "Task list" has itemNotSelected class', async () => {
      const { getByText } = await renderSidebar('/create/edit');
      await waitFor(() => {
        const taskListAnchor = getByText('Task list').closest('a');
        expect(taskListAnchor?.className).toMatch(/itemNotSelected/);
      });
    });
  });

  describe('Run-page highlighting (/create/templates/...) with Advanced View enabled', () => {
    beforeEach(() => {
      localStorage.setItem(ADVANCED_VIEW_KEY, 'true');
    });

    it('on an import-flow run - suppresses "Templates" and force-selects "Import..."', async () => {
      const { getByText } = await renderSidebar(
        '/create/templates/default/import-tpl',
      );
      await waitFor(() => {
        expect(getByText('Templates').closest('a')?.className).toMatch(
          /itemNotSelected/,
        );
        expect(getByText('Import...').closest('a')?.className).toMatch(
          /itemSelected/,
        );
      });
    });

    it('on a self-service run - suppresses "Templates" and force-selects "Self Service"', async () => {
      const { getByText } = await renderSidebar(
        '/create/templates/default/selfservice-tpl',
      );
      await waitFor(() => {
        expect(getByText('Templates').closest('a')?.className).toMatch(
          /itemNotSelected/,
        );
        expect(getByText('Self Service').closest('a')?.className).toMatch(
          /itemSelected/,
        );
      });
    });

    it('on a marketplace run - suppresses "Templates" and force-selects "Marketplace"', async () => {
      const { getByText } = await renderSidebar(
        '/create/templates/default/marketplace-tpl',
      );
      await waitFor(() => {
        expect(getByText('Templates').closest('a')?.className).toMatch(
          /itemNotSelected/,
        );
        expect(getByText('Marketplace').closest('a')?.className).toMatch(
          /itemSelected/,
        );
      });
    });

    it('on a plain template run - does not suppress "Templates"', async () => {
      const { getByText } = await renderSidebar(
        '/create/templates/default/plain-tpl',
      );
      await waitFor(() => {
        expect(getByText('Templates').closest('a')?.className).not.toMatch(
          /itemNotSelected/,
        );
      });
    });

    it('on a run whose template lookup resolves undefined - falls back to plain template highlight', async () => {
      const { getByText } = await renderSidebar(
        '/create/templates/default/missing-tpl',
      );
      // Not found -> fall back to the neutral "template" kind, so Templates is
      // highlighted normally rather than being left blank.
      await waitFor(() => {
        expect(getByText('Templates').closest('a')?.className).not.toMatch(
          /itemNotSelected/,
        );
      });
    });
  });

  describe('Advanced View toggle reactivity', () => {
    it('updates sidebar when localStorage changes and custom event fires', async () => {
      const { queryByText, getByText } = await renderSidebar();

      await waitFor(() => {
        expect(getByText('Develop...')).toBeInTheDocument();
        expect(queryByText('Task list')).not.toBeInTheDocument();
      });

      // Simulate the toggle being switched on from another component
      localStorage.setItem(ADVANCED_VIEW_KEY, 'true');
      window.dispatchEvent(new Event('devhub-advanced-view-change'));

      await waitFor(() => {
        expect(queryByText('Develop...')).not.toBeInTheDocument();
        expect(getByText('Task list')).toBeInTheDocument();
      });
    });

    it('reverts sidebar when toggle is switched back off', async () => {
      localStorage.setItem(ADVANCED_VIEW_KEY, 'true');

      const { queryByText, getByText } = await renderSidebar();

      await waitFor(() => {
        expect(getByText('Task list')).toBeInTheDocument();
      });

      // Simulate toggle switched off
      localStorage.setItem(ADVANCED_VIEW_KEY, 'false');
      window.dispatchEvent(new Event('devhub-advanced-view-change'));

      await waitFor(() => {
        expect(queryByText('Task list')).not.toBeInTheDocument();
        expect(getByText('Develop...')).toBeInTheDocument();
      });
    });
  });
});
