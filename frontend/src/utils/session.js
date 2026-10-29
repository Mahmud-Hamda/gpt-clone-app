const SESSION_STORAGE_KEY = 'gpt-clone.session-id';

/**
 * Returns this browser's anonymous chat session id, creating one on first use.
 *
 * The id is a random UUID kept in `localStorage`. The backend uses it to keep
 * each visitor's chat history separate; it is not a login and identifies nobody.
 *
 * @returns {string}
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
};
