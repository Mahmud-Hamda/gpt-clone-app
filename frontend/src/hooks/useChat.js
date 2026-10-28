import { useCallback, useEffect, useState } from 'react';
import {
  fetchMessages,
  getErrorMessage,
  isRequestCanceled,
  sendMessage,
} from '../services/chatService';

/** @typedef {import('../services/chatService').Message} Message */

/**
 * Manages the chat history and sending questions to the assistant.
 *
 * Loads the history on mount, shows the user's question immediately while
 * the reply is pending, and replaces it with the stored version once the
 * server responds. On failure, the error is shown as an assistant message.
 *
 * @returns {{
 *   messages: Message[],
 *   isLoading: boolean,
 *   sendQuestion: (question: string) => Promise<void>,
 * }}
 */
export const useChat = () => {
  const [messages, setMessages] = useState(/** @type {Message[]} */ ([]));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchMessages({ signal: controller.signal })
      .then(setMessages)
      .catch((error) => {
        if (!isRequestCanceled(error)) {
          console.error('Failed to load chat history:', error);
        }
      });

    return () => controller.abort();
  }, []);

  const sendQuestion = useCallback(async (question) => {
    const pendingMessage = { id: crypto.randomUUID(), role: 'user', content: question };

    setMessages((previous) => [...previous, pendingMessage]);
    setIsLoading(true);

    try {
      const { userMessage, assistantMessage } = await sendMessage(question);

      setMessages((previous) => [
        ...previous.filter((message) => message.id !== pendingMessage.id),
        userMessage,
        assistantMessage,
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);

      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: 'assistant', content: getErrorMessage(error) },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendQuestion };
};
