import { ApiError } from "@google/genai";
import { env } from "../../config/env.js";
import { geminiClient } from "../../config/gemini.js";
import { HttpError } from "../../utils/http-error.js";
import { SYSTEM_INSTRUCTION } from "./chat.prompt.js";
import { findRecentMessages, insertMessage } from "./chat.repository.js";

/** @typedef {import("./chat.repository.js").Message} Message */

/** Number of messages returned to the client when the page loads. */
const CHAT_HISTORY_LIMIT = 100;

/**
 * Number of previous messages sent to Gemini as context.
 * Kept even so the history always starts with a user turn.
 */
const CONTEXT_WINDOW_SIZE = 6;

const GENERATION_CONFIG = Object.freeze({
  temperature: 0.7,
  maxOutputTokens: 1024,
  systemInstruction: SYSTEM_INSTRUCTION,
});

/**
 * Converts stored messages to the Gemini chat history format.
 * Gemini names the assistant role `"model"` instead of `"assistant"`.
 *
 * @param {Message[]} messages
 * @returns {import("@google/genai").Content[]}
 */
const toGeminiHistory = (messages) =>
  messages.map(({ role, content }) => ({
    role: role === "assistant" ? "model" : "user",
    parts: [{ text: content }],
  }));

/**
 * Translates a failed Gemini call into an error that is safe and helpful to
 * show in the chat. Gemini's own messages are logged, never sent to the client.
 *
 * @param {unknown} error - Error thrown by the Gemini SDK.
 * @returns {HttpError}
 */
const toAssistantError = (error) => {
  console.error("Gemini request failed:", error);

  const status = error instanceof ApiError ? error.status : undefined;

  if (status === 429) {
    return new HttpError(
      503,
      "The assistant has reached its free usage limit for now. Please try again in a few minutes, or come back tomorrow.",
    );
  }

  if (status === 500 || status === 503 || status === 504) {
    return new HttpError(
      503,
      "The assistant is busy right now. Please try again in a moment.",
    );
  }

  return new HttpError(502, "The assistant couldn't answer right now. Please try again later.");
};

/**
 * Asks Gemini to answer a question, given the previous conversation as context.
 *
 * @param {string} question
 * @param {Message[]} history - Previous messages, oldest first.
 * @returns {Promise<{ text: string, tokenCount: number }>}
 * @throws {HttpError} 503 when the Gemini quota is used up or Gemini is overloaded; 502 for other Gemini failures.
 */
const generateAssistantReply = async (question, history) => {
  const chat = geminiClient.chats.create({
    model: env.gemini.model,
    history: toGeminiHistory(history),
    config: GENERATION_CONFIG,
  });

  try {
    const response = await chat.sendMessage({ message: question });

    return {
      text: response.text ?? "",
      tokenCount: response.usageMetadata?.totalTokenCount ?? 0,
    };
  } catch (error) {
    throw toAssistantError(error);
  }
};

/**
 * Returns a session's chat history, shown when the app loads.
 *
 * @param {string} sessionId
 * @returns {Promise<Message[]>} Messages, oldest first.
 */
export const getChatHistory = (sessionId) => findRecentMessages(sessionId, CHAT_HISTORY_LIMIT);

/**
 * Answers a user's question and stores both sides of the exchange in their session.
 *
 * Only that session's previous messages are sent to Gemini as context.
 * The reply is generated before anything is saved, so a failed Gemini call
 * never leaves an unanswered question in the database.
 *
 * @param {string} sessionId
 * @param {string} question - The user's question (already validated and trimmed).
 * @returns {Promise<{ userMessage: Message, assistantMessage: Message }>}
 */
export const askAssistant = async (sessionId, question) => {
  const history = await findRecentMessages(sessionId, CONTEXT_WINDOW_SIZE);
  const reply = await generateAssistantReply(question, history);

  const userMessage = await insertMessage({ sessionId, role: "user", content: question });
  const assistantMessage = await insertMessage({
    sessionId,
    role: "assistant",
    content: reply.text,
    tokenCount: reply.tokenCount,
  });

  return { userMessage, assistantMessage };
};
