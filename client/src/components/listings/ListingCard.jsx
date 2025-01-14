import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Gamepad2, Shield, Heart } from 'lucide-react';

const ListingCard = ({ listing, view = 'grid' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all 
                    duration-200 overflow-hidden ${
                      view === 'grid' ? '' : 'flex'
                    }`}>
      {/* Image Section */}
      <div className={`relative ${view === 'grid' ? 'w-full' : 'w-1/3'}`}>
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        {listing.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 
                       py-1 rounded-full text-xs font-medium">
            Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-6 ${view === 'grid' ? '' : 'w-2/3'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{listing.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gamepad2 className="w-4 h-4" />
                <span>Level {listing.level}</span>
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
              {listing.type}
            </div>
          </div>
        </div>

        {/* Features/Details */}
        <div className="space-y-3">
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {listing.features.map((feature, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg 
                         text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <div className="font-medium">{listing.seller.name}</div>
              <div className="text-gray-500">{listing.seller.ratings} ratings</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <Link
              to={`/listing/${listing.id}`}
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