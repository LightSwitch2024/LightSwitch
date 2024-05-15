import { jest, describe, expect, it, afterEach } from '@jest/globals';
import { LSFlagNotFoundError, LSServerError, LSTypeCastError } from '../lib/error';
describe('Exception', () => {
  // Exception Test
  it('should create an instance with the correct error message', () => {
    const errorMessage = '플래그가 존재하지 않습니다.';
    const error = new LSFlagNotFoundError(errorMessage);

    expect(error instanceof LSFlagNotFoundError).toBe(true);
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe('LSFlagNotFoundError');
  });

  it('should create an instance with the correct error message', () => {
    const errorMessage = '플래그를 캐스팅하는데 실패했습니다.';
    const error = new LSTypeCastError(errorMessage);

    expect(error instanceof LSTypeCastError).toBe(true);
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe('LSTypeCastError');
  });

  it('should create an instance with the correct error message', () => {
    const errorMessage = 'LightSwitch 서버와 통신에 실패했습니다.';
    const error = new LSServerError(errorMessage);

    expect(error instanceof LSServerError).toBe(true);
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe('LSServerError');
  });
});
