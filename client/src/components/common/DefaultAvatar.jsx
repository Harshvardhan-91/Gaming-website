import React from 'react';
import { User } from 'lucide-react';

const DefaultAvatar = ({ name = '', size = 'md', className = '' }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const hasInitials = name.trim().length > 0;
  const bgColor = `bg-${Math.floor(name.length * 7) % 2 === 0 ? 'blue' : 'purple'}-100`;

  return (
    <div
      className={`relative rounded-full flex items-center justify-center 
                 ${bgColor} ${sizeClasses[size]} ${className}`}
    >
      {hasInitials ? (
        <span className="font-semibold text-gray-700">
          {getInitials(name)}
        </span>
      ) : (
        <User
          className={`text-gray-400 ${
            size === 'xs' ? 'w-4 h-4' :
            size === 'sm' ? 'w-5 h-5' :
            size === 'md' ? 'w-6 h-6' :
            size === 'lg' ? 'w-8 h-8' :
            'w-10 h-10'
          }`}
        />
      )}
    </div>
  );
};

export default DefaultAvatar;