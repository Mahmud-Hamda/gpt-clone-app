import { useEffect, useState } from 'react';
import ChatHeader from './components/ChatHeader/ChatHeader';
import ChatInput from './components/ChatInput/ChatInput';
import MessageList from './components/MessageList/MessageList';
import Sidebar from './components/Sidebar/Sidebar';
import { useChat } from './hooks/useChat';

const NARROW_NAV = '(max-width: 767px)';

/**
 * Root layout: sidebar on the left, chat panel on the right.
 * Below 768px the sidebar is a drawer opened from the header.
 *
 * @returns {JSX.Element}
 */
const App = () => {
  const { messages, isLoading, sendQuestion } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_NAV).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(NARROW_NAV);
    const onChange = () => {
      setNarrow(query.matches);
      if (!query.matches) setMenuOpen(false);
    };
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const mobileHidden = narrow && !menuOpen;

  return (
    <div className={`app${menuOpen && narrow ? ' app--navOpen' : ''}`}>
      {narrow && menuOpen ? (
        <button
          type='button'
          className='appBackdrop'
          aria-label='Close menu'
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <Sidebar
        open={menuOpen}
        mobileHidden={mobileHidden}
        onClose={() => setMenuOpen(false)}
        narrow={narrow}
      />

      <main className='chat'>
        <ChatHeader
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
        />
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendQuestion} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;
