import { describe, expect } from '@jest/globals';
import {
  getRequest,
  postRequest,
  getHashedPercentageForObjectIds,
  compareObjectsAndMaps,
} from '../lib/utils';

describe('getRequest', () => {
  it('should make a successful GET request', async () => {
    const data = await getRequest('https://jsonplaceholder.typicode.com/posts/1');
    expect(data.userId).toBe(1);
  });

  it('should throw an error if GET request fails due to network error', async () => {
    await expect(getRequest('https://nonexistentwebsite123456789.com')).rejects.toThrow();
  });

  it('should throw an error if GET request fails due to invalid URL', async () => {
    await expect(getRequest('invalid-url')).rejects.toThrow();
  });

  it('should throw an error if GET request returns non-ok status', async () => {
    const url = 'https://jsonplaceholder.typicode.com/posts/99999'; // Assuming this returns 404
    await expect(getRequest(url)).rejects.toThrow();
  });
});

describe('postRequest', () => {
  it('should make a successful POST request', async () => {
    const data = await postRequest('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    });
    expect(data.id).toBeDefined();
  });

  it('should throw an error if POST request fails due to network error', async () => {
    await expect(
      postRequest('https://nonexistentwebsite123456789.com', {}),
    ).rejects.toThrow();
  });

  it('should throw an error if POST request fails due to invalid URL', async () => {
    await expect(postRequest('invalid-url', {})).rejects.toThrow();
  });

  it('should throw an error if POST request returns non-ok status', async () => {
    const url = 'https://jsonplaceholder.typicode.com/posts/99999'; // Assuming this returns 404
    await expect(postRequest(url, {})).rejects.toThrow();
  });
});

describe('getHashedPercentageForObjectIds', () => {
  it('should return a percentage value between 0 and 100', () => {
    const objectIds = ['123', '456', '789'];
    const iterations = 1;
    const result = getHashedPercentageForObjectIds(objectIds, iterations);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should return different values for different iterations', () => {
    const objectIds = ['123', '456', '789'];
    const iterations1 = 1;
    const iterations2 = 2;
    const result1 = getHashedPercentageForObjectIds(objectIds, iterations1);
    const result2 = getHashedPercentageForObjectIds(objectIds, iterations2);
    expect(result1).not.toEqual(result2);
  });
});

describe('compareObjectsAndMaps', () => {
  it('should return true when objects and maps have same key-value pairs', () => {
    // Arrange
    const obj = [
      { property: 'key1', data: 'value1' },
      { property: 'key2', data: 'value2' },
    ];
    const map = new Map<string, string>([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);

    // Act
    const result = compareObjectsAndMaps(obj, map);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when objects and maps have different key-value pairs', () => {
    // Arrange
    const obj = [
      { property: 'key1', data: 'value1' },
      { property: 'key2', data: 'value2' },
    ];
    const map = new Map<string, string>([
      ['key1', 'value1'],
      ['key3', 'value3'],
    ]);

    // Act
    const result = compareObjectsAndMaps(obj, map);

    // Assert
    expect(result).toBe(false);
  });

  it('should return true when objects and maps have different key-value pairs (reverse order)', () => {
    // Arrange
    const obj = [
      { property: 'key1', data: 'value1' },
      { property: 'key2', data: 'value2' },
    ];
    const map = new Map<string, string>([
      ['key2', 'value2'],
      ['key1', 'value1'],
    ]);

    // Act
    const result = compareObjectsAndMaps(obj, map);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when objects and maps have different key-value pairs (missing key)', () => {
    // Arrange
    const obj = [
      { property: 'key1', data: 'value1' },
      { property: 'key2', data: 'value2' },
    ];
    const map = new Map<string, string>([['key1', 'value1']]);

    // Act
    const result = compareObjectsAndMaps(obj, map);

    // Assert
    expect(result).toBe(false);
  });
});
