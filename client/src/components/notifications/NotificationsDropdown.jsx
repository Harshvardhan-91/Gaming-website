import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Bell, MessageSquare, DollarSign, ShoppingBag, 
  Check, X, AlertCircle, ChevronRight 
} from 'lucide-react';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 
                         text-white text-xs rounded-full flex items-center 
                         justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg 
                      border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center 
                        justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 
                         font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 last:border-0 
                           hover:bg-gray-50 transition-colors cursor-pointer
                           ${notification.read ? 'bg-white' : 'bg-blue-50/50'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${
                      getIconBackground(notification.type)
                    }`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {notification.content}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1 
                                   hover:bg-gray-100 rounded-full 
                                   transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {notification.read && (
                          <span className="flex items-center gap-1 text-xs 
                                         text-green-600">
                            <Check className="w-3 h-3" />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="w-full flex items-center justify-center gap-1 
                       text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;