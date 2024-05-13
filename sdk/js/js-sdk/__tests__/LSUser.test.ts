import { jest, describe, expect, it } from '@jest/globals';
import LSUser from '../lib/LSUser';

// Describe 블록을 사용하여 테스트 스위트를 정의합니다.
describe('LSUser', () => {
  // LSUser 클래스의 생성자를 테스트합니다.
  describe('constructor', () => {
    // userId를 제공하지 않았을 때 예외를 던지는지 확인합니다.
    it('throws an error if userId is not provided', () => {
      // 예외가 발생하는지 확인합니다.
      expect(() => {
        new LSUser('');
      }).toThrow('Please specify a userId');
    });

    // userId를 제공했을 때 올바르게 생성되는지 확인합니다.
    it('creates an LSUser instance when userId is provided', () => {
      // LSUser 인스턴스를 생성합니다.
      const user = new LSUser('testUser');

      // 제대로 생성되었는지 확인합니다.
      expect(user.getUserId()).toBe('testUser');
    });

    // properties를 제공했을 때 올바르게 설정되는지 확인합니다.
    it('sets properties when provided', () => {
      // LSUser 인스턴스를 생성합니다.
      const properties = { age: '30', gender: 'male' };
      const user = new LSUser('testUser', properties);

      // properties가 올바르게 설정되었는지 확인합니다.
      expect(user.properties.get('age')).toBe('30');
      expect(user.properties.get('gender')).toBe('male');
    });
  });

  // getUserId 메서드를 테스트합니다.
  describe('getUserId', () => {
    // getUserId 메서드가 올바른 userId를 반환하는지 확인합니다.
    it('returns the correct userId', () => {
      // LSUser 인스턴스를 생성합니다.
      const user = new LSUser('testUser');

      // getUserId 메서드가 올바른 userId를 반환하는지 확인합니다.
      expect(user.getUserId()).toBe('testUser');
    });
  });
});
