import { ILSClient, Logger, SdkConfig } from './types';
import { LSLogger, LogLevel } from './LSLogger';
import { getRequest, postRequest } from './utils';

const IS_DEV = true;

const logger = LSLogger(LogLevel.DEBUG);

const SERVER_URL = IS_DEV ? 'https://k10s202.p.ssafy.io' : 'http://localhost:8000';

const INIT_REQUEST_PATH = SERVER_URL + '/api/v1';
const FEATURE_REQUEST_PATH = SERVER_URL + '/api/v1/feature';

const LSClient = class {
  isInitialized = false;
  sdkKey = '';
  logLevel = LogLevel.DEBUG; // 로그 레벨
  lastUpdated = ''; // feature flag 데이터 갱신 날짜
  flags = Object.assign({});

  init = (config: SdkConfig) => {
    try {
      const { sdkKey, logLevel } = config;
      this.sdkKey = sdkKey;

      if (!sdkKey) {
        throw new Error('Please specify a Light Switch sdk key');
      }

      this.getInitData();

      this.isInitialized = true;
      logger.debug('success to initialize client sdk');
    } catch (error) {
      logger.error(`failed to initialize client sdk error : ${error}`);
    }
  };
  getInitData = () => {
    return getRequest(INIT_REQUEST_PATH)
      .then((response) => {
        logger.info(`receive init data : ${response}`);
      })
      .catch((error) => {
        logger.error(`failed to request ${INIT_REQUEST_PATH}, error : ${error}`);
      });
  };

  isEnabled = () => {
    return this.isInitialized;
  };

  getFlags = () => {
    // getRequest(FEATURE_REQUEST_PATH)
    //   .then((response) => {
    //     logger.info(`receive init data : ${response}`);

    //   })
    //   .catch((error) => {
    //     logger.error(`failed to request ${FEATURE_REQUEST_PATH}, error : ${error}`);
    //   });

    logger.debug('call getFlags');
    return false;
  };
  getAllFlags = () => {};
  onFlagChanged = () => {
    logger.debug('call onFlagChanged');
  };

  destroy = () => {
    logger.debug('call destroy');
  };
};

export default LSClient;
