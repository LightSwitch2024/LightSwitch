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
  FlagId,
} from './types';
import { LSLogger } from './LSLogger';
import { getRequest, postRequest, getHashedPercentageForObjectIds } from './utils';
import ReconnectingEventSource from 'reconnecting-eventsource';
import { log } from 'console';

const IS_DEV = true;

const logger = LSLogger(LogLevel.DEBUG);

const SERVER_URL = IS_DEV ? 'http://localhost:8000' : 'https://k10s202.p.ssafy.io';

const FLAG_NOT_FOUND = 1000;
const VARIATION_NOT_FOUND = 1001;
const MEMBER_NOT_FOUND = 2000;
const SDK_KEY_ALREADY_EXISTS = 3000;
const SDK_KEY_NOT_FOUND = 3001;

const INIT_REQUEST_PATH = SERVER_URL + '/api/v1/sdk/init';
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
  // private lastUpdated = ''; // feature flag 데이터 갱신 날짜
  private flags: Flag[] = [];
  private onError: null | ErrorCallback = null;
  private onFlagChanged: null | flagChangedCallback = null;
  private eventSource: null | ReconnectingEventSource = null;
  private userKey = '';
  private reconnectTime = 3000;
  public async init(config: SdkConfig): Promise<void> {
    const { sdkKey, logLevel, onError, onFlagChanged, reconnectTime } = config;

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

    this.eventSource = this.getEventSource(
      '/8030ca7d78fb464fb9b661a715bbab13',
      this.reconnectTime,
    );
    this.addSseListener();
    this.isInitialized = true;
    logger.info('success to initialize client sdk');
  }

  private getEventSource(
    userKey: string,
    reconnectTime: number,
  ): ReconnectingEventSource {
    return new ReconnectingEventSource(SSE_CONNECT_PATH + userKey, {
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
        this.flags.push(flag);
      });

      this.onFlagChanged?.(this.flags);

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

  public getFlag(name: string, LSUser: ILSUser): any {
    // if (!this.isInitialized) {
    //   throw new Error('LightSwitch is not initialized.');
    // }
    logger.info('call getFlag');
    const flag = this.flags.find((flag) => {
      return flag.title === name;
    });
    if (!flag) {
      this.onError?.(new Error('flag is not defined'));
    }
    //
    if (flag?.active) {
      logger.info(
        `id : ${flag?.flagId} title : ${flag.title} is activated, start evaluate portion`,
      );
      // 플래그가 켜져 있는경우 사용자가 속하는 portion 계산하기
      let percentage = getHashedPercentageForObjectIds([LSUser.getUserId()], 1);
      logger.info(percentage);
      if (flag.variations) {
        for (let i = 0; i < flag.variations.length; i++) {
          const variation = flag.variations[i];
          percentage -= variation.portion;
          logger.info(`percentage : ${percentage}, portion : ${variation.portion}`);
          if (percentage < 0) {
            logger.info(`value : ${variation.value}`);
            return variation.value;
          }
        }
      }
      logger.info(`user does not belong to any portion. return defaultValue`);
      return flag.defaultValue;
    } else {
      // 플래그가 꺼져 있는경우 default value return
      logger.info(
        `id : ${flag?.flagId} title : ${flag?.title} is not activated, return defaultValue`,
      );
      return flag?.defaultValue;
    }
  }

  public getAllFlags(): Flag[] {
    return this.flags;
  }

  public addSseListener(): void {
    this.eventSource?.addEventListener('sse', (event: MessageEvent) => {
      logger.info(`receive flag changed ${event.data}`);
      // if (event.data.userKey != this.userKey) {
      // logger.error("receive incorrect data")
      // }

      logger.info(`current flag : ${JSON.stringify(this.flags)}`);
      logger.info(event.data);
      if (event.data === 'SSE connected') {
        return;
      }
      const data: LSMessage = JSON.parse(event.data);
      logger.info(data.type);
      // if (event.data.data === "")
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
          const switchData = data.data as FlagId;
          this.switchFlag(switchData);
          break;
      }

      logger.info(`updated flag : ${JSON.stringify(this.flags)}`);
      this.onFlagChanged?.(this.flags);
    });
  }
  private addFlag(flag: Flag): void {
    logger.info('addFlag call');
    this.flags.push(flag);
  }
  private updateFlag(newFlag: Flag): void {
    logger.info('updateFlag call');
    const index = this.flags.findIndex((flag) => flag.title === newFlag.title);
    if (index !== -1) {
      this.flags[index] = newFlag;
    } else {
      logger.error(`Flag with title ${newFlag.title} not found.`);
    }
  }
  private deleteFlag(title: Title): void {
    logger.info('deleteFlag call');
    const index = this.flags.findIndex((flag) => flag.title === title.title);
    if (index !== -1) {
      this.flags.splice(index, 1);
    } else {
      logger.error(`Flag with title ${title.title} not found.`);
    }
  }
  private switchFlag(flagId: FlagId): void {
    logger.info('switchFlag call');
    const index = this.flags.findIndex((flag) => flag.flagId === flagId.flagId);
    if (index !== -1) {
      this.flags[index].active = !this.flags[index].active;
    } else {
      logger.error(`Flag with id : ${flagId.flagId} not found.`);
    }
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
