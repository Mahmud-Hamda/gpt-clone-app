import { HttpError } from "../../utils/http-error.js";
import { askAssistant, getChatHistory } from "./chat.service.js";

/** Longest question accepted, to keep Gemini requests (and their cost) bounded. */
export const MAX_QUESTION_LENGTH = 2000;

/**
 * `GET /api/chat/messages` — returns the chat history of the caller's session.
 *
 * @type {import("express").RequestHandler}
 */
export const getMessages = async (req, res) => {
  const messages = await getChatHistory(req.sessionId);

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
 * @throws {HttpError} 400 when `question` is missing, blank, or too long.
 */
export const createMessage = async (req, res) => {
  const question = req.body?.question;

  if (typeof question !== "string" || !question.trim()) {
    throw new HttpError(400, "Question is required.");
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    throw new HttpError(400, `Questions can be at most ${MAX_QUESTION_LENGTH} characters.`);
  }

  const { userMessage, assistantMessage } = await askAssistant(req.sessionId, question.trim());

  res.status(201).json({
    success: true,
    message: "Message created successfully.",
    data: { userMessage, assistantMessage },
  });
};
