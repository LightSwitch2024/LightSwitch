class LSFlagNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LSFlagNotFoundError';
  }
}
