import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Hex } from 'viem';
import { Message } from './types';
import { useSomniaService } from './src/hooks/useSomniaService';
import { NEXT_PUBLIC_CHAT_SCHEMA_ID } from './constants';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';

const DEFAULT_ROOM_ID = 'general';
const SCHEMA_ID = NEXT_PUBLIC_CHAT_SCHEMA_ID as Hex;

const App: React.FC = () => {
  const { isConnected, address } = useAccount();
  const somniaService = useSomniaService();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userNameInput, setUserNameInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSchemaRegistered, setIsSchemaRegistered] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear user state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setCurrentUser(null);
      setUserNameInput('');
      setMessages([]);
      setIsSchemaRegistered(false);
    }
  }, [isConnected]);

  // Register schema when service is available
  useEffect(() => {
    if (somniaService && !isSchemaRegistered) {
      somniaService.registerChatSchema(SCHEMA_ID)
        .then(() => {
          setIsSchemaRegistered(true);
          console.log('Schema registration complete');
        })
        .catch((error) => {
          console.error('Schema registration failed:', error);
          // Continue anyway - schema might already be registered
          setIsSchemaRegistered(true);
        });
    }
  }, [somniaService, isSchemaRegistered]);
  
  const handleNewMessages = useCallback((newMessages: Message[]) => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages].sort((a, b) => a.timestamp - b.timestamp));
  }, []);

  useEffect(() => {
    if (currentUser && somniaService && address && isSchemaRegistered) {
      // Clear initial messages
      setMessages([]);
      somniaService.subscribeToMessages(
        handleNewMessages,
        SCHEMA_ID,
        DEFAULT_ROOM_ID,
        address,
        currentUser
      );
    }
    return () => {
      somniaService?.unsubscribe();
    };
  }, [currentUser, somniaService, address, handleNewMessages, isSchemaRegistered]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentUser || !somniaService) return;

    setIsSending(true);

    try {
      await somniaService.publishMessage(text, currentUser, DEFAULT_ROOM_ID, SCHEMA_ID);
      // The new message will appear automatically when the polling service picks it up.
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. See console for details.");
    } finally {
      setIsSending(false);
    }
  };

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (userNameInput.trim()) {
      setCurrentUser(userNameInput.trim());
    }
  };

  // Render a wallet connection prompt if no wallet is connected
  if (!isConnected) {
    return (
      <div className="flex flex-col h-screen bg-somnia-dark text-somnia-text font-sans antialiased">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-somnia-medium p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h1 className="text-2xl font-bold mb-6 text-somnia-accent">Welcome to Somnia Chat</h1>
            <p className="text-sm text-somnia-text-secondary mb-6">
              Connect your wallet to start chatting on-chain with the Somnia network.
            </p>
            <div className="text-sm text-somnia-text-secondary">
              Click "Connect Wallet" in the top right corner to get started.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render a join screen if wallet is connected but no user name is set
  if (!currentUser) {
    return (
      <div className="flex flex-col h-screen bg-somnia-dark text-somnia-text font-sans antialiased">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-somnia-medium p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-6 text-somnia-accent">Join Somnia Chat</h1>
            <p className="text-sm text-somnia-text-secondary text-center mb-6">Enter your name to start chatting on-chain. Open another browser tab to chat with yourself as a different user!</p>
            {!isSchemaRegistered && (
              <p className="text-xs text-somnia-accent text-center mb-4">Registering chat schema...</p>
            )}
            <form onSubmit={handleJoinChat} className="flex flex-col space-y-4">
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-somnia-light border border-somnia-light text-somnia-text rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-somnia-accent transition duration-200"
                required
                aria-label="Your name"
                disabled={!isSchemaRegistered}
              />
              <button
                type="submit"
                className="w-full bg-somnia-accent hover:bg-somnia-accent-dark text-white font-bold py-2 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-somnia-dark focus:ring-somnia-accent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isSchemaRegistered}
              >
                Join Chat
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render the chat interface
  return (
    <div className="flex flex-col h-screen bg-somnia-dark text-somnia-text font-sans antialiased">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" aria-live="polite">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </main>
      <div className="p-4 md:p-6 bg-somnia-dark border-t border-somnia-light">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
      </div>
    </div>
  );
};

export default App;
