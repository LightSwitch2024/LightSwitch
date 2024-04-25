import { LSLogger, LogLevel } from './LSLogger';
import LSClient from './LSClient';
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

export { add, subtract, multiply, divide, LSLogger, LogLevel, LSClient };
