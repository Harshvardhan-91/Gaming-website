import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ conversations, activeConversation, setActiveConversation }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-80 h-full bg-white border-r border-gray-200">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 
                     rounded-xl focus:outline-none focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-100"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="overflow-y-auto h-[calc(100vh-10rem)]">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => setActiveConversation(conversation)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 
                     transition-colors border-b border-gray-100 ${
                       activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                     }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={conversation.user.avatar}
                alt={conversation.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.user.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                             border-2 border-white rounded-full"></span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold truncate">
                  {conversation.user.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {conversation.lastMessage.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate mb-2">
                {conversation.lastMessage.content}
              </p>

              {/* Related Listing */}
              {conversation.listing && (
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                  <img
                    src={conversation.listing.image}
                    alt={conversation.listing.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {conversation.listing.title}
                    </p>
                    <p className="text-xs text-blue-600">
                      ${conversation.listing.price}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Unread Badge */}
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white 
                           rounded-full text-xs flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;