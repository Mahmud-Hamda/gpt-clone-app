/**
 * An error that maps directly to an HTTP response status.
 *
 * Throw it anywhere in a request handler; the global error handler turns it
 * into a JSON response with the matching status code.
 *
 * @example
 * throw new HttpError(400, "Question is required.");
 */
export class HttpError extends Error {
  /**
   * @param {number} status - HTTP status code, e.g. `400` or `404`.
   * @param {string} message - Message that is safe to show to the client.
   */
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
