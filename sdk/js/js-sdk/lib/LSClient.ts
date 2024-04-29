import {
  SdkConfig,
  LogLevel,
  ApiResponse,
  Flag,
  ErrorCallback,
  FlagErrorCallback,
  FlagChangedCallback,
} from './types';
import { LSLogger } from './LSLogger';
import { getRequest, postRequest } from './utils';
import _EventSource from 'reconnecting-eventsource';
import ReconnectingEventSource from 'reconnecting-eventsource';
import { error } from 'console';

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
const SSE_CONNECT_PATH = '/api/sse/subscribe/';
const SSE_RECEIVE_PATH = '/api/sse/publish/';

class LSClient {
  private isInitialized = false;
  private sdkKey = '';
  private logLevel = LogLevel.DEBUG; // 로그 레벨
  private lastUpdated = ''; // feature flag 데이터 갱신 날짜
  private flags: Record<string, any> = {};
  private onError: null | ErrorCallback = null;
  private eventSource: null | ReconnectingEventSource = null;
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

    this.eventSource = new ReconnectingEventSource(
      SERVER_URL + SSE_CONNECT_PATH + this.sdkKey,
    );

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
    this.eventSource?.addEventListener('sse', (event) => {
      const data = JSON.parse(event.data);
      console.log(`receive flag changed ${data.message}`);

      // Implement the functionality
      callback();
    });
  }

  public onFlagError(cb: (error: any) => void): void {
    if (this.eventSource) {
      this.eventSource.onerror = (err) => {
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
