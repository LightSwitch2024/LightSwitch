const LSLogger = require('./LSLogger');
const LSClient = require('./LSClient');
const types = require('./types');
const utils = require('./utils');

// for test
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return a / b;
}
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  LSLogger,
  LSClient,
  types,
  utils,
};
