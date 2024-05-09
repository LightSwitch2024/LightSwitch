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
  Title,
  flagChangedCallback,
  Switch,
  Flags,
  Property,
} from './types';
import { LSLogger } from './LSLogger';
import {
  getRequest,
  postRequest,
  getHashedPercentageForObjectIds,
  compareObjectsAndMaps,
} from './utils';
import ReconnectingEventSource from 'reconnecting-eventsource';
import LSUser from './LSUser';

const IS_DEV = true;

const logger = LSLogger(LogLevel.DEBUG);

const SERVER_URL = IS_DEV ? 'http://localhost:8000' : 'https://lightswitch.kr';

const FLAG_NOT_FOUND = 1000;
const VARIATION_NOT_FOUND = 1001;
const MEMBER_NOT_FOUND = 2000;
const SDK_KEY_ALREADY_EXISTS = 3000;
const SDK_KEY_NOT_FOUND = 3001;

const INIT_REQUEST_PATH = SERVER_URL + '/api/v1/sdk/init';
const SSE_CONNECT_PATH = SERVER_URL + '/api/v1/sse/subscribe';

class LSClient implements ILSClient {
  private static instance: LSClient | null = null;

  private constructor() {}

  public static getInstance(): LSClient {
    if (!LSClient.instance) {
      LSClient.instance = new LSClient();
    }
    return LSClient.instance;
  }

  isInitialized = false;
  private sdkKey = '';
  private logLevel = LogLevel.DEBUG; // 로그 레벨
  // private lastUpdated = ''; // feature flag 데이터 갱신 날짜
  private flags: Flags = new Map<string, Flag>();
  private onError: null | ErrorCallback = null;
  private eventSource: null | ReconnectingEventSource = null;
  private onFlagChanged: null | flagChangedCallback = null;
  private userKey = '';
  private reconnectTime = 3000;
  public async init(config: SdkConfig): Promise<void> {
    const { sdkKey, onError, onFlagChanged, reconnectTime } = config;

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
    if (!onFlagChanged) {
      throw new Error('Please specify a Light Switch flagChangedListener');
    }

    this.onFlagChanged = onFlagChanged;

    await this.getInitData();

    logger.debug('success to getInitData');

    await this.getUserKey();

    logger.debug('success to getUserKey, start connecting SSE');

    if (!this.userKey) {
      throw new Error('Failed to get data for sse connection');
    }

    this.eventSource = this.getEventSource(this.userKey, this.reconnectTime);
    this.addSseListener();
    this.isInitialized = true;
    logger.info('success to initialize client sdk');
  }
  private getVariationValue<T>(flag: Flag, LSUser: ILSUser): any {
    let percentage = getHashedPercentageForObjectIds([LSUser.getUserId()], 1);
    logger.info(percentage);
    if (flag.variations) {
      for (let i = 0; i < flag.variations.length; i++) {
        const variation = flag.variations[i];
        percentage -= variation.portion;
        logger.info(`percentage : ${percentage}, portion : ${variation.portion}`);
        if (percentage < 0) {
          logger.info(`value : ${variation.value}`);
          return variation.value as T;
        }
      }
    }
    return flag.defaultValue as T;
  }
  public getFlag<T>(name: string, LSUser: ILSUser): any {
    const flag = this.flags.get(name);
    if (!flag) {
      this.onError?.(new Error('flag is not defined'));
    }
    // if (flag?.type !== ('BOOLEAN' || 'STRING' || 'INTEGER')) {
    //   this.onError?.(new Error('not supported type'));
    // }

    if (flag?.active) {
      if (flag.keywords.length > 0 && LSUser.properties?.size > 0) {
        logger.info('flag contains keyword and user properties, evaluate keyword value');
        for (let i = 0; i < flag.keywords.length; i++) {
          const keyword = flag.keywords[i];
          const isEqual = compareObjectsAndMaps(keyword.properties, LSUser.properties);
          console.log(isEqual);
          if (isEqual) {
            console.log(`value : ${keyword.value}`);
            return keyword.value; // 이 부분에서 return을 사용하는 것은 함수 내부에서만 가능합니다.
          }
        }
      }
      logger.info(
        `id : ${flag?.flagId} title : ${flag.title} is activated, start evaluate portion`,
      );
      return this.getVariationValue<T>(flag, LSUser);
    } else {
      logger.info(
        `id : ${flag?.flagId} title : ${flag?.title} is not activated, return defaultValue`,
      );
      return flag?.defaultValue as T;
    }
  }

  public getBooleanFlag(name: string, LSUser: ILSUser): boolean {
    return this.getFlag<boolean>(name, LSUser);
  }
  public getIntegerFlag(name: string, LSUser: ILSUser): number {
    const data = this.getFlag<number>(name, LSUser);
    console.log(data);
    return data;
  }
  public getStringFlag(name: string, LSUser: ILSUser): string {
    return this.getFlag<string>(name, LSUser);
  }

  private getEventSource(
    userKey: string,
    reconnectTime: number,
  ): ReconnectingEventSource {
    return new ReconnectingEventSource(SSE_CONNECT_PATH + '/' + userKey, {
      // indicating if CORS should be set to include credentials, default `false`
      withCredentials: true,
      // the maximum time to wait before attempting to reconnect in ms, default `3000`
      // note: wait time is randomised to prevent all clients from attempting to reconnect simultaneously
      max_retry_time: reconnectTime,
      // underlying EventSource class, default `EventSource`
      eventSourceClass: EventSource,
    });
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
        this.flags.set(flag.title, flag);
      });

      this.onFlagChanged?.();

      logger.info(`receive init data : ${JSON.stringify(response)}`);
    } catch (error) {
      this.onError?.(error);
    }
  }
  private async getUserKey(): Promise<void> {
    try {
      logger.info(this.sdkKey);
      const response: ApiResponse<userKey> = await postRequest(`${SSE_CONNECT_PATH}`, {
        sdkKey: this.sdkKey,
      });
      if (response.code == SDK_KEY_NOT_FOUND) {
        throw new Error(response.message);
      }
      this.userKey = response.data.userKey;
      logger.info(`receive userKey data : ${JSON.stringify(response)}`);
    } catch (error) {
      this.onError?.(error);
    }
  }

  public getAllFlags(): Flags {
    return this.flags;
  }

  public addSseListener(): void {
    this.eventSource?.addEventListener('sse', (event: MessageEvent) => {
      if (event.data === 'SSE connected') {
        return;
      }
      const data: LSMessage = JSON.parse(event.data);
      logger.info(data.type);
      switch (data.type) {
        case 'CREATE':
          const createData = data.data as Flag;
          this.addFlag(createData);
          break;
        case 'UPDATE':
          const updateData = data.data as Flag;
          this.updateFlag(updateData);
          break;
        case 'DELETE':
          const deleteData = data.data as Title;
          this.deleteFlag(deleteData);
          break;
        case 'SWITCH': // not used
          const switchData = data.data as Switch;
          this.switchFlag(switchData);
          break;
      }

      this.flags.forEach((f) => {
        logger.info(`updated flag : ${JSON.stringify(f)}`);
      });

      this.onFlagChanged?.();
    });
  }

  private addFlag(flag: Flag): void {
    logger.info('addFlag call');

    this.flags.set(flag.title, flag);
  }

  private updateFlag(newFlag: Flag): void {
    logger.info('updateFlag call');

    this.flags.delete(newFlag.title);
    this.flags.set(newFlag.title, newFlag);
  }

  private deleteFlag(title: Title): void {
    logger.info('deleteFlag call');
    this.flags.delete(title.title);
  }

  private switchFlag(sw: Switch): void {
    logger.info('switchFlag call');

    const flag = this.flags.get(sw.title);
    const newFlag = JSON.parse(JSON.stringify(flag));
    newFlag.active = sw.active;
    this.flags.set(sw.title, newFlag);
    logger.info(newFlag);
  }

  public onFlagError(cb: (error: any) => void): void {
    if (!this.isInitialized) {
      throw new Error('LightSwitch is not initialized.');
    }
    if (this.eventSource) {
      this.eventSource.onerror = (err: any) => {
        this.eventSource?.close();
        cb(err);
      };
    }
  }

  public destroy(): void {
    if (!this.isInitialized) {
      throw new Error('LightSwitch is not initialized.');
    }
    this.eventSource?.close();
    this.isInitialized = false;
    logger.debug('call destroy');
  }
}

export default LSClient;
