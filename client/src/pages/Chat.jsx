import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, ImagePlus, Paperclip, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatList from '../components/chat/ChatList';
import ChatMessage from '../components/chat/ChatMessage';
import api from '../utils/api';
import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('set_online_status', true);
    });

    newSocket.on('new_message', handleNewMessage);
    newSocket.on('messages_read', handleMessagesRead);
    newSocket.on('new_chat', handleNewChat);

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('set_online_status', false);
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();

    // Handle direct navigation to chat with specific seller/listing
    const params = new URLSearchParams(location.search);
    const sellerId = params.get('seller');
    const listingId = params.get('listing');

    if (sellerId && listingId) {
      initializeChat(sellerId, listingId);
    }
  }, [location]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chats');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const initializeChat = async (sellerId, listingId) => {
    try {
      const response = await api.post('/chats', {
        participantId: sellerId,
        listingId
      });
      
      const newChat = response.data;
      setConversations(prev => {
        const exists = prev.find(chat => chat._id === newChat._id);
        if (!exists) {
          return [newChat, ...prev];
        }
        return prev;
      });
      setActiveConversation(newChat);
      
      // Join the chat room
      socket?.emit('join_chat', newChat._id);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleNewMessage = ({ chatId, message }) => {
    setConversations(prev => prev.map(chat => {
      if (chat._id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.content,
          unreadCount: chat._id !== activeConversation?._id ? 
            (chat.unreadCount || 0) + 1 : 0
        };
      }
      return chat;
    }));

    // If the message is for the active conversation, mark it as read
    if (chatId === activeConversation?._id) {
      markMessagesAsRead(chatId);
    }
  };

  const handleMessagesRead = ({ chatId, userId }) => {
    if (userId !== user._id) {
      setConversations(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => ({
              ...msg,
              read: true
            }))
          };
        }
        return chat;
      }));
    }
  };

  const handleNewChat = (chat) => {
    setConversations(prev => [chat, ...prev]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    try {
      await api.post(`/chats/${activeConversation._id}/messages`, {
        content: message.trim()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      await api.put(`/chats/${chatId}/read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload', formData);
      const fileUrl = response.data.url;

      await api.post(`/chats/${activeConversation._id}/messages`, {
        content: message.trim() || 'Sent an attachment',
        attachments: [fileUrl]
      });

      setMessage('');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden 
                      h-[calc(100vh-8rem)] flex">
          {/* Chat List */}
          <ChatList
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={(chat) => {
              setActiveConversation(chat);
              markMessagesAsRead(chat._id);
            }}
          />

          {/* Chat Area */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center 
                           justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.participants.find(
                      p => p._id !== user._id
                    )?.avatar || '/api/placeholder/40/40'}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {activeConversation.participants.find(
                        p => p._id !== user._id
                      )?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeConversation.listing.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    message={msg}
                    isOwn={msg.sender === user._id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 hover:text-gray-700 
                               hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2">
                        <div 
                          className="fixed inset-0" 
                          onClick={() => setShowEmojiPicker(false)}
                        />
                        <div className="relative">
                          <EmojiPicker
                            onEmojiClick={(emojiObject) => {
                              setMessage(prev => prev + emojiObject.emoji);
                              setShowEmojiPicker(false);
                            }}
                            lazyLoadEmojis={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-700 
                             hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 
                             rounded-xl focus:outline-none focus:border-blue-500 
                             focus:ring-1 focus:ring-blue-100"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 bg-blue-500 text-white rounded-xl 
                             hover:bg-blue-600 transition-colors disabled:opacity-50 
                             disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;