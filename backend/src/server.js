import app from "./app.js";
import { verifyDatabaseConnection } from "./config/database.js";
import { env } from "./config/env.js";

/**
 * Starts the HTTP server for local development and self-hosting.
 *
 * Verifies the database connection first and exits the process if it fails,
 * so a misconfigured `.env` is caught immediately rather than on the first request.
 *
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    await verifyDatabaseConnection();
    console.log("Connected to MySQL.");

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
