export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}

export interface Logger {
  debug: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
}

export interface SdkConfig {
  sdkKey: string;
  endpoint: string;
  logLevel: LogLevel;
}

export interface ILSClient {
  isInitialized: boolean;

  init: (config: SdkConfig) => void;
  getFlags: () => void;
  getAllFlags: () => void;
  destroy: () => void;
}
