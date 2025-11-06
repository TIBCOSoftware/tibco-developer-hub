/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity } from '@backstage/catalog-model';
import {
  CustomEntityNodeProps,
  CustomIconProps,
} from '../components/CustomEntityNode/CustomEntityNode';

export type CustomIconDetails = {
  icon: string | undefined;
  color?: string;
  tooltip?: string;
};

export function getCustomEntityIcon(entity: Entity) {
  const topologyNodeCustomization: CustomEntityNodeProps =
    (entity?.metadata?.[
      'tibco.developer.hub/topology'
    ] as CustomEntityNodeProps) ?? {};

  if (topologyNodeCustomization) {
    const customIconProvided =
      typeof topologyNodeCustomization?.entityIcon?.icon === 'string';

    if (customIconProvided) {
      const customIcon = topologyNodeCustomization?.entityIcon?.icon || null;
      const customIconColor =
        topologyNodeCustomization?.entityIcon?.iconColor || undefined;
      const customIconTooltip =
        topologyNodeCustomization?.entityIcon?.iconTooltip || undefined;
      if (customIcon) {
        return {
          icon: customIcon,
          color: customIconColor,
          tooltip: customIconTooltip,
        };
      }
    }
  }

  return null;
}

export function getEntityStatusIcons(entity: Entity) {
  const topologyNodeCustomization: CustomEntityNodeProps =
    (entity?.metadata?.[
      'tibco.developer.hub/topology'
    ] as CustomEntityNodeProps) ?? {};

  if (topologyNodeCustomization) {
    const statusIconsProvided =
      Array.isArray(topologyNodeCustomization?.statusIcons) &&
      topologyNodeCustomization?.statusIcons.length > 0;

    if (statusIconsProvided) {
      const statusIcons = topologyNodeCustomization.statusIcons;
      const statusIconsArray: CustomIconProps[] = [];
      if (statusIcons && statusIcons.length > 0) {
        statusIcons.forEach(iconObj => {
          // Validate that iconObj is a valid object before accessing properties
          if (iconObj && typeof iconObj === 'object') {
            const icon = iconObj.icon || undefined;
            const iconColor = iconObj.iconColor || 'inherit';
            const iconTooltip = iconObj.iconTooltip || undefined;

            statusIconsArray.push({
              icon,
              iconColor,
              iconTooltip,
            });
          }
        });
        return statusIconsArray;
      }
    }
  }

  return null;
}
