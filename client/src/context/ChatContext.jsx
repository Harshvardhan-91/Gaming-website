import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
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
      newSocket.on('user_status_changed', handleUserStatusChange);

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.emit('set_online_status', false);
          newSocket.disconnect();
        }
      };
    }
  }, [user]);

  // Fetch conversations when user changes
  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      resetState();
    }
  }, [user]);

  const resetState = () => {
    setConversations([]);
    setActiveConversation(null);
    setUnreadMessages(0);
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chats');
      setConversations(response.data);
      calculateUnreadMessages(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = ({ chatId, message }) => {
    setConversations(prev => prev.map(chat => {
      if (chat._id === chatId) {
        const newChat = {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message
        };

        // Update unread count if not active conversation
        if (chatId !== activeConversation?._id) {
          newChat.unreadCount = (chat.unreadCount || 0) + 1;
        }

        return newChat;
      }
      return chat;
    }));

    // Show notification if message is not from current user
    if (message.sender !== user?._id && (!activeConversation || activeConversation._id !== chatId)) {
      toast.custom((t) => (
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-start gap-3">
          <img
            src={message.senderAvatar || '/api/placeholder/40/40'}
            alt="Sender"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="font-medium">{message.senderName}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
          </div>
        </div>
      ));
    }
  };

  const handleMessagesRead = ({ chatId, userId }) => {
    if (userId !== user?._id) {
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

  const handleUserStatusChange = ({ userId, online }) => {
    setConversations(prev => prev.map(chat => {
      const otherUser = chat.participants.find(p => p._id !== user?._id);
      if (otherUser?._id === userId) {
        return {
          ...chat,
          participants: chat.participants.map(p => 
            p._id === userId ? { ...p, online } : p
          )
        };
      }
      return chat;
    }));
  };

  const calculateUnreadMessages = (chats) => {
    const count = chats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
    setUnreadMessages(count);
  };

  const sendMessage = async (chatId, content, attachments = []) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, {
        content,
        attachments
      });

      // Update local state
      handleNewMessage({
        chatId,
        message: response.data.messages[response.data.messages.length - 1]
      });

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  const markAsRead = async (chatId) => {
    try {
      await api.put(`/chats/${chatId}/read`);
      
      setConversations(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            unreadCount: 0,
            messages: chat.messages.map(msg => ({
              ...msg,
              read: true
            }))
          };
        }
        return chat;
      }));

      calculateUnreadMessages(conversations);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const createChat = async (participantId, listingId) => {
    try {
      const response = await api.post('/chats', {
        participantId,
        listingId
      });

      setConversations(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
      throw error;
    }
  };

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    unreadMessages,
    loading,
    sendMessage,
    markAsRead,
    createChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;