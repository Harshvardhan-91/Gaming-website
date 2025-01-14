import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Bell, DollarSign } from 'lucide-react';

const Toast = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'offer':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`flex items-center p-4 bg-white rounded-lg shadow-lg`}>
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 mr-4">
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-gray-600">{notification.content}</div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts = [], removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;