import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Star,
  Shield,
  Clock,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Info,
  CheckCircle2,
  Gamepad2,
  Trophy,
  AlertCircle
} from 'lucide-react';

const ListingDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock data for a single listing
  const listing = {
    id,
    title: "Premium Valorant Account",
    price: 249.99,
    seller: {
      name: "ProGamer123",
      rating: 4.9,
      sales: 156,
      verified: true,
      joinedDate: "Aug 2023"
    },
    images: Array(4).fill("/api/placeholder/800/600"),
    rating: 4.8,
    level: 150,
    skins: 45,
    timeLeft: "2 days",
    verified: true,
    description: "Max level Valorant account with rare skins and all battle passes completed. Perfect for serious players looking for a competitive advantage.",
    features: [
      "Account Level 150+",
      "45+ Premium Skins",
      "All Agents Unlocked",
      "Rare Battle Pass Items",
      "Competition Ready",
      "Clean Account History"
    ],
    stats: {
      rank: "Immortal 3",
      kdRatio: "1.8",
      winRate: "62%",
      hoursPlayed: "1200+",
      achievements: "85%"
    }
  };

  const ImageGallery = () => (
    <div className="space-y-4">
      <div className="relative h-96 rounded-xl overflow-hidden">
        <img
          src={listing.images[selectedImage]}
          alt={`${listing.title} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
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
    </div>
  );

  const SellerInfo = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{listing.seller.name}</h3>
            {listing.seller.verified && (
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{listing.seller.rating}</span>
            <span>•</span>
            <span>{listing.seller.sales} sales</span>
          </div>
        </div>
        <button 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={() => {}}
        >
          View Profile
        </button>
      </div>
      <button 
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                 text-white rounded-xl hover:opacity-90 transition-all duration-200 
                 flex items-center justify-center gap-2 mb-3"
      >
        <MessageCircle className="w-5 h-5" />
        Contact Seller
      </button>
      <button 
        className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl 
                 hover:bg-gray-50 transition-all duration-200"
      >
        Make Offer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Browse</span>
          <ChevronRight className="w-4 h-4" />
          <span>Valorant</span>
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
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                        isWishlisted ? 'text-red-500' : 'text-gray-600'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{listing.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{listing.timeLeft} left</span>
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
                <p className="text-gray-600">{listing.description}</p>
              </div>

              {/* Features Grid */}
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

              {/* Stats */}
              <div>
                <h2 className="font-semibold mb-3">Account Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Trophy className="w-5 h-5" />
                      <span>Rank</span>
                    </div>
                    <div className="text-lg font-semibold">{listing.stats.rank}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Gamepad2 className="w-5 h-5" />
                      <span>K/D Ratio</span>
                    </div>
                    <div className="text-lg font-semibold">{listing.stats.kdRatio}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Trophy className="w-5 h-5" />
                      <span>Win Rate</span>
                    </div>
                    <div className="text-lg font-semibold">{listing.stats.winRate}</div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-1">Safety First!</h3>
                    <p className="text-sm text-blue-600/80">
                      Always use our secure payment system and chat. Never share personal 
                      information or make payments outside the platform.
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
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Important Notice</h3>
                  <p className="text-sm text-gray-600">
                    This listing will expire in {listing.timeLeft}. Act fast to secure 
                    this account!
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