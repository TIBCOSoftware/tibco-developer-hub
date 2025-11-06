/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { CustomEntityNodeProps } from '../components/CustomEntityNode/CustomEntityNode';
import { Entity } from '@backstage/catalog-model';

export type TopologyThemes =
  | 'blue'
  | 'green'
  | 'navy'
  | 'orange'
  | 'pastelGreen'
  | 'pink'
  | 'purple'
  | 'yellow';

export type CustomThemeProps = {
  background?: string;
  iconColor?: string;
};

export const topologyThemes = {
  blue: {
    background: 'hsla(191, 100%, 83%, 1)',
    iconColor: 'hsla(193, 100%, 48%, 1)',
  },
  green: {
    background: 'hsla(139, 100%, 87%, 1)',
    iconColor: 'hsla(139, 46%, 44%, 1)',
  },
  navy: {
    background: 'hsla(240, 100%, 95%, 1)',
    iconColor: 'hsla(240, 100%, 25%, 1)',
  },
  orange: {
    background: 'hsla(31, 100%, 87%, 1)',
    iconColor: 'hsla(29, 72%, 50%, 1)',
  },
  pastelGreen: {
    background: 'hsla(87, 100%, 77%, 1)',
    iconColor: 'hsla(100, 58%, 52%, 1)',
  },
  pink: {
    background: 'hsla(354, 100%, 87%, 1)',
    iconColor: 'hsla(346, 82%, 59%, 1)',
  },
  purple: {
    background: 'hsla(315, 100%, 92%, 1)',
    iconColor: 'hsla(316, 72%, 36%, 1)',
  },
  yellow: {
    background: 'hsla(47, 100%, 82%, 1)',
    iconColor: 'hsla(42, 100%, 50%, 1)',
  },
};

export function getCustomNodeThemeColors(theme: TopologyThemes | undefined) {
  if (!theme) {
    return {};
  }
  if (theme in topologyThemes) {
    return topologyThemes[theme];
  }
  return {};
}

export function getCustomThemeProps(entity: Entity) {
  let styleProps: CustomThemeProps = {};

  const topologyNodeCustomization: CustomEntityNodeProps =
    (entity?.metadata?.[
      'tibco.developer.hub/topology'
    ] as CustomEntityNodeProps) ?? {};

  if (topologyNodeCustomization) {
    const customTheme =
      typeof topologyNodeCustomization?.theme === 'object' &&
      topologyNodeCustomization.theme !== null;

    if (customTheme) {
      const customColors =
        topologyNodeCustomization?.theme?.colors || undefined;
      const userTheme = topologyNodeCustomization?.theme?.name;
      const theme =
        userTheme && userTheme in topologyThemes ? userTheme : undefined;

      // theme customization priority
      // 1. user defined theme
      // 2. predifined theme with user customized colors for either bg or icon
      // 3. user chooses one of the predefined theme
      // 4. default theme

      if (customColors && customColors.background && customColors.iconColor) {
        return customColors;
      }

      if (theme && customColors) {
        styleProps = getCustomNodeThemeColors(theme as TopologyThemes);
        if (customColors.background) {
          styleProps.background = customColors.background;
        }
        if (customColors.iconColor) {
          styleProps.iconColor = customColors.iconColor;
        }
        return styleProps;
      }

      return getCustomNodeThemeColors(theme as TopologyThemes);
    }
  }

  return styleProps;
}
