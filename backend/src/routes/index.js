import { Router } from "express";
import { chatRouter } from "../modules/chat/chat.routes.js";

/**
 * Root API router, mounted at `/api`.
 *
 * @type {import("express").Router}
 */
export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

apiRouter.use("/chat", chatRouter);
