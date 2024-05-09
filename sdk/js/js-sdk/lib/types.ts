export type LSMessageData = Flag | Title | Switch | string;
export type LSFlagType = 'BOOLEAN' | 'STRING' | 'INTEGER';
export type LSDefaultValueType = boolean | string | number;
export type ErrorCallback = (error: any) => void;
export type flagChangedCallback = () => void;
export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}

export interface Logger {
  debug: (message: any) => void;
  info: (message: any) => void;
  warning: (message: any) => void;
  error: (message: any) => void;
}

export interface userKey {
  userKey: string;
}

export interface SdkConfig {
  sdkKey: string;
  onFlagChanged: flagChangedCallback;
  endpoint?: string;
  logLevel?: LogLevel;
  reconnectTime?: number;
  onError?: ErrorCallback;
}
export interface ILSUser {
  userId: null | string;
  properties: Map<string, string>;
  getUserId: () => string;
}

export interface ILSClient {
  isInitialized: boolean;

  init: (config: SdkConfig) => void;
  getFlag: (name: string, LSUser: ILSUser) => void;
  getBooleanFlag: (name: string, LSUser: ILSUser) => boolean;
  getIntegerFlag: (name: string, LSUser: ILSUser) => number;
  getStringFlag: (name: string, LSUser: ILSUser) => string;
  getAllFlags: () => void;
  destroy: () => void;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface LSMessage {
  userKey: string;
  type: string;
  data: LSMessageData;
}

export interface Title {
  title: string;
}

export interface Switch {
  title: string;
  active: boolean;
}

export type Flags = Map<string, Flag>;

export interface Flag {
  flagId: number;
  title: string;
  description: string;
  type: LSFlagType;
  keywords: Keyword[];
  defaultValue: LSDefaultValueType;
  defaultValuePortion?: number;
  defaultValueDescription?: string;
  variations?: Variation[];
  maintainerId: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  active: boolean;
}

export interface Variation {
  value: LSDefaultValueType;
  portion: number;
  description: string;
}

export interface Keyword {
  properties: Property[];
  value: string;
}

export interface Property {
  property: string;
  data: string;
}
