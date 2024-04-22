import { LSLogger, LogLevel, Logger } from './LSLogger';
import LSClient from './LSClient';
import types from './types';
import utils from './utils';
// for test
function add(a: number, b: number) {
  return a + b;
}
function subtract(a: number, b: number) {
  return a - b;
}
function multiply(a: number, b: number) {
  return a * b;
}
function divide(a: number, b: number) {
  return a / b;
}

export {
  add,
  subtract,
  multiply,
  divide,
  LSLogger,
  LogLevel,
  Logger,
  LSClient,
  types,
  utils,
};
