import LSClient from '../LSClient';
import { LogLevel, SdkConfig } from '../types';
import { getRequest } from '../utils';

// getRequest 모듈을 mock으로 대체하여 외부 의존성을 제어한다
jest.mock('../utils', () => ({
  getRequest: jest.fn(),
}));

describe('LSClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with valid sdk key', async () => {
    // Given
    const config: SdkConfig = {
      sdkKey: 'valid-sdk-key',
      logLevel: LogLevel.DEBUG,
      endpoint: '',
    };
    const lsClient = new LSClient();

    // When
    await lsClient.init(config);

    // Then
    expect(lsClient.isEnabled()).toBe(true);
  });

  it('should throw an error when initializing with empty sdk key', async () => {
    // Given
    const config: SdkConfig = {
      sdkKey: '', // Empty sdk key
      logLevel: LogLevel.DEBUG,
      endpoint: '',
    };
    const lsClient = new LSClient();

    // When
    await expect(lsClient.init(config)).rejects.toThrow(
      'Please specify a Light Switch sdk key',
    );
  });

  it('should request init data when initialized', async () => {
    // Given
    const config: SdkConfig = {
      sdkKey: 'valid-sdk-key',
      logLevel: LogLevel.DEBUG,
      endpoint: '',
    };
    const lsClient = new LSClient();

    // When
    await lsClient.init(config);

    // Then
    expect(getRequest).toHaveBeenCalledWith('http://localhost:8000/users/hello');
  });
});
