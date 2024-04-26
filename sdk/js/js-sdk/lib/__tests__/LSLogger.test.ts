import { LSLogger } from '../LSLogger';
import { LogLevel } from '../types';

describe('LSLogger', () => {
  it('로그레벨 DEBUG 일때 로그 확인', () => {
    // Given
    const logger = LSLogger(LogLevel.DEBUG);
    const consoleDebugSpy = jest.spyOn(console, 'debug');

    // When
    logger.debug('This is a debug message');

    // Then
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining('LightSwitch DEBUG] : This is a debug message'),
    );
  });

  it('로그레벨 INFO 일때 로그 확인', () => {
    // Given
    const logger = LSLogger(LogLevel.INFO);
    const consoleLogSpy = jest.spyOn(console, 'log');

    // When
    logger.info('This is an info message');

    // Then
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('LightSwitch INFO] : This is an info message'),
    );
  });

  it('로그레벨 WARNING 일때 로그 확인', () => {
    // Given
    const logger = LSLogger(LogLevel.WARNING);
    const consoleWarnSpy = jest.spyOn(console, 'warn');

    // When
    logger.warning('This is a warning message');

    // Then
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('LightSwitch WARNING] : This is a warning message'),
    );
  });

  it('로그레벨 ERROR 일때 로그 확인', () => {
    // Given
    const logger = LSLogger(LogLevel.ERROR);
    const consoleErrorSpy = jest.spyOn(console, 'error');

    // When
    logger.error('This is an error message');

    // Then
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('LightSwitch ERROR] : This is an error message'),
    );
  });

  //   it('로그레벨 INFO 일때 DEBUG 로그 찍히지 않아야 함', () => {
  //     // Given
  //     const logger = LSLogger(LogLevel.INFO);
  //     const loggerDebugSpy = jest.spyOn(logger, 'debug');

  //     // When
  //     logger.debug('This is a debug message');

  //     // Then
  //     expect(loggerDebugSpy).not.toHaveBeenCalledWith('This is a debug message');
  //   });
});
