import { jest, describe, expect, it, afterEach } from '@jest/globals';
import LSClient from '../lib/LSClient';
import { LogLevel, SdkConfig } from '../lib/types';
// getRequest 모듈을 mock으로 대체하여 외부 의존성을 제어한다

describe('LSClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('LSClient는 항상 같은 인스턴스를 반환해야한다.', () => {
    // Arrange
    const instance1 = LSClient.getInstance();
    const instance2 = LSClient.getInstance();

    // Act & Assert
    expect(instance1).toBe(instance2);
  });

  it('init 함수 호출 후에는 isInitialized가 true로 반환된다.', async () => {
    // Arrange
    const instance = LSClient.getInstance();

    // Act
    await instance.init({
      sdkKey: 'testSdkKey',
      onFlagChanged: jest.fn(),
      endpoint: 'https://lightswitch.kr',
    });

    // Assert
    expect(LSClient.isInitialized).toBe(true);
  });

  it('init 함수는 오직 한번만 실행된다.', async () => {
    // Arrange
    const instance = LSClient.getInstance();
    const consoleLogSpy = jest.spyOn(console, 'log');

    // Act
    await instance.init({
      sdkKey: '32a832f30e1a4130af7e4a068ea103a1',
      onFlagChanged: jest.fn(),
      endpoint: 'https://lightswitch.kr',
    });
    await instance.init({
      sdkKey: '32a832f30e1a4130af7e4a068ea103a1',
      onFlagChanged: jest.fn(),
      endpoint: 'https://lightswitch.kr',
    });

    // Assert
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('lightswitch is already initialized, skip init process'),
    );
  });

  it('sdkKey가 없는경우 오류를 Throw 한다.', async () => {
    // Arrange
    const instance = LSClient.getInstance();

    // Act & Assert
    await expect(
      instance.init({
        sdkKey: '',
        onFlagChanged: jest.fn(),
        endpoint: 'https://lightswitch.kr',
      }),
    ).rejects.toThrow();
  });
});
