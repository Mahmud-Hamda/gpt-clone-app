import axios from 'axios';

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

/** Axios instance preconfigured with the backend base URL. */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
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
