import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Shield, Heart, Share2, MessageSquare, ChevronRight, 
  Clock, Gamepad2, Trophy, Info, User, CheckCircle2, Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatRelativeTime } from '../utils/helpers';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/listings/${id}`);
      setListing(response.data.listing);
      // Check if the listing is in user's wishlist
      if (user && response.data.listing.likes.includes(user._id)) {
        setIsWishlisted(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching listing');
      console.error('Error fetching listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    // Navigate to chat with this seller
    navigate(`/chat`, { 
      state: { 
        sellerId: listing.seller._id,
        listingId: listing._id 
      } 
    });
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    try {
      const response = await api.post(`/listings/${id}/like`);
      setIsWishlisted(response.data.liked);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  const ImageGallery = () => (
    <div className="space-y-4">
      <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100">
        {listing.images.length > 0 ? (
          <img
            src={listing.images[selectedImage]}
            alt={`${listing.title} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No images available
          </div>
        )}
      </div>
      {listing.images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {listing.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-lg overflow-hidden aspect-square ${
                selectedImage === index ? 'ring-2 ring-blue-500' : ''
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
      )}
    </div>
  );

  const SellerInfo = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            {listing.seller.avatar ? (
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-full h-full rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{listing.seller.name}</h3>
              {listing.seller.verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {listing.seller.rating && (
                <>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{listing.seller.rating.toFixed(1)}</span>
                  <span>•</span>
                </>
              )}
              <span>Member since {new Date(listing.seller.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <Link 
          to={`/seller/${listing.seller._id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Profile
        </Link>
      </div>

      {user ? (
        <>
          <button 
            onClick={handleContactSeller}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white rounded-xl hover:opacity-90 transition-all duration-200 
                     flex items-center justify-center gap-2 mb-3"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Seller
          </button>
        </>
      ) : (
        <Link
          to="/login"
          state={{ from: `/listing/${id}` }}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white rounded-xl hover:opacity-90 transition-all duration-200 
                   flex items-center justify-center gap-2"
        >
          Login to Contact Seller
        </Link>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchListing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Listing not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/browse" className="hover:text-gray-900">Browse</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery />

            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold">{listing.title}</h1>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleWishlist}
                      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                        isWishlisted ? 'text-red-500' : 'text-gray-600'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatRelativeTime(listing.createdAt)}</span>
                  </div>
                  {listing.verified && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <Shield className="w-4 h-4" />
                        <span>Verified Account</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${listing.price}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-semibold mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Features Grid */}
              {listing.features && listing.features.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-3">Account Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {listing.details && (
                <div>
                  <h2 className="font-semibold mb-3">Account Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.details.level && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Trophy className="w-5 h-5" />
                          <span>Level</span>
                        </div>
                        <div className="text-lg font-semibold">{listing.details.level}</div>
                      </div>
                    )}
                    {listing.details.rank && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Trophy className="w-5 h-5" />
                          <span>Rank</span>
                        </div>
                        <div className="text-lg font-semibold">{listing.details.rank}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Safety Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-1">Safety First!</h3>
                    <p className="text-sm text-blue-600/80">
                      Always use our secure chat system. Never share personal 
                      information or make arrangements outside the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Seller Info & Actions */}
          <div className="space-y-6">
            <SellerInfo />
            
            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-3 text-yellow-600">
                <Info className="w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Important Notice</h3>
                  <p className="text-sm text-gray-600">
                    Account credentials will be securely shared through our chat system
                    after seller verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;

