import React, { useState } from 'react';
import { 
  CheckCheck, 
  Check, 
  Clock, 
  SmilePlus,
  MoreHorizontal, 
  Reply,
  Trash2,
  Copy
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Avatar from '../common/Avatar';

const ChatMessage = ({ 
  message, 
  isOwn, 
  onReaction, 
  onReply, 
  onDelete,
  showAvatar = true,
  replyTo = null
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getDeliveryStatus = () => {
    if (message.read) return 'read';
    if (message.delivered) return 'delivered';
    if (message.sent) return 'sent';
    return 'pending';
  };

  const renderDeliveryStatus = () => {
    const status = getDeliveryStatus();
    switch (status) {
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-100" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-blue-300" />;
      case 'sent':
        return <Check className="w-4 h-4 text-blue-300" />;
      default:
        return <Clock className="w-4 h-4 text-blue-300 animate-pulse" />;
    }
  };

  const handleReaction = (emojiData) => {
    onReaction?.(message.id, emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowActions(false);
  };

  return (
    <div className={`group flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && showAvatar && (
        <Avatar 
          src={message.sender?.avatar}
          alt={message.sender?.name}
          size="sm"
          className="mt-1"
        />
      )}
      
      <div className="max-w-[70%]">
        {/* Reply reference */}
        {replyTo && (
          <div className={`text-xs mb-1 flex items-center gap-1
            ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
            <Reply className="w-3 h-3" />
            Replying to {replyTo.sender.name}
          </div>
        )}

        <div className="relative group">
          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>

            {/* Attachments would go here */}

            <div className={`flex items-center gap-1 mt-1 text-xs 
              ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}
            >
              <span>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {isOwn && renderDeliveryStatus()}
            </div>
          </div>

          {/* Reactions */}
          {message.reactions?.length > 0 && (
            <div className={`absolute -bottom-2 ${isOwn ? 'right-0' : 'left-0'} 
                          flex items-center gap-0.5 bg-white rounded-full 
                          shadow-sm px-2 py-0.5 text-xs border`}>
              {message.reactions.map((reaction, index) => (
                <span key={index}>{reaction.emoji}</span>
              ))}
            </div>
          )}

          {/* Message actions */}
          <div className={`absolute top-0 ${isOwn ? 'left-0' : 'right-0'} 
                        -translate-x-full px-2 opacity-0 group-hover:opacity-100
                        transition-opacity flex items-center gap-1`}>
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500
                       transition-colors"
            >
              <SmilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onReply?.(message)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500
                       transition-colors"
            >
              <Reply className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500
                         transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {/* Actions dropdown */}
              {showActions && (
                <div className="absolute bottom-full right-0 mb-2 bg-white 
                             rounded-lg shadow-lg border py-1 min-w-[120px]">
                  <button
                    onClick={handleCopy}
                    className="w-full px-3 py-1.5 text-left text-sm 
                             hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  {isOwn && (
                    <button
                      onClick={() => {
                        onDelete?.(message.id);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm 
                               text-red-500 hover:bg-red-50 
                               flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 z-50">
              <div 
                className="fixed inset-0" 
                onClick={() => setShowEmojiPicker(false)}
              />
              <div className="relative">
                <EmojiPicker
                  onEmojiClick={handleReaction}
                  lazyLoadEmojis={true}
                  searchPlaceholder="Search emoji..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isOwn && showAvatar && (
        <Avatar 
          src={message.sender?.avatar}
          alt={message.sender?.name}
          size="sm"
          className="mt-1"
        />
      )}
    </div>
  );
};

export default ChatMessage;