import { GoogleGenAI } from "@google/genai";
import { env } from "./env.js";

/**
 * Google Gemini API client.
 *
 * @type {GoogleGenAI}
 */
export const geminiClient = new GoogleGenAI({ apiKey: env.gemini.apiKey });
