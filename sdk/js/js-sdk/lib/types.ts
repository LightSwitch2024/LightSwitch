export type LSMessageData = Flag | Title | FlagId | string;
export type LSFlagType = 'BOOLEAN' | 'STRING' | 'NUMBER';
export type LSDefaultValueType = boolean | string | number;
export type ErrorCallback = (error: any) => void;
export type flagChangedCallback = (flags: Flag[]) => void;
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
  property: null | Map<string, string>;
  getUserId: () => string;
}

export interface ILSClient {
  isInitialized: boolean;

  init: (config: SdkConfig) => void;
  getFlag: (name: string, LSUser: ILSUser) => void;
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

export interface FlagId {
  flagId: number;
}

export interface Flag {
  flagId: number;
  title: string;
  description: string;
  type: LSFlagType;
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
