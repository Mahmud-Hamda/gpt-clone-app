import { Bot } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './MessageList.module.css';

/** @typedef {import('../../services/chatService').Message} Message */

/**
 * Scrollable list of chat messages with a typing indicator.
 * Automatically scrolls to the newest message.
 *
 * @param {Object} props
 * @param {Message[]} [props.messages=[]]
 * @param {boolean} [props.isLoading=false] - Shows the typing indicator while a reply is pending.
 * @returns {JSX.Element}
 */
const MessageList = ({ messages = [], isLoading = false }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className={styles.messages}>
      {messages.length === 0 ? (
        <div className={styles.empty}>What are you working on?</div>
      ) : (
        messages.map(({ id, role, content }) => (
          <ChatMessage key={id} role={role} content={content} />
        ))
      )}

      {isLoading && (
        <div className={styles.loadingContainer} aria-label='Assistant is typing'>
          <div className={styles.loadingAvatar}>
            <Bot size={18} color='white' />
          </div>
          <div className={styles.loading}>
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
