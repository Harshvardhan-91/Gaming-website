import React, { useState } from 'react';
import { 
  Search, Filter, Star, ChevronDown, Grid, List, Gamepad2, 
  Clock, SlidersHorizontal, X, Check 
} from 'lucide-react';

const GameListing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gameType: [],
    priceRange: '',
    rating: null,
    sortBy: 'newest'
  });

  // Mock data for listings
  const listings = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    title: `${['Valorant', 'PUBG', 'CS:GO', 'Fortnite'][index % 4]} Premium Account`,
    price: Math.floor(Math.random() * 200) + 50,
    image: `/api/placeholder/400/300`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    level: Math.floor(Math.random() * 100) + 50,
    skins: Math.floor(Math.random() * 50) + 10,
    timeLeft: `${Math.floor(Math.random() * 7) + 1} days`,
    verified: Math.random() > 0.3,
    description: "High-level account with rare skins and exclusive items. Perfect for serious gamers."
  }));

  const gameTypes = [
    "FPS", "Battle Royale", "MOBA", "RPG", "Sports", "Strategy"
  ];

  const priceRanges = [
    { label: "Under $50", value: "0-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "$100 - $200", value: "100-200" },
    { label: "$200+", value: "200+" }
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Most Popular", value: "popular" }
  ];

  const toggleFilter = (type, value) => {
    setSelectedFilters(prev => {
      if (type === 'gameType') {
        const newGameTypes = prev.gameType.includes(value)
          ? prev.gameType.filter(t => t !== value)
          : [...prev.gameType, value];
        return { ...prev, gameType: newGameTypes };
      }
      return { ...prev, [type]: value };
    });
  };

  const ListingCard = ({ listing, view }) => (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all 
                    duration-200 overflow-hidden ${
                      view === 'grid' ? '' : 'flex'
                    }`}>
      <div className={`relative ${view === 'grid' ? 'w-full' : 'w-1/3'}`}>
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        {listing.verified && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs 
                         px-2 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>
      <div className={`p-6 ${view === 'grid' ? '' : 'w-2/3'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {listing.description}
            </p>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            ${listing.price}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{listing.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Level {listing.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{listing.timeLeft} left</span>
          </div>
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-xl hover:opacity-90 transition-all duration-200">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Game Accounts</h1>
            <p className="text-gray-600">
              Browse through {listings.length.toLocaleString()} verified game accounts
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-sm flex p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-white p-2 rounded-lg shadow-sm text-gray-600 hover:text-gray-800"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Sort Dropdown */}
            <select
              value={selectedFilters.sortBy}
              onChange={(e) => toggleFilter('sortBy', e.target.value)}
              className="bg-white py-2 px-4 rounded-lg shadow-sm text-gray-600 
                       border-gray-200 focus:outline-none focus:ring-2 
                       focus:ring-blue-100 focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="font-semibold mb-4">Filters</h2>

            {/* Game Type */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Game Type</h3>
              <div className="space-y-2">
                {gameTypes.map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.gameType.includes(type)}
                      onChange={() => toggleFilter('gameType', type)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 
                               focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label key={range.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedFilters.priceRange === range.value}
                      onChange={(e) => toggleFilter('priceRange', e.target.value)}
                      className="w-4 h-4 border-gray-300 text-blue-600 
                               focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium mb-3">Minimum Rating</h3>
              <div className="flex items-center gap-2">
                {[4, 3, 2].map(rating => (
                  <button
                    key={rating}
                    onClick={() => toggleFilter('rating', rating)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm
                              ${selectedFilters.rating === rating
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-50 text-gray-600'
                              }`}
                  >
                    {rating}+ <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {listings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  view={viewMode}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              {/* Mobile filter content - same as desktop */}
              {/* Game Type */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Game Type</h3>
                <div className="space-y-2">
                  {gameTypes.map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.gameType.includes(type)}
                        onChange={() => toggleFilter('gameType', type)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 
                                 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={selectedFilters.priceRange === range.value}
                        onChange={(e) => toggleFilter('priceRange', e.target.value)}
                        className="w-4 h-4 border-gray-300 text-blue-600 
                                 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Minimum Rating</h3>
                <div className="flex items-center gap-2">
                  {[4, 3, 2].map(rating => (
                    <button
                      key={rating}
                      onClick={() => toggleFilter('rating', rating)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm
                                ${selectedFilters.rating === rating
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-gray-50 text-gray-600'
                                }`}
                    >
                      {rating}+ <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameListing;