import React from 'react';
import { CheckCheck, Download, File, Image } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    return imageTypes.includes(extension) ? 'image' : 'document';
  };

  const renderAttachment = (url) => {
    const type = getFileType(url);
    
    if (type === 'image') {
      return (
        <div className="relative group mt-2">
          <img
            src={url}
            alt="Attachment"
            className="max-w-[200px] rounded-lg cursor-pointer"
            onClick={() => window.open(url, '_blank')}
          />
          <a
            href={url}
            download
            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-4 h-4 text-white" />
          </a>
        </div>
      );
    }

    return (
      <a
        href={url}
        download
        className="flex items-center gap-2 mt-2 p-2 bg-gray-100 rounded-lg 
                 hover:bg-gray-200 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <File className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-700 truncate">
          {url.split('/').pop()}
        </span>
        <Download className="w-4 h-4 text-gray-500" />
      </a>
    );
  };

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
        
        {message.attachments?.map((url, index) => (
          <div key={index}>
            {renderAttachment(url)}
          </div>
        ))}

        <div className={`flex items-center gap-1 mt-1 text-xs 
          ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
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

export default MessageBubble;