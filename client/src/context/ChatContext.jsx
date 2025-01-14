import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (user) {
      // In real app, fetch from API
      fetchConversations();
    }
  }, [user]);

  // Update messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      // In real app, fetch from API
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    // TODO: Implement API call
    // Mock data for now
    const mockConversations = [
      {
        id: 1,
        user: {
          id: 2,
          name: "John Doe",
          avatar: "/api/placeholder/40/40",
          online: true
        },
        lastMessage: {
          content: "Hey, is the account still available?",
          time: "2m ago"
        },
        unreadCount: 2,
        listing: {
          title: "Valorant Account - Diamond Rank",
          price: 149.99,
          image: "/api/placeholder/60/60"
        }
      },
      // Add more mock conversations
    ];

    setConversations(mockConversations);
    updateUnreadCount(mockConversations);
  };

  const fetchMessages = async (conversationId) => {
    // TODO: Implement API call
    // Mock data for now
    const mockMessages = [
      {
        id: 1,
        content: "Hey, is the account still available?",
        time: "2:30 PM",
        senderId: 2,
        read: true
      },
      // Add more mock messages
    ];

    setMessages(mockMessages);
  };

  const sendMessage = async (content, conversationId) => {
    // TODO: Implement API call
    const newMessage = {
      id: Date.now(),
      content,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      senderId: user.id,
      read: false
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                time: 'Just now'
              }
            }
          : conv
      )
    );

    return newMessage;
  };

  const markConversationAsRead = async (conversationId) => {
    // TODO: Implement API call
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    updateUnreadCount(conversations);
  };

  const updateUnreadCount = (convs) => {
    const count = convs.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
    setUnreadCount(count);
  };

  // Real-time updates simulation
  useEffect(() => {
    if (!user) return;

    const simulateNewMessage = () => {
      if (conversations.length === 0) return;

      // Randomly select a conversation
      const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
      
      const newMessage = {
        id: Date.now(),
        content: "This is a simulated message",
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        senderId: randomConv.user.id,
        read: false
      };

      // Add message if it's the active conversation
      if (activeConversation?.id === randomConv.id) {
        setMessages(prev => [...prev, newMessage]);
      }

      // Update conversation's last message and unread count
      setConversations(prev =>
        prev.map(conv =>
          conv.id === randomConv.id
            ? {
                ...conv,
                lastMessage: {
                  content: newMessage.content,
                  time: 'Just now'
                },
                unreadCount: conv.id === activeConversation?.id
                  ? 0
                  : (conv.unreadCount || 0) + 1
              }
            : conv
        )
      );
    };

    // Simulate receiving messages every 45 seconds
    const interval = setInterval(simulateNewMessage, 45000);

    return () => clearInterval(interval);
  }, [user, conversations, activeConversation]);

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    unreadCount,
    sendMessage,
    markConversationAsRead
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