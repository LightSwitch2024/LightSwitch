import { LogLevel, ILSUser } from './types';
import { LSLogger } from './LSLogger';

const logger = LSLogger(LogLevel.DEBUG);

class LSUser implements ILSUser {
  userId: string = '';
  properties: Map<string, string> = new Map<string, string>();
  constructor(userId: string, properties?: object) {
    if (!userId) {
      throw new Error('Please specify a userId');
    }
    this.userId = userId;
    if (properties) {
      Object.entries(properties).forEach((entry) => {
        const [key, value] = entry;
        this.properties.set(key, value);
      });
    }
  }
  public getUserId(): string {
    return this.userId;
  }
}
export default LSUser;
