import {
  Code2,
  FolderKanban,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquare,
  Microscope,
  PanelLeftClose,
  Search,
} from 'lucide-react';
import styles from './Sidebar.module.css';

/**
 * @typedef {Object} NavItem
 * @property {import('lucide-react').LucideIcon} icon
 * @property {string} label
 */

/** @type {NavItem[]} */
const NAV_ITEMS = [
  { icon: MessageSquare, label: 'New chat' },
  { icon: Search, label: 'Search chats' },
  { icon: ImageIcon, label: 'Images' },
  { icon: LayoutGrid, label: 'Apps' },
  { icon: Microscope, label: 'Deep research' },
  { icon: Code2, label: 'Codex' },
  { icon: FolderKanban, label: 'Projects' },
];

/**
 * Left navigation sidebar (visual only; the links are placeholders).
 *
 * @returns {JSX.Element}
 */
const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.iconButton}>
          <PanelLeftClose size={20} />
        </div>
      </div>
      <button type='button' className={styles.iconButton} aria-label='New chat'>
        <MessageSquare size={20} />
      </button>
    </div>

    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ icon: Icon, label }) => (
        <a key={label} href='#' className={styles.item}>
          <Icon size={18} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
