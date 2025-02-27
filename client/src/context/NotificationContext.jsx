import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();  // Changed from user to currentUser
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - In real app, this would be from your backend
  const mockNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      content: 'You have a new message from John regarding CSGO account',
      time: '2 minutes ago',
      read: false,
      link: '/chat/1'
    },
    {
      id: 2,
      type: 'listing',
      title: 'New Offer',
      content: 'Someone made an offer on your Valorant account',
      time: '1 hour ago',
      read: false,
      link: '/listings/offers'
    },
    {
      id: 3,
      type: 'security',
      title: 'Account Verified',
      content: 'Your account has been successfully verified',
      time: '1 day ago',
      read: true,
      link: '/profile'
    }
  ];

  useEffect(() => {
    if (currentUser) {
      // In real app, fetch notifications from API
      setNotifications(mockNotifications);
      updateUnreadCount(mockNotifications);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    updateUnreadCount(notifications);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      time: 'Just now',
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    updateUnreadCount([newNotification, ...notifications]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    updateUnreadCount(notifications.filter(notif => notif.id !== id));
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;