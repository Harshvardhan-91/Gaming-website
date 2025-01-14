import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, MessageSquare, DollarSign, ShoppingBag, 
  AlertCircle, Filter, Check, Trash2 
} from 'lucide-react';

const NotificationsPage = () => {
  const { 
    notifications, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filterTypes = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'message', label: 'Messages' },
    { value: 'offer', label: 'Offers' },
    { value: 'purchase', label: 'Purchases' }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'offer':
        return <DollarSign className="w-5 h-5" />;
      case 'purchase':
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getIconBackground = (type) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'offer':
        return 'bg-green-100 text-green-600';
      case 'purchase':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleReadMore = (notificationId) => {
    // Navigate to specific notification detail or related page
    console.log('Navigate to notification:', notificationId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-gray-600">
                  Stay updated with your account activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 
                         hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Check className="w-5 h-5" />
                Mark all as read
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 
                               hover:bg-gray-100 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
                Clear all
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filterTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium 
                         transition-colors whitespace-nowrap ${
                  filter === type.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-full h-fit ${
                    getIconBackground(notification.type)
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600">
                          {notification.content}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 h-fit"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-500">
                        {notification.time}
                      </span>
                      {notification.read ? (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Read
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReadMore(notification.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;