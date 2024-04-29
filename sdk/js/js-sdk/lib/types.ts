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

export type ErrorCallback = (error: any) => void;

export interface SdkConfig {
  sdkKey: string;
  endpoint?: string;
  logLevel?: LogLevel;
  onError?: ErrorCallback;
}

export interface ILSClient {
  isInitialized: boolean;

  init: (config: SdkConfig) => void;
  getFlags: () => void;
  getAllFlags: () => void;
  destroy: () => void;
}

export interface Variation {
  value: string;
  portion: number;
  description: string;
}

export interface Flag {
  flagId: number;
  title: string;
  description: string;
  type: string;
  defaultValue: string;
  defaultValuePortion: number;
  defaultValueDescription: string;
  variations: Variation[];
  maintainerId: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  active: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
