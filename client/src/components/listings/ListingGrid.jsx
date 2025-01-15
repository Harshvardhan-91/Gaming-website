import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Check, 
  Star, X, Loader2 
} from 'lucide-react';
import api from '../../utils/api';

const ListingGrid = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gameType: '',
    minPrice: '',
    maxPrice: '',
    verified: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const gameTypes = [
    "All",
    "Valorant",
    "CSGO",
    "PUBG",
    "Fortnite",
    "League of Legends",
    "Other"
  ];

  const fetchListings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.gameType && filters.gameType !== 'All') {
        queryParams.append('gameType', filters.gameType);
      }
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.verified) queryParams.append('verified', filters.verified);
      queryParams.append('page', page);

      const response = await api.get(`/listings?${queryParams.toString()}`);
      setListings(response.data.listings);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err) {
      setError('Error fetching listings. Please try again.');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters, page]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const ListingCard = ({ listing }) => (
    <div 
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow 
                 cursor-pointer overflow-hidden"
    >
      <div className="aspect-[4/3] relative">
        <img
          src={listing.images?.[0] || '/placeholder-image.jpg'}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {listing.seller?.verified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 
                        rounded-full">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {listing.title}
          </h3>
          <span className="text-green-600 font-semibold whitespace-nowrap ml-2">
            ${listing.price}
          </span>
        </div>
  
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {listing.gameType}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            {/* Add null checking for seller rating */}
            {listing.seller?.rating ? listing.seller.rating.toFixed(1) : 'N/A'}
          </div>
        </div>
  
        <div className="flex items-center text-sm text-gray-500">
          <img
            src={listing.seller?.avatar || '/default-avatar.jpg'}
            alt={listing.seller?.name || 'Seller'}
            className="w-5 h-5 rounded-full mr-2"
          />
          <span>{listing.seller?.name || 'Unknown Seller'}</span>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 
                      rounded-full bg-red-100 text-red-500 mb-4">
          <X className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Listings
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchListings}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                           text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 
                     rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Type
                </label>
                <select
                  value={filters.gameType}
                  onChange={(e) => handleFilterChange('gameType', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  {gameTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Min $"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Max $"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Status
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>Verified Sellers Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                        xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListingGrid;