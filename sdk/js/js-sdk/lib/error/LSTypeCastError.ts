class LSTypeCastError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LSTypeCastError';
  }
}
