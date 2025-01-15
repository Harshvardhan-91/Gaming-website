import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Clock, Gamepad2, Shield, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ListingGrid from '../components/listings/ListingGrid';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('FPS Games');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      // Fetch only verified listings with high ratings
      const response = await api.get('/listings', {
        params: {
          verified: true,
          sort: '-rating',
          limit: 3
        }
      });
      setFeaturedListings(response.data.listings);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: "FPS Games",
      count: 1234,
      image: "/api/placeholder/400/400" // Using placeholder images
    },
    {
      name: "Battle Royale",
      count: 856,
      image: "/api/placeholder/400/400"
    },
    {
      name: "MOBA",
      count: 654,
      image: "/api/placeholder/400/400"
    },
    {
      name: "RPG",
      count: 987,
      image: "/api/placeholder/400/400"
    },
    {
      name: "Sports",
      count: 432,
      image: "/api/placeholder/400/400"
    },
    {
      name: "Strategy",
      count: 345,
      image: "/api/placeholder/400/400"
    }
  ];

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "50K+",
      label: "Active Users"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      value: "100%",
      label: "Secure Transactions"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "24/7",
      label: "Customer Support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your One-Stop Destination for Gaming Accounts
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Buy and sell game accounts safely and securely. 
              Join thousands of gamers in our trusted marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="px-8 py-3 bg-white text-blue-600 rounded-xl 
                         font-semibold hover:bg-blue-50 transition-all duration-200"
              >
                Browse Accounts
              </Link>
              <Link
                to="/create-listing"
                className="px-8 py-3 bg-transparent border-2 border-white 
                         rounded-xl font-semibold hover:bg-white/10 
                         transition-all duration-200"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-gray-50"></div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 justify-center"
              >
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link 
            to="/browse" 
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading featured listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <Link 
                key={listing._id}
                to={`/listing/${listing._id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md 
                         transition-all duration-200"
              >
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <span className="text-2xl font-bold text-blue-600">
                      ${listing.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{listing.seller.rating || 'New'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gamepad2 className="w-4 h-4" />
                      <span>Level {listing.details.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 
                                   to-purple-600 text-white rounded-xl 
                                   hover:opacity-90 transition-all duration-200">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden 
                          transition-all duration-200
                          ${activeCategory === category.name ? 'ring-2 ring-blue-500' : ''}`}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold">{category.name}</h3>
                  <span className="text-white/80 text-sm">{category.count} listings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Listings Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">All Listings</h2>
        <ListingGrid />
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Safe and Secure Trading</h2>
            <p className="mb-6">
              Our platform ensures secure transactions and verified sellers. 
              Trade with confidence knowing you're protected.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 
                       rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Learn How It Works
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;