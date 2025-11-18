import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface HeaderProps {
  currentRoom?: string;
  displayName?: string;
  onRoomClick?: () => void;
  onDisplayNameClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentRoom, displayName, onRoomClick, onDisplayNameClick }) => {
  const { isConnected, address } = useAccount();

  return (
    <header role="banner" className="sticky top-0 z-50 flex items-center justify-between p-4 xs:p-3 sm:p-4 bg-surface border-b border-border shadow-md">
      <div className="flex items-center space-x-2">
        <div 
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-500'}`}
          role="status"
          aria-label={isConnected ? 'Connected' : 'Disconnected'}
        ></div>
        <h1 className="text-base sm:text-lg font-bold text-text">Somnia On-Chain Chat</h1>
      </div>
      <nav aria-label="User navigation" className="flex items-center space-x-2 sm:space-x-3">
        {isConnected && (
          <>
            {currentRoom && (
              <button
                onClick={onRoomClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-surface-light hover:bg-background rounded-md transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                aria-label={`Current room: ${currentRoom}. Click to switch room`}
              >
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-text">#{currentRoom}</span>
              </button>
            )}
            {displayName && (
              <button
                onClick={onDisplayNameClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-surface-light hover:bg-background rounded-md transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                aria-label={`Display name: ${displayName}. Click to edit`}
              >
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-text">{displayName}</span>
              </button>
            )}
            {address && (
              <div 
                className="hidden md:block text-sm text-text-secondary" 
                aria-label={`Connected wallet address: ${address}`}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
          </>
        )}
        <ConnectButton />
      </nav>
    </header>
  );
};

export default Header;
