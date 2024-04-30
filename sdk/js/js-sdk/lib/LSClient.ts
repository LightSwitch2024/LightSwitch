import { SdkConfig, LogLevel } from './types';
import { LSLogger } from './LSLogger';
import { getRequest, postRequest } from './utils';

const IS_DEV = true;

const logger = LSLogger(LogLevel.DEBUG);

const SERVER_URL = IS_DEV ? 'http://localhost:8000' : 'https://k10s202.p.ssafy.io';

const INIT_REQUEST_PATH = SERVER_URL + '/users/hello';
const FEATURE_REQUEST_PATH = SERVER_URL + '/api/v1/feature';
class LSClient {
  private isInitialized = false;
  private sdkKey = '';
  private logLevel = LogLevel.DEBUG; // 로그 레벨
  private lastUpdated = ''; // feature flag 데이터 갱신 날짜
  private flags: Record<string, any> = {};

  public async init(config: SdkConfig): Promise<void> {
    const { sdkKey, logLevel } = config;
    this.sdkKey = sdkKey;

    if (!sdkKey) {
      throw new Error('Please specify a Light Switch sdk key');
    }

    await this.getInitData();

    this.isInitialized = true;
    logger.info('success to initialize client sdk');
  }

  private async getInitData(): Promise<void> {
    try {
      const response = await getRequest(INIT_REQUEST_PATH);
      logger.info(`receive init data : ${JSON.stringify(response)}`);
    } catch (error) {
      logger.error(`failed to request ${INIT_REQUEST_PATH}, ${error}`);
    }
  }

  public isEnabled(): boolean {
    return this.isInitialized;
  }

  // 실제 동작을 구현해야 함
  public getFlags(): Record<string, any> {
    logger.debug('call getFlags');
    return this.flags;
  }

  // 실제 동작을 구현해야 함
  public getAllFlags(): void {
    // Implement the functionality
  }

  // 실제 동작을 구현해야 함
  public onFlagChanged(): void {
    logger.debug('call onFlagChanged');
    // Implement the functionality
  }

  // 실제 동작을 구현해야 함
  public destroy(): void {
    logger.debug('call destroy');
    // Implement the functionality
  }
}

export default LSClient;
