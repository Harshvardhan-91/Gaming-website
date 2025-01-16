import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileAvatar = ({ 
  size = 'md', 
  editable = false,
  showStatus = false, 
  className = '' 
}) => {
  const { user, updateAvatar } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await updateAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderInitials = () => {
    if (!user?.name) return <User className="w-1/2 h-1/2 text-gray-400" />;
    
    const initials = user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return <span className="font-semibold text-gray-700">{initials}</span>;
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${
        isUploading ? 'opacity-50' : ''
      }`}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'Profile'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onError = null;
              e.target.src = ''; // This will trigger the fallback content
            }}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-gray-100 flex items-center 
                        justify-center`}>
            {renderInitials()}
          </div>
        )}
      </div>

      {editable && isHovered && (
        <label className="absolute inset-0 flex items-center justify-center 
                       bg-black bg-opacity-50 rounded-full cursor-pointer 
                       transition-opacity">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Camera className="w-1/3 h-1/3 text-white" />
        </label>
      )}

      {showStatus && user?.online && (
        <span className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-green-500 
                      border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default ProfileAvatar;