import { HttpError } from "../utils/http-error.js";

/**
 * Global Express error handler.
 *
 * Messages are shown to the client only when they were written for it: any
 * {@link HttpError}, or a 4xx error from middleware such as the JSON parser.
 * Every other error is logged and answered with a generic message, so
 * internal details never leak.
 *
 * @type {import("express").ErrorRequestHandler}
 */
export const errorHandler = (error, req, res, _next) => {
  const status = error?.status ?? error?.statusCode ?? 500;
  const isClientError = status >= 400 && status < 500;
  const isPublicMessage = error instanceof HttpError || isClientError;

  if (!isPublicMessage) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
  }

  res.status(status).json({
    success: false,
    message: isPublicMessage
      ? (error?.message ?? "Request failed.")
      : "Internal Server Error",
  });
};
