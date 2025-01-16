import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Share2, Check, 
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Clock, Trophy, Calendar, Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Alert, AlertDescription } from '../ui/alert';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data.listing);
        setIsLiked(response.data.listing.likes.includes(user?._id));
      } catch (err) {
        setError(err.response?.data?.error || 'Error loading listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }

    try {
      const response = await api.post(`/listings/${id}/like`);
      setIsLiked(response.data.liked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    // Navigate to chat with the seller
    navigate(`/chat?listing=${id}&seller=${listing.seller._id}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing.title,
        text: `Check out this ${listing.gameType} account!`,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!listing) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] relative bg-white rounded-2xl overflow-hidden">
              <img
                src={listing.images[currentImageIndex]}
                alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 
                             rounded-full bg-white/80 hover:bg-white shadow-sm 
                             transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 
                             rounded-full bg-white/80 hover:bg-white shadow-sm 
                             transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 aspect-[4/3] 
                           rounded-lg overflow-hidden ${
                             index === currentImageIndex 
                               ? 'ring-2 ring-blue-500' 
                               : 'opacity-70 hover:opacity-100'
                           }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {listing.title}
                </h1>
                <span className="text-2xl font-bold text-green-600">
                  ${listing.price.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  {listing.gameType}
                </span>
                <span>Views: {listing.views}</span>
                <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={listing.seller.avatar || '/api/placeholder/48/48'}
                  alt={listing.seller.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{listing.seller.name}</h3>
                    {listing.seller.verified && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(listing.seller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full ${
                    isLiked 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-500 bg-gray-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-gray-500 bg-gray-50"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium">{listing.details.level || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Rank</p>
                    <p className="font-medium">{listing.details.rank || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Account Age</p>
                    <p className="font-medium">{listing.details.accountAge || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Skins</p>
                    <p className="font-medium">{listing.details.skins || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg">Features</h3>
                <ul className="space-y-2">
                  {listing.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleContact}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 
                         transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Seller
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 border border-gray-200 rounded-xl 
                         text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Safety Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Safety Tips:</strong> Always use our in-app chat for 
                communication. Never share personal contact information or make 
                payments outside the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;