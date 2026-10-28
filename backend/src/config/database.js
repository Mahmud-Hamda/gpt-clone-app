import mysql from "mysql2/promise";
import { env } from "./env.js";

const { database } = env;

/**
 * Shared MySQL connection pool used by every repository.
 *
 * @type {import("mysql2/promise").Pool}
 */
export const pool = mysql.createPool({
  host: database.host,
  port: database.port,
  user: database.user,
  password: database.password,
  database: database.name,
  ssl: database.useSsl
    ? { ca: database.sslCa, rejectUnauthorized: true }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Confirms the database is reachable by opening and releasing a connection.
 *
 * @returns {Promise<void>}
 * @throws {Error} When the database cannot be reached or the credentials are wrong.
 */
export const verifyDatabaseConnection = async () => {
  const connection = await pool.getConnection();
  connection.release();
};
