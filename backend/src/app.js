import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found-handler.js";
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
app.use(cors({ origin: env.clientOrigins }));
app.use(express.json());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
