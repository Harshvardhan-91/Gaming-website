import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ImageOff } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Early return if listing is undefined
  if (!listing) {
    return null;
  }

  const {
    _id,
    images = [],
    title = '',
    price = 0,
    gameType = '',
    seller = {}
  } = listing;

  const {
    verified = false,
    rating = 0,
    avatar = '',
    name = ''
  } = seller;

  const handleImageError = () => {
    setImageError(true);
  };

  const renderImage = () => {
    if (imageError) {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    return (
      <img
        src={images[0] || '/api/placeholder/400/300'}
        alt={title}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    );
  };

  return (
    <div 
      onClick={() => navigate(`/listing/${_id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow 
                 cursor-pointer overflow-hidden group"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {renderImage()}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        {verified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 
                        rounded-full shadow-sm">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <span className="text-green-600 font-semibold whitespace-nowrap ml-2">
            ${typeof price === 'number' ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded-lg">
            {gameType}
          </span>
          {rating > 0 && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                {rating.toFixed(1)}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 mr-2">
            <img
              src={avatar || '/api/placeholder/40/40'}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = '/api/placeholder/40/40'}
            />
          </div>
          <span className="truncate">{name}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;