import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="flex flex-col max-w-xs md:max-w-md items-start">
        <div className="px-4 py-2 rounded-2xl bg-surface-light text-text rounded-bl-none">
          <div className="flex items-center justify-center space-x-1">
            <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
