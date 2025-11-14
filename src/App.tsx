import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Hex, getAddress } from 'viem';
import { Message } from '../types';
import { useSomniaService } from './hooks/useSomniaService';
import { SCHEMA_ID } from '../constants';
import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import RoomModal from '../components/RoomModal';
import DisplayNameModal from '../components/DisplayNameModal';

interface RoomInfo {
  roomName: string;
  schemaId: Hex;
}

function App() {
  const { isConnected, address } = useAccount();
  const somniaService = useSomniaService();
  
  // Room state
  const [currentRoom, setCurrentRoom] = useState<RoomInfo | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  
  // Display name state
  const [displayName, setDisplayName] = useState<string>('');
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);
  
  // Chat state
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

  // Load display name from localStorage when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      const checksumAddress = getAddress(address);
      const storageKey = `displayName_${checksumAddress}`;
      const savedDisplayName = localStorage.getItem(storageKey);
      
      if (savedDisplayName) {
        setDisplayName(savedDisplayName);
      } else {
        // Default to checksum address
        setDisplayName(checksumAddress);
      }
      
      // Load last room from localStorage
      const lastRoomStr = localStorage.getItem('lastRoom');
      if (lastRoomStr) {
        try {
          const lastRoom = JSON.parse(lastRoomStr);
          setCurrentRoom({
            roomName: lastRoom.roomName,
            schemaId: lastRoom.schemaId as Hex,
          });
        } catch (e) {
          console.error('Failed to parse last room:', e);
        }
      } else {
        // Show room modal if no room is selected
        setIsRoomModalOpen(true);
      }
    }
  }, [isConnected, address]);

  // Clear state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setDisplayName('');
      setCurrentRoom(null);
      setMessages([]);
      setIsSchemaRegistered(false);
    }
  }, [isConnected]);

  // Register schema when service is available
  useEffect(() => {
    if (somniaService && currentRoom && !isSchemaRegistered) {
      somniaService.registerChatSchema(currentRoom.schemaId, currentRoom.roomName, currentRoom.roomName)
        .then(() => {
          setIsSchemaRegistered(true);
          console.log('Schema registration complete for room:', currentRoom.roomName);
        })
        .catch((error) => {
          console.error('Schema registration failed:', error);
          // Continue anyway - schema might already be registered
          setIsSchemaRegistered(true);
        });
    }
  }, [somniaService, currentRoom, isSchemaRegistered]);
  
  const handleNewMessages = useCallback((newMessages: Message[]) => {
    setMessages((prevMessages) => {
      const allMessages = [...prevMessages, ...newMessages];
      // Deduplicate and sort by timestamp
      const uniqueMessages = Array.from(
        new Map(allMessages.map(msg => [msg.id, msg])).values()
      ).sort((a, b) => a.timestamp - b.timestamp);
      return uniqueMessages;
    });
  }, []);

  // Subscribe to messages when room and display name are set
  useEffect(() => {
    if (displayName && somniaService && address && currentRoom && isSchemaRegistered) {
      // Clear messages when switching rooms
      setMessages([]);
      
      const checksumAddress = getAddress(address);
      somniaService.subscribeToMessages(
        handleNewMessages,
        currentRoom.schemaId,
        currentRoom.roomName,
        checksumAddress
      );
    }
    return () => {
      somniaService?.unsubscribe();
    };
  }, [displayName, somniaService, address, currentRoom, handleNewMessages, isSchemaRegistered]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !displayName || !somniaService || !currentRoom || !address) return;

    setIsSending(true);

    try {
      const checksumAddress = getAddress(address);
      await somniaService.publishMessage(
        text,
        displayName,
        checksumAddress,
        currentRoom.roomName,
        currentRoom.schemaId
      );
      // The new message will appear automatically when the polling service picks it up.
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. See console for details.");
    } finally {
      setIsSending(false);
    }
  };

  const handleRoomSelect = (roomName: string, schemaId: Hex) => {
    setCurrentRoom({ roomName, schemaId });
    setIsSchemaRegistered(false); // Reset schema registration for new room
    setMessages([]); // Clear messages when switching rooms
  };

  const handleDisplayNameSave = (newDisplayName: string) => {
    if (address) {
      const checksumAddress = getAddress(address);
      const storageKey = `displayName_${checksumAddress}`;
      localStorage.setItem(storageKey, newDisplayName);
      setDisplayName(newDisplayName);
      
      // Clear and reload messages with new display name
      setMessages([]);
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

  // Render room selection if no room is selected
  if (!currentRoom) {
    return (
      <div className="flex flex-col h-screen bg-somnia-dark text-somnia-text font-sans antialiased">
        <Header 
          displayName={displayName}
          onDisplayNameClick={() => setIsDisplayNameModalOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-somnia-medium p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h1 className="text-2xl font-bold mb-6 text-somnia-accent">Select a Room</h1>
            <p className="text-sm text-somnia-text-secondary mb-6">
              Join an existing room or create a new one to start chatting.
            </p>
            <button
              onClick={() => setIsRoomModalOpen(true)}
              className="w-full bg-somnia-accent hover:bg-somnia-accent-dark text-white font-bold py-3 px-4 rounded-md transition-all duration-200"
            >
              Browse Rooms
            </button>
          </div>
        </div>
        
        <RoomModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onRoomSelect={handleRoomSelect}
          defaultSchemaId={SCHEMA_ID as Hex}
        />
        
        <DisplayNameModal
          isOpen={isDisplayNameModalOpen}
          onClose={() => setIsDisplayNameModalOpen(false)}
          onSave={handleDisplayNameSave}
          currentDisplayName={displayName}
          defaultName={address ? getAddress(address) : ''}
        />
      </div>
    );
  }

  // Show loading state while schema is being registered
  if (!isSchemaRegistered) {
    return (
      <div className="flex flex-col h-screen bg-somnia-dark text-somnia-text font-sans antialiased">
        <Header 
          currentRoom={currentRoom.roomName}
          displayName={displayName}
          onRoomClick={() => setIsRoomModalOpen(true)}
          onDisplayNameClick={() => setIsDisplayNameModalOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-somnia-medium p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 bg-somnia-accent rounded-full mx-auto mb-4"></div>
            </div>
            <p className="text-lg text-somnia-text mb-2">Preparing room...</p>
            <p className="text-sm text-somnia-text-secondary">
              Registering chat schema for room: {currentRoom.roomName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the chat interface
  return (
    <div className="flex flex-col h-screen bg-somnia-dark text-somnia-text font-sans antialiased">
      <Header 
        currentRoom={currentRoom.roomName}
        displayName={displayName}
        onRoomClick={() => setIsRoomModalOpen(true)}
        onDisplayNameClick={() => setIsDisplayNameModalOpen(true)}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-somnia-text-secondary">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Be the first to say something in #{currentRoom.roomName}!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={chatEndRef} />
      </main>
      
      <div className="p-4 md:p-6 bg-somnia-dark border-t border-somnia-light">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
      </div>

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onRoomSelect={handleRoomSelect}
        defaultSchemaId={SCHEMA_ID as Hex}
      />
      
      <DisplayNameModal
        isOpen={isDisplayNameModalOpen}
        onClose={() => setIsDisplayNameModalOpen(false)}
        onSave={handleDisplayNameSave}
        currentDisplayName={displayName}
        defaultName={address ? getAddress(address) : ''}
      />
    </div>
  );
}

export default App;
