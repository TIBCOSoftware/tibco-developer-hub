/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  Entity,
  RELATION_HAS_PART,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntegrationTopologyPage } from './IntegrationTopologyPage';
import { GetEntitiesByRefsRequest } from '@backstage/catalog-client';
import { searchApiRef, MockSearchApi } from '@backstage/plugin-search-react';
import { SearchResult } from '@backstage/plugin-search-common';

// Mock the useFetchAllEntities hook
jest.mock('../../hooks/useFetchAllEntities', () => ({
  useFetchAllEntities: jest.fn(),
}));

const mockUseFetchAllEntities = require('../../hooks/useFetchAllEntities')
  .useFetchAllEntities as jest.MockedFunction<any>;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock components
jest.mock('react-draggable', () => ({
  __esModule: true,
  default: function MockDraggable({ children }: any) {
    return <div data-testid="draggable-component">{children}</div>;
  },
}));

jest.mock('../TopologyGraph/TopologyGraph', () => ({
  TopologyGraph: jest.fn(props => (
    <div
      data-testid="topology-graph"
      data-show-arrow-heads={props.showArrowHeads}
    >
      TopologyGraph Mock
    </div>
  )),
}));

jest.mock('@backstage/plugin-catalog-graph', () => ({
  EntityRelationsGraph: jest.fn(() => (
    <div data-testid="entity-relations-graph">EntityRelationsGraph Mock</div>
  )),
  Direction: { LEFT_RIGHT: 'LR' },
  ALL_RELATION_PAIRS: [],
}));

jest.mock('../EntityNodeDetails/EntityNodeDetails', () => ({
  EntityNodeDetails: jest.fn(() => (
    <div data-testid="entity-node-details">EntityNodeDetails Mock</div>
  )),
}));

// Mock filter components
jest.mock('./SelectedKindDropDown', () => ({
  SelectedKindDropDown: () => (
    <div data-testid="selected-kind-dropdown">Kind Filter</div>
  ),
}));

jest.mock('./SearchableDropDown', () => ({
  SearchableDropDown: () => (
    <div data-testid="searchable-dropdown">Entity Dropdown</div>
  ),
}));

jest.mock('./SearchByEntityName', () => ({
  SearchByEntityName: () => (
    <div data-testid="search-by-entity-name">Search Entity</div>
  ),
}));

jest.mock('./MaxDepthFilter', () => ({
  MaxDepthFilter: () => <div data-testid="max-depth-filter">Max Depth</div>,
}));

jest.mock('./SelectedKindsFilter', () => ({
  SelectedKindsFilter: () => (
    <div data-testid="selected-kinds-filter">Kinds Filter</div>
  ),
}));

jest.mock('./SelectedRelationsFilter', () => ({
  SelectedRelationsFilter: () => (
    <div data-testid="selected-relations-filter">Relations Filter</div>
  ),
}));

jest.mock('./DirectionFilter', () => ({
  DirectionFilter: () => (
    <div data-testid="direction-filter">Direction Filter</div>
  ),
}));

jest.mock('./CurveFilter', () => ({
  CurveFilter: () => <div data-testid="curve-filter">Curve Filter</div>,
}));

jest.mock('./SwitchFilter', () => ({
  SwitchFilter: ({ label }: any) => (
    <div data-testid="switch-filter">{label}</div>
  ),
}));

describe('IntegrationTopologyPage - Highlighted Code Block Tests', () => {
  const entityC = {
    apiVersion: 'a',
    kind: 'Component',
    metadata: { name: 'c', namespace: 'd' },
    relations: [
      {
        type: RELATION_PART_OF,
        targetRef: 'Component:d/e',
        target: { kind: 'Component', namespace: 'd', name: 'e' },
      },
    ],
  };

  const entityE = {
    apiVersion: 'a',
    kind: 'Component',
    metadata: { name: 'e', namespace: 'd' },
    relations: [
      {
        type: RELATION_HAS_PART,
        targetRef: 'Component:d/c',
        target: { kind: 'Component', namespace: 'd', name: 'c' },
      },
    ],
  };

  // Configure mock to return entities and kinds
  beforeEach(() => {
    mockUseFetchAllEntities.mockReturnValue({
      entities: [entityC, entityE],
      kinds: ['Component'],
      loading: false,
      error: null,
    });
  });

  const allEntities: Record<string, Entity> = {
    'Component:d/c': entityC,
    'Component:d/e': entityE,
  };

  const catalogApi = catalogApiMock.mock();
  catalogApi.getEntitiesByRefs.mockImplementation(
    async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
      items: entityRefs.map(ref => allEntities[ref]),
    }),
  );

  const mockSearchApi = new MockSearchApi({
    results: [
      { document: { title: 'c', text: 'c' } },
      { document: { title: 'e', text: 'e' } },
    ] as SearchResult[],
  });

  const wrapper = (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApi],
        [searchApiRef, mockSearchApi],
      ]}
    >
      <IntegrationTopologyPage />
    </TestApiProvider>
  );

  describe('Filter Section Conditional Rendering', () => {
    it('renders all filter components when showFilters is true', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('selected-kind-dropdown'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('searchable-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('search-by-entity-name')).toBeInTheDocument();
        expect(screen.getByTestId('max-depth-filter')).toBeInTheDocument();
        expect(screen.getByTestId('selected-kinds-filter')).toBeInTheDocument();
        expect(
          screen.getByTestId('selected-relations-filter'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('direction-filter')).toBeInTheDocument();
        expect(screen.getByTestId('curve-filter')).toBeInTheDocument();
      });
    });

    it('hides filter components when showFilters is false', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      const filtersButton = screen.getByRole('button', { name: /filters/i });
      await userEvent.click(filtersButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('selected-kind-dropdown'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('max-depth-filter'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Graph View Conditional Rendering', () => {
    it('renders TopologyGraph with showArrowHeads in topology view', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      await waitFor(() => {
        const topologyGraph = screen.getByTestId('topology-graph');
        expect(topologyGraph).toBeInTheDocument();
        expect(topologyGraph).toHaveAttribute('data-show-arrow-heads', 'true');
        expect(
          screen.queryByTestId('entity-relations-graph'),
        ).not.toBeInTheDocument();
      });
    });

    it('renders EntityRelationsGraph in graph view', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      const graphViewInput = screen.getByLabelText('Graph View');
      await userEvent.click(graphViewInput);

      await waitFor(() => {
        expect(
          screen.getByTestId('entity-relations-graph'),
        ).toBeInTheDocument();
        expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
      });
    });
  });

  describe('Draggable EntityNodeDetails Conditional Rendering', () => {
    it('renders Draggable components when entities are available and detailsEntity is set', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      await waitFor(() => {
        // In topology view with entities available, draggable should render since setDetailsEntity is called
        expect(screen.getByLabelText('Topology View')).toBeChecked();
        expect(screen.getByTestId('draggable-component')).toBeInTheDocument();
        expect(screen.getByTestId('entity-node-details')).toBeInTheDocument();
      });
    });

    it('does not render Draggable components in graph view', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      const graphViewInput = screen.getByLabelText('Graph View');
      await userEvent.click(graphViewInput);

      await waitFor(() => {
        expect(
          screen.queryByTestId('draggable-component'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('entity-node-details'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('View Toggle Integration', () => {
    it('toggles between topology and graph views correctly', async () => {
      await renderInTestApp(wrapper, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      // Initially in topology view
      await waitFor(() => {
        expect(screen.getByLabelText('Topology View')).toBeChecked();
        expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
        // Draggable should render with proper entity state setup
        expect(screen.getByTestId('draggable-component')).toBeInTheDocument();
      });

      // Switch to graph view
      const graphViewInput = screen.getByLabelText('Graph View');
      await userEvent.click(graphViewInput);

      await waitFor(() => {
        expect(graphViewInput).toBeChecked();
        expect(
          screen.getByTestId('entity-relations-graph'),
        ).toBeInTheDocument();
        expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('draggable-component'),
        ).not.toBeInTheDocument();
      });

      // Switch back to topology view
      const topologyViewInput = screen.getByLabelText('Topology View');
      await userEvent.click(topologyViewInput);

      await waitFor(() => {
        expect(topologyViewInput).toBeChecked();
        expect(screen.getByTestId('topology-graph')).toBeInTheDocument();
        expect(
          screen.queryByTestId('entity-relations-graph'),
        ).not.toBeInTheDocument();
        // Draggable should render with proper state
        expect(screen.getByTestId('draggable-component')).toBeInTheDocument();
      });
    });
  });

  describe('No Entities Available Display Logic', () => {
    const wrapperNoEntities = (
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [searchApiRef, mockSearchApi],
        ]}
      >
        <IntegrationTopologyPage />
      </TestApiProvider>
    );

    beforeEach(() => {
      // Override mock to return no entities
      mockUseFetchAllEntities.mockReturnValue({
        entities: [],
        kinds: [],
        loading: false,
        error: null,
      });
    });

    afterEach(() => {
      // Reset to default mock with entities
      mockUseFetchAllEntities.mockReturnValue({
        entities: [entityC, entityE],
        kinds: ['Component'],
        loading: false,
        error: null,
      });
    });

    it('displays "No entities available to display" message in topology view when no entities are available', async () => {
      await renderInTestApp(wrapperNoEntities, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Topology View')).toBeChecked();
        expect(
          screen.getByText('No entities available to display'),
        ).toBeInTheDocument();
        expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('draggable-component'),
        ).not.toBeInTheDocument();
      });
    });

    it('displays "No entities available to display" message in graph view when no entities are available', async () => {
      await renderInTestApp(wrapperNoEntities, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      // Switch to graph view
      const graphViewInput = screen.getByLabelText('Graph View');
      await userEvent.click(graphViewInput);

      await waitFor(() => {
        expect(graphViewInput).toBeChecked();
        expect(
          screen.getByText('No entities available to display'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('entity-relations-graph'),
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('draggable-component'),
        ).not.toBeInTheDocument();
      });
    });

    it('does not render graph components when entities array is empty but still shows filters', async () => {
      await renderInTestApp(wrapperNoEntities, {
        mountedRoutes: { '/entity/:kind/:namespace/:name': entityRouteRef },
      });

      await waitFor(() => {
        // Filters should still be visible
        expect(
          screen.getByTestId('selected-kind-dropdown'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('searchable-dropdown')).toBeInTheDocument();

        // But no graph or draggable components
        expect(screen.queryByTestId('topology-graph')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('draggable-component'),
        ).not.toBeInTheDocument();

        // And shows the no entities message
        expect(
          screen.getByText('No entities available to display'),
        ).toBeInTheDocument();
      });
    });
  });
});
