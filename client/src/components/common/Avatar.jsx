import React from 'react';
import DefaultAvatar from './DefaultAvatar';

const Avatar = ({ 
  src, 
  name = '', 
  size = 'md', 
  className = '',
  showStatus = false,
  isOnline = false 
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  };

  if (!src || imgError) {
    return <DefaultAvatar name={name} size={size} className={className} />;
  }

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={name || 'Avatar'}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
      {showStatus && (
        <span 
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full 
                     border-2 border-white ${
                       isOnline ? 'bg-green-500' : 'bg-gray-400'
                     }`}
        />
      )}
    </div>
  );
};

export default Avatar;