import {
  SdkConfig,
  LogLevel,
  ApiResponse,
  Flag,
  ErrorCallback,
  userKey,
  LSMessage,
  ILSClient,
  ILSUser,
} from './types';
import { LSLogger } from './LSLogger';
import { getRequest, postRequest, getHashedPercentageForObjectIds } from './utils';
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

class LSClient implements ILSClient {
  // javascript 싱글톤 레퍼런스 찾아보기
  // private static instance: LSClient | null = null;

  // private constructor() {}

  // public static getInstance(): LSClient {
  //   if (!LSClient.instance) {
  //     LSClient.instance = new LSClient();
  //   }
  //   return LSClient.instance;
  // }

  isInitialized = false;
  private sdkKey = '';
  private logLevel = LogLevel.DEBUG; // 로그 레벨
  private lastUpdated = ''; // feature flag 데이터 갱신 날짜
  private flags: Flag[] = [];
  private onError: null | ErrorCallback = null;
  private eventSource: null | ReconnectingEventSource = null;
  private userKey = '';
  private reconnectTime = 3000;
  public async init(config: SdkConfig): Promise<void> {
    const { sdkKey, logLevel, onError, reconnectTime } = config;

    this.sdkKey = sdkKey;

    if (reconnectTime) {
      this.reconnectTime = reconnectTime;
    }

    if (onError) {
      this.onError = onError;
    }

    if (!sdkKey) {
      throw new Error('Please specify a Light Switch sdk key');
    }

    await this.getInitData();

    logger.debug('success to getInitData');

    await this.getUserKey();

    logger.debug('success to getUserKey, start connecting SSE');

    if (!this.userKey) {
      throw new Error('Failed to get data for sse connection');
    }

    this.eventSource = new ReconnectingEventSource(
      SSE_CONNECT_PATH + '/' + this.userKey,
      {
        // indicating if CORS should be set to include credentials, default `false`
        withCredentials: true,
        // the maximum time to wait before attempting to reconnect in ms, default `3000`
        // note: wait time is randomised to prevent all clients from attempting to reconnect simultaneously
        max_retry_time: reconnectTime,
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
      const newFlags: Flag[] = response.data;
      newFlags.forEach((flag) => {
        this.flags.push(flag);
      });
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
  public getFlag(name: string, LSUser: ILSUser): any {
    logger.info('call getFlags');
    if (!this.isInitialized) {
      new Error('LightSwitch is not initialized.');
    }
    logger.info(this.flags);
    const flag = this.flags.find((flag) => {
      return flag.title === name;
    });
    if (!flag) {
      this.onError?.(new Error('flag is not defined'));
    }
    //
    if (flag?.active) {
      // 플래그가 켜져 있는경우 사용자가 속하는 portion 계산하기
      let percentage = getHashedPercentageForObjectIds([LSUser.getUserId()], 1);
      logger.info(percentage);

      flag.variations?.forEach((variation) => {
        percentage -= variation.portion;
        if (percentage < 0) {
          return variation.value;
        }
      });
      return flag.defaultValue;
    } else {
      // 플래그가 꺼져 있는경우 default value return
      return flag?.defaultValue;
    }
  }

  // 실제 동작을 구현해야 함
  public getAllFlags(): Flag[] {
    return this.flags;
    // Implement the functionality
  }

  // 실제 동작을 구현해야 함
  public onFlagChanged(callback: () => void): void {
    this.eventSource?.addEventListener('sse', (event: MessageEvent<LSMessage>) => {
      logger.info(`receive flag changed ${event.data}`);

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
  }
}

export default LSClient;
