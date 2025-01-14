import React from 'react';
import { Search, MessageCircle } from 'lucide-react';

const GameCard = ({ title, price, seller, platform }) => {
  return (
    <div className="p-4 border rounded-lg bg-white hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200">
      <div className="mb-4">
        <img
          src="/api/placeholder/300/200"
          alt="Game"
          className="w-full h-48 object-cover rounded-md"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
            {platform}
          </span>
          <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
            Verified
          </span>
        </div>
        <p className="text-xl font-bold text-green-600">${price}</p>
        <p className="text-sm text-gray-500">Seller: {seller}</p>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200">
          <MessageCircle className="w-4 h-4" />
          Contact Seller
        </button>
      </div>
    </div>
  );
};

const FeaturedCategories = () => {
  const categories = [
    'RPG Games',
    'Action Games',
    'Sports Games',
    'Strategy Games',
    'Adventure Games',
    'Racing Games',
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <button
          key={category}
          className="h-24 border rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
        >
          <span className="text-sm">{category}</span>
        </button>
      ))}
    </div>
  );
};

const HomePage = () => {
  const featuredGames = [
    {
      title: 'PUBG Mobile Account',
      price: '299',
      seller: 'GameMaster',
      platform: 'Mobile',
    },
    {
      title: 'Genshin Impact Account',
      price: '199',
      seller: 'ProGamer',
      platform: 'PC/Mobile',
    },
    {
      title: 'Valorant Account',
      price: '150',
      seller: 'EliteGamer',
      platform: 'PC',
    },
    {
      title: 'Mobile Legends Account',
      price: '250',
      seller: 'MLBBPro',
      platform: 'Mobile',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">
            Buy & Sell Game Accounts Safely
          </h1>
          <p className="text-xl mb-8">
            The most trusted marketplace for gamers
          </p>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for games..."
              className="w-full px-10 py-3 text-gray-800 bg-white rounded-md placeholder-gray-500"
            />
            <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <FeaturedCategories />
        </div>

        {/* Featured Listings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Game Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;