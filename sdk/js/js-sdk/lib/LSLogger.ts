import { LogLevel, Logger } from './types';
const LSLogger = (logLevel: LogLevel = LogLevel.INFO): Logger => ({
  debug: (message) => log(LogLevel.DEBUG, message, logLevel),
  info: (message) => log(LogLevel.INFO, message, logLevel),
  warning: (message) => log(LogLevel.WARNING, message, logLevel),
  error: (message) => log(LogLevel.ERROR, message, logLevel),
});

const log = (level: LogLevel, message: any, logLevel: LogLevel): void => {
  // 사용자가 설정한 로그 수준(logLevel)보다 실제 로그 레벨(level)이 높거나 같은 경우에만 로그를 출력합니다.
  if (level >= logLevel) {
    const now = new Date();
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // 밀리세컨드 값
    const timestamp = `${now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}.${milliseconds}`;
    const prefix = `[${timestamp} LightSwitch ${LogLevel[level]}] :`;

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
export { LSLogger };
