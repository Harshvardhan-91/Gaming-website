import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Star, Shield, Clock } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../../utils/helpers';

const ListingCard = ({ listing }) => {
  const {
    _id,
    title,
    price,
    gameType,
    images,
    seller,
    views,
    verified,
    createdAt
  } = listing;

  return (
    <Link 
      to={`/listing/${_id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden rounded-t-xl">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
            {formatPrice(price)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full">{gameType}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {views}
          </span>
        </div>

        {/* Seller Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {seller.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{seller.name}</p>
              {seller.rating && (
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  {seller.rating.toFixed(1)}
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(createdAt)}
          </div>
        </div>

        {/* Contact Button */}
        <button
          className="mt-4 w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 
                   text-blue-600 rounded-lg font-medium text-sm flex items-center 
                   justify-center gap-2 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement chat functionality
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Contact Seller
        </button>
      </div>
    </Link>
  );
};

export default ListingCard;