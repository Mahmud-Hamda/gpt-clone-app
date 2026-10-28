import { HttpError } from "../../utils/http-error.js";
import { askAssistant, getChatHistory } from "./chat.service.js";

/**
 * `GET /api/chat/messages` — returns the stored chat history.
 *
 * @type {import("express").RequestHandler}
 */
export const getMessages = async (_req, res) => {
  const messages = await getChatHistory();

  res.status(200).json({
    success: true,
    message: "Messages fetched successfully.",
    data: { messages },
  });
};

/**
 * `POST /api/chat/messages` — sends a question to the assistant and returns
 * both the stored question and the assistant's reply.
 *
 * @type {import("express").RequestHandler}
 * @throws {HttpError} 400 when `question` is missing or blank.
 */
export const createMessage = async (req, res) => {
  const question = req.body?.question;

  if (typeof question !== "string" || !question.trim()) {
    throw new HttpError(400, "Question is required.");
  }

  const { userMessage, assistantMessage } = await askAssistant(question.trim());

  res.status(201).json({
    success: true,
    message: "Message created successfully.",
    data: { userMessage, assistantMessage },
  });
};
