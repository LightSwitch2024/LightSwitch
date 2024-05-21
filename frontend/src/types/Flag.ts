import { Tag } from './Tag';

export interface OverviewInfo {
  sdkKey: string;
  totalFlags: number;
  activeFlags: number;
}

export interface FlagInfo {
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
}

export interface VariationInfo {
  type: string;
  defaultValue: string;
  defaultPortion: number | '';
  defaultDescription: string;
  variations: Array<Variation>;
}

export interface KeywordInfo {
  keywords: Array<Keyword>;
}

export interface SdkKeyResDto {
  key: string;
}

export interface FlagDetailItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  type: string;
  keywords: Array<Keyword>;
  defaultValue: string;
  defaultPortion: number;
  defaultDescription: string;
  variations: Array<Variation>;
  memberId: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface FlagItem {
  title: string;
  tags: Array<Tag>;
  description: string;
  type: string;
  keywords: Array<Keyword>;
  defaultValue: string;
  defaultPortion: number;
  defaultDescription: string;
  variations: Array<Variation>;
  memberId: number;
}

export interface FlagDetailResponse {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  type: string;
  keywords: Array<Keyword>;
  defaultValue: string;
  defaultPortion: number;
  defaultDescription: string;
  variations: Array<Variation>;
  memberId: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  histories: Array<History>;
}

export interface Variation {
  variationId?: number | '';
  value: string;
  portion: number | '';
  description: string;
}

export interface Keyword {
  keywordId: number | '';
  properties: Array<Property>;
  description: string;
  value: string;
}

export interface Property {
  propertyId: number | '';
  property: string;
  data: string;
}

export interface History {
  flagTitle: string;
  target: string | null;
  previous: string | null;
  current: string | null;
  action: HistoryType;
  createdAt: number[];
}

export enum HistoryType {
  // flag
  CREATE_FLAG = 'CREATE_FLAG',
  UPDATE_FLAG_TITLE = 'UPDATE_FLAG_TITLE',
  UPDATE_FLAG_TYPE = 'UPDATE_FLAG_TYPE',
  SWITCH_FLAG = 'SWITCH_FLAG',
  DELETE_FLAG = 'DELETE_FLAG',

  // variation
  CREATE_VARIATION = 'CREATE_VARIATION',
  UPDATE_VARIATION_VALUE = 'UPDATE_VARIATION_VALUE',
  UPDATE_VARIATION_PORTION = 'UPDATE_VARIATION_PORTION',
  DELETE_VARIATION = 'DELETE_VARIATION',

  // keyword
  CREATE_KEYWORD = 'CREATE_KEYWORD',
  UPDATE_KEYWORD = 'UPDATE_KEYWORD',

  //    UPDATE_KEYWORD_PROPERTY,
  DELETE_KEYWORD = 'DELETE_KEYWORD',

  // property
  CREATE_PROPERTY = 'CREATE_PROPERTY',
  UPDATE_PROPERTY_KEY = 'UPDATE_PROPERTY_KEY',
  UPDATE_PROPERTY_VALUE = 'UPDATE_PROPERTY_VALUE',
  DELETE_PROPERTY = 'DELETE_PROPERTY',
}
