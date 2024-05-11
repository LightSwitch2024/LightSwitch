import { describe, expect } from '@jest/globals';
import LSClient from '../lib/LSClient';
import { LogLevel, SdkConfig } from '../lib/types';
import { getRequest } from '../lib/utils';

// getRequest 모듈을 mock으로 대체하여 외부 의존성을 제어한다
jest.mock('../lib/utils', () => ({
  getRequest: jest.fn(),
}));

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
    await instance.init({ sdkKey: 'testSdkKey', onFlagChanged: jest.fn() });

    // Assert
    expect(instance.isInitialized).toBe(true);
  });

  it('sdkKey가 없는경우 오류를 Throw 한다.', async () => {
    // Arrange
    const instance = LSClient.getInstance();

    // Act & Assert
    await expect(instance.init({ sdkKey: '', onFlagChanged: jest.fn() })).rejects.toThrow(
      'Please specify a Light Switch sdk key',
    );
  });

  it('should throw an error when initializing with empty sdk key', async () => {
    // Given
    const config: SdkConfig = {
      sdkKey: 'valid-sdk-key',
      logLevel: LogLevel.DEBUG,
      endpoint: '',
      onFlagChanged: () => {},
    };
    const lsClient = LSClient.getInstance();

    // When
    await expect(lsClient.init(config)).rejects.toThrow(
      'Please specify a Light Switch sdk key',
    );
  });
});
