/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { createContext, useState, ReactNode } from 'react';
import { Entity } from '@backstage/catalog-model';
import { Direction } from '@backstage/plugin-catalog-graph';

export interface TopologyContextType {
  display: string;
  rootEntity: Entity | null;
  detailsEntity: Entity | null;
  detailsLocked: boolean;
  graphDirection?: Direction;
  toggleDisplay: () => void;
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  setRootEntity: React.Dispatch<React.SetStateAction<Entity | null>>;
  setDetailsEntity: React.Dispatch<React.SetStateAction<Entity | null>>;
  setDetailsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setGraphDirection?: React.Dispatch<React.SetStateAction<Direction>>;
}

export const TopologyContext = createContext<TopologyContextType>({
  display: 'block',
  rootEntity: null,
  detailsEntity: null,
  detailsLocked: false,
  graphDirection: Direction.LEFT_RIGHT,
  toggleDisplay: () => {},
  setDisplay: () => {},
  setRootEntity: () => {},
  setDetailsEntity: () => {},
  setDetailsLocked: () => {},
  setGraphDirection: () => {},
});

export interface TopologyProviderProps {
  children: ReactNode;
}

export const TopologyProvider = ({ children }: TopologyProviderProps) => {
  const [display, setDisplay] = useState('block');
  const [rootEntity, setRootEntity] = useState<Entity | null>(null);
  const [detailsEntity, setDetailsEntity] = useState<Entity | null>(null);
  const [detailsLocked, setDetailsLocked] = useState<boolean>(false);
  const [graphDirection, setGraphDirection] = useState<Direction>(
    Direction.LEFT_RIGHT,
  );

  const toggleDisplay = () => {
    setDisplay(prevDisplay => (prevDisplay === 'none' ? 'block' : 'none'));
  };

  return (
    <TopologyContext.Provider
      value={{
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
      }}
    >
      {children}
    </TopologyContext.Provider>
  );
};
