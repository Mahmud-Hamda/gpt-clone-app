import { pool } from "../../config/database.js";

/**
 * @typedef {"user" | "assistant"} MessageRole
 */

/**
 * A single chat message as returned by the API.
 *
 * @typedef {Object} Message
 * @property {number} id
 * @property {MessageRole} role
 * @property {string} content
 * @property {number} tokenCount - Total tokens Gemini used to produce an assistant reply (`0` for user messages).
 * @property {Date} createdAt
 */

const MESSAGE_COLUMNS = "id, role, content, token_count, created_at";

/**
 * Maps a raw `conversations` row (snake_case) to a {@link Message} (camelCase).
 *
 * @param {import("mysql2").RowDataPacket} row
 * @returns {Message}
 */
const toMessage = (row) => ({
  id: row.id,
  role: row.role,
  content: row.content,
  tokenCount: Number(row.token_count ?? 0),
  createdAt: row.created_at,
});

/**
 * Returns a session's most recent messages in chronological order (oldest first).
 *
 * @param {string} sessionId - Anonymous id of the browser session that owns the messages.
 * @param {number} limit - Maximum number of messages to return.
 * @returns {Promise<Message[]>}
 */
export const findRecentMessages = async (sessionId, limit) => {
  // `query` (not `execute`): MySQL 8.0.22+ and TiDB reject a prepared-statement placeholder for LIMIT
  const [rows] = await pool.query(
    `SELECT ${MESSAGE_COLUMNS} FROM conversations WHERE session_id = ? ORDER BY id DESC LIMIT ?`,
    [sessionId, limit],
  );

  return rows.map(toMessage).reverse();
};

/**
 * Finds a single message by its id.
 *
 * @param {number} id
 * @returns {Promise<Message | null>} The message, or `null` if it does not exist.
 */
const findMessageById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT ${MESSAGE_COLUMNS} FROM conversations WHERE id = ? LIMIT 1`,
    [id],
  );

  return rows[0] ? toMessage(rows[0]) : null;
};

/**
 * Inserts a message into a session and returns the stored record.
 *
 * @param {Object} message
 * @param {string} message.sessionId
 * @param {MessageRole} message.role
 * @param {string} message.content
 * @param {number} [message.tokenCount=0]
 * @returns {Promise<Message>}
 */
export const insertMessage = async ({ sessionId, role, content, tokenCount = 0 }) => {
  const [result] = await pool.execute(
    "INSERT INTO conversations (session_id, role, content, token_count) VALUES (?, ?, ?, ?)",
    [sessionId, role, content, tokenCount],
  );

  return findMessageById(result.insertId);
};
