import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isSelf = message.sender === 'self';
  
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-xs md:max-w-md ${isSelf ? 'items-end' : 'items-start'}`}>
        <span className={`text-xs font-medium mb-1 px-1 ${isSelf ? 'text-somnia-accent' : 'text-somnia-text-secondary'}`}>
          {message.senderName}
        </span>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSelf
              ? 'bg-somnia-accent text-white rounded-br-none'
              : 'bg-somnia-light text-somnia-text rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <span className="text-xs text-somnia-text-secondary mt-1 px-1">{time}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
