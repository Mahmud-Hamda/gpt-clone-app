import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatMessage.module.css';

/**
 * A single chat bubble. User messages are shown as plain text;
 * assistant messages are rendered as Markdown.
 *
 * @param {Object} props
 * @param {import('../../services/chatService').MessageRole} props.role
 * @param {string} props.content
 * @returns {JSX.Element}
 */
const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';
  const roleClassName = styles[role] ?? '';

  return (
    <div className={`${styles.message} ${roleClassName}`}>
      <div className={`${styles.avatar} ${roleClassName}`}>
        {isUser ? <User size={18} color='white' /> : <Bot size={18} color='white' />}
      </div>

      <div className={styles.content}>
        {isUser ? (
          content
        ) : (
          <div className={styles.markdownBody}>
            <ReactMarkdown>{content ?? ''}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
