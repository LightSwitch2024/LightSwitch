import { SdkConfig } from './types';
import { LSLogger, LogLevel } from './LSLogger';

const logger = LSLogger(LogLevel.DEBUG);

function initLSClient(config: SdkConfig) {
  logger.debug('initialize client sdk');
}

function isEnabled(flagName: String) {
  logger.debug('call isEnabled');
}

function getAllFlags() {
  logger.debug('call getAllFlags');
}

function onFlagChanged() {
  logger.debug('call onFlagChanged');
}

function destroy() {
  logger.debug('call destroy');
}

export default initLSClient;
