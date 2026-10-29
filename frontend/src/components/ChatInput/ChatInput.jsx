import { ArrowUp, Mic, Plus } from 'lucide-react';
import { useState } from 'react';
import { MAX_QUESTION_LENGTH } from '../../services/chatService';
import styles from './ChatInput.module.css';

/**
 * Message composer. Shows a send button once the user has typed something.
 *
 * @param {Object} props
 * @param {(question: string) => void} props.onSend - Called with the trimmed question on submit.
 * @param {boolean} [props.isLoading=false] - Disables input while a reply is pending.
 * @returns {JSX.Element}
 */
const ChatInput = ({ onSend, isLoading = false }) => {
  const [question, setQuestion] = useState('');
  const trimmedQuestion = question.trim();

  /** @param {React.FormEvent<HTMLFormElement>} event */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    onSend(trimmedQuestion);
    setQuestion('');
  };

  return (
    <div className={styles.container}>
      <p className={styles.disclaimer}>This is AI and can make mistakes.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.icon}>
          <Plus size={20} />
        </div>

        <input
          type='text'
          className={styles.input}
          placeholder='Ask anything'
          aria-label='Ask anything'
          value={question}
          maxLength={MAX_QUESTION_LENGTH}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={isLoading}
        />

        {trimmedQuestion ? (
          <button
            type='submit'
            className={styles.submitButton}
            disabled={isLoading}
            aria-label='Send message'
          >
            <ArrowUp size={18} />
          </button>
        ) : (
          <div className={styles.icon}>
            <Mic size={20} />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
