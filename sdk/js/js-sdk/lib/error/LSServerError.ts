class LSServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LSServerError';
  }
}

export default LSServerError;
