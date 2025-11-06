/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createTranslationRef,
  TranslationRef,
} from '@backstage/frontend-plugin-api';

/** @alpha */
export const catalogGraphTranslationRef: TranslationRef = createTranslationRef({
  id: 'integration-topology',
  messages: {
    topologyGraphCard: {
      title: 'Integration Topology',
      deepLinkTitle: 'View topology',
    },
    catalogGraphPage: {
      title: 'Integration Topology',
      filterToggleButtonTitle: 'Filters',
      graphViewLabel: 'Graph View',
      topologyViewLabel: 'Topology View',
      supportButtonDescription:
        'Start tracking your component in by adding it to the software catalog.',
      simplifiedSwitchLabel: 'Simplified',
      mergeRelationsSwitchLabel: 'Merge relations',
      zoomOutDescription:
        'Use pinch & zoom to move around the diagram. Click to change active node, shift click to navigate to entity.',
      curveFilter: {
        title: 'Curve',
        curveMonotoneX: 'Monotone X',
        curveStepBefore: 'Step Before',
      },
      directionFilter: {
        title: 'Direction',
        leftToRight: 'Left to right',
        rightToLeft: 'Right to left',
        topToBottom: 'Top to bottom',
        bottomToTop: 'Bottom to top',
      },
      maxDepthFilter: {
        title: 'Max depth',
        inputPlaceholder: '∞ Infinite',
        clearButtonAriaLabel: 'clear max depth',
      },
      selectedKindsFilter: {
        title: 'Kinds',
      },
      selectedRelationsFilter: {
        title: 'Relations',
      },
    },
  },
});
