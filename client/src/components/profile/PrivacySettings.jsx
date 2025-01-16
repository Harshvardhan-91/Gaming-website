import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PrivacySettings = ({ preferences, onChange }) => {
  const settings = [
    {
      id: 'showEmail',
      label: 'Show Email Address',
      description: 'Allow other users to see your email address'
    },
    {
      id: 'showPhone',
      label: 'Show Phone Number',
      description: 'Allow other users to see your phone number'
    }
  ];

  const NotificationSettings = [
    {
      id: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email'
    },
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Receive push notifications in browser'
    },
    {
      id: 'messages',
      label: 'Message Notifications',
      description: 'Receive notifications for new messages'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
        </div>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">{setting.label}</label>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onChange('privacy', setting.id, 
                  !preferences.privacy[setting.id])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full 
                         transition-colors ${
                           preferences.privacy[setting.id] 
                             ? 'bg-blue-600' 
                             : 'bg-gray-200'
                         }`}
              >
                <span className="sr-only">Enable {setting.label}</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full 
                           bg-white transition-transform ${
                             preferences.privacy[setting.id] 
                               ? 'translate-x-6' 
                               : 'translate-x-1'
                           }`}
                />
                {preferences.privacy[setting.id] ? (
                  <Eye className="absolute right-1 w-3 h-3 text-white" />
                ) : (
                  <EyeOff className="absolute left-1 w-3 h-3 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {NotificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">{setting.label}</label>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onChange('notifications', setting.id, 
                  !preferences.notifications[setting.id])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full 
                         transition-colors ${
                           preferences.notifications[setting.id] 
                             ? 'bg-blue-600' 
                             : 'bg-gray-200'
                         }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full 
                           bg-white transition-transform ${
                             preferences.notifications[setting.id] 
                               ? 'translate-x-6' 
                               : 'translate-x-1'
                           }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;