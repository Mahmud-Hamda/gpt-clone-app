import { HttpError } from "../utils/http-error.js";

/**
 * Forwards a 404 error for any request that did not match a route.
 *
 * @type {import("express").RequestHandler}
 */
export const notFoundHandler = (req, _res, next) => {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found.`));
};
