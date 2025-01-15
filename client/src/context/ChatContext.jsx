import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();  // Changed from user to currentUser
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);  // Changed name to be consistent with Navbar

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    } else {
      // Reset state when user logs out
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
      setUnreadMessages(0);
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    // Mock data for demonstration
    const mockConversations = [
      {
        id: 1,
        otherUser: {
          id: 2,
          name: "John Doe",
          avatar: "/api/placeholder/40/40",
          online: true
        },
        lastMessage: {
          content: "Hey, is the account still available?",
          timestamp: new Date().toISOString(),
          unread: true
        },
        listing: {
          id: 1,
          title: "Valorant Account - Diamond Rank",
          price: 149.99,
          image: "/api/placeholder/60/60"
        }
      }
    ];

    setConversations(mockConversations);
    calculateUnreadMessages(mockConversations);
  };

  const fetchMessages = async (conversationId) => {
    // Mock messages data
    const mockMessages = [
      {
        id: 1,
        senderId: currentUser?.id,
        content: "Hello, I'm interested in your account",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: 2,
        senderId: 2, // other user
        content: "Sure, it's still available. Would you like more details?",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false
      }
    ];

    setMessages(mockMessages);
  };

  const calculateUnreadMessages = (convs) => {
    const count = convs.reduce((acc, conv) => 
      acc + (conv.lastMessage?.unread ? 1 : 0), 0
    );
    setUnreadMessages(count);
  };

  const sendMessage = async (content, conversationId) => {
    const newMessage = {
      id: Date.now(),
      senderId: currentUser?.id,
      content,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                timestamp: new Date().toISOString(),
                unread: false
              }
            }
          : conv
      )
    );

    return newMessage;
  };

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    unreadMessages, // This matches the Navbar expectation
    sendMessage
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