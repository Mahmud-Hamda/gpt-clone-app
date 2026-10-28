import { env } from "../../config/env.js";
import { geminiClient } from "../../config/gemini.js";
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
 * Asks Gemini to answer a question, given the previous conversation as context.
 *
 * @param {string} question
 * @param {Message[]} history - Previous messages, oldest first.
 * @returns {Promise<{ text: string, tokenCount: number }>}
 */
const generateAssistantReply = async (question, history) => {
  const chat = geminiClient.chats.create({
    model: env.gemini.model,
    history: toGeminiHistory(history),
    config: GENERATION_CONFIG,
  });

  const response = await chat.sendMessage({ message: question });

  return {
    text: response.text ?? "",
    tokenCount: response.usageMetadata?.totalTokenCount ?? 0,
  };
};

/**
 * Returns the chat history shown when the app loads.
 *
 * @returns {Promise<Message[]>} Messages, oldest first.
 */
export const getChatHistory = () => findRecentMessages(CHAT_HISTORY_LIMIT);

/**
 * Answers a user's question and stores both sides of the exchange.
 *
 * The reply is generated before anything is saved, so a failed Gemini call
 * never leaves an unanswered question in the database.
 *
 * @param {string} question - The user's question (already validated and trimmed).
 * @returns {Promise<{ userMessage: Message, assistantMessage: Message }>}
 */
export const askAssistant = async (question) => {
  const history = await findRecentMessages(CONTEXT_WINDOW_SIZE);
  const reply = await generateAssistantReply(question, history);

  const userMessage = await insertMessage({ role: "user", content: question });
  const assistantMessage = await insertMessage({
    role: "assistant",
    content: reply.text,
    tokenCount: reply.tokenCount,
  });

  return { userMessage, assistantMessage };
};
