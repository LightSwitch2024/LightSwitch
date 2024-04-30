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

export interface Tag {
  colorHex: string;
  content: string;
}

export interface Flag {
  title: string;
  tags: Tag[];
  description: string;
  type: 'BOOLEAN' | 'NUMBER' | 'STRING'; // "BOOLEAN", "NUMBER", "STRING" 중 하나여야 함
  defaultValue: string;
  defaultValuePortion: number;
  defaultValueDescription: string;
  variation: string;
  variationPortion: number;
  variationDescription: string;
  userId: number;
}
