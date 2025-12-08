/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useContext, useEffect, useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { Direction } from '@backstage/plugin-catalog-graph';
import { TopologyContext, TopologyProvider } from './TopologyContext';

describe('TopologyContext', () => {
  const createMockEntity = (name: string, kind = 'Component'): Entity => ({
    apiVersion: 'backstage.io/v1alpha1',
    kind,
    metadata: {
      name,
      namespace: 'default',
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
    },
  });

  // Test component to access context values and functions
  const TestConsumer = ({
    onContextUpdate,
    testAction,
  }: {
    onContextUpdate?: (context: any) => void;
    testAction?: string;
  }) => {
    const context = useContext(TopologyContext);
    const {
      display,
      rootEntity,
      detailsEntity,
      detailsLocked,
      graphDirection,
      toggleDisplay,
      setDisplay,
      setRootEntity,
      setDetailsEntity,
      setDetailsLocked,
      setGraphDirection,
    } = context;

    useEffect(() => {
      if (onContextUpdate) {
        onContextUpdate(context);
      }
    }, [context, onContextUpdate]);

    const handleTestAction = () => {
      switch (testAction) {
        case 'toggleDisplay':
          toggleDisplay();
          break;
        case 'setDisplayNone':
          setDisplay('none');
          break;
        case 'setDisplayBlock':
          setDisplay('block');
          break;
        case 'setRootEntity':
          setRootEntity(createMockEntity('test-root'));
          break;
        case 'setDetailsEntity':
          setDetailsEntity(createMockEntity('test-details'));
          break;
        case 'setDetailsLocked':
          setDetailsLocked(true);
          break;
        case 'clearRootEntity':
          setRootEntity(null);
          break;
        case 'clearDetailsEntity':
          setDetailsEntity(null);
          break;
        case 'unlockDetails':
          setDetailsLocked(false);
          break;
        case 'setDirectionTopBottom':
          setGraphDirection?.(Direction.TOP_BOTTOM);
          break;
        case 'setDirectionBottomTop':
          setGraphDirection?.(Direction.BOTTOM_TOP);
          break;
        case 'setDirectionLeftRight':
          setGraphDirection?.(Direction.LEFT_RIGHT);
          break;
        case 'setDirectionRightLeft':
          setGraphDirection?.(Direction.RIGHT_LEFT);
          break;
        default:
          break;
      }
    };

    return (
      <div>
        <div data-testid="display">{display}</div>
        <div data-testid="root-entity">
          {rootEntity ? rootEntity.metadata.name : 'null'}
        </div>
        <div data-testid="details-entity">
          {detailsEntity ? detailsEntity.metadata.name : 'null'}
        </div>
        <div data-testid="details-locked">{detailsLocked.toString()}</div>
        <div data-testid="graph-direction">{graphDirection}</div>
        <button data-testid="test-action" onClick={handleTestAction}>
          {testAction || 'No Action'}
        </button>
      </div>
    );
  };

  describe('TopologyProvider', () => {
    it('should provide default context values', () => {
      let contextValue: any;

      render(
        <TopologyProvider>
          <TestConsumer
            onContextUpdate={context => {
              contextValue = context;
            }}
          />
        </TopologyProvider>,
      );

      expect(contextValue.display).toBe('block');
      expect(contextValue.rootEntity).toBeNull();
      expect(contextValue.detailsEntity).toBeNull();
      expect(contextValue.detailsLocked).toBe(false);
      expect(contextValue.graphDirection).toBe(Direction.LEFT_RIGHT);
      expect(typeof contextValue.toggleDisplay).toBe('function');
      expect(typeof contextValue.setDisplay).toBe('function');
      expect(typeof contextValue.setRootEntity).toBe('function');
      expect(typeof contextValue.setDetailsEntity).toBe('function');
      expect(typeof contextValue.setDetailsLocked).toBe('function');
      expect(typeof contextValue.setGraphDirection).toBe('function');
    });

    it('should render children properly', () => {
      render(
        <TopologyProvider>
          <div data-testid="child">Test Child</div>
        </TopologyProvider>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
    });

    it('should maintain context state across re-renders', () => {
      const { rerender } = render(
        <TopologyProvider>
          <TestConsumer testAction="toggleDisplay" />
        </TopologyProvider>,
      );

      // Initial state should be 'block'
      expect(screen.getByTestId('display')).toHaveTextContent('block');

      // Toggle to 'none'
      fireEvent.click(screen.getByTestId('test-action'));
      expect(screen.getByTestId('display')).toHaveTextContent('none');

      // Rerender with the same component structure
      rerender(
        <TopologyProvider>
          <TestConsumer testAction="toggleDisplay" />
        </TopologyProvider>,
      );

      // After rerender, the state should remain the same since we rerender the same provider
      expect(screen.getByTestId('display')).toHaveTextContent('none');
    });
  });

  describe('Display Management', () => {
    it('should toggle display from block to none', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="toggleDisplay" />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('display')).toHaveTextContent('block');

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('display')).toHaveTextContent('none');
    });

    it('should toggle display from none back to block', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="toggleDisplay" />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('test-action'));
      expect(screen.getByTestId('display')).toHaveTextContent('none');

      fireEvent.click(screen.getByTestId('test-action'));
      expect(screen.getByTestId('display')).toHaveTextContent('block');
    });

    it('should set display directly to specific values', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setDisplayNone" />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('display')).toHaveTextContent('none');
    });

    it('should handle multiple display toggles', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="toggleDisplay" />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('display')).toHaveTextContent('block');

      // Toggle multiple times
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByTestId('test-action'));

        const expectedValue = i % 2 === 0 ? 'none' : 'block';
        expect(screen.getByTestId('display')).toHaveTextContent(expectedValue);
      }
    });
  });

  describe('Root Entity Management', () => {
    it('should set root entity', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setRootEntity" />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('test-root');
    });

    it('should clear root entity', () => {
      const ClearRootEntityTest = () => {
        const { rootEntity, setRootEntity } = useContext(TopologyContext);

        const handleSetEntity = () =>
          setRootEntity(createMockEntity('test-root'));
        const handleClearEntity = () => setRootEntity(null);

        return (
          <div>
            <div data-testid="root-entity">
              {rootEntity ? rootEntity.metadata.name : 'null'}
            </div>
            <button data-testid="set-entity" onClick={handleSetEntity}>
              Set Entity
            </button>
            <button data-testid="clear-entity" onClick={handleClearEntity}>
              Clear Entity
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <ClearRootEntityTest />
        </TopologyProvider>,
      );

      // First set an entity
      fireEvent.click(screen.getByTestId('set-entity'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('test-root');

      // Then clear it
      fireEvent.click(screen.getByTestId('clear-entity'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');
    });

    it('should handle multiple root entity updates', () => {
      const MultipleEntityTest = () => {
        const { setRootEntity } = useContext(TopologyContext);

        const handleSetEntity1 = () =>
          setRootEntity(createMockEntity('entity-1'));
        const handleSetEntity2 = () =>
          setRootEntity(createMockEntity('entity-2'));
        const handleClearEntity = () => setRootEntity(null);

        return (
          <div>
            <TestConsumer />
            <button data-testid="set-entity-1" onClick={handleSetEntity1}>
              Set Entity 1
            </button>
            <button data-testid="set-entity-2" onClick={handleSetEntity2}>
              Set Entity 2
            </button>
            <button data-testid="clear-entity" onClick={handleClearEntity}>
              Clear Entity
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <MultipleEntityTest />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');

      fireEvent.click(screen.getByTestId('set-entity-1'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('entity-1');

      fireEvent.click(screen.getByTestId('set-entity-2'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('entity-2');

      fireEvent.click(screen.getByTestId('clear-entity'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');
    });
  });

  describe('Details Entity Management', () => {
    it('should set details entity', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setDetailsEntity" />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('details-entity')).toHaveTextContent('null');

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('details-entity')).toHaveTextContent(
        'test-details',
      );
    });

    it('should clear details entity', () => {
      const ClearDetailsEntityTest = () => {
        const { detailsEntity, setDetailsEntity } = useContext(TopologyContext);

        const handleSetEntity = () =>
          setDetailsEntity(createMockEntity('test-details'));
        const handleClearEntity = () => setDetailsEntity(null);

        return (
          <div>
            <div data-testid="details-entity">
              {detailsEntity ? detailsEntity.metadata.name : 'null'}
            </div>
            <button data-testid="set-entity" onClick={handleSetEntity}>
              Set Entity
            </button>
            <button data-testid="clear-entity" onClick={handleClearEntity}>
              Clear Entity
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <ClearDetailsEntityTest />
        </TopologyProvider>,
      );

      // First set an entity
      fireEvent.click(screen.getByTestId('set-entity'));

      expect(screen.getByTestId('details-entity')).toHaveTextContent(
        'test-details',
      );

      // Then clear it
      fireEvent.click(screen.getByTestId('clear-entity'));

      expect(screen.getByTestId('details-entity')).toHaveTextContent('null');
    });

    it('should handle different entity types for details', () => {
      const DifferentEntityTypesTest = () => {
        const { setDetailsEntity } = useContext(TopologyContext);

        const handleSetAPI = () =>
          setDetailsEntity(createMockEntity('api-entity', 'API'));
        const handleSetResource = () =>
          setDetailsEntity(createMockEntity('resource-entity', 'Resource'));
        const handleSetComponent = () =>
          setDetailsEntity(createMockEntity('component-entity', 'Component'));

        return (
          <div>
            <TestConsumer />
            <button data-testid="set-api" onClick={handleSetAPI}>
              Set API
            </button>
            <button data-testid="set-resource" onClick={handleSetResource}>
              Set Resource
            </button>
            <button data-testid="set-component" onClick={handleSetComponent}>
              Set Component
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <DifferentEntityTypesTest />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('set-api'));

      expect(screen.getByTestId('details-entity')).toHaveTextContent(
        'api-entity',
      );

      fireEvent.click(screen.getByTestId('set-resource'));

      expect(screen.getByTestId('details-entity')).toHaveTextContent(
        'resource-entity',
      );

      fireEvent.click(screen.getByTestId('set-component'));

      expect(screen.getByTestId('details-entity')).toHaveTextContent(
        'component-entity',
      );
    });
  });

  describe('Details Locked Management', () => {
    it('should set details locked to true', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setDetailsLocked" />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('details-locked')).toHaveTextContent('false');

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('details-locked')).toHaveTextContent('true');
    });

    it('should unlock details', () => {
      const UnlockDetailsTest = () => {
        const { detailsLocked, setDetailsLocked } = useContext(TopologyContext);

        const handleLock = () => setDetailsLocked(true);
        const handleUnlock = () => setDetailsLocked(false);

        return (
          <div>
            <div data-testid="details-locked">{detailsLocked.toString()}</div>
            <button data-testid="lock" onClick={handleLock}>
              Lock
            </button>
            <button data-testid="unlock" onClick={handleUnlock}>
              Unlock
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <UnlockDetailsTest />
        </TopologyProvider>,
      );

      // First lock
      fireEvent.click(screen.getByTestId('lock'));

      expect(screen.getByTestId('details-locked')).toHaveTextContent('true');

      // Then unlock
      fireEvent.click(screen.getByTestId('unlock'));

      expect(screen.getByTestId('details-locked')).toHaveTextContent('false');
    });

    it('should toggle details locked state multiple times', () => {
      const ToggleLockTest = () => {
        const { setDetailsLocked, detailsLocked } = useContext(TopologyContext);

        const handleToggleLock = () => setDetailsLocked(!detailsLocked);

        return (
          <div>
            <TestConsumer />
            <button data-testid="toggle-lock" onClick={handleToggleLock}>
              Toggle Lock
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <ToggleLockTest />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('details-locked')).toHaveTextContent('false');

      // Toggle multiple times
      for (let i = 0; i < 4; i++) {
        fireEvent.click(screen.getByTestId('toggle-lock'));

        const expectedValue = i % 2 === 0 ? 'true' : 'false';
        expect(screen.getByTestId('details-locked')).toHaveTextContent(
          expectedValue,
        );
      }
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle simultaneous state updates', () => {
      const SimultaneousUpdateTest = () => {
        const {
          setDisplay,
          setRootEntity,
          setDetailsEntity,
          setDetailsLocked,
        } = useContext(TopologyContext);

        const handleUpdateAll = () => {
          setDisplay('none');
          setRootEntity(createMockEntity('integration-root'));
          setDetailsEntity(createMockEntity('integration-details'));
          setDetailsLocked(true);
        };

        return (
          <div>
            <TestConsumer />
            <button data-testid="update-all" onClick={handleUpdateAll}>
              Update All
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <SimultaneousUpdateTest />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('display')).toHaveTextContent('block');
      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');
      expect(screen.getByTestId('details-entity')).toHaveTextContent('null');
      expect(screen.getByTestId('details-locked')).toHaveTextContent('false');

      fireEvent.click(screen.getByTestId('update-all'));

      expect(screen.getByTestId('display')).toHaveTextContent('none');
      expect(screen.getByTestId('root-entity')).toHaveTextContent(
        'integration-root',
      );
      expect(screen.getByTestId('details-entity')).toHaveTextContent(
        'integration-details',
      );
      expect(screen.getByTestId('details-locked')).toHaveTextContent('true');
    });

    it('should handle complex workflow scenarios', async () => {
      const WorkflowTest = () => {
        const context = useContext(TopologyContext);
        const {
          setRootEntity,
          setDetailsEntity,
          setDetailsLocked,
          toggleDisplay,
        } = context;

        const handleWorkflow = async () => {
          // Step 1: Set root entity
          setRootEntity(createMockEntity('workflow-root'));

          // Step 2: Set details entity and lock
          setTimeout(() => {
            setDetailsEntity(createMockEntity('workflow-details'));
            setDetailsLocked(true);
          }, 10);

          // Step 3: Toggle display
          setTimeout(() => {
            toggleDisplay();
          }, 20);
        };

        return (
          <div>
            <TestConsumer />
            <button data-testid="run-workflow" onClick={handleWorkflow}>
              Run Workflow
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <WorkflowTest />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('run-workflow'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent(
        'workflow-root',
      );

      await waitFor(() => {
        expect(screen.getByTestId('details-entity')).toHaveTextContent(
          'workflow-details',
        );
        expect(screen.getByTestId('details-locked')).toHaveTextContent('true');
      });

      await waitFor(() => {
        expect(screen.getByTestId('display')).toHaveTextContent('none');
      });
    });

    it('should maintain state consistency across re-renders', () => {
      const ConsistencyTest = ({
        forceRerender,
      }: {
        forceRerender: number;
      }) => {
        return (
          <div>
            <TestConsumer />
            <div data-testid="render-count">{forceRerender}</div>
          </div>
        );
      };

      const ParentTest = () => {
        const [renderCount, setRenderCount] = useState(0);
        const { setRootEntity } = useContext(TopologyContext);

        const handleSetEntityAndRerender = () => {
          setRootEntity(createMockEntity('consistent-entity'));
          setRenderCount(prev => prev + 1);
        };

        return (
          <div>
            <ConsistencyTest forceRerender={renderCount} />
            <button
              data-testid="set-and-rerender"
              onClick={handleSetEntityAndRerender}
            >
              Set Entity and Rerender
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <ParentTest />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('set-and-rerender'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent(
        'consistent-entity',
      );
      expect(screen.getByTestId('render-count')).toHaveTextContent('1');
    });
  });

  describe('Context outside Provider', () => {
    it('should provide default context values when used outside provider', () => {
      let contextValue: any;

      const OutsideProviderTest = () => {
        const context = useContext(TopologyContext);
        contextValue = context;
        return <div>Outside Provider Test</div>;
      };

      render(<OutsideProviderTest />);

      expect(contextValue.display).toBe('block');
      expect(contextValue.rootEntity).toBeNull();
      expect(contextValue.detailsEntity).toBeNull();
      expect(contextValue.detailsLocked).toBe(false);
      expect(typeof contextValue.toggleDisplay).toBe('function');
      expect(typeof contextValue.setDisplay).toBe('function');
      expect(typeof contextValue.setRootEntity).toBe('function');
      expect(typeof contextValue.setDetailsEntity).toBe('function');
      expect(typeof contextValue.setDetailsLocked).toBe('function');
    });

    it('should handle function calls outside provider gracefully', () => {
      const OutsideProviderFunctionTest = () => {
        const { toggleDisplay, setDisplay, setRootEntity } =
          useContext(TopologyContext);

        const handleCallFunctions = () => {
          toggleDisplay();
          setDisplay('none');
          setRootEntity(createMockEntity('outside-entity'));
        };

        return (
          <button data-testid="call-functions" onClick={handleCallFunctions}>
            Call Functions
          </button>
        );
      };

      render(<OutsideProviderFunctionTest />);

      // Should not throw errors when calling functions outside provider
      expect(() => {
        fireEvent.click(screen.getByTestId('call-functions'));
      }).not.toThrow();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid state updates', () => {
      const RapidUpdateTest = () => {
        const { setDisplay, setDetailsLocked } = useContext(TopologyContext);

        const handleRapidUpdates = () => {
          for (let i = 0; i < 100; i++) {
            setDisplay(i % 2 === 0 ? 'block' : 'none');
            setDetailsLocked(i % 3 === 0);
          }
        };

        return (
          <div>
            <TestConsumer />
            <button data-testid="rapid-updates" onClick={handleRapidUpdates}>
              Rapid Updates
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <RapidUpdateTest />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('rapid-updates'));

      // Should handle rapid updates without crashing
      expect(screen.getByTestId('display')).toBeInTheDocument();
      expect(screen.getByTestId('details-locked')).toBeInTheDocument();
    });

    it('should handle null and undefined entity assignments', () => {
      const NullEntityTest = () => {
        const { setRootEntity, setDetailsEntity } = useContext(TopologyContext);

        const handleSetNullEntities = () => {
          setRootEntity(null);
          setDetailsEntity(null);
        };

        const handleSetUndefinedEntities = () => {
          setRootEntity(undefined as any);
          setDetailsEntity(undefined as any);
        };

        return (
          <div>
            <TestConsumer />
            <button data-testid="set-null" onClick={handleSetNullEntities}>
              Set Null
            </button>
            <button
              data-testid="set-undefined"
              onClick={handleSetUndefinedEntities}
            >
              Set Undefined
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <NullEntityTest />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('set-null'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');
      expect(screen.getByTestId('details-entity')).toHaveTextContent('null');

      fireEvent.click(screen.getByTestId('set-undefined'));

      expect(screen.getByTestId('root-entity')).toHaveTextContent('null');
      expect(screen.getByTestId('details-entity')).toHaveTextContent('null');
    });

    it('should maintain independent state across multiple provider instances', () => {
      const MultiProviderTest = () => {
        return (
          <div>
            <TopologyProvider>
              <div data-testid="provider-1">
                <TestConsumer testAction="setRootEntity" />
              </div>
            </TopologyProvider>
            <TopologyProvider>
              <div data-testid="provider-2">
                <TestConsumer testAction="setDetailsEntity" />
              </div>
            </TopologyProvider>
          </div>
        );
      };

      render(<MultiProviderTest />);

      const provider1 = screen.getByTestId('provider-1');
      const provider2 = screen.getByTestId('provider-2');

      expect(
        provider1.querySelector('[data-testid="root-entity"]'),
      ).toHaveTextContent('null');
      expect(
        provider2.querySelector('[data-testid="root-entity"]'),
      ).toHaveTextContent('null');
      expect(
        provider1.querySelector('[data-testid="details-entity"]'),
      ).toHaveTextContent('null');
      expect(
        provider2.querySelector('[data-testid="details-entity"]'),
      ).toHaveTextContent('null');
    });
  });

  describe('Graph Direction Management', () => {
    it('should set default graph direction to LEFT_RIGHT', () => {
      render(
        <TopologyProvider>
          <TestConsumer />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.LEFT_RIGHT,
      );
    });

    it('should set graph direction to TOP_BOTTOM', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setDirectionTopBottom" />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.TOP_BOTTOM,
      );
    });

    it('should set graph direction to BOTTOM_TOP', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setDirectionBottomTop" />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.BOTTOM_TOP,
      );
    });

    it('should set graph direction to RIGHT_LEFT', () => {
      render(
        <TopologyProvider>
          <TestConsumer testAction="setDirectionRightLeft" />
        </TopologyProvider>,
      );

      fireEvent.click(screen.getByTestId('test-action'));

      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.RIGHT_LEFT,
      );
    });

    it('should change graph direction back to LEFT_RIGHT', () => {
      const TopBottomTest = () => {
        const { setGraphDirection } = useContext(TopologyContext);

        return (
          <div>
            <TestConsumer />
            <button
              data-testid="set-top-bottom"
              onClick={() => setGraphDirection?.(Direction.TOP_BOTTOM)}
            >
              Set Top Bottom
            </button>
            <button
              data-testid="set-left-right"
              onClick={() => setGraphDirection?.(Direction.LEFT_RIGHT)}
            >
              Set Left Right
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <TopBottomTest />
        </TopologyProvider>,
      );

      // Change to TOP_BOTTOM
      fireEvent.click(screen.getByTestId('set-top-bottom'));
      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.TOP_BOTTOM,
      );

      // Change back to LEFT_RIGHT
      fireEvent.click(screen.getByTestId('set-left-right'));
      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.LEFT_RIGHT,
      );
    });

    it('should handle multiple direction changes', () => {
      const DirectionTest = () => {
        const { setGraphDirection } = useContext(TopologyContext);

        return (
          <div>
            <TestConsumer />
            <button
              data-testid="set-top-bottom"
              onClick={() => setGraphDirection?.(Direction.TOP_BOTTOM)}
            >
              Top Bottom
            </button>
            <button
              data-testid="set-bottom-top"
              onClick={() => setGraphDirection?.(Direction.BOTTOM_TOP)}
            >
              Bottom Top
            </button>
            <button
              data-testid="set-left-right"
              onClick={() => setGraphDirection?.(Direction.LEFT_RIGHT)}
            >
              Left Right
            </button>
            <button
              data-testid="set-right-left"
              onClick={() => setGraphDirection?.(Direction.RIGHT_LEFT)}
            >
              Right Left
            </button>
          </div>
        );
      };

      render(
        <TopologyProvider>
          <DirectionTest />
        </TopologyProvider>,
      );

      const directions = [
        { button: 'set-top-bottom', expected: Direction.TOP_BOTTOM },
        { button: 'set-bottom-top', expected: Direction.BOTTOM_TOP },
        { button: 'set-right-left', expected: Direction.RIGHT_LEFT },
        { button: 'set-left-right', expected: Direction.LEFT_RIGHT },
      ];

      directions.forEach(({ button, expected }) => {
        fireEvent.click(screen.getByTestId(button));
        expect(screen.getByTestId('graph-direction')).toHaveTextContent(
          expected,
        );
      });
    });

    it('should maintain graph direction state across re-renders', () => {
      const { rerender } = render(
        <TopologyProvider>
          <TestConsumer testAction="setDirectionTopBottom" />
        </TopologyProvider>,
      );

      // Set to TOP_BOTTOM
      fireEvent.click(screen.getByTestId('test-action'));
      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.TOP_BOTTOM,
      );

      // Rerender and check if state persists
      rerender(
        <TopologyProvider>
          <TestConsumer testAction="setDirectionTopBottom" />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('graph-direction')).toHaveTextContent(
        Direction.TOP_BOTTOM,
      );
    });
  });

  describe('TypeScript Compliance', () => {
    it('should have correct TypeScript types for context values', () => {
      const TypeTest = () => {
        const context = useContext(TopologyContext);

        // These should pass TypeScript compilation
        const display: string = context.display;
        const rootEntity: Entity | null = context.rootEntity;
        const detailsEntity: Entity | null = context.detailsEntity;
        const detailsLocked: boolean = context.detailsLocked;
        const graphDirection: Direction | undefined = context.graphDirection;

        // Functions are tested by their existence and expected behavior
        expect(typeof context.toggleDisplay).toBe('function');
        expect(typeof context.setDisplay).toBe('function');
        expect(typeof context.setRootEntity).toBe('function');
        expect(typeof context.setDetailsEntity).toBe('function');
        expect(typeof context.setDetailsLocked).toBe('function');
        expect(typeof context.setGraphDirection).toBe('function');

        return (
          <div data-testid="type-test">
            {display} {rootEntity?.metadata.name} {detailsEntity?.metadata.name}{' '}
            {detailsLocked.toString()} {graphDirection}
          </div>
        );
      };

      render(
        <TopologyProvider>
          <TypeTest />
        </TopologyProvider>,
      );

      expect(screen.getByTestId('type-test')).toBeInTheDocument();
    });
  });
});
