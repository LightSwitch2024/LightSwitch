import CryptoJS from 'crypto-js';

export async function getRequest(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

// POST 요청
export async function postRequest(url: string, data?: any): Promise<any> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export function getHashedPercentageForObjectIds(
  objectIds: string[],
  iterations: number,
): number {
  let toHash = objectIds.join(',');
  toHash = toHash.repeat(Math.max(0, iterations));

  const hashedBytes = CryptoJS.MD5(toHash).toString();
  const no = BigInt('0x' + hashedBytes);

  let value = (Number(no % BigInt(9999)) / 9998) * 100;

  if (value === 100) {
    return getHashedPercentageForObjectIds(objectIds, iterations + 1);
  }

  return value;
}
