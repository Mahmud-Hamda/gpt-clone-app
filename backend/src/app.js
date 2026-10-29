import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found-handler.js";
import { apiRateLimiter } from "./middleware/rate-limit.js";
import { apiRouter } from "./routes/index.js";

/**
 * The Express application.
 *
 * This module is also the Vercel entry point: Vercel detects `src/app.js`,
 * and runs its default export as a serverless function.
 *
 * @type {import("express").Express}
 */
const app = express();

app.disable("x-powered-by");

// Behind Vercel's proxy, trust one hop so `req.ip` is the visitor's IP (used by the rate limiters)
if (env.isVercel) {
  app.set("trust proxy", 1);
}

app.use(cors({ origin: env.clientOrigins }));
app.use(express.json({ limit: "16kb" }));

app.use("/api", apiRateLimiter, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
