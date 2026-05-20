/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

export enum HomeCardType {
  Topology = 'Topology',
  MarketPlace = 'Marketplace',
  Document = 'Document',
  System = 'System',
  Component = 'Component',
  API = 'API',
  Template = 'Template',
  SelfService = 'Self Service',
  ImportFlow = 'Import Flow',
  WalkThrough = 'Walk-through',
}

type CardInfo = {
  tags?: string[];
  link?: string;
  title?: string;
  name: string;
  text: string;
  star?: boolean;
  namespace?: string;
  kind?: HomeCardType;
  url?: string;
};
export type ExtraInfo = {
  subTitle: string;
  icon: any;
  viewAllLink?: string;
};
export interface HomeCardProps extends ExtraInfo {
  type: HomeCardType;
  loading: boolean;
  itemsInfo?: CardInfo[];
}
export interface WelcomeData {
  name?: string;
  title?: string;
}
