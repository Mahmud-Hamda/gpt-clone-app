import dotenv from "dotenv";

dotenv.config({ quiet: true });

const DEFAULT_CLIENT_ORIGINS = "http://localhost:5173,http://localhost:5174";
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

/**
 * Splits a comma-separated string into trimmed, non-empty values.
 *
 * @param {string} value - Comma-separated list, e.g. `"a, b,c"`.
 * @returns {string[]} The individual values, e.g. `["a", "b", "c"]`.
 */
const parseList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

/**
 * Application configuration, resolved once from environment variables.
 *
 * @typedef {Object} DatabaseConfig
 * @property {string | undefined} host
 * @property {number} port
 * @property {string | undefined} user
 * @property {string | undefined} password
 * @property {string | undefined} name
 * @property {boolean} useSsl - Whether to connect over TLS (required by most hosted MySQL providers).
 * @property {string | undefined} sslCa - PEM-encoded CA certificate for providers with a private CA.
 *
 * @typedef {Object} GeminiConfig
 * @property {string | undefined} apiKey
 * @property {string} model
 *
 * @typedef {Object} EnvConfig
 * @property {number} port - Port for the local HTTP server.
 * @property {boolean} isVercel - True when running as a Vercel Function (behind Vercel's proxy).
 * @property {string[]} clientOrigins - Frontend origins allowed by CORS.
 * @property {DatabaseConfig} database
 * @property {GeminiConfig} gemini
 */

/** @type {Readonly<EnvConfig>} */
export const env = Object.freeze({
  port: Number(process.env.PORT) || 5002,
  isVercel: Boolean(process.env.VERCEL),
  clientOrigins: parseList(process.env.CLIENT_ORIGINS ?? DEFAULT_CLIENT_ORIGINS),
  database: Object.freeze({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    useSsl: process.env.DB_SSL === "true",
    sslCa: process.env.DB_SSL_CA || undefined,
  }),
  gemini: Object.freeze({
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
  }),
});
