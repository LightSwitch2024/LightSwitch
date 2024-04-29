import { SdkConfig, LogLevel, ApiResponse, Flag, ErrorCallback, userKey } from './types';
import { LSLogger } from './LSLogger';
import { getRequest, postRequest } from './utils';
import ReconnectingEventSource from 'reconnecting-eventsource';

const IS_DEV = true;

const logger = LSLogger(LogLevel.DEBUG);

const SERVER_URL = IS_DEV ? 'http://localhost:8000' : 'https://k10s202.p.ssafy.io';

const FLAG_NOT_FOUND = 1000;
const VARIATION_NOT_FOUND = 1001;
const MEMBER_NOT_FOUND = 2000;
const SDK_KEY_ALREADY_EXISTS = 3000;
const SDK_KEY_NOT_FOUND = 3001;

const INIT_REQUEST_PATH = SERVER_URL + '/api/v1/sdk/init';
const FEATURE_REQUEST_PATH = SERVER_URL + '/api/v1/feature';
const SSE_CONNECT_PATH = SERVER_URL + '/api/v1/sse/subscribe';

class LSClient {
  private isInitialized = false;
  private sdkKey = '';
  private logLevel = LogLevel.DEBUG; // 로그 레벨
  private lastUpdated = ''; // feature flag 데이터 갱신 날짜
  private flags: Record<string, any> = {};
  private onError: null | ErrorCallback = null;
  private eventSource: null | ReconnectingEventSource = null;
  private userKey = '';
  public async init(config: SdkConfig): Promise<void> {
    const { sdkKey, logLevel, onError } = config;
    this.sdkKey = sdkKey;
    console.log(this.sdkKey);
    if (!sdkKey) {
      throw new Error('Please specify a Light Switch sdk key');
    }

    if (onError) {
      this.onError = onError;
    }

    await this.getInitData();

    await this.getUserKey();

    this.eventSource = new ReconnectingEventSource(
      SSE_CONNECT_PATH + '/' + this.userKey,
      {
        // indicating if CORS should be set to include credentials, default `false`
        withCredentials: true,
        // the maximum time to wait before attempting to reconnect in ms, default `3000`
        // note: wait time is randomised to prevent all clients from attempting to reconnect simultaneously
        max_retry_time: 3000,
        // underlying EventSource class, default `EventSource`
        eventSourceClass: EventSource,
      },
    );
    this.onFlagChanged(() => {});
    this.isInitialized = true;
    logger.info('success to initialize client sdk');
  }

  private async getInitData(): Promise<void> {
    try {
      const response: ApiResponse<Flag[]> = await postRequest(INIT_REQUEST_PATH, {
        sdkKey: this.sdkKey,
      });
      if (response.code == SDK_KEY_NOT_FOUND) {
        throw new Error(response.message);
      }

      logger.info(response.data);
      logger.info(`receive init data : ${JSON.stringify(response)}`);
    } catch (error) {
      this.onError?.(error);
    }
  }
  private async getUserKey(): Promise<void> {
    try {
      logger.info(this.sdkKey);
      const response: ApiResponse<userKey> = await postRequest(
        `${SSE_CONNECT_PATH}?sdkKey=${this.sdkKey}`,
      );
      if (response.code == SDK_KEY_NOT_FOUND) {
        throw new Error(response.message);
      }
      this.userKey = response.data.userKey;
      logger.info(`receive userKey data : ${JSON.stringify(response)}`);
    } catch (error) {
      this.onError?.(error);
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
  public onFlagChanged(callback: () => void): void {
    this.eventSource?.addEventListener('sse', (event: MessageEvent) => {
      console.log(`receive flag changed ${event.data}`);

      // Implement the functionality
      callback();
    });
  }

  public onFlagError(cb: (error: any) => void): void {
    if (this.eventSource) {
      this.eventSource.onerror = (err: any) => {
        this.eventSource?.close();
        cb(err);
      };
    }
  }
  // 실제 동작을 구현해야 함
  public destroy(): void {
    this.eventSource?.close();
    logger.debug('call destroy');
    // Implement the functionality
  }
}

export default LSClient;
