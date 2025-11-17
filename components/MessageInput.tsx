import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 w-full bg-surface border border-border text-text rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="flex items-center justify-center w-10 h-10 bg-accent hover:bg-accent-dark text-white rounded-full transition-all duration-200 disabled:bg-surface-light disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent"
      >
        {isLoading ? <SpinnerIcon /> : <SendIcon />}
      </button>
    </form>
  );
};

export default MessageInput;
