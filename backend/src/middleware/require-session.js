import { HttpError } from "../utils/http-error.js";

/** Request header carrying the browser's anonymous session id. */
const SESSION_HEADER = "X-Session-Id";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Reads the anonymous session id (a UUID the browser generates and keeps in
 * `localStorage`) and exposes it as `req.sessionId`, so each visitor only sees
 * and continues their own conversation.
 *
 * @type {import("express").RequestHandler}
 * @throws {HttpError} 400 when the header is missing or not a UUID.
 */
export const requireSession = (req, _res, next) => {
  const sessionId = req.get(SESSION_HEADER);

  if (!sessionId || !UUID_PATTERN.test(sessionId)) {
    next(new HttpError(400, `A valid ${SESSION_HEADER} header is required.`));
    return;
  }

  req.sessionId = sessionId.toLowerCase();
  next();
};
