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
    <header className="flex items-center justify-between p-4 bg-somnia-medium border-b border-somnia-light shadow-md">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
        <h1 className="text-lg font-bold text-somnia-text">Somnia On-Chain Chat</h1>
      </div>
      <div className="flex items-center space-x-3">
        {isConnected && (
          <>
            {currentRoom && (
              <button
                onClick={onRoomClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-somnia-light hover:bg-somnia-dark rounded-md transition-colors text-sm"
                title="Switch room"
              >
                <svg className="w-4 h-4 text-somnia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-somnia-text">#{currentRoom}</span>
              </button>
            )}
            {displayName && (
              <button
                onClick={onDisplayNameClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-somnia-light hover:bg-somnia-dark rounded-md transition-colors text-sm"
                title="Edit display name"
              >
                <svg className="w-4 h-4 text-somnia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-somnia-text">{displayName}</span>
              </button>
            )}
            {address && (
              <div className="hidden md:block text-sm text-somnia-text-secondary">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
          </>
        )}
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
