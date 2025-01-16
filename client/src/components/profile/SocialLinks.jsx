import React from 'react';
import { MessageCircle, GamepadIcon, MessagesSquare } from 'lucide-react';

const SocialLinks = ({ socialLinks, onChange }) => {
  const socialPlatforms = [
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageCircle,  // Changed to a similar icon
      placeholder: 'Your Discord username',
      pattern: '^.{3,32}#[0-9]{4}$',
      validation: 'Format: Username#0000'
    },
    {
      id: 'steam',
      name: 'Steam',
      icon: GamepadIcon,    // Changed to a gaming-related icon
      placeholder: 'Your Steam profile URL',
      pattern: '^https?://steamcommunity\\.com/.*$',
      validation: 'Enter your Steam profile URL'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: MessagesSquare, // Changed to a similar icon
      placeholder: 'Your Twitter username',
      pattern: '^@?[a-zA-Z0-9_]{4,15}$',
      validation: 'Enter your Twitter handle'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
      <div className="grid gap-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {platform.name}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={socialLinks[platform.id] || ''}
                  onChange={(e) => onChange({
                    ...socialLinks,
                    [platform.id]: e.target.value
                  })}
                  placeholder={platform.placeholder}
                  pattern={platform.pattern}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-200 
                           rounded-lg focus:ring-2 focus:ring-blue-100 
                           focus:border-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{platform.validation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;