import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter as FilterIcon, Grid, List } from 'lucide-react';
import ListingCard from '../components/listings/ListingCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: '',
    gameType: [],
    sort: 'relevance'
  });

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      // Mock data
      const mockResults = Array(8).fill(null).map((_, index) => ({
        id: index + 1,
        title: `${['Valorant', 'CSGO', 'PUBG', 'Fortnite'][index % 4]} Account - ${query}`,
        price: Math.floor(Math.random() * 200) + 50,
        image: `/api/placeholder/400/300`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        level: Math.floor(Math.random() * 100) + 50,
        verified: Math.random() > 0.3,
        description: "High-level account with rare skins and exclusive items.",
        features: ['Rare Skins', 'Battle Pass Items', 'Limited Edition Content'],
        seller: {
          name: `Seller ${index + 1}`,
          avatar: '/api/placeholder/32/32',
          ratings: Math.floor(Math.random() * 100) + 10
        }
      }));

      setResults(mockResults);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  const FilterDrawer = () => (
    <div className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl 
                    transform transition-transform duration-300 ease-in-out 
                    ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
            className="w-full p-2 border border-gray-200 rounded-lg"
          >
            <option value="">All Prices</option>
            <option value="0-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
        </div>

        {/* Game Types */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Game Type</h3>
          <div className="space-y-2">
            {['FPS', 'Battle Royale', 'MOBA', 'RPG'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.gameType.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        gameType: [...prev.gameType, type]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        gameType: prev.gameType.filter(t => t !== type)
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 
                           focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
          <select
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            className="w-full p-2 border border-gray-200 rounded-lg"
          >
            <option value="relevance">Most Relevant</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <button
          onClick={() => setIsFilterOpen(false)}
          className="w-full py-2 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent 
                     rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {results.length} results
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg 
                     shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FilterIcon className="w-5 h-5" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {results.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              view={viewMode}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg 
                         text-gray-700 hover:bg-gray-50 transition-colors">
            Load More Results
          </button>
        </div>

        {/* Filter Drawer */}
        <FilterDrawer />
      </div>
    </div>
  );
};

export default SearchPage;