import React from 'react';
import { CheckCheck } from 'lucide-react';

const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 text-xs 
          ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}
        >
          <span>{message.time}</span>
          {isOwn && (
            <CheckCheck className={`w-4 h-4 ${
              message.read ? 'text-blue-100' : 'text-blue-300'
            }`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;