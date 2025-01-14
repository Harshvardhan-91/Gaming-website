import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, CheckCircle2, User, MessageSquare, Package, 
  Award, Shield, TrendingUp 
} from 'lucide-react';
import ListingCard from '../components/listings/ListingCard';

const SellerProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('listings');

  // Mock seller data
  const seller = {
    id,
    name: 'ProGamer123',
    avatar: '/api/placeholder/120/120',
    rating: 4.9,
    salesCount: 156,
    joinedDate: 'August 2023',
    verified: true,
    bio: 'Professional game account trader with 5+ years of experience. Specializing in high-tier accounts across multiple games.',
    socialLinks: {
      discord: '#',
      steam: '#'
    }
  };

  // Mock listings data
  const listings = Array(6).fill(null).map((_, index) => ({
    id: index + 1,
    title: `${['Valorant', 'CSGO', 'PUBG', 'Fortnite'][index % 4]} Account`,
    price: Math.floor(Math.random() * 200) + 50,
    image: `/api/placeholder/400/300`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    level: Math.floor(Math.random() * 100) + 50,
    verified: Math.random() > 0.3,
    description: "High-level account with rare skins and exclusive items.",
    features: ['Rare Skins', 'Battle Pass Items', 'Limited Edition Content'],
    seller: {
      name: seller.name,
      avatar: seller.avatar,
      ratings: seller.salesCount
    }
  }));

  const stats = [
    {
      label: 'Total Listings',
      value: listings.length,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'Total Sales',
      value: seller.salesCount,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Rating',
      value: seller.rating,
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-600 mb-2">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
          <div className={`p-3 bg-opacity-10 rounded-full ${stat.color} bg-current`}>
            <Icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Seller Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              {seller.verified && (
                <CheckCircle2 
                  className="absolute bottom-2 right-2 w-8 h-8 text-blue-500 
                             bg-white rounded-full p-1 shadow-md"
                />
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold">{seller.name}</h1>
                {seller.verified && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span>{seller.rating} Rating</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Award className="w-5 h-5 text-green-500" />
                  <span>{seller.salesCount} Sales</span>
                </div>
                <span>•</span>
                <span>Joined {seller.joinedDate}</span>
              </div>
              <p className="text-gray-600 max-w-xl mx-auto md:mx-0 text-center md:text-left">
                {seller.bio}
              </p>
            </div>
            <div className="flex flex-col md:flex-col gap-4">
                              <button 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                text-white rounded-xl hover:opacity-90 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Seller
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-gray-200 pt-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Seller Listings and Reviews */}
        <div>
          {/* Tabs */}
          <div className="flex justify-center mb-8 bg-white rounded-xl shadow-sm p-2">
            {[
              { id: 'listings', label: 'Listings', icon: Package },
              { id: 'reviews', label: 'Reviews', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg 
                transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  view="grid"
                />
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Customer Reviews
              </h2>
              
              {/* Overall Rating */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  <span className="text-3xl font-bold">{seller.rating}</span>
                </div>
                <p className="text-gray-600">
                  Based on {seller.salesCount} verified sales
                </p>
              </div>

              {/* Review List (Mock Data) */}
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    name: 'John Doe',
                    avatar: '/api/placeholder/40/40',
                    rating: 5,
                    comment: 'Great seller! Account was exactly as described.',
                    date: '2 weeks ago'
                  },
                  {
                    id: 2,
                    name: 'Jane Smith',
                    avatar: '/api/placeholder/40/40',
                    rating: 4,
                    comment: 'Good experience, would recommend.',
                    date: '1 month ago'
                  }
                ].map(review => (
                  <div 
                    key={review.id} 
                    className="bg-gray-50 p-6 rounded-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{review.name}</h3>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;