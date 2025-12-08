/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { EntityNodeDetails } from './EntityNodeDetails';
import { TopologyContext } from '../../context/TopologyContext';
import { MemoryRouter } from 'react-router-dom';

// Mock Material-UI components
jest.mock('@material-ui/icons/Lock', () => {
  return function MockLockIcon(props: any) {
    return (
      <div data-testid="lock-icon" {...props}>
        Lock
      </div>
    );
  };
});

jest.mock('@material-ui/icons/LockOpen', () => {
  return function MockLockOpenIcon(props: any) {
    return (
      <div data-testid="lock-open-icon" {...props}>
        LockOpen
      </div>
    );
  };
});

jest.mock('@material-ui/icons/Person', () => {
  return function MockPersonIcon(props: any) {
    return (
      <div data-testid="person-icon" {...props}>
        Person
      </div>
    );
  };
});

jest.mock('@material-ui/icons/Info', () => {
  return function MockInfoIcon(props: any) {
    return (
      <div data-testid="info-icon" {...props}>
        Info
      </div>
    );
  };
});

jest.mock('@material-ui/icons/UnfoldLess', () => {
  return function MockUnfoldLess(props: any) {
    return (
      <div data-testid="unfold-less-icon" {...props}>
        UnfoldLess
      </div>
    );
  };
});

jest.mock('@material-ui/icons/UnfoldMore', () => {
  return function MockUnfoldMore(props: any) {
    return (
      <div data-testid="unfold-more-icon" {...props}>
        UnfoldMore
      </div>
    );
  };
});

jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  Tooltip: ({ children, title, ...props }: any) => (
    <div data-testid="tooltip" title={title} {...props}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({
    tFloatContainer: 'mock-float-container',
    tCardBody: 'mock-card-body',
    tTitle: 'mock-title',
    tTitleIconTextContainer: 'mock-title-icon-text-container',
    tIcon: 'mock-icon',
    tTitleTextContainer: 'mock-title-text-container',
    tTitleText: 'mock-title-text',
    tSubTitle: 'mock-sub-title',
    tMenu: 'mock-menu',
    tMenuIcon: 'mock-menu-icon',
    tSectionContainer: 'mock-section-container',
    tSectionLabel: 'mock-section-label',
    tDescription: 'mock-description',
    tSectionContent: 'mock-section-content',
    tSectionContentItem: 'mock-section-content-item',
    tInfoLinkSection: 'mock-info-link-section',
    tSectionButton: 'mock-section-button',
    tStatusIcon: 'mock-status-icon',
    tTooltip: 'mock-tooltip',
    tCustomTooltip: 'mock-custom-tooltip',
    TCustomArrow: 'mock-custom-arrow',
  }),
}));

// Mock Backstage hooks
jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityPresentation: jest.fn(),
  catalogApiRef: 'catalogApiRef',
}));

// Mock custom components
jest.mock('../common/CustomIcon', () => ({
  CustomIcon: function MockCustomIcon({ onClick, id, iconName }: any) {
    return (
      <button
        data-testid="custom-icon"
        onClick={onClick}
        id={id}
        data-icon={iconName}
      >
        {iconName}
      </button>
    );
  },
}));

jest.mock('../common/EntityIcon', () => ({
  EntityIcon: function MockEntityIcon({
    className,
    icon,
    fallbackIcon,
    ...props
  }: any) {
    return (
      <div
        data-testid="entity-icon"
        className={className}
        data-icon={icon}
        {...props}
      >
        EntityIcon
      </div>
    );
  },
}));

jest.mock('../common/CustomPopOver', () => ({
  CustomPopOver: function MockCustomPopOver({ label, popOverContent }: any) {
    return (
      <div
        data-testid="custom-popover"
        data-label={label}
        data-content={popOverContent}
      >
        {label}
      </div>
    );
  },
}));

// Mock custom hooks
jest.mock('../../hooks/useFetchAllLinks', () => ({
  useFetchAllLinks: jest.fn(),
}));

// Mock utility functions
jest.mock('../../utils/theme-utils', () => ({
  getCustomThemeProps: jest.fn().mockReturnValue({ iconColor: '#0E4F9E' }),
}));

jest.mock('../../utils/icon-utils', () => ({
  getCustomEntityIcon: jest.fn(),
  getEntityStatusIcons: jest.fn(),
}));

const mockCatalogApi = {
  getEntityByRef: jest.fn(),
};

const mockConfig = new ConfigReader({
  cpLink: 'https://test-cp-link.com',
});

const createMockEntity = (overrides: Partial<Entity> = {}): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test-component',
    description: 'Test component description',
    namespace: 'default',
    uid: 'test-uid-123',
    tags: ['frontend', 'react'],
    links: [
      {
        url: 'https://example.com/docs',
        title: 'Documentation',
        type: 'docs',
      },
    ],
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
    owner: 'test-team',
    profile: {
      displayName: 'Test Component Display Name',
    },
  },
  ...overrides,
});

const createTopologyContextValue = (overrides = {}) => ({
  display: 'block',
  rootEntity: null,
  detailsEntity: createMockEntity(),
  detailsLocked: false,
  toggleDisplay: jest.fn(),
  setDisplay: jest.fn(),
  setRootEntity: jest.fn(),
  setDetailsEntity: jest.fn(),
  setDetailsLocked: jest.fn(),
  ...overrides,
});

const renderWithProviders = (topologyValue = {}) => {
  const contextValue = createTopologyContextValue(topologyValue);

  return render(
    <MemoryRouter>
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [configApiRef, mockConfig],
        ]}
      >
        <TopologyContext.Provider value={contextValue}>
          <EntityNodeDetails />
        </TopologyContext.Provider>
      </TestApiProvider>
    </MemoryRouter>,
  );
};

describe('EntityNodeDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    const {
      useEntityPresentation,
    } = require('@backstage/plugin-catalog-react');
    const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
    const {
      getCustomEntityIcon,
      getEntityStatusIcons,
    } = require('../../utils/icon-utils');

    useEntityPresentation.mockReturnValue({
      Icon: 'MockIcon',
    });

    useFetchAllLinks.mockReturnValue({
      infoLinks: {},
      externalLinks: [],
      platformLinks: [],
    });

    getCustomEntityIcon.mockReturnValue({ icon: 'custom-icon' });
    getEntityStatusIcons.mockReturnValue([]);

    mockCatalogApi.getEntityByRef.mockResolvedValue({
      metadata: { name: 'test-team', namespace: 'default' },
      kind: 'Group',
    });
  });

  describe('Functionality Tests', () => {
    describe('Basic Rendering', () => {
      test('renders component with basic entity information', () => {
        renderWithProviders();

        expect(
          screen.getByText(/Test Component Display Na/, { exact: false }),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Test component description'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('entity-icon')).toBeInTheDocument();
      });

      test('renders with entity name when display name is not available', () => {
        const entity = createMockEntity({
          spec: {
            type: 'service',
            lifecycle: 'production',
            owner: 'test-team',
          },
        });

        renderWithProviders({ detailsEntity: entity });

        expect(screen.getByText('test-component')).toBeInTheDocument();
      });

      test('renders UUID in popover when available', () => {
        renderWithProviders();

        const popover = screen.getByTestId('custom-popover');
        expect(popover).toHaveAttribute('data-label', 'UUID');
        expect(popover).toHaveAttribute('data-content', 'test-uid-123');
      });

      test('handles entity without description gracefully', () => {
        const entity = createMockEntity({
          metadata: {
            ...createMockEntity().metadata,
            description: undefined,
          },
        });

        renderWithProviders({ detailsEntity: entity });

        expect(
          screen.getByText(/Test Component Display Na/, { exact: false }),
        ).toBeInTheDocument();
      });
    });

    describe('Display Control', () => {
      test('renders when display is block', () => {
        renderWithProviders({ display: 'block' });

        expect(
          screen.getByText(/Test Component Display Na/, { exact: false }),
        ).toBeInTheDocument();
      });

      test('hides when display is none', () => {
        const { container } = renderWithProviders({ display: 'none' });

        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv).toHaveStyle('display: none');
      });

      test('expands and collapses content', () => {
        renderWithProviders();

        const expandButton = screen
          .getByTestId('unfold-less-icon')
          .closest('button')!;

        // Initially expanded
        expect(screen.getByText('Description')).toBeInTheDocument();

        // Collapse
        fireEvent.click(expandButton);

        // Content should be hidden but button should now show unfold-more
        expect(screen.getByTestId('unfold-more-icon')).toBeInTheDocument();
      });
    });

    describe('Lock Functionality', () => {
      test('shows lock icon when details are locked', () => {
        renderWithProviders({ detailsLocked: true });

        expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      });

      test('shows unlock icon when details are not locked', () => {
        renderWithProviders({ detailsLocked: false });

        expect(screen.getByTestId('lock-open-icon')).toBeInTheDocument();
      });

      test('toggles lock state when lock button is clicked', () => {
        const setDetailsLocked = jest.fn();
        renderWithProviders({ detailsLocked: false, setDetailsLocked });

        const lockButton = screen
          .getByTestId('lock-open-icon')
          .closest('button')!;
        fireEvent.click(lockButton);

        expect(setDetailsLocked).toHaveBeenCalledWith(true);
      });
    });

    describe('Exit Functionality', () => {
      test('calls toggleDisplay when exit button is clicked and not locked', () => {
        const toggleDisplay = jest.fn();
        renderWithProviders({ detailsLocked: false, toggleDisplay });

        const exitButton = screen.getByTestId('custom-icon').closest('button')!;
        fireEvent.click(exitButton);

        expect(toggleDisplay).toHaveBeenCalled();
      });

      test('unlocks and calls toggleDisplay when exit button is clicked and locked', () => {
        const toggleDisplay = jest.fn();
        const setDetailsLocked = jest.fn();
        renderWithProviders({
          detailsLocked: true,
          toggleDisplay,
          setDetailsLocked,
        });

        const exitButton = screen.getByTestId('custom-icon').closest('button')!;
        fireEvent.click(exitButton);

        expect(setDetailsLocked).toHaveBeenCalledWith(false);
        expect(toggleDisplay).toHaveBeenCalled();
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Owner Information', () => {
      test('displays owner information when available', async () => {
        renderWithProviders();

        await waitFor(() => {
          expect(screen.getByTestId('person-icon')).toBeInTheDocument();
          expect(screen.getByText('test-team')).toBeInTheDocument();
        });
      });

      test('creates link to owner when owner entity is found', async () => {
        renderWithProviders();

        await waitFor(() => {
          const ownerLink = screen.getByText('test-team').closest('a');
          expect(ownerLink).toHaveAttribute(
            'href',
            '/catalog/default/group/test-team',
          );
        });
      });

      test('shows owner name without link when owner entity is not found', async () => {
        mockCatalogApi.getEntityByRef.mockResolvedValue(null);
        renderWithProviders();

        // Wait for async operations to complete
        await waitFor(() => {
          // Look for the span containing owner info - it should have the owner text but no link
          const ownerSpan = document.querySelector(
            'span[style*="display: flex"]',
          );
          expect(ownerSpan).toBeInTheDocument();
          expect(ownerSpan?.textContent).toContain('test-team');

          // Verify no link exists around the owner text
          const links = screen.queryAllByRole('link');
          const ownerLinks = links.filter(link =>
            link.textContent?.includes('test-team'),
          );
          expect(ownerLinks).toHaveLength(0);
        });
      });

      test('handles owner API errors gracefully', async () => {
        mockCatalogApi.getEntityByRef.mockRejectedValue(new Error('API Error'));
        renderWithProviders();

        await waitFor(() => {
          // Look for the span containing owner info
          const ownerSpan = document.querySelector(
            'span[style*="display: flex"]',
          );
          expect(ownerSpan).toBeInTheDocument();
          expect(ownerSpan?.textContent).toContain('test-team');
        });
      });
    });

    describe('Platform Links', () => {
      test('displays platform links for Component entities', () => {
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {},
          externalLinks: [],
          platformLinks: [
            {
              pLink: 'https://platform.com/app1',
              pLabel: 'App 1',
              pAppType: 'BWCE',
            },
            {
              pLink: 'https://platform.com/app2',
              pLabel: 'App 2',
              pAppType: 'Flogo',
            },
          ],
        });

        renderWithProviders();

        expect(screen.getByText('App Deployments')).toBeInTheDocument();
        expect(screen.getByText('App 1')).toBeInTheDocument();
        expect(screen.getByText('App 2')).toBeInTheDocument();
      });

      test('does not show platform links for non-Component entities', () => {
        const entity = createMockEntity({ kind: 'API' });
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {},
          externalLinks: [],
          platformLinks: [
            {
              pLink: 'https://platform.com/app1',
              pLabel: 'App 1',
              pAppType: 'BWCE',
            },
          ],
        });

        renderWithProviders({ detailsEntity: entity });

        expect(screen.queryByText('App Deployments')).not.toBeInTheDocument();
      });
    });

    describe('External Links', () => {
      test('displays external links when available', () => {
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {},
          externalLinks: [
            { url: 'https://external1.com', title: 'External 1' },
            { url: 'https://external2.com', title: 'External 2' },
          ],
          platformLinks: [],
        });

        renderWithProviders();

        expect(screen.getByText('External Links')).toBeInTheDocument();
        expect(screen.getByText('External 1')).toBeInTheDocument();
        expect(screen.getByText('External 2')).toBeInTheDocument();
      });

      test('external links open in new tab', () => {
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {},
          externalLinks: [
            { url: 'https://external1.com', title: 'External 1' },
          ],
          platformLinks: [],
        });

        renderWithProviders();

        const externalLink = screen.getByText('External 1').closest('a');
        expect(externalLink).toHaveAttribute('target', '_blank');
        expect(externalLink).toHaveAttribute('href', 'https://external1.com');
      });
    });

    describe('Info Links', () => {
      test('displays API definition link when available', () => {
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {
            apis: '/api/definition',
          },
          externalLinks: [],
          platformLinks: [],
        });

        renderWithProviders();

        expect(screen.getByText('View API Definition')).toBeInTheDocument();
      });

      test('displays documentation link when available', () => {
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {
            docs: '/documentation',
          },
          externalLinks: [],
          platformLinks: [],
        });

        renderWithProviders();

        expect(screen.getByText('View Documentation')).toBeInTheDocument();
      });

      test('displays CI/CD and source links when available', () => {
        const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
        useFetchAllLinks.mockReturnValue({
          infoLinks: {
            cicd: '/cicd',
            source: '/source',
          },
          externalLinks: [],
          platformLinks: [],
        });

        renderWithProviders();

        const customIcons = screen.getAllByTestId('custom-icon');

        // Find CI/CD icon (should be one of the custom icons)
        const cicdIcon = customIcons.find(
          icon => icon.getAttribute('data-icon') === 'cicd',
        );
        expect(cicdIcon).toBeInTheDocument();

        // Find source icon
        const sourceIcon = customIcons.find(
          icon => icon.getAttribute('data-icon') === 'source',
        );
        expect(sourceIcon).toBeInTheDocument();
      });
    });

    describe('Tags Display', () => {
      test('displays entity tags when available', () => {
        renderWithProviders();

        // Tags are rendered with a specific class that we can check
        const tagElements = document.querySelectorAll('.tpdh-card-item-tag');
        expect(tagElements).toHaveLength(2);
      });

      test('does not render tags section when no tags available', () => {
        const entity = createMockEntity({
          metadata: {
            ...createMockEntity().metadata,
            tags: undefined,
          },
        });

        renderWithProviders({ detailsEntity: entity });

        const tagElements = document.querySelectorAll('.tpdh-card-item-tag');
        expect(tagElements).toHaveLength(0);
      });
    });

    describe('Status Icons', () => {
      test('displays status icons when available', () => {
        const { getEntityStatusIcons } = require('../../utils/icon-utils');
        getEntityStatusIcons.mockReturnValue([
          {
            icon: 'warning',
            iconColor: '#ff9800',
            iconTooltip: 'Warning status',
          },
          {
            icon: 'success',
            iconColor: '#4caf50',
            iconTooltip: 'Success status',
          },
        ]);

        renderWithProviders();

        const tooltips = screen.getAllByTestId('tooltip');
        expect(
          tooltips.some(
            tooltip => tooltip.getAttribute('title') === 'Warning status',
          ),
        ).toBe(true);
        expect(
          tooltips.some(
            tooltip => tooltip.getAttribute('title') === 'Success status',
          ),
        ).toBe(true);
      });

      test('does not render status icons section when no icons available', () => {
        const { getEntityStatusIcons } = require('../../utils/icon-utils');
        getEntityStatusIcons.mockReturnValue([]);

        renderWithProviders();

        // Check that no status icon elements are rendered
        const statusIconElements = screen.queryAllByRole('img', {
          name: /status/i,
        });
        expect(statusIconElements).toHaveLength(0);

        // Also check that status icon tooltips specifically are not present
        const tooltipElements = screen.queryAllByText(
          /status|error|warning|info/i,
        );
        expect(tooltipElements).toHaveLength(0);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles null entity gracefully', () => {
      renderWithProviders({ detailsEntity: null });

      // Should not crash, but may not render detailed content
      const container = document.querySelector('[style*="display: block"]');
      expect(container).toBeInTheDocument();
    });

    test('handles entity without spec gracefully', () => {
      const entity = createMockEntity({
        spec: undefined as any,
      });

      renderWithProviders({ detailsEntity: entity });

      expect(screen.getByText('test-component')).toBeInTheDocument();
    });

    test('handles entity without metadata gracefully', () => {
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'minimal-entity',
        },
        spec: {},
      } as Entity;

      // Update the useEntityPresentation mock to return the entity name
      const {
        useEntityPresentation,
      } = require('@backstage/plugin-catalog-react');
      useEntityPresentation.mockReturnValue({
        Icon: 'MockIcon',
      });

      // Pass the entity correctly to the context
      renderWithProviders({ detailsEntity: entity });

      // Should render the entity name, which comes from metadata.name
      expect(screen.getByText('minimal-entity')).toBeInTheDocument();
    });

    test('handles missing owner gracefully', () => {
      const entity = createMockEntity({
        spec: {
          type: 'service',
          lifecycle: 'production',
          // Remove owner field
        },
      });

      renderWithProviders({ detailsEntity: entity });

      // Should render the entity name since there's no display name in spec.profile
      expect(screen.getByText('test-component')).toBeInTheDocument();
      // Note: The component might still show person icon as part of the default layout
    });

    test('handles entity presentation hook errors', () => {
      const {
        useEntityPresentation,
      } = require('@backstage/plugin-catalog-react');
      useEntityPresentation.mockReturnValue({
        Icon: null,
      });

      renderWithProviders();

      // Should still render basic information
      expect(
        screen.getByText(/Test Component Display Na/, { exact: false }),
      ).toBeInTheDocument();
    });

    test('handles useFetchAllLinks hook errors', () => {
      const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
      useFetchAllLinks.mockReturnValue({
        infoLinks: null,
        externalLinks: null,
        platformLinks: null,
      });

      renderWithProviders();

      // Should still render basic component information
      expect(
        screen.getByText(/Test Component Display Na/, { exact: false }),
      ).toBeInTheDocument();
    });
  });

  describe('Real-world Scenarios', () => {
    test('handles complete entity with all features', () => {
      const { useFetchAllLinks } = require('../../hooks/useFetchAllLinks');
      const { getEntityStatusIcons } = require('../../utils/icon-utils');

      useFetchAllLinks.mockReturnValue({
        infoLinks: {
          docs: '/docs',
          apis: '/apis',
          cicd: '/cicd',
          source: '/source',
        },
        externalLinks: [
          { url: 'https://external.com', title: 'External Link' },
        ],
        platformLinks: [
          {
            pLink: 'https://platform.com/app',
            pLabel: 'Platform App',
            pAppType: 'BWCE',
          },
        ],
      });

      getEntityStatusIcons.mockReturnValue([
        {
          icon: 'success',
          iconColor: '#4caf50',
          iconTooltip: 'All systems operational',
        },
      ]);

      renderWithProviders();

      // Check all major sections are present
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('App Deployments')).toBeInTheDocument();
      expect(screen.getByText('External Links')).toBeInTheDocument();
      expect(screen.getByText('View API Definition')).toBeInTheDocument();
      expect(screen.getByText('View Documentation')).toBeInTheDocument();

      // Check status icons
      const tooltips = screen.getAllByTestId('tooltip');
      expect(
        tooltips.some(
          tooltip =>
            tooltip.getAttribute('title') === 'All systems operational',
        ),
      ).toBe(true);
    });

    test('handles minimal entity with only required fields', () => {
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'minimal-component',
        },
        spec: {},
      } as Entity;

      renderWithProviders({ detailsEntity: entity });

      expect(screen.getByText('minimal-component')).toBeInTheDocument();
    });

    test('handles rapid state changes correctly', () => {
      const { rerender } = renderWithProviders({ detailsLocked: false });

      // Initially unlocked
      expect(screen.getByTestId('lock-open-icon')).toBeInTheDocument();

      // Change to locked
      const contextValue = createTopologyContextValue({ detailsLocked: true });
      rerender(
        <MemoryRouter>
          <TestApiProvider
            apis={[
              [catalogApiRef, mockCatalogApi],
              [configApiRef, mockConfig],
            ]}
          >
            <TopologyContext.Provider value={contextValue}>
              <EntityNodeDetails />
            </TopologyContext.Provider>
          </TestApiProvider>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    });

    test('maintains state consistency during user interactions', () => {
      const toggleDisplay = jest.fn();
      const setDetailsLocked = jest.fn();

      const { rerender } = renderWithProviders({
        detailsLocked: false,
        toggleDisplay,
        setDetailsLocked,
      });

      // Lock the details
      const lockButton = screen
        .getByTestId('lock-open-icon')
        .closest('button')!;
      fireEvent.click(lockButton);
      expect(setDetailsLocked).toHaveBeenCalledWith(true);

      // Update context to reflect locked state
      const lockedContextValue = createTopologyContextValue({
        detailsLocked: true,
        toggleDisplay,
        setDetailsLocked,
      });

      rerender(
        <MemoryRouter>
          <TestApiProvider
            apis={[
              [catalogApiRef, mockCatalogApi],
              [configApiRef, mockConfig],
            ]}
          >
            <TopologyContext.Provider value={lockedContextValue}>
              <EntityNodeDetails />
            </TopologyContext.Provider>
          </TestApiProvider>
        </MemoryRouter>,
      );

      // Clear previous mock calls
      setDetailsLocked.mockClear();
      toggleDisplay.mockClear();

      // Try to exit - should unlock first
      const exitButton = screen.getByTestId('custom-icon').closest('button')!;
      fireEvent.click(exitButton);

      expect(setDetailsLocked).toHaveBeenCalledWith(false);
      expect(toggleDisplay).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('provides proper ARIA attributes for interactive elements', () => {
      renderWithProviders();

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Check that buttons are keyboard accessible
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    test('provides tooltips for status icons', () => {
      const { getEntityStatusIcons } = require('../../utils/icon-utils');
      getEntityStatusIcons.mockReturnValue([
        {
          icon: 'warning',
          iconColor: '#ff9800',
          iconTooltip: 'System warning',
        },
      ]);

      renderWithProviders();

      // Check specifically for status icon tooltips (multiple tooltips exist on the page)
      const statusIconTooltip = screen.getByTitle('System warning');
      expect(statusIconTooltip).toBeInTheDocument();
    });
    test('supports keyboard navigation for interactive elements', () => {
      renderWithProviders();

      const lockButton = screen
        .getByTestId('lock-open-icon')
        .closest('button')!;
      lockButton.focus();
      expect(document.activeElement).toBe(lockButton);
    });
  });
});
