import { LogLevel, ILSUser } from './types';
import { LSLogger } from './LSLogger';

const logger = LSLogger(LogLevel.DEBUG);

class LSUser implements ILSUser {
  userId: string = '';
  property: null | Map<string, string> = null;
  constructor(userId: string, property?: Map<string, string>) {
    if (!userId) {
      throw new Error('Please specify a userId');
    }
    this.userId = userId;

    if (property) {
      this.property = property;
    }
  }
  public getUserId(): string {
    return this.userId;
  }
}
export default LSUser;
