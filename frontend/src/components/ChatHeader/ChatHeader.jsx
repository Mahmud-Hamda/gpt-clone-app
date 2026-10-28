import { ChevronDown } from 'lucide-react';
import styles from './ChatHeader.module.css';

/**
 * Top bar of the chat panel: model selector label and user avatar.
 *
 * @returns {JSX.Element}
 */
const ChatHeader = () => (
  <header className={styles.header}>
    <div className={styles.left}>
      <span>ChatGPT</span>
      <ChevronDown size={16} />
    </div>
    <div className={styles.right}>
      <div className={styles.avatar}>IT</div>
    </div>
  </header>
);

export default ChatHeader;
