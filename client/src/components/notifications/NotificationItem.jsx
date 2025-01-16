import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, DollarSign, ShoppingBag, AlertCircle, Check } from 'lucide-react';

const NotificationItem = ({ notification, onRead }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
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

  const getIconBackground = () => {
    switch (notification.type) {
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

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 
                 transition-colors cursor-pointer
                 ${notification.read ? 'bg-white' : 'bg-blue-50/50'}`}
    >
      <div className="flex gap-3">
        <div className={`p-2 rounded-full ${getIconBackground()}`}>
          {getIcon()}
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{notification.time}</span>
            {notification.read && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <Check className="w-3 h-3" />
                Read
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;