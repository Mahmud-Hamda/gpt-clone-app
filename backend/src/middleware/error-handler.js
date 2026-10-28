/**
 * Global Express error handler.
 *
 * Client errors (4xx) return their own message; server errors (5xx) are
 * logged and return a generic message so internal details never leak.
 *
 * @type {import("express").ErrorRequestHandler}
 */
export const errorHandler = (error, req, res, _next) => {
  const status = error?.status ?? error?.statusCode ?? 500;
  const isClientError = status >= 400 && status < 500;

  if (!isClientError) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
  }

  res.status(status).json({
    success: false,
    message: isClientError
      ? (error?.message ?? "Request failed.")
      : "Internal Server Error",
  });
};
