import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-somnia-medium border-b border-somnia-light shadow-md">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h1 className="text-lg font-bold text-somnia-text">Somnia On-Chain Chat</h1>
      </div>
      <div className="text-sm text-somnia-text-secondary">
        Connected
      </div>
    </header>
  );
};

export default Header;
