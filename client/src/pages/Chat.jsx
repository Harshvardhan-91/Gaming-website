import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Search, MoreVertical, Phone, Video, Info, 
  Image as ImageIcon, Paperclip, Smile, CheckCheck, ChevronLeft
} from 'lucide-react';

const Chat = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const messagesEndRef = useRef(null);

  const conversations = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/api/placeholder/40/40",
        online: true
      },
      lastMessage: "Hey, is this account still available?",
      time: "2m ago",
      unread: 2,
      listing: {
        title: "Valorant Premium Account",
        price: 149.99,
        image: "/api/placeholder/60/60"
      }
    },
    {
      id: 2,
      user: {
        name: "Alice Smith",
        avatar: "/api/placeholder/40/40",
        online: false
      },
      lastMessage: "Thanks for the quick response!",
      time: "1h ago",
      unread: 0,
      listing: {
        title: "CSGO Rare Skins Account",
        price: 299.99,
        image: "/api/placeholder/60/60"
      }
    }
  ];

  const messages = [
    {
      id: 1,
      text: "Hey, is this account still available?",
      time: "2:30 PM",
      sender: "user",
      status: "read"
    },
    {
      id: 2,
      text: "Yes, it's still available! Are you interested in purchasing?",
      time: "2:31 PM",
      sender: "other",
      status: "read"
    },
    {
      id: 3,
      text: "Could you tell me more about the skins included?",
      time: "2:32 PM",
      sender: "user",
      status: "read"
    },
    {
      id: 4,
      text: "Of course! The account includes several rare skins including the Prime Vandal, Reaver Operator, and full Glitchpop collection. All battle passes from Episode 1 are also completed.",
      time: "2:33 PM",
      sender: "other",
      status: "read"
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add new message to the list
    setNewMessage('');
  };

  const ConversationList = () => (
    <div className="bg-white border-r border-gray-200 w-full lg:w-80 h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 
                     rounded-xl focus:outline-none focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="overflow-y-auto h-[calc(100vh-10rem)]">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => {
              setActiveConversation(conversation);
              setIsMobileListVisible(false);
            }}
            className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 
                     transition-colors border-b border-gray-100"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={conversation.user.avatar}
                alt={conversation.user.name}
                className="w-12 h-12 rounded-full"
              />
              {conversation.user.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                               border-2 border-white rounded-full"></span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                <span className="text-xs text-gray-500">{conversation.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate mb-2">
                {conversation.lastMessage}
              </p>
              {/* Listing Preview */}
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
            </div>

            {/* Unread Badge */}
            {conversation.unread > 0 && (
              <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white 
                             rounded-full text-xs flex items-center justify-center">
                {conversation.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const ChatView = ({ conversation }) => (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
        <button 
          onClick={() => setIsMobileListVisible(true)}
          className="lg:hidden"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="relative flex-shrink-0">
          <img
            src={conversation.user.avatar}
            alt={conversation.user.name}
            className="w-10 h-10 rounded-full"
          />
          {conversation.user.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 
                           border-2 border-white rounded-full"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{conversation.user.name}</h2>
          <p className="text-sm text-gray-500">
            {conversation.user.online ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white'} 
                           rounded-2xl px-4 py-2 shadow-sm`}>
              <p>{message.text}</p>
              <div className={`flex items-center gap-1 text-xs mt-1 
                           ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                <span>{message.time}</span>
                {message.sender === 'user' && (
                  <CheckCheck className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
            <Smile className="w-6 h-6" />
          </button>
          <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
            <ImageIcon className="w-6 h-6" />
          </button>
          <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
            <Paperclip className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              rows="1"
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] bg-gray-50">
      <div className="container mx-auto h-full">
        <div className="bg-white rounded-xl shadow-sm h-full flex overflow-hidden">
          {/* Conversations List - Hidden on mobile when chat is open */}
          <div className={`${isMobileListVisible ? 'block' : 'hidden'} lg:block h-full`}>
            <ConversationList />
          </div>

          {/* Chat View - Hidden on mobile when list is shown */}
          <div className={`${!isMobileListVisible ? 'block' : 'hidden'} lg:block flex-1`}>
            {activeConversation ? (
              <ChatView conversation={activeConversation} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;