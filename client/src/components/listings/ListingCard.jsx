import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow 
                 cursor-pointer overflow-hidden"
    >
      <div className="aspect-[4/3] relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {listing.seller.verified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 
                        rounded-full">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {listing.title}
          </h3>
          <span className="text-green-600 font-semibold whitespace-nowrap ml-2">
            ${listing.price}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {listing.gameType}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            {listing.seller.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <img
            src={listing.seller.avatar}
            alt={listing.seller.name}
            className="w-5 h-5 rounded-full mr-2"
          />
          <span>{listing.seller.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;