import { rateLimit } from "express-rate-limit";

const ONE_MINUTE_MS = 60 * 1000;
const ONE_DAY_MS = 24 * 60 * ONE_MINUTE_MS;

/**
 * Creates a per-IP rate limiter that answers in the API's JSON error format.
 *
 * Counters live in memory, so on Vercel each warm function instance keeps its
 * own count: the limits are a strong deterrent, not an exact global quota.
 *
 * @param {Object} options
 * @param {number} options.windowMs - Length of the counting window.
 * @param {number} options.limit - Requests allowed per IP in that window.
 * @param {string} options.message - Message returned with the 429 response.
 * @returns {import("express").RequestHandler}
 */
const createRateLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, res, _next, options) => {
      res.status(options.statusCode).json({ success: false, message });
    },
  });

/** Caps all API traffic, protecting the database from request floods. */
export const apiRateLimiter = createRateLimiter({
  windowMs: ONE_MINUTE_MS,
  limit: 60,
  message: "Too many requests. Please wait a minute and try again.",
});

/** Caps how fast one visitor can ask questions (each one uses Gemini quota). */
export const questionBurstLimiter = createRateLimiter({
  windowMs: ONE_MINUTE_MS,
  limit: 5,
  message: "You're asking questions too quickly. Please wait a minute and try again.",
});

/** Caps how many questions one visitor can ask per day. */
export const questionDailyLimiter = createRateLimiter({
  windowMs: ONE_DAY_MS,
  limit: 50,
  message: "You've reached today's question limit for this demo. Please come back tomorrow.",
});
