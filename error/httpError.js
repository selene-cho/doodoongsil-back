class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.result = 'error';
    this.status = status;
  }
}

module.exports = HttpError;
