export enum HomeCardType {
  System = 'System',
  API = 'API',
  Component = 'Component',
  Template = 'Template',
  Document = 'Document',
  WalkThrough = 'Walk-through',
}

type CardInfo = {
  tags?: string[];
  link?: string;
  title: string;
  text: string;
  star?: boolean;
  namespace?: string;
  kind?: HomeCardType;
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
