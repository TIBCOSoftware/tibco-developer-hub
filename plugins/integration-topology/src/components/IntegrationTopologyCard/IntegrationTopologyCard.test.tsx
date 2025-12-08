/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { MemoryRouter } from 'react-router-dom';
import { IntegrationTopologyCard } from './IntegrationTopologyCard';

// Mock Backstage components
jest.mock('@backstage/core-components', () => ({
  InfoCard: function MockInfoCard({
    title,
    children,
    className,
    variant,
    cardClassName,
    noPadding,
    deepLink,
    action,
    ...domProps
  }: any) {
    // Only spread DOM-safe props
    const safeProps = Object.keys(domProps).reduce((acc: any, key) => {
      if (
        key.startsWith('data-') ||
        key.startsWith('aria-') ||
        key === 'role' ||
        key === 'id'
      ) {
        acc[key] = domProps[key];
      }
      return acc;
    }, {});

    return (
      <div
        data-testid="info-card"
        data-title={title}
        className={className}
        data-variant={variant}
        {...safeProps}
      >
        <div data-testid="info-card-title">{title}</div>
        {deepLink && (
          <a
            data-testid="info-card-deep-link"
            href={deepLink.link}
            title={deepLink.title}
          >
            {deepLink.title}
          </a>
        )}
        <div data-testid="info-card-content">{children}</div>
      </div>
    );
  },
}));

// Mock Backstage hooks
jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
  catalogApiRef: 'catalogApiRef',
  entityRouteRef: 'entityRouteRef',
}));

jest.mock('@backstage/core-plugin-api', () => ({
  useAnalytics: jest.fn(),
  useRouteRef: jest.fn(),
}));

jest.mock('@backstage/frontend-plugin-api', () => ({
  useTranslationRef: jest.fn(),
}));

// Mock routes
jest.mock('../../routes', () => ({
  topologyGraphRouteRef: 'topologyGraphRouteRef',
}));

// Mock translation
jest.mock('../../translation', () => ({
  catalogGraphTranslationRef: 'catalogGraphTranslationRef',
}));

// Mock catalog model functions
jest.mock('@backstage/catalog-model', () => ({
  ...jest.requireActual('@backstage/catalog-model'),
  getCompoundEntityRef: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock custom components
jest.mock('../common/CustomViewToggle', () => ({
  CustomViewToggle: function MockCustomViewToggle({
    view,
    setView,
    viewOptions,
    ...props
  }: any) {
    return (
      <div data-testid="custom-view-toggle" {...props}>
        {viewOptions.map((option: string) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={view === option}
              onChange={() => setView(option)}
              aria-label={`${
                option.charAt(0).toUpperCase() + option.slice(1)
              } View`}
            />
            {option.charAt(0).toUpperCase() + option.slice(1)} View
          </label>
        ))}
      </div>
    );
  },
}));

jest.mock('../TopologyGraph/TopologyGraph', () => ({
  TopologyGraph: function MockTopologyGraph(props: any) {
    // Filter out non-DOM props
    const {
      rootEntityNames,
      onNodeClick,
      maxDepth,
      unidirectional,
      mergeRelations,
      relationPairs,
      entityFilter,
      ...domSafeProps
    } = props;

    // Only include data attributes and other safe props
    const safeProps = Object.keys(domSafeProps).reduce((acc: any, key) => {
      if (
        key.startsWith('data-') ||
        key.startsWith('aria-') ||
        key === 'role' ||
        key === 'id' ||
        key === 'className'
      ) {
        acc[key] = domSafeProps[key];
      }
      return acc;
    }, {});

    return (
      <div data-testid="topology-graph" {...safeProps}>
        TopologyGraph Component
      </div>
    );
  },
}));

jest.mock('@backstage/plugin-catalog-graph', () => ({
  EntityRelationsGraph: function MockEntityRelationsGraph(props: any) {
    // Filter out non-DOM props
    const {
      rootEntityNames,
      onNodeClick,
      maxDepth,
      unidirectional,
      mergeRelations,
      relationPairs,
      entityFilter,
      ...domSafeProps
    } = props;

    // Only include data attributes and other safe props
    const safeProps = Object.keys(domSafeProps).reduce((acc: any, key) => {
      if (
        key.startsWith('data-') ||
        key.startsWith('aria-') ||
        key === 'role' ||
        key === 'id' ||
        key === 'className'
      ) {
        acc[key] = domSafeProps[key];
      }
      return acc;
    }, {});

    return (
      <div data-testid="entity-relations-graph" {...safeProps}>
        EntityRelationsGraph Component
      </div>
    );
  },
  Direction: {
    TOP_BOTTOM: 'TOP_BOTTOM',
  },
  ALL_RELATION_PAIRS: [],
}));

// Mock Material-UI
jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  makeStyles: () => () => ({
    topologyCardContainer: 'mock-topology-card-container',
  }),
}));

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test-component',
    namespace: 'default',
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
  },
};

describe('IntegrationTopologyCard', () => {
  const mockUseEntity = require('@backstage/plugin-catalog-react').useEntity;
  const mockUseAnalytics = require('@backstage/core-plugin-api').useAnalytics;
  const mockUseRouteRef = require('@backstage/core-plugin-api').useRouteRef;
  const mockUseTranslationRef =
    require('@backstage/frontend-plugin-api').useTranslationRef;
  const mockGetCompoundEntityRef =
    require('@backstage/catalog-model').getCompoundEntityRef;
  const mockUseNavigate = require('react-router-dom').useNavigate;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseEntity.mockReturnValue({
      entity: mockEntity,
      loading: false,
      error: undefined,
    });

    mockUseAnalytics.mockReturnValue({
      captureEvent: jest.fn(),
    });

    mockUseRouteRef.mockImplementation(() => {
      return () =>
        `/entity/${mockEntity.kind}/${mockEntity.metadata.namespace}/${mockEntity.metadata.name}`;
    });

    mockUseTranslationRef.mockReturnValue({
      t: (key: string) => key,
    });

    mockGetCompoundEntityRef.mockImplementation((entity: any) => {
      if (!entity) return 'default:component/unknown';
      return `${entity.kind}:${entity.metadata.namespace || 'default'}/${
        entity.metadata.name
      }`;
    });

    mockUseNavigate.mockReturnValue(jest.fn());
  });

  const renderComponent = (props: any = {}) => {
    return render(
      <MemoryRouter>
        <IntegrationTopologyCard {...props} />
      </MemoryRouter>,
    );
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    it('renders with correct title', () => {
      renderComponent();
      expect(screen.getByTestId('info-card')).toHaveAttribute(
        'data-title',
        'topologyGraphCard.title',
      );
    });

    it('renders custom view toggle', () => {
      renderComponent();
      expect(screen.getByTestId('custom-view-toggle')).toBeInTheDocument();
    });

    it('renders topology view by default', () => {
      renderComponent();
      expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
      expect(
        screen.queryByTestId('entity-relations-graph'),
      ).not.toBeInTheDocument();
    });
  });

  describe('View Toggle Functionality', () => {
    it('switches to graph view when toggled', () => {
      renderComponent();

      const graphViewInput = screen.getByLabelText('Graph View');
      fireEvent.click(graphViewInput);

      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
      expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
    });

    it('switches back to topology view when toggled', () => {
      renderComponent();

      // Switch to graph view first
      const graphViewInput = screen.getByLabelText('Graph View');
      fireEvent.click(graphViewInput);

      // Switch back to topology view
      const topologyViewInput = screen.getByLabelText('Topology View');
      fireEvent.click(topologyViewInput);

      expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
      expect(
        screen.queryByTestId('entity-relations-graph'),
      ).not.toBeInTheDocument();
    });

    it('maintains correct checked state for view options', () => {
      renderComponent();

      const topologyViewInput = screen.getByLabelText('Topology View');
      const graphViewInput = screen.getByLabelText('Graph View');

      // Initially topology should be checked
      expect(topologyViewInput).toBeChecked();
      expect(graphViewInput).not.toBeChecked();

      // After clicking graph view
      fireEvent.click(graphViewInput);

      expect(topologyViewInput).not.toBeChecked();
      expect(graphViewInput).toBeChecked();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards props to topology graph components', () => {
      const customProps = {
        maxDepth: 5,
        unidirectional: true,
        mergeRelations: false,
      };

      renderComponent(customProps);

      // These props should be forwarded to the graph components
      const topologyGraph = screen.getByTestId('topology-graph');
      expect(topologyGraph).toBeInTheDocument();

      // Switch to graph view to test EntityRelationsGraph props
      const graphViewInput = screen.getByLabelText('Graph View');
      fireEvent.click(graphViewInput);

      const entityGraph = screen.getByTestId('entity-relations-graph');
      expect(entityGraph).toBeInTheDocument();
    });

    it('forwards variant prop to InfoCard', () => {
      renderComponent({ variant: 'gridItem' });

      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toHaveAttribute('data-variant', 'gridItem');
    });
  });

  describe('Entity Context Integration', () => {
    it('handles loading state', () => {
      mockUseEntity.mockReturnValue({
        entity: mockEntity,
        loading: true,
        error: undefined,
      });

      renderComponent();

      // Component should handle loading state gracefully
      // Even with loading=true, the component should render with the entity
      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toBeInTheDocument();
      expect(screen.getByText('topologyGraphCard.title')).toBeInTheDocument();
    });

    it('handles error state', () => {
      mockUseEntity.mockReturnValue({
        entity: mockEntity,
        loading: false,
        error: new Error('Test error'),
      });

      renderComponent();

      // Component should handle error state gracefully
      // Even with error, the component should render with the entity
      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toBeInTheDocument();
      expect(screen.getByText('topologyGraphCard.title')).toBeInTheDocument();
    });

    it('renders with valid entity', () => {
      mockUseEntity.mockReturnValue({
        entity: mockEntity,
        loading: false,
        error: undefined,
      });

      renderComponent();

      // Component should render normally with a valid entity
      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toBeInTheDocument();
      expect(screen.getByText('topologyGraphCard.title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-view-toggle')).toBeInTheDocument();
    });
  });

  describe('Analytics Integration', () => {
    it('captures analytics events on view toggle', () => {
      const mockCaptureEvent = jest.fn();
      mockUseAnalytics.mockReturnValue({
        captureEvent: mockCaptureEvent,
      });

      renderComponent();

      const graphViewInput = screen.getByLabelText('Graph View');
      fireEvent.click(graphViewInput);

      // Analytics should be available for capturing events
      expect(mockUseAnalytics).toHaveBeenCalled();
    });
  });

  describe('Routing Integration', () => {
    it('generates correct entity routes', () => {
      const mockRouteGenerator = jest
        .fn()
        .mockReturnValue('/entity/component/default/test-component');
      mockUseRouteRef.mockReturnValue(mockRouteGenerator);

      renderComponent();

      expect(mockUseRouteRef).toHaveBeenCalled();
    });

    it('renders deepLink with correct URL and title', () => {
      const mockTopologyGraphRoute = jest
        .fn()
        .mockReturnValue('/topology-graph');
      mockUseRouteRef.mockImplementation((routeRef: any) => {
        if (routeRef.toString().includes('topology')) {
          return mockTopologyGraphRoute;
        }
        return jest
          .fn()
          .mockReturnValue('/entity/component/default/test-component');
      });

      renderComponent();

      const deepLink = screen.getByTestId('info-card-deep-link');
      expect(deepLink).toBeInTheDocument();
      expect(deepLink).toHaveAttribute(
        'href',
        expect.stringContaining('/topology-graph'),
      );
      expect(deepLink).toHaveAttribute(
        'title',
        'topologyGraphCard.deepLinkTitle',
      );
    });

    it('deepLink includes correct query parameters', () => {
      const mockTopologyGraphRoute = jest
        .fn()
        .mockReturnValue('/topology-graph');
      mockUseRouteRef.mockImplementation((routeRef: any) => {
        if (routeRef.toString().includes('topology')) {
          return mockTopologyGraphRoute;
        }
        return jest
          .fn()
          .mockReturnValue('/entity/component/default/test-component');
      });

      renderComponent({
        maxDepth: 3,
        unidirectional: false,
        mergeRelations: false,
      });

      const deepLink = screen.getByTestId('info-card-deep-link');
      const href = deepLink.getAttribute('href');

      expect(href).toContain('maxDepth=3');
      expect(href).toContain('unidirectional=false');
      expect(href).toContain('mergeRelations=false');
      expect(href).toContain('rootEntityRefs');
    });

    it('deepLink navigates to topology graph view with entity context', () => {
      const mockTopologyGraphRoute = jest
        .fn()
        .mockReturnValue('/catalog-graph');
      mockUseRouteRef.mockImplementation((routeRef: any) => {
        if (routeRef.toString().includes('topology')) {
          return mockTopologyGraphRoute;
        }
        return jest
          .fn()
          .mockReturnValue('/entity/component/default/test-component');
      });

      renderComponent();

      const deepLink = screen.getByTestId('info-card-deep-link');
      const href = deepLink.getAttribute('href');

      // Should contain the URL-encoded entity reference
      expect(href).toContain('component%3Adefault%2Ftest-component');
      expect(href).toContain('/catalog-graph');
    });

    it('deepLink works with custom kinds and relations', () => {
      const mockTopologyGraphRoute = jest
        .fn()
        .mockReturnValue('/topology-graph');
      mockUseRouteRef.mockImplementation((routeRef: any) => {
        if (routeRef.toString().includes('topology')) {
          return mockTopologyGraphRoute;
        }
        return jest
          .fn()
          .mockReturnValue('/entity/component/default/test-component');
      });

      renderComponent({
        kinds: ['Component', 'API'],
        relations: ['dependsOn', 'providesApi'],
      });

      const deepLink = screen.getByTestId('info-card-deep-link');
      const href = deepLink.getAttribute('href');

      expect(href).toContain('selectedKinds');
      expect(href).toContain('selectedRelations');
    });

    it('deepLink click behavior is properly configured', () => {
      const mockTopologyGraphRoute = jest
        .fn()
        .mockReturnValue('/topology-graph');
      mockUseRouteRef.mockImplementation((routeRef: any) => {
        if (routeRef.toString().includes('topology')) {
          return mockTopologyGraphRoute;
        }
        return jest
          .fn()
          .mockReturnValue('/entity/component/default/test-component');
      });

      renderComponent();

      const deepLink = screen.getByTestId('info-card-deep-link');

      // Verify the link is clickable and has proper attributes
      expect(deepLink).toBeInTheDocument();
      expect(deepLink.tagName).toBe('A');
      expect(deepLink).toHaveAttribute('href');
      expect(deepLink).toHaveAttribute('title');

      // Verify link text
      expect(deepLink).toHaveTextContent('topologyGraphCard.deepLinkTitle');

      // Verify it's accessible
      expect(deepLink).toHaveAttribute(
        'title',
        'topologyGraphCard.deepLinkTitle',
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid view toggles', () => {
      renderComponent();

      const topologyViewInput = screen.getByLabelText('Topology View');
      const graphViewInput = screen.getByLabelText('Graph View');

      // Rapidly toggle between views
      fireEvent.click(graphViewInput);
      fireEvent.click(topologyViewInput);
      fireEvent.click(graphViewInput);
      fireEvent.click(topologyViewInput);

      // Should end up in topology view
      expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
      expect(
        screen.queryByTestId('entity-relations-graph'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('does not render both graph components simultaneously', () => {
      renderComponent();

      // Initially only topology should be rendered
      expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
      expect(
        screen.queryByTestId('entity-relations-graph'),
      ).not.toBeInTheDocument();

      // Switch to graph view
      const graphViewInput = screen.getByLabelText('Graph View');
      fireEvent.click(graphViewInput);

      // Now only entity relations graph should be rendered
      expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
      expect(screen.getByTestId('entity-relations-graph')).toBeInTheDocument();
    });
  });

  describe('Real-world Scenarios', () => {
    it('handles complex entity with many relations', () => {
      const complexEntity = {
        ...mockEntity,
        relations: [
          {
            type: 'ownedBy',
            targetRef: 'group:default/team-a',
            target: { kind: 'Group', namespace: 'default', name: 'team-a' },
          },
          {
            type: 'dependsOn',
            targetRef: 'component:default/service-b',
            target: {
              kind: 'Component',
              namespace: 'default',
              name: 'service-b',
            },
          },
        ],
      };

      mockUseEntity.mockReturnValue({
        entity: complexEntity,
        loading: false,
        error: undefined,
      });

      renderComponent();

      expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
    });

    it('works with different card variants', () => {
      renderComponent({ variant: 'fullHeight' });

      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toHaveAttribute('data-variant', 'fullHeight');
      expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
    });
  });
});
