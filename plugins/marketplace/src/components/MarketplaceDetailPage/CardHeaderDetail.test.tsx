/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { screen } from '@testing-library/react';
import { CardHeaderDetail } from './CardHeaderDetail';
import { MarketplaceEntity } from '../MarketplaceListPage/MarketplaceListPage';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('CardHeaderDetail Component', () => {
  const mockTemplate: MarketplaceEntity = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'test-template',
      title: 'Test Template Title',
      'tibco.developer.hub/marketplace': { isNew: true },
    },
    spec: {
      type: 'template',
      steps: [],
    },
    installed: false,
  };
  const mockCatalogApi = catalogApiMock({
    entities: [],
  });
  it('renders the category text correctly', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Template')).toBeInTheDocument();
  });

  it('renders the "New" icon when the template is marked as new', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByAltText('new-logo')).toBeInTheDocument();
  });

  it('renders the "Installed" text and icon when the template is installed', async () => {
    const installedTemplate = { ...mockTemplate, installed: true };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={installedTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByAltText('new-logo')).toBeInTheDocument();
  });

  it('renders the header image with correct background and icon based on template type', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    const headerImage = screen.getByAltText('template');
    expect(headerImage).toBeInTheDocument();
  });

  it('does not render owned by relations when none are available', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={mockTemplate} />
      </TestApiProvider>,
    );
    expect(
      screen.queryByTestId('marketplace-card-actions--ownedby'),
    ).not.toBeInTheDocument();
  });

  it('renders artificial-intelligence type correctly with proper formatting', async () => {
    const aiAgentTemplate = {
      ...mockTemplate,
      spec: {
        type: 'artificial-intelligence',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={aiAgentTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
    expect(screen.getByAltText('artificial-intelligence')).toBeInTheDocument();
  });

  it('renders Import Flow type correctly with proper formatting', async () => {
    const importFlowTemplate = {
      ...mockTemplate,
      spec: {
        type: 'import-flow',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={importFlowTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Import Flow')).toBeInTheDocument();
    expect(screen.getByAltText('import-flow')).toBeInTheDocument();
  });

  it('renders Sample type correctly with proper formatting', async () => {
    const sampleTemplate = {
      ...mockTemplate,
      spec: {
        type: 'sample',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={sampleTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.getByAltText('sample')).toBeInTheDocument();
  });

  it('renders Document type correctly with proper formatting', async () => {
    const documentTemplate = {
      ...mockTemplate,
      spec: {
        type: 'document',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={documentTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByAltText('document')).toBeInTheDocument();
  });

  it('handles unknown types by using blank icon and fallback formatting', async () => {
    const unknownTemplate = {
      ...mockTemplate,
      spec: {
        type: 'custom-widget',
        steps: [],
      },
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={unknownTemplate} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Custom Widget')).toBeInTheDocument();
    expect(screen.getByAltText('custom-widget')).toBeInTheDocument();
  });

  it('renders remove button when template is installed and has entityRef', async () => {
    const installedTemplateWithRef = {
      ...mockTemplate,
      installed: true,
      entityRef: 'template:default/test-template',
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={installedTemplateWithRef} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(
      screen.getByTestId('marketplace-uninstall-button'),
    ).toBeInTheDocument();
  });

  it('does not render remove button when template is installed but has no entityRef', async () => {
    const installedTemplateWithoutRef = {
      ...mockTemplate,
      installed: true,
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={installedTemplateWithoutRef} />
      </TestApiProvider>,
    );
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(
      screen.queryByTestId('marketplace-uninstall-button'),
    ).not.toBeInTheDocument();
  });

  it('does not render "New" icon when template is not marked as new', async () => {
    const templateNotNew = {
      ...mockTemplate,
      metadata: {
        ...mockTemplate.metadata,
        'tibco.developer.hub/marketplace': { isNew: false },
      },
    };
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, mockApis.permission()],
          [catalogApiRef, mockCatalogApi],
        ]}
      >
        <CardHeaderDetail template={templateNotNew} />
      </TestApiProvider>,
    );
    expect(screen.queryByAltText('new-logo')).not.toBeInTheDocument();
  });
});
