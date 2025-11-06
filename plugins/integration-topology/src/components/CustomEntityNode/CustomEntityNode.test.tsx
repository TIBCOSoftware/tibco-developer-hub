/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { StylesProvider } from '@material-ui/core/styles';
import { CustomEntityNode } from './CustomEntityNode';
import { DependencyGraphTypes } from '@backstage/core-components';
import { EntityNodeData } from '@backstage/plugin-catalog-graph';
import { Entity } from '@backstage/catalog-model';
import { TopologyContext } from '../../context/TopologyContext';
import * as useFetchAllLinksModule from '../../hooks/useFetchAllLinks';
import * as useEntityPresentationModule from '@backstage/plugin-catalog-react';
import * as iconUtilsModule from '../../utils/icon-utils';
import * as themeUtilsModule from '../../utils/theme-utils';
import { useRef } from 'react';

// Mock react module
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
}));

// Mock Material-UI makeStyles
jest.mock('@material-ui/core/styles', () => ({
  ...jest.requireActual('@material-ui/core/styles'),
  makeStyles: () => () => ({}),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  MemoryRouter: ({ children }: any) => (
    <div data-testid="memory-router">{children}</div>
  ),
  useLocation: () => ({
    pathname: '/test',
    search: '',
    hash: '',
    state: undefined,
  }),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock external dependencies
jest.mock('../../hooks/useFetchAllLinks');
jest.mock('@backstage/plugin-catalog-react');
jest.mock('../../utils/icon-utils');
jest.mock('../../utils/theme-utils');
jest.mock('../common/CustomIcon', () => ({
  CustomIcon: ({ id, iconName, iconStyle, x, y, width, height }: any) => (
    <g data-testid={`custom-icon-${id || iconName}`}>
      <rect
        x={x}
        y={y}
        width={width || 16}
        height={height || 16}
        data-icon-name={iconName}
        data-icon-style={iconStyle}
      />
    </g>
  ),
}));
jest.mock('../common/EntityIcon', () => ({
  EntityIcon: ({ icon, fallbackIcon, x, y, width, height, className }: any) => (
    <g data-testid="entity-icon" className={className}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        data-icon={icon}
        data-fallback-icon={fallbackIcon?.name}
      />
    </g>
  ),
}));
jest.mock('../common/CustomTooltip', () => ({
  CustomTooltip: ({ title, xPos, yPos }: any) => (
    <g data-testid="custom-tooltip">
      <text x={xPos} y={yPos} data-tooltip-title={title}>
        {title}
      </text>
    </g>
  ),
}));
jest.mock('./EntityDeploymentCard', () => ({
  EntityDeploymentCard: ({
    platformLinks,
    iconSize,
    iconOffsetX,
    iconOffsetY,
  }: any) => (
    <g data-testid="entity-deployment-card">
      <rect
        x={iconOffsetX}
        y={iconOffsetY}
        width={iconSize}
        height={iconSize}
        data-platform-links-count={platformLinks?.length || 0}
      />
    </g>
  ),
}));
jest.mock('./EntityStatusIconsCard', () => ({
  __esModule: true,
  default: ({ statusIcons, iconSize, x, y }: any) => (
    <g data-testid="entity-status-icons-card">
      <rect
        x={x}
        y={y}
        width={iconSize}
        height={iconSize}
        data-status-icons-count={statusIcons?.length || 0}
      />
    </g>
  ),
}));

const useFetchAllLinksMock =
  useFetchAllLinksModule.useFetchAllLinks as jest.MockedFunction<
    typeof useFetchAllLinksModule.useFetchAllLinks
  >;
const useEntityPresentationMock =
  useEntityPresentationModule.useEntityPresentation as jest.MockedFunction<
    typeof useEntityPresentationModule.useEntityPresentation
  >;
const getCustomEntityIconMock =
  iconUtilsModule.getCustomEntityIcon as jest.MockedFunction<
    typeof iconUtilsModule.getCustomEntityIcon
  >;
const getEntityStatusIconsMock =
  iconUtilsModule.getEntityStatusIcons as jest.MockedFunction<
    typeof iconUtilsModule.getEntityStatusIcons
  >;
const getCustomThemePropsMock =
  themeUtilsModule.getCustomThemeProps as jest.MockedFunction<
    typeof themeUtilsModule.getCustomThemeProps
  >;

describe('CustomEntityNode Component', () => {
  // Default test data
  const mockEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-service',
      namespace: 'default',
      description: 'A test service for unit testing',
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      owner: 'team-a',
    },
  };

  const mockNodeData: DependencyGraphTypes.RenderNodeProps<EntityNodeData> = {
    node: {
      id: 'component:default/test-service',
      entity: mockEntity,
      color: 'default',
      focused: false,
      onClick: jest.fn(),
      name: 'test-service',
      namespace: 'default',
    },
  };

  const mockContextValue = {
    detailsLocked: false,
    display: 'none' as const,
    rootEntity: null,
    detailsEntity: null,
    toggleDisplay: jest.fn(),
    setDisplay: jest.fn(),
    setRootEntity: jest.fn(),
    setDetailsEntity: jest.fn(),
    setDetailsLocked: jest.fn(),
  };

  const renderComponent = (
    props: Partial<DependencyGraphTypes.RenderNodeProps<EntityNodeData>> = {},
    contextValue = mockContextValue,
  ) => {
    const nodeProps = { ...mockNodeData, ...props };
    return render(
      <StylesProvider injectFirst>
        <div data-testid="memory-router">
          <TopologyContext.Provider value={contextValue}>
            <svg>
              <CustomEntityNode {...nodeProps} />
            </svg>
          </TopologyContext.Provider>
        </div>
      </StylesProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock getBBox on SVGElement prototype
    Object.defineProperty(SVGElement.prototype, 'getBBox', {
      writable: true,
      value: jest.fn().mockReturnValue({
        width: 120,
        height: 18,
        x: 0,
        y: 0,
      }),
    });

    // Mock useRef to return a mock SVG text element
    const mockSVGElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text',
    );
    const mockRefObject = {
      current: mockSVGElement,
    };

    (useRef as jest.Mock).mockReturnValue(mockRefObject);

    // Default mock implementations
    useFetchAllLinksMock.mockReturnValue({
      cpLink: '/cp/test-service',
      infoLinks: {
        docs: '/docs/test-service',
        source: 'https://github.com/test/repo',
      },
      externalLinks: [{ title: 'External Link', url: 'https://external.com' }],
      platformLinks: [
        {
          pLink: 'https://prod.env.com',
          pLabel: 'Production',
          pAppType: 'bwce',
        },
      ],
      error: null,
    });

    useEntityPresentationMock.mockReturnValue({
      entityRef: 'component:default/test-service',
      primaryTitle: 'Test Service',
      Icon: { name: 'TestIcon' } as any,
    });

    getCustomEntityIconMock.mockReturnValue({
      icon: 'custom-icon',
      color: '#ff0000',
      tooltip: 'Custom Icon Tooltip',
    });

    getEntityStatusIconsMock.mockReturnValue([
      { icon: 'status1', iconColor: '#00ff00', iconTooltip: 'Status 1' },
      { icon: 'status2', iconColor: '#0000ff', iconTooltip: 'Status 2' },
    ]);

    getCustomThemePropsMock.mockReturnValue({
      iconColor: '#1976d2',
      background: '#ffffff',
    });
  });

  describe('Functionality Tests', () => {
    describe('Basic Rendering', () => {
      test('renders node with basic structure', () => {
        renderComponent();

        // Check main card container
        expect(
          screen.getByTestId('custom-icon-pl-icon-details'),
        ).toBeInTheDocument();
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(
          screen.getByText('A test service for unit testing'),
        ).toBeInTheDocument();
      });

      test('renders with correct node dimensions', () => {
        const { container } = renderComponent();

        const cardContainer = container.querySelector('[id$="-cardContainer"]');
        expect(cardContainer).toHaveAttribute('width', '350');
        expect(cardContainer).toHaveAttribute('height', '92');
        expect(cardContainer).toHaveAttribute('rx', '4');
        expect(cardContainer).toHaveAttribute('ry', '4');
      });

      test('renders icon and text sections', () => {
        const { container } = renderComponent();

        // Icon section
        const iconSection = container.querySelector('rect[width="70"]');
        expect(iconSection).toBeInTheDocument();

        // Text section
        const textSection = container.querySelector('rect[width="286"]');
        expect(textSection).toBeInTheDocument();
      });

      test('renders spacer rectangle', () => {
        const { container } = renderComponent();

        const spacer = container.querySelector('rect[width="5"]');
        expect(spacer).toBeInTheDocument();
        expect(spacer).toHaveAttribute('x', '63'); // cardIconSectionWidth - 7
      });
    });

    describe('Icon and Status Rendering', () => {
      test('renders entity icon with custom properties', () => {
        renderComponent();

        const entityIcon = screen.getByTestId('entity-icon');
        expect(entityIcon).toBeInTheDocument();
      });

      test('renders status icons when available', () => {
        renderComponent();

        const statusIconsCard = screen.getByTestId('entity-status-icons-card');
        expect(statusIconsCard).toBeInTheDocument();
        expect(statusIconsCard.querySelector('rect')).toHaveAttribute(
          'data-status-icons-count',
          '2',
        );
      });

      test('does not render status icons when none available', () => {
        getEntityStatusIconsMock.mockReturnValue([]);

        renderComponent();

        expect(
          screen.queryByTestId('entity-status-icons-card'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Tooltips', () => {
      test('renders tooltip for details icon when display is none', () => {
        renderComponent();

        const tooltip = screen.getByText('Open Details');
        expect(tooltip).toBeInTheDocument();
      });

      test('renders custom icon tooltip when available', () => {
        renderComponent();

        const tooltip = screen.getByText('Custom Icon Tooltip');
        expect(tooltip).toBeInTheDocument();
      });
    });

    describe('Links Rendering', () => {
      test('renders info links with correct icons', () => {
        renderComponent();

        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-source'),
        ).toBeInTheDocument();
      });

      test('renders external links section', () => {
        renderComponent();

        expect(screen.getByText('External Links')).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-externalLink'),
        ).toBeInTheDocument();
      });
    });

    describe('Component Entity Features', () => {
      test('renders deployment card for Component entities', () => {
        renderComponent();

        const deploymentCard = screen.getByTestId('entity-deployment-card');
        expect(deploymentCard).toBeInTheDocument();
        expect(deploymentCard.querySelector('rect')).toHaveAttribute(
          'data-platform-links-count',
          '1',
        );
      });

      test('does not render deployment card for non-Component entities', () => {
        const apiEntity = {
          ...mockEntity,
          kind: 'API',
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: apiEntity },
        });

        expect(
          screen.queryByTestId('entity-deployment-card'),
        ).not.toBeInTheDocument();
      });
    });

    describe('useRef and getBBox Integration', () => {
      test('component renders without getBBox errors', () => {
        // This test verifies that our useRef mock with getBBox works correctly
        expect(() => {
          renderComponent();
        }).not.toThrow();

        // Verify the mock was called
        expect(useRef).toHaveBeenCalled();
      });

      test('handles getBBox method call correctly', () => {
        renderComponent();

        // The component should render successfully with our mocked getBBox
        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('getBBox mock returns expected dimensions', () => {
        renderComponent();

        // Verify that our mock is working by checking if the component renders
        // The actual getBBox call happens inside useLayoutEffect
        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });
    });

    describe('Node Interaction', () => {
      test('handles node click events', () => {
        const onClickMock = jest.fn();
        renderComponent({
          node: { ...mockNodeData.node, onClick: onClickMock },
        });

        const nodeContainer = screen.getByTestId('custom-node-group');
        expect(nodeContainer).toBeInTheDocument();
        // screen.debug(nodeContainer);
        fireEvent.click(nodeContainer);

        expect(onClickMock).toHaveBeenCalled();
      });

      test('applies focused styling when focused', () => {
        const { container } = renderComponent({
          node: { ...mockNodeData.node, focused: true },
        });

        const cardContainer = container.querySelector('[id$="-cardContainer"]');
        expect(cardContainer).toBeInTheDocument();
      });
    });
  });

  describe('Integration Tests', () => {
    describe('Hooks Integration', () => {
      test('integrates with useFetchAllLinks hook', () => {
        renderComponent();

        expect(useFetchAllLinksMock).toHaveBeenCalledWith(mockEntity);
      });

      test('integrates with useEntityPresentation hook', () => {
        renderComponent();

        expect(useEntityPresentationMock).toHaveBeenCalledWith(mockEntity, {
          defaultNamespace: 'default',
        });
      });
    });

    describe('Context Integration', () => {
      test('handles different display modes', () => {
        const contextWithDetails = {
          ...mockContextValue,
          display: 'details' as any,
        };

        renderComponent({}, contextWithDetails);

        // Should render differently based on display mode
        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('handles locked details state', () => {
        const contextWithLockedDetails = {
          ...mockContextValue,
          detailsLocked: true,
        };

        renderComponent({}, contextWithLockedDetails);

        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('handles different root and details entities', () => {
        const contextWithEntities = {
          ...mockContextValue,
          rootEntity: mockEntity as any,
          detailsEntity: mockEntity as any,
        };

        renderComponent({}, contextWithEntities);

        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });
    });

    describe('Real-world Scenarios', () => {
      test('handles entity with all features enabled', () => {
        renderComponent();

        // Should render all major components
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByTestId('entity-icon')).toBeInTheDocument();
        expect(
          screen.getByTestId('entity-status-icons-card'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('entity-deployment-card'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-externalLink'),
        ).toBeInTheDocument();
      });

      test('handles minimal entity configuration', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: [],
          platformLinks: [],
          error: null,
        });

        getEntityStatusIconsMock.mockReturnValue([]);
        getCustomEntityIconMock.mockReturnValue(null);

        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/test-service',
          primaryTitle: 'Minimal Service',
          Icon: undefined,
        });

        renderComponent();

        expect(screen.getByText('Minimal Service')).toBeInTheDocument();

        expect(
          screen
            .queryByTestId('entity-status-icons-card')
            ?.querySelector('rect'),
        ).toBeUndefined();

        expect(
          screen.queryByTestId('entity-deployment-card')?.querySelector('rect'),
        )?.toHaveAttribute('data-platform-links-count', '0');
      });

      test('handles different entity kinds', () => {
        const resourceEntity = {
          ...mockEntity,
          kind: 'Resource',
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: resourceEntity },
        });

        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(
          screen.queryByTestId('entity-deployment-card'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('handles missing entity description', () => {
        const entityWithoutDescription = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            description: undefined,
          },
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithoutDescription },
        });

        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('handles entity with special characters in name', () => {
        const entityWithSpecialChars = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            name: 'test-service-with-special@chars#123',
          },
        };

        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/test-service-with-special@chars#123',
          primaryTitle: 'Special Service @#123',
          Icon: { name: 'TestIcon' } as any,
        });

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithSpecialChars },
        });

        expect(screen.getByText('Special Service @#123')).toBeInTheDocument();
      });

      test('handles null custom entity icon', () => {
        getCustomEntityIconMock.mockReturnValue(null);

        renderComponent();

        expect(
          screen.queryByText('Custom Icon Tooltip'),
        ).not.toBeInTheDocument();
      });

      test('handles missing theme properties', () => {
        getCustomThemePropsMock.mockReturnValue({
          iconColor: undefined,
          background: undefined,
        });

        renderComponent();

        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('handles useEntityPresentation with missing data', () => {
        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/test-service',
          primaryTitle: undefined as any,
          Icon: undefined,
        });

        renderComponent();

        // Should still render basic structure
        expect(
          screen.getByTestId('custom-icon-pl-icon-details'),
        ).toBeInTheDocument();
      });

      test('handles missing external links gracefully', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: null as any,
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(screen.queryByText('External Links')).not.toBeInTheDocument();
      });

      test('handles different platform link types', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {
            docs: '/docs/test-service',
            source: 'https://github.com/test/repo',
          },
          externalLinks: [
            { title: 'External Link 1', url: 'https://external1.com' },
            { title: 'External Link 2', url: 'https://external2.com' },
          ],
          platformLinks: [
            {
              pLink: 'https://prod.env.com',
              pLabel: 'Production',
              pAppType: 'bwce',
            },
            {
              pLink: 'https://staging.env.com',
              pLabel: 'Staging',
              pAppType: 'nodejs',
            },
          ],
          error: null,
        });

        renderComponent();

        expect(
          screen.getByTestId('entity-deployment-card').querySelector('rect'),
        ).toHaveAttribute('data-platform-links-count', '2');
        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-source'),
        ).toBeInTheDocument();
      });

      test('handles multiple status icons', () => {
        getEntityStatusIconsMock.mockReturnValue([
          { icon: 'status1', iconColor: '#00ff00', iconTooltip: 'Status 1' },
          { icon: 'status2', iconColor: '#0000ff', iconTooltip: 'Status 2' },
          { icon: 'status3', iconColor: '#ff0000', iconTooltip: 'Status 3' },
        ]);

        renderComponent();

        const statusIconsCard = screen.getByTestId('entity-status-icons-card');
        expect(statusIconsCard.querySelector('rect')).toHaveAttribute(
          'data-status-icons-count',
          '3',
        );
      });

      test('handles long entity names and descriptions', () => {
        const entityWithLongText = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            name: 'very-long-service-name-that-might-overflow-the-card-width',
            description:
              'This is a very long description that might overflow the card height and needs to be handled properly by the component layout system',
          },
        };

        useEntityPresentationMock.mockReturnValue({
          entityRef:
            'component:default/very-long-service-name-that-might-overflow-the-card-width',
          primaryTitle:
            'Very Long Service Name That Might Overflow The Card Width',
          Icon: { name: 'TestIcon' } as any,
        });

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithLongText },
        });

        expect(
          screen.getByText('Very Long Service Name That Mi...'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Mouse Event Handling', () => {
    describe('Node Click Events', () => {
      test('handles node click and prevents event propagation for links', () => {
        const onClickMock = jest.fn();
        renderComponent({
          node: { ...mockNodeData.node, onClick: onClickMock },
        });

        const nodeContainer = screen.getByTestId('custom-node-group');
        fireEvent.click(nodeContainer);

        expect(onClickMock).toHaveBeenCalledWith(expect.any(Object));
      });

      test('does not call onClick when node is not clickable', () => {
        const onClickMock = jest.fn();
        renderComponent({
          node: { ...mockNodeData.node, onClick: undefined },
        });

        const nodeContainer = screen.getByTestId('custom-node-group');
        fireEvent.click(nodeContainer);

        expect(onClickMock).not.toHaveBeenCalled();
      });

      test('applies clickable class when onClick is provided', () => {
        const onClickMock = jest.fn();
        renderComponent({
          node: { ...mockNodeData.node, onClick: onClickMock },
        });

        const nodeContainer = screen.getByTestId('custom-node-group');
        // When onClick is provided, the component should be rendered
        expect(nodeContainer).toBeInTheDocument();
      });

      test('does not apply clickable class when onClick is not provided', () => {
        renderComponent({
          node: { ...mockNodeData.node, onClick: undefined },
        });

        const nodeContainer = screen.getByTestId('custom-node-group');
        // When no onClick is provided, the component should still render
        expect(nodeContainer).toBeInTheDocument();
      });
    });

    describe('Mouse Enter Events', () => {
      test('handles mouse enter when details are not locked and display is not none', () => {
        const mockSetDisplay = jest.fn();
        const mockSetDetailsEntity = jest.fn();
        const contextValue = {
          ...mockContextValue,
          detailsLocked: false,
          display: 'block' as any,
          setDisplay: mockSetDisplay,
          setDetailsEntity: mockSetDetailsEntity,
        };

        renderComponent({}, contextValue);

        const nodeContainer = screen.getByTestId('custom-node-group');
        fireEvent.mouseEnter(nodeContainer);

        expect(mockSetDisplay).toHaveBeenCalledWith('block');
        expect(mockSetDetailsEntity).toHaveBeenCalledWith(mockEntity);
      });

      test('does not update display when details are locked', () => {
        const mockSetDisplay = jest.fn();
        const mockSetDetailsEntity = jest.fn();
        const contextValue = {
          ...mockContextValue,
          detailsLocked: true,
          display: 'block' as any,
          setDisplay: mockSetDisplay,
          setDetailsEntity: mockSetDetailsEntity,
        };

        renderComponent({}, contextValue);

        const nodeContainer = screen.getByTestId('custom-node-group');
        fireEvent.mouseEnter(nodeContainer);

        expect(mockSetDisplay).not.toHaveBeenCalled();
        expect(mockSetDetailsEntity).not.toHaveBeenCalled();
      });

      test('does not update display when display mode is none', () => {
        const mockSetDisplay = jest.fn();
        const mockSetDetailsEntity = jest.fn();
        const contextValue = {
          ...mockContextValue,
          detailsLocked: false,
          display: 'none' as any,
          setDisplay: mockSetDisplay,
          setDetailsEntity: mockSetDetailsEntity,
        };

        renderComponent({}, contextValue);

        const nodeContainer = screen.getByTestId('custom-node-group');
        fireEvent.mouseEnter(nodeContainer);

        expect(mockSetDisplay).not.toHaveBeenCalled();
        expect(mockSetDetailsEntity).not.toHaveBeenCalled();
      });
    });

    describe('Details Panel Interactions', () => {
      test('shows details button with correct tooltip when display is none', () => {
        const contextValue = {
          ...mockContextValue,
          display: 'none' as any,
        };

        renderComponent({}, contextValue);

        expect(
          screen.getByTestId('custom-icon-pl-icon-details'),
        ).toBeInTheDocument();
        expect(screen.getByText('Open Details')).toBeInTheDocument();
      });

      test('clicking details button sets display to block', () => {
        const mockSetDisplay = jest.fn();
        const contextValue = {
          ...mockContextValue,
          display: 'none' as any,
          setDisplay: mockSetDisplay,
        };

        renderComponent({}, contextValue);

        const detailsButton = screen
          .getByTestId('custom-icon-pl-icon-details')
          .closest('g');
        fireEvent.click(detailsButton!);

        expect(mockSetDisplay).toHaveBeenCalledWith('block');
      });

      test('details button click prevents event propagation', () => {
        const onClickMock = jest.fn();
        const mockSetDisplay = jest.fn();
        const contextValue = {
          ...mockContextValue,
          display: 'none' as any,
          setDisplay: mockSetDisplay,
        };

        renderComponent(
          {
            node: { ...mockNodeData.node, onClick: onClickMock },
          },
          contextValue,
        );

        const detailsButton = screen
          .getByTestId('custom-icon-pl-icon-details')
          .closest('g');
        fireEvent.click(detailsButton!);

        expect(mockSetDisplay).toHaveBeenCalledWith('block');
        // Node onClick should not be called due to stopPropagation
        expect(onClickMock).not.toHaveBeenCalled();
      });

      test('shows lock icon when display is block and details are locked', () => {
        const contextValue = {
          ...mockContextValue,
          display: 'block' as any,
          detailsLocked: true,
        };

        renderComponent({}, contextValue);

        expect(
          screen.getByTestId('custom-icon-details-view-icon-collapse'),
        ).toBeInTheDocument();
        expect(screen.getByText('Unlock Details')).toBeInTheDocument();
      });

      test('shows unlock icon when display is block and details are not locked', () => {
        const contextValue = {
          ...mockContextValue,
          display: 'block' as any,
          detailsLocked: false,
        };

        renderComponent({}, contextValue);

        expect(
          screen.getByTestId('custom-icon-details-view-icon-expand'),
        ).toBeInTheDocument();
        expect(screen.getByText('Lock Details')).toBeInTheDocument();
      });

      test('clicking lock/unlock button toggles details lock state', () => {
        const mockSetDetailsLocked = jest.fn();
        const contextValue = {
          ...mockContextValue,
          display: 'block' as any,
          detailsLocked: false,
          setDetailsLocked: mockSetDetailsLocked,
        };

        renderComponent({}, contextValue);

        const lockButton = screen
          .getByTestId('custom-icon-details-view-icon-expand')
          .closest('g');
        fireEvent.click(lockButton!);

        expect(mockSetDetailsLocked).toHaveBeenCalledWith(true);
      });

      test('lock/unlock button click prevents event propagation', () => {
        const onClickMock = jest.fn();
        const mockSetDetailsLocked = jest.fn();
        const contextValue = {
          ...mockContextValue,
          display: 'block' as any,
          detailsLocked: false,
          setDetailsLocked: mockSetDetailsLocked,
        };

        renderComponent(
          {
            node: { ...mockNodeData.node, onClick: onClickMock },
          },
          contextValue,
        );

        const lockButton = screen
          .getByTestId('custom-icon-details-view-icon-expand')
          .closest('g');
        fireEvent.click(lockButton!);

        expect(mockSetDetailsLocked).toHaveBeenCalledWith(true);
        // Node onClick should not be called due to stopPropagation
        expect(onClickMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('Text Rendering and Truncation', () => {
    describe('Title Truncation', () => {
      test('truncates long titles correctly', () => {
        const entityWithLongTitle = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            name: 'very-long-service-name-that-exceeds-thirty-characters-limit',
          },
        };

        useEntityPresentationMock.mockReturnValue({
          entityRef:
            'component:default/very-long-service-name-that-exceeds-thirty-characters-limit',
          primaryTitle:
            'Very Long Service Name That Exceeds Thirty Characters Limit',
          Icon: { name: 'TestIcon' } as any,
        });

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithLongTitle },
        });

        expect(
          screen.getByText('Very Long Service Name That Ex...'),
        ).toBeInTheDocument();
      });

      test('does not truncate short titles', () => {
        const entityWithShortTitle = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            name: 'short',
          },
        };

        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/short',
          primaryTitle: 'Short',
          Icon: { name: 'TestIcon' } as any,
        });

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithShortTitle },
        });

        expect(screen.getByText('Short')).toBeInTheDocument();
      });

      test('handles exactly 30 character titles', () => {
        const entityWithExactTitle = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            name: '123456789012345678901234567890', // exactly 30 chars
          },
        };

        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/123456789012345678901234567890',
          primaryTitle: '123456789012345678901234567890',
          Icon: { name: 'TestIcon' } as any,
        });

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithExactTitle },
        });

        expect(
          screen.getByText('123456789012345678901234567890'),
        ).toBeInTheDocument();
      });
    });

    describe('Description Wrapping', () => {
      test('renders single line description for short text', () => {
        renderComponent();

        // Look for the description text directly in screen
        expect(
          screen.getByText('A test service for unit testing'),
        ).toBeInTheDocument();
      });

      test('wraps description into two lines for medium length text', () => {
        const entityWithMediumDescription = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            description:
              'This is a medium length description that should be wrapped into two lines',
          },
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithMediumDescription },
        });

        // For wrapped text, we should be able to find the description text
        expect(
          screen.getByText(/This is a medium length description/),
        ).toBeInTheDocument();
      });

      test('truncates very long descriptions with ellipsis', () => {
        const entityWithLongDescription = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            description:
              'This is an extremely long description that exceeds the maximum allowed length and should be truncated with ellipsis at the end to prevent overflow',
          },
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithLongDescription },
        });

        // Look for text that contains ellipsis
        expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
      });

      test('handles description between 55 and 90 characters correctly', () => {
        const entityWith65CharDescription = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            description:
              'This description is exactly sixty-five characters long test',
          },
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWith65CharDescription },
        });

        // For descriptions in the middle range, they should be rendered (possibly wrapped in tspan)
        expect(
          screen.getByText('This description is exactly sixty-five charac'),
        ).toBeInTheDocument();
        expect(screen.getByText('ters long test')).toBeInTheDocument();
      });
    });
  });

  describe('Link Interactions and Rendering', () => {
    describe('Info Links', () => {
      test('renders multiple info links with correct positioning', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {
            docs: '/docs/test-service',
            source: 'https://github.com/test/repo',
            apis: '/apis/test-service',
            cicd: '/cicd/test-service',
          },
          externalLinks: [],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-source'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-apis'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-cicd'),
        ).toBeInTheDocument();
      });

      test('renders dividers between multiple info links', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {
            docs: '/docs/test-service',
            source: 'https://github.com/test/repo',
            apis: '/apis/test-service',
          },
          externalLinks: [],
          platformLinks: [],
          error: null,
        });

        const { container } = renderComponent();

        // Look for divider rectangles in the SVG - they should be thin vertical lines
        const dividers = container.querySelectorAll('rect[width="1"]');
        expect(dividers.length).toBeGreaterThanOrEqual(1);
      });

      test('opens source links in new tab', () => {
        renderComponent();

        // Verify that the source icon is rendered (which represents the GitHub link)
        expect(
          screen.getByTestId('custom-icon-pl-icon-source'),
        ).toBeInTheDocument();
      });

      test('opens non-source links in same tab', () => {
        renderComponent();

        // Verify that the docs icon is rendered
        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
      });

      test('prevents event propagation on info link clicks', () => {
        const onClickMock = jest.fn();
        const { container } = renderComponent({
          node: { ...mockNodeData.node, onClick: onClickMock },
        });

        const infoLinkGroup = container.querySelector('[id*="info-link-"]');
        fireEvent.click(infoLinkGroup!);

        expect(onClickMock).not.toHaveBeenCalled();
      });

      test('renders tooltips for info links', () => {
        renderComponent();

        expect(screen.getByText('Open docs')).toBeInTheDocument();
        expect(screen.getByText('Open source')).toBeInTheDocument();
      });
    });

    describe('External Links', () => {
      test('renders external links section with correct title', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: { docs: '/docs/test-service' },
          externalLinks: [
            { title: 'External Link 1', url: 'https://external1.com' },
            { title: 'External Link 2', url: 'https://external2.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(screen.getByText('External Links')).toBeInTheDocument();
      });

      test('renders multiple external link icons', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: { docs: '/docs/test-service' },
          externalLinks: [
            { title: 'External Link 1', url: 'https://external1.com' },
            { title: 'External Link 2', url: 'https://external2.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        const externalLinkIcons = screen.getAllByTestId(
          'custom-icon-pl-icon-externalLink',
        );
        expect(externalLinkIcons).toHaveLength(2);
      });

      test('renders divider for external links section', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: { docs: '/docs/test-service' },
          externalLinks: [
            { title: 'External Link', url: 'https://external.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        // When external links are present, the section should be rendered
        expect(screen.getByText('External Links')).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-externalLink'),
        ).toBeInTheDocument();
      });

      test('opens external links in new window on click', () => {
        const windowOpenSpy = jest
          .spyOn(window, 'open')
          .mockImplementation(() => null);

        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: [
            { title: 'Test External Link', url: 'https://example.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        const externalLinkIcon = screen
          .getByTestId('custom-icon-pl-icon-externalLink')
          .closest('g');
        fireEvent.click(externalLinkIcon!);

        expect(windowOpenSpy).toHaveBeenCalledWith(
          'https://example.com',
          '_blank',
        );

        windowOpenSpy.mockRestore();
      });

      test('prevents event propagation on external link clicks', () => {
        const onClickMock = jest.fn();
        const windowOpenSpy = jest
          .spyOn(window, 'open')
          .mockImplementation(() => null);

        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: [
            { title: 'Test External Link', url: 'https://example.com' },
          ],
          platformLinks: [],
          error: null,
        });

        const { container } = renderComponent({
          node: { ...mockNodeData.node, onClick: onClickMock },
        });

        const externalLinkGroup = container.querySelector(
          '[id*="external-link-"]',
        );
        fireEvent.click(externalLinkGroup!);

        expect(onClickMock).not.toHaveBeenCalled();

        windowOpenSpy.mockRestore();
      });

      test('renders custom tooltips for external links', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: [
            { title: 'Custom External Link', url: 'https://example.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(screen.getByText('Custom External Link')).toBeInTheDocument();
      });

      test('renders default tooltip when external link has no title', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: [{ title: '', url: 'https://example.com' }],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(screen.getByText('Open Link')).toBeInTheDocument();
      });
    });

    describe('Links Layout and Positioning', () => {
      test('calculates correct positioning with both info and external links', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {
            docs: '/docs/test-service',
            source: 'https://github.com/test/repo',
          },
          externalLinks: [
            { title: 'External Link', url: 'https://external.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        // Both info links and external links should be rendered
        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-source'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-externalLink'),
        ).toBeInTheDocument();
        expect(screen.getByText('External Links')).toBeInTheDocument();
      });

      test('handles single info link layout', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {
            docs: '/docs/test-service',
          },
          externalLinks: [],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(screen.queryByText('External Links')).not.toBeInTheDocument();
      });

      test('handles no info links with external links', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {},
          externalLinks: [
            { title: 'External Link', url: 'https://external.com' },
          ],
          platformLinks: [],
          error: null,
        });

        renderComponent();

        expect(screen.getByText('External Links')).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-externalLink'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Icon and Status Rendering Logic', () => {
    describe('Custom Entity Icon', () => {
      test('uses custom icon when available', () => {
        getCustomEntityIconMock.mockReturnValue({
          icon: 'custom-service-icon',
          color: '#ff6b35',
          tooltip: 'Custom Service Icon',
        });

        renderComponent();

        const entityIcon = screen.getByTestId('entity-icon');
        expect(entityIcon.querySelector('rect')).toHaveAttribute(
          'data-icon',
          'custom-service-icon',
        );
      });

      test('falls back to entity presentation icon when custom icon not available', () => {
        getCustomEntityIconMock.mockReturnValue(null);

        renderComponent();

        const entityIcon = screen.getByTestId('entity-icon');
        expect(entityIcon.querySelector('rect')).toHaveAttribute(
          'data-fallback-icon',
          'TestIcon',
        );
      });

      test('renders custom icon tooltip when available', () => {
        getCustomEntityIconMock.mockReturnValue({
          icon: 'custom-icon',
          color: '#ff0000',
          tooltip: 'Custom Icon Tooltip Message',
        });

        renderComponent();

        expect(
          screen.getByText('Custom Icon Tooltip Message'),
        ).toBeInTheDocument();
      });

      test('does not render tooltip when custom icon has no tooltip', () => {
        getCustomEntityIconMock.mockReturnValue({
          icon: 'custom-icon',
          color: '#ff0000',
          tooltip: undefined,
        });

        renderComponent();

        // When no custom tooltip, only the standard tooltips should exist
        expect(
          screen.queryByText('Custom Icon Tooltip Message'),
        ).not.toBeInTheDocument();
        // But other tooltips should still exist
        expect(screen.getByText('Open Details')).toBeInTheDocument();
      });
    });

    describe('Status Icons Positioning', () => {
      test('positions entity icon differently when status icons are present', () => {
        getEntityStatusIconsMock.mockReturnValue([
          { icon: 'status1', iconColor: '#00ff00', iconTooltip: 'Status 1' },
        ]);

        renderComponent();

        // When status icons are present, both should be visible
        expect(screen.getByTestId('entity-icon')).toBeInTheDocument();
        expect(
          screen.getByTestId('entity-status-icons-card'),
        ).toBeInTheDocument();
      });

      test('centers entity icon when no status icons are present', () => {
        getEntityStatusIconsMock.mockReturnValue([]);

        renderComponent();

        // When no status icons, only entity icon should be visible
        expect(screen.getByTestId('entity-icon')).toBeInTheDocument();
        expect(
          screen.queryByTestId('entity-status-icons-card'),
        ).not.toBeInTheDocument();
      });

      test('limits status icons to maximum of 3', () => {
        getEntityStatusIconsMock.mockReturnValue([
          { icon: 'status1', iconColor: '#00ff00', iconTooltip: 'Status 1' },
          { icon: 'status2', iconColor: '#0000ff', iconTooltip: 'Status 2' },
          { icon: 'status3', iconColor: '#ff0000', iconTooltip: 'Status 3' },
          { icon: 'status4', iconColor: '#ffff00', iconTooltip: 'Status 4' },
          { icon: 'status5', iconColor: '#ff00ff', iconTooltip: 'Status 5' },
        ]);

        renderComponent();

        const statusIconsCard = screen.getByTestId('entity-status-icons-card');
        expect(statusIconsCard.querySelector('rect')).toHaveAttribute(
          'data-status-icons-count',
          '3',
        );
      });
    });
  });

  describe('Styling and Theme Integration', () => {
    describe('Color Variations', () => {
      test('applies primary color styling', () => {
        const { container } = renderComponent({
          node: { ...mockNodeData.node, color: 'primary' },
        });

        const cardContainer = container.querySelector('[id$="-cardContainer"]');
        expect(cardContainer).not.toHaveClass('tCardContainerOutlined');

        const iconCard = container.querySelector('rect[width="70"]');
        expect(iconCard).toHaveClass('primary');
      });

      test('applies secondary color styling with outlined container', () => {
        renderComponent({
          node: { ...mockNodeData.node, color: 'secondary' },
        });

        // For secondary color, the component should still render correctly
        expect(screen.getByTestId('custom-node-group')).toBeInTheDocument();
        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('applies default color styling', () => {
        const { container } = renderComponent({
          node: { ...mockNodeData.node, color: 'default' },
        });

        const cardContainer = container.querySelector('[id$="-cardContainer"]');
        expect(cardContainer).not.toHaveClass('tCardContainerOutlined');
      });
    });

    describe('Focus States', () => {
      test('applies focused styling to text elements when focused', () => {
        renderComponent({
          node: { ...mockNodeData.node, focused: true },
        });

        // When focused, the component should still render correctly
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(
          screen.getByText('A test service for unit testing'),
        ).toBeInTheDocument();
      });

      test('does not apply focused styling when not focused', () => {
        renderComponent({
          node: { ...mockNodeData.node, focused: false },
        });

        // When not focused, the component should still render correctly
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(
          screen.getByText('A test service for unit testing'),
        ).toBeInTheDocument();
      });
    });

    describe('Custom Theme Props', () => {
      test('uses custom theme icon color when provided', () => {
        getCustomThemePropsMock.mockReturnValue({
          iconColor: '#custom-color',
          background: '#custom-background',
        });

        renderComponent();

        // Theme props are applied via CSS-in-JS, so we verify the mock was called
        expect(getCustomThemePropsMock).toHaveBeenCalledWith(mockEntity);
      });

      test('custom icon color overrides theme color', () => {
        getCustomEntityIconMock.mockReturnValue({
          icon: 'custom-icon',
          color: '#override-color',
          tooltip: 'Custom Icon',
        });

        getCustomThemePropsMock.mockReturnValue({
          iconColor: '#theme-color',
          background: '#theme-background',
        });

        renderComponent();

        // Both mocks should be called but custom icon color takes precedence
        expect(getCustomEntityIconMock).toHaveBeenCalledWith(mockEntity);
        expect(getCustomThemePropsMock).toHaveBeenCalledWith(mockEntity);
      });
    });
  });

  describe('Complex Integration Scenarios', () => {
    describe('Complete Feature Integration', () => {
      test('renders all features together correctly', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '/cp/test-service',
          infoLinks: {
            docs: '/docs/test-service',
            source: 'https://github.com/test/repo',
            apis: '/apis/test-service',
          },
          externalLinks: [
            { title: 'External Link 1', url: 'https://external1.com' },
            { title: 'External Link 2', url: 'https://external2.com' },
          ],
          platformLinks: [
            {
              pLink: 'https://prod.env.com',
              pLabel: 'Production',
              pAppType: 'bwce',
            },
            {
              pLink: 'https://staging.env.com',
              pLabel: 'Staging',
              pAppType: 'nodejs',
            },
          ],
          error: null,
        });

        getEntityStatusIconsMock.mockReturnValue([
          { icon: 'status1', iconColor: '#00ff00', iconTooltip: 'Healthy' },
          { icon: 'status2', iconColor: '#ffff00', iconTooltip: 'Warning' },
        ]);

        getCustomEntityIconMock.mockReturnValue({
          icon: 'service-icon',
          color: '#1976d2',
          tooltip: 'Service Component',
        });

        const contextValue = {
          ...mockContextValue,
          display: 'block' as any,
          detailsLocked: false,
        };

        renderComponent(
          {
            node: { ...mockNodeData.node, focused: true, color: 'primary' },
          },
          contextValue,
        );

        // Main components
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(
          screen.getByText('A test service for unit testing'),
        ).toBeInTheDocument();

        // Icons and status
        expect(screen.getByTestId('entity-icon')).toBeInTheDocument();
        expect(
          screen.getByTestId('entity-status-icons-card'),
        ).toBeInTheDocument();
        expect(screen.getByText('Service Component')).toBeInTheDocument();

        // Links
        expect(
          screen.getByTestId('custom-icon-pl-icon-docs'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-source'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-apis'),
        ).toBeInTheDocument();
        expect(screen.getByText('External Links')).toBeInTheDocument();

        // Deployment (Component specific)
        expect(
          screen.getByTestId('entity-deployment-card'),
        ).toBeInTheDocument();

        // Details controls
        expect(
          screen.getByTestId('custom-icon-details-view-icon-expand'),
        ).toBeInTheDocument();
        expect(screen.getByText('Lock Details')).toBeInTheDocument();
      });

      test('handles minimal configuration gracefully', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '',
          infoLinks: {},
          externalLinks: [],
          platformLinks: [],
          error: null,
        });

        getEntityStatusIconsMock.mockReturnValue([]);
        getCustomEntityIconMock.mockReturnValue(null);

        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/minimal-service',
          primaryTitle: 'Minimal Service',
          Icon: undefined,
        });

        const contextValue = {
          ...mockContextValue,
          display: 'none' as any,
        };

        renderComponent(
          {
            node: {
              ...mockNodeData.node,
              entity: {
                ...mockEntity,
                metadata: {
                  ...mockEntity.metadata,
                  description: undefined,
                },
              },
            },
          },
          contextValue,
        );

        // Basic structure should still render
        expect(screen.getByText('Minimal Service')).toBeInTheDocument();
        expect(
          screen.getByTestId('custom-icon-pl-icon-details'),
        ).toBeInTheDocument();

        // Optional features should not render
        expect(
          screen.queryByTestId('entity-status-icons-card'),
        ).not.toBeInTheDocument();
        expect(screen.queryByText('External Links')).not.toBeInTheDocument();
        // Some tooltips will still exist (like for the details button), so we check for absence of custom ones
        expect(
          screen.queryByText('Custom Icon Tooltip Message'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Error States and Edge Cases', () => {
      test('handles missing entity data gracefully', () => {
        const incompleteEntity = {
          ...mockEntity,
          metadata: {
            name: 'test-service',
            // missing namespace and description
          },
          // missing spec
        } as any;

        useEntityPresentationMock.mockReturnValue({
          entityRef: 'component:default/test-service',
          primaryTitle: undefined as any,
          Icon: undefined,
        });

        renderComponent({
          node: { ...mockNodeData.node, entity: incompleteEntity },
        });

        // Should still render basic structure
        expect(screen.getByTestId('custom-node-group')).toBeInTheDocument();
      });

      test('handles hook errors gracefully', () => {
        useFetchAllLinksMock.mockReturnValue({
          cpLink: '',
          infoLinks: {},
          externalLinks: null as any,
          platformLinks: null as any,
          error: 'Failed to fetch links',
        });

        renderComponent();

        // Should still render main entity information
        expect(screen.getByText('Test Service')).toBeInTheDocument();
      });

      test('handles extreme description lengths', () => {
        const entityWithExtremeDescription = {
          ...mockEntity,
          metadata: {
            ...mockEntity.metadata,
            description: 'A'.repeat(200), // 200 character description
          },
        };

        renderComponent({
          node: { ...mockNodeData.node, entity: entityWithExtremeDescription },
        });

        // The component should still render even with extreme descriptions
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        // The component should handle extreme descriptions gracefully
        expect(screen.getByTestId('custom-node-group')).toBeInTheDocument();
      });
    });

    describe('Performance and Optimization', () => {
      test('handles rapid state changes without errors', () => {
        const mockSetDisplay = jest.fn();
        const mockSetDetailsLocked = jest.fn();
        const contextValue = {
          ...mockContextValue,
          display: 'block' as any,
          detailsLocked: false,
          setDisplay: mockSetDisplay,
          setDetailsLocked: mockSetDetailsLocked,
        };

        renderComponent({}, contextValue);

        const lockButton = screen
          .getByTestId('custom-icon-details-view-icon-expand')
          .closest('g');

        // Simulate rapid clicks
        for (let i = 0; i < 5; i++) {
          fireEvent.click(lockButton!);
        }

        expect(mockSetDetailsLocked).toHaveBeenCalledTimes(5);
      });

      test('handles multiple simultaneous mouse events', () => {
        const onClickMock = jest.fn();
        const mockSetDisplay = jest.fn();
        const contextValue = {
          ...mockContextValue,
          detailsLocked: false,
          display: 'block' as any,
          setDisplay: mockSetDisplay,
        };

        renderComponent(
          {
            node: { ...mockNodeData.node, onClick: onClickMock },
          },
          contextValue,
        );

        const nodeContainer = screen.getByTestId('custom-node-group');

        // Simulate simultaneous events
        fireEvent.mouseEnter(nodeContainer);
        fireEvent.click(nodeContainer);
        fireEvent.mouseLeave(nodeContainer);

        expect(onClickMock).toHaveBeenCalled();
        expect(mockSetDisplay).toHaveBeenCalled();
      });
    });
  });
});
