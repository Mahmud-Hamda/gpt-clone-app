import { Router } from "express";
import { questionBurstLimiter, questionDailyLimiter } from "../../middleware/rate-limit.js";
import { requireSession } from "../../middleware/require-session.js";
import { createMessage, getMessages } from "./chat.controller.js";

/**
 * Chat routes, mounted at `/api/chat`. Every route is scoped to the caller's
 * anonymous session (see {@link requireSession}).
 *
 * @type {import("express").Router}
 */
export const chatRouter = Router();

chatRouter.use(requireSession);

chatRouter
  .route("/messages")
  .get(getMessages)
  .post(questionBurstLimiter, questionDailyLimiter, createMessage);
