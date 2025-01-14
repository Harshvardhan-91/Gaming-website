import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications for demonstration
  const mockNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      content: 'You have a new message from John Doe',
      time: '2 minutes ago',
      read: false,
      link: '/chat/1',
      icon: 'message'
    },
    {
      id: 2,
      type: 'offer',
      title: 'New Offer',
      content: 'Someone made an offer on your Valorant account',
      time: '1 hour ago',
      read: false,
      link: '/listings/offers',
      icon: 'offer'
    }
  ];

  useEffect(() => {
    // In real app, fetch from API
    setNotifications(mockNotifications);
    updateUnreadCount(mockNotifications);
  }, []);

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
    setNotifications(prev => [
      {
        id: Date.now(),
        read: false,
        time: 'Just now',
        ...notification
      },
      ...prev
    ]);
    updateUnreadCount(notifications);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    updateUnreadCount(notifications);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        removeNotification
      }}
    >
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