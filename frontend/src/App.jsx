import ChatHeader from './components/ChatHeader/ChatHeader';
import ChatInput from './components/ChatInput/ChatInput';
import MessageList from './components/MessageList/MessageList';
import Sidebar from './components/Sidebar/Sidebar';
import { useChat } from './hooks/useChat';

/**
 * Root layout: sidebar on the left, chat panel on the right.
 *
 * @returns {JSX.Element}
 */
const App = () => {
  const { messages, isLoading, sendQuestion } = useChat();

  return (
    <div className='app'>
      <Sidebar />

      <main className='chat'>
        <ChatHeader />
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendQuestion} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;
