import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Gamepad2, Shield, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ListingCard = ({ listing, view = 'grid' }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    listing.likes?.some(like => like === user?._id)
  );

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation
    if (!user) {
      toast.error('Please login to save listings');
      return;
    }

    try {
      const response = await api.post(`/listings/${listing._id}/like`);
      if (response.data.success) {
        setIsLiked(response.data.liked);
        toast.success(response.data.liked ? 'Added to wishlist' : 'Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + ' years ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + ' months ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + ' days ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + ' hours ago';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + ' minutes ago';
    
    return 'Just now';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all 
                    duration-200 overflow-hidden ${
                      view === 'grid' ? '' : 'flex'
                    }`}>
      {/* Image Section */}
      <Link to={`/listing/${listing._id}`} className={`block ${view === 'grid' ? 'w-full' : 'w-1/3'}`}>
        <div className="relative group">
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          {listing.verified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 
                         py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                       transition-opacity flex items-center justify-center">
            <span className="text-white font-medium">View Details</span>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className={`p-6 ${view === 'grid' ? '' : 'w-2/3'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link to={`/listing/${listing._id}`}>
              <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 
                         transition-colors">{listing.title}</h3>
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{listing.seller?.rating?.toFixed(1) || 'New'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gamepad2 className="w-4 h-4" />
                <span>{listing.gameType}</span>
              </div>
              {listing.verified && (
                <div className="flex items-center gap-1 text-green-600">
                  <Shield className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ${listing.price}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {formatTimeAgo(listing.createdAt)}
            </div>
          </div>
        </div>

        {/* Features/Details */}
        <div className="space-y-3">
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {listing.features?.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
              >
                {feature}
              </span>
            ))}
            {listing.features?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                +{listing.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <Link 
            to={`/seller/${listing.seller?._id}`}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 
                     transition-colors"
          >
            <img
              src={listing.seller?.avatar || '/api/placeholder/32/32'}
              alt={listing.seller?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <div className="font-medium">{listing.seller?.name}</div>
              <div className="text-gray-500">
                {listing.seller?.salesCount || 0} sales
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleLike}
              className={`p-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <Link
              to={`/listing/${listing._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;