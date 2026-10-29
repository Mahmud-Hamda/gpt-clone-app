import axios from 'axios';
import { getSessionId } from '../utils/session';

/**
 * @typedef {'user' | 'assistant'} MessageRole
 */

/**
 * A chat message. Messages created on the client before the server responds
 * have a temporary string id.
 *
 * @typedef {Object} Message
 * @property {number | string} id
 * @property {MessageRole} role
 * @property {string} content
 * @property {number} [tokenCount]
 * @property {string} [createdAt]
 */

const DEFAULT_API_BASE_URL = 'http://localhost:5002/api';
const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/** Longest question the backend accepts. */
export const MAX_QUESTION_LENGTH = 2000;

/**
 * Axios instance preconfigured with the backend base URL and this browser's
 * session id, so the backend only returns and extends this visitor's chat.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId(),
  },
});

/**
 * Fetches the stored chat history.
 *
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal] - Cancels the request when aborted.
 * @returns {Promise<Message[]>} Messages, oldest first.
 */
export const fetchMessages = async ({ signal } = {}) => {
  const { data } = await apiClient.get('/chat/messages', { signal });
  return data?.data?.messages ?? [];
};

/**
 * Sends a question to the assistant.
 *
 * @param {string} question
 * @returns {Promise<{ userMessage: Message, assistantMessage: Message }>}
 */
export const sendMessage = async (question) => {
  const { data } = await apiClient.post('/chat/messages', { question });
  return data.data;
};

/**
 * Checks whether an error came from an aborted request.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export const isRequestCanceled = (error) => axios.isCancel(error);

/**
 * Extracts a user-friendly message from an API or network error.
 *
 * @param {unknown} error
 * @returns {string}
 */
export const getErrorMessage = (error) =>
  error?.response?.data?.message ?? error?.message ?? FALLBACK_ERROR_MESSAGE;
