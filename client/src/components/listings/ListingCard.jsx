import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  // Early return if listing is undefined
  if (!listing) {
    return null;
  }

  // Optional chaining and default values for nested properties
  const {
    _id,
    images = [],
    title = '',
    price = 0,
    gameType = '',
    seller = {}
  } = listing;

  // Destructure seller with default values
  const {
    verified = false,
    rating = 0,
    avatar = '',
    name = ''
  } = seller;

  return (
    <div 
      onClick={() => navigate(`/listing/${_id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow 
                 cursor-pointer overflow-hidden"
    >
      <div className="aspect-[4/3] relative">
        <img
          src={images[0] || '/api/placeholder/400/300'}
          alt={title}
          className="w-full h-full object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 
                        rounded-full">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <span className="text-green-600 font-semibold whitespace-nowrap ml-2">
            ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {gameType}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            {typeof rating === 'number' ? rating.toFixed(1) : '0.0'}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <img
            src={avatar || '/api/placeholder/40/40'}
            alt={name}
            className="w-5 h-5 rounded-full mr-2"
          />
          <span>{name}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;