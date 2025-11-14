import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header: React.FC = () => {
  const { isConnected, address } = useAccount();

  return (
    <header className="flex items-center justify-between p-4 bg-somnia-medium border-b border-somnia-light shadow-md">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
        <h1 className="text-lg font-bold text-somnia-text">Somnia On-Chain Chat</h1>
      </div>
      <div className="flex items-center space-x-4">
        {isConnected && address && (
          <div className="text-sm text-somnia-text-secondary">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
