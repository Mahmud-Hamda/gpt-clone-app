import { Router } from "express";
import { createMessage, getMessages } from "./chat.controller.js";

/**
 * Chat routes, mounted at `/api/chat`.
 *
 * @type {import("express").Router}
 */
export const chatRouter = Router();

chatRouter.route("/messages").get(getMessages).post(createMessage);
