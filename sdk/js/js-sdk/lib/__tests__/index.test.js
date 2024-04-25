const { add, subtract, multiply, divide, LSLogger } = require('../index');
describe('Calculator functions', () => {
  const logger = LSLogger(LogLevel.DEBUG);
  test('addition', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 2)).toBe(1);
    expect(add(0, 0)).toBe(0);
    logger.debug('qwewqe');
  });

  test('subtraction', () => {
    expect(subtract(3, 2)).toBe(1);
    expect(subtract(-1, -1)).toBe(0);
    expect(subtract(5, 10)).toBe(-5);
  });

  test('multiplication', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-1, 5)).toBe(-5);
    expect(multiply(0, 10)).toBe(0);
  });

  test('division', () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(-10, 2)).toBe(-5);
    expect(divide(0, 5)).toBe(0);
  });

  test('division by zero', () => {
    expect(() => divide(6, 0)).toThrow('Division by zero');
  });
});
