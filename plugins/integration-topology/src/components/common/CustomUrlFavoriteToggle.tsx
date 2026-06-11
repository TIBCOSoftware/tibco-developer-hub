/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { FavoriteToggle } from '@backstage/core-components';
import { useUrlFavorites } from '../../hooks/useUrlFavourites';

interface Props {
  entityName: string;
  url: string;
}

export const CustomUrlFavoriteToggle = ({ entityName, url }: Props) => {
  const { isFavorited, toggleFavorite } = useUrlFavorites();

  const active = isFavorited(url);

  return (
    <FavoriteToggle
      id="topology-url-favorite-toggle"
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      isFavorite={active}
      onToggle={() => toggleFavorite({ [entityName]: url })}
    />
  );
};
