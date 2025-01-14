import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Send,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import ChatList from "../components/chat/ChatList";
import ChatMessage from "../components/chat/ChatMessage";

const Chat = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const messagesEndRef = useRef(null);

  // Mock data for conversations
  useEffect(() => {
    // In real app, fetch from API
    setConversations([
      {
        id: 1,
        user: {
          id: 2,
          name: "John Doe",
          avatar: "/api/placeholder/40/40",
          online: true,
        },
        lastMessage: {
          content: "Hey, is the account still available?",
          time: "2m ago",
        },
        unreadCount: 2,
        listing: {
          title: "Valorant Account - Diamond Rank",
          price: 149.99,
          image: "/api/placeholder/60/60",
        },
      },
      {
        id: 2,
        user: {
          id: 3,
          name: "Alice Smith",
          avatar: "/api/placeholder/40/40",
          online: false,
        },
        lastMessage: {
          content: "Thanks for the quick response!",
          time: "1h ago",
        },
        unreadCount: 0,
        listing: {
          title: "CSGO Inventory - Rare Skins",
          price: 299.99,
          image: "/api/placeholder/60/60",
        },
      },
    ]);
  }, []);

  // Mock messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      // In real app, fetch from API
      setMessages([
        {
          id: 1,
          content: "Hey, is the account still available?",
          time: "2:30 PM",
          senderId: activeConversation.user.id,
          read: true,
        },
        {
          id: 2,
          content:
            "Yes, it's still available! Are you interested in purchasing?",
          time: "2:31 PM",
          senderId: user.id,
          read: true,
        },
        {
          id: 3,
          content: "Great! Could you tell me more about the skins included?",
          time: "2:32 PM",
          senderId: activeConversation.user.id,
          read: true,
        },
        {
          id: 4,
          content:
            "The account includes several rare skins including the Prime Vandal, Reaver Operator, and the full Glitchpop collection. All battle passes from Episode 1 are also completed.",
          time: "2:33 PM",
          senderId: user.id,
          read: true,
        },
      ]);
    }
  }, [activeConversation, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add new message
    const newMessage = {
      id: Date.now(),
      content: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      senderId: user.id,
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] bg-gray-50">
      <div className="container mx-auto h-full">
        <div className="bg-white rounded-xl shadow-sm h-full flex overflow-hidden">
          {/* Chat List - Hidden on mobile when chat is open */}
          <div
            className={`${
              isMobileListVisible ? "block" : "hidden"
            } lg:block h-full`}
          >
            <ChatList
              conversations={conversations}
              activeConversation={activeConversation}
              setActiveConversation={(conversation) => {
                setActiveConversation(conversation);
                setIsMobileListVisible(false);
              }}
            />
          </div>

          {/* Chat View */}
          <div
            className={`${
              !isMobileListVisible ? "block" : "hidden"
            } lg:block flex-1`}
          >
            {activeConversation ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-4">
                  <button
                    onClick={() => setIsMobileListVisible(true)}
                    className="lg:hidden"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <img
                        src={activeConversation.user.avatar}
                        alt={activeConversation.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {activeConversation.user.online && (
                        <span
                          className="absolute bottom-0 right-0 w-3 h-3 
                                     bg-green-500 border-2 border-white rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        {activeConversation.user.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {activeConversation.user.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      isOwn={msg.senderId === user.id}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Smile className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ImageIcon className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Paperclip className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full p-3 border border-gray-200 rounded-xl 
                                 focus:outline-none focus:border-blue-500 
                                 focus:ring-1 focus:ring-blue-100 resize-none"
                        rows="1"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="p-3 bg-blue-600 text-white rounded-xl 
                               hover:bg-blue-700 transition-colors 
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>

                {/* Active Listing Preview */}
                {activeConversation?.listing && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeConversation.listing.image}
                          alt={activeConversation.listing.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-sm">
                            {activeConversation.listing.title}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            ${activeConversation.listing.price}
                          </p>
                        </div>
                      </div>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Listing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Empty state when no conversation is selected
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div
                  className="w-16 h-16 bg-gray-100 rounded-full flex items-center 
             justify-center mb-4"
                >
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">No Conversation Selected</h3>
                <p className="text-sm">
                  Choose a conversation to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
