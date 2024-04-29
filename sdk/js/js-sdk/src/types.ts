export interface SdkConfig {
  key: String;
  endpoint: String;
  logLevel: String;
}

export interface ILSClient {
  init: (config: SdkConfig) => Promise<void>;

  getFlags: () => Promise<void>;
  /**
   * Returns the current flags
   */
  // getAllFlags: () => IFlags<>;
  /**
   * Identify user, triggers a call to get flags if flagsmith.init has been called
   */
  // identify: (userId: string, traits?: Record<T, Value>) => Promise<void>;
  /**
   * Retrieves the current state of flagsmith
   */
  // getState: () => IState;
  /**
   * Set the current state of flagsmith
   */
  // setState: (state: IState) => void;

  // hasFeature: (key: F) => boolean;

  /**
   * Get the value of a particular remote config e.g. flagsmith.getValue("font_size")
   */
  // getValue<T = Value>(key: F, options?: GetValueOptions<T>): Value<T>;

  /**
   * Whether the flagsmith SDK is initialised
   */
  initialised?: boolean;
}
