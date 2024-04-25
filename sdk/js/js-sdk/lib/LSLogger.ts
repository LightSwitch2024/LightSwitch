import { LogLevel, Logger } from './types';

const LSLogger = (logLevel: LogLevel = LogLevel.INFO): Logger => ({
  debug: (message) => log(LogLevel.DEBUG, message, logLevel),
  info: (message) => log(LogLevel.INFO, message, logLevel),
  warning: (message) => log(LogLevel.WARNING, message, logLevel),
  error: (message) => log(LogLevel.ERROR, message, logLevel),
});

const log = (level: LogLevel, message: string, logLevel: LogLevel): void => {
  if (logLevel <= level) {
    const prefix = `[${LogLevel[level]}]`;
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${message}`);
        break;
      case LogLevel.INFO:
        console.log(`${prefix} ${message}`);
        break;
      case LogLevel.WARNING:
        console.warn(`${prefix} ${message}`);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
        break;
    }
  }
};

export { LSLogger, LogLevel };
