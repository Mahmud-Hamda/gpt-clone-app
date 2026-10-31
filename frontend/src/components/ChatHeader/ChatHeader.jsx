import { ChevronDown, Menu, X } from 'lucide-react';
import styles from './ChatHeader.module.css';

/**
 * Top bar of the chat panel: menu (narrow screens), model label, and avatar.
 *
 * @param {Object} props
 * @param {boolean} [props.menuOpen] - Whether the narrow-screen menu is open.
 * @param {() => void} [props.onMenuToggle] - Opens or closes that menu.
 * @returns {JSX.Element}
 */
const ChatHeader = ({ menuOpen = false, onMenuToggle }) => (
  <header className={styles.header}>
    <div className={styles.left}>
      <button
        type='button'
        className={styles.menu}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls='chat-sidebar'
        onClick={onMenuToggle}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <span>ChatGPT</span>
      <ChevronDown size={16} />
    </div>
    <div className={styles.right}>
      <div className={styles.avatar}>IT</div>
    </div>
  </header>
);

export default ChatHeader;
