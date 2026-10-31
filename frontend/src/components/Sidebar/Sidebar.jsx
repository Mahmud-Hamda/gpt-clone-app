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
 * Left navigation sidebar. On a narrow screen it is an off-canvas drawer.
 * The links are placeholders.
 *
 * @param {Object} props
 * @param {boolean} [props.open] - Drawer is open.
 * @param {boolean} [props.mobileHidden] - Drawer is off-screen; keep it out of the tab order.
 * @param {boolean} [props.narrow] - Viewport is narrow enough for the drawer.
 * @param {() => void} [props.onClose] - Closes the drawer.
 * @returns {JSX.Element}
 */
const Sidebar = ({ open = false, mobileHidden = false, narrow = false, onClose }) => (
  <aside
    id='chat-sidebar'
    className={`${styles.sidebar}${open ? ` ${styles.sidebarOpen}` : ''}`}
    inert={mobileHidden ? true : undefined}
    aria-hidden={mobileHidden || undefined}
  >
    <div className={styles.header}>
      <div className={styles.logo}>
        <button
          type='button'
          className={styles.iconButton}
          aria-label='Close menu'
          tabIndex={narrow ? 0 : -1}
          onClick={onClose}
        >
          <PanelLeftClose size={20} />
        </button>
      </div>
      <button
        type='button'
        className={styles.iconButton}
        aria-label='New chat'
        onClick={onClose}
      >
        <MessageSquare size={20} />
      </button>
    </div>

    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ icon: Icon, label }) => (
        <a
          key={label}
          href='#'
          className={styles.item}
          onClick={(event) => {
            event.preventDefault();
            onClose?.();
          }}
        >
          <Icon size={18} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
