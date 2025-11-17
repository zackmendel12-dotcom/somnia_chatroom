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
import LayoutShell from '../components/layout/LayoutShell';
import UtilityBar from '../components/layout/UtilityBar';
import { ChatContainer, ScrollableContent, ComposerPanel } from '../components/layout/ChatContainer';
import EmptyState from '../components/shared/EmptyState';
import LoadingState from '../components/shared/LoadingState';

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
      <LayoutShell>
        <Header />
        <UtilityBar isConnected={false} />
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            icon={
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Welcome to Somnia Chat"
            description="Connect your wallet to start chatting on-chain with the Somnia network. Click 'Connect Wallet' in the top right corner to get started."
          />
        </div>
      </LayoutShell>
    );
  }

  // Render room selection if no room is selected
  if (!currentRoom) {
    return (
      <LayoutShell>
        <Header 
          displayName={displayName}
          onDisplayNameClick={() => setIsDisplayNameModalOpen(true)}
        />
        <UtilityBar isConnected={isConnected} />
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            icon={
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="Select a Room"
            description="Join an existing room or create a new one to start chatting."
            action={{
              label: 'Browse Rooms',
              onClick: () => setIsRoomModalOpen(true)
            }}
          />
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
      </LayoutShell>
    );
  }

  // Show loading state while schema is being registered
  if (!isSchemaRegistered) {
    return (
      <LayoutShell>
        <Header 
          currentRoom={currentRoom.roomName}
          displayName={displayName}
          onRoomClick={() => setIsRoomModalOpen(true)}
          onDisplayNameClick={() => setIsDisplayNameModalOpen(true)}
        />
        <UtilityBar 
          currentRoom={currentRoom.roomName}
          onRoomClick={() => setIsRoomModalOpen(true)}
          isConnected={isConnected}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingState message={`Preparing room #${currentRoom.roomName}...`} size="lg" />
        </div>
      </LayoutShell>
    );
  }

  // Render the chat interface
  return (
    <LayoutShell>
      <Header 
        currentRoom={currentRoom.roomName}
        displayName={displayName}
        onRoomClick={() => setIsRoomModalOpen(true)}
        onDisplayNameClick={() => setIsDisplayNameModalOpen(true)}
      />
      
      <UtilityBar 
        currentRoom={currentRoom.roomName}
        onRoomClick={() => setIsRoomModalOpen(true)}
        isConnected={isConnected}
      />
      
      <ChatContainer>
        <ScrollableContent aria-live="polite" aria-atomic="false" aria-relevant="additions">
          {messages.length === 0 ? (
            <EmptyState
              icon={
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              title="No messages yet"
              description={`Be the first to say something in #${currentRoom.roomName}!`}
            />
          ) : (
            messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))
          )}
          <div ref={chatEndRef} />
        </ScrollableContent>
        
        <ComposerPanel>
          <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
        </ComposerPanel>
      </ChatContainer>

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
    </LayoutShell>
  );
}

export default App;
