import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  Loader2
} from "lucide-react";
import api from '../utils/api';
import ListingCard from "../components/listings/ListingCard";
import toast from 'react-hot-toast';

const GameListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    gameType: searchParams.get('gameType')?.split(',') || [],
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    search: searchParams.get('q') || ''
  });

  const gameTypes = [
    "Valorant",
    "CSGO",
    "PUBG",
    "Fortnite",
    "League of Legends",
    "Other"
  ];

  const priceRanges = [
    { label: "Under $50", value: "0-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "$100 - $200", value: "100-200" },
    { label: "$200+", value: "200+" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Most Popular", value: "popular" }
  ];

  // Fetch listings with current filters
  const fetchListings = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      
      // Construct query parameters
      const params = new URLSearchParams();
      if (filters.gameType.length) params.append('gameType', filters.gameType.join(','));
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) params.append('minPrice', min);
        if (max && max !== '+') params.append('maxPrice', max);
      }
      if (filters.sortBy) {
        const sort = filters.sortBy === 'newest' ? '-createdAt' :
                    filters.sortBy === 'price_asc' ? 'price' :
                    filters.sortBy === 'price_desc' ? '-price' :
                    filters.sortBy === 'popular' ? '-views' : '-createdAt';
        params.append('sort', sort);
      }
      params.append('page', page);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/listings?${params}`);
      
      if (response?.data?.success) {
        if (page === 1) {
          setListings(response.data.listings);
        } else {
          setListings(prev => [...prev, ...response.data.listings]);
        }
        setTotalPages(response.data.pages);
        setCurrentPage(response.data.currentPage);
      } else {
        throw new Error(response.data?.error || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error(error.response?.data?.error || error.message || 'Error loading listings');
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.gameType.length) params.set('gameType', filters.gameType.join(','));
    if (filters.priceRange) params.set('priceRange', filters.priceRange);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.search) params.set('q', filters.search);
    setSearchParams(params);
    
    fetchListings(1);
  }, [filters]);

  // Handle filter changes
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      if (type === "gameType") {
        const newGameTypes = prev.gameType.includes(value)
          ? prev.gameType.filter((t) => t !== value)
          : [...prev.gameType, value];
        return { ...prev, gameType: newGameTypes };
      }
      return { ...prev, [type]: value };
    });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: e.target.search.value }));
  };

  // Load more listings
  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchListings(currentPage + 1);
    }
  };

  // Reset filters
  const clearFilters = () => {
    setFilters({
      gameType: [],
      priceRange: '',
      sortBy: 'newest',
      search: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start 
                     md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Game Accounts</h1>
            <p className="text-gray-600">
              Browse through our verified game accounts
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-sm flex p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden bg-white p-2 rounded-lg shadow-sm text-gray-600 
                       hover:text-gray-800"
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => toggleFilter("sortBy", e.target.value)}
              className="bg-white py-2 px-4 rounded-lg shadow-sm text-gray-600 
                       border-gray-200 focus:outline-none focus:ring-2 
                       focus:ring-blue-100 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
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

            {/* Search */}
            <div className="mb-6">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Search listings..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </form>
            </div>

            {/* Game Type */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Game Type
              </h3>
              <div className="space-y-2">
                {gameTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.gameType.includes(type)}
                      onChange={() => toggleFilter("gameType", type)}
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Price Range
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) =>
                        toggleFilter("priceRange", e.target.value)
                      }
                      className="w-4 h-4 border-gray-300 text-blue-600 
                               focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 
                       font-medium"
            >
              Clear All Filters
            </button>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {loading && listings.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No listings found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    view={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && currentPage < totalPages && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-white border border-gray-200 
                           text-gray-700 rounded-xl hover:bg-gray-50 
                           transition-colors inline-flex items-center gap-2"
                >
                  Load More
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        name="search"
                        defaultValue={filters.search}
                        placeholder="Search listings..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                  </form>
                </div>

                {/* Game Type */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Game Type
                  </h3>
                  <div className="space-y-2">
                    {gameTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.gameType.includes(type)}
                          onChange={() => toggleFilter("gameType", type)}
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
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={filters.priceRange === range.value}
                          onChange={(e) =>
                            toggleFilter("priceRange", e.target.value)
                          }
                          className="w-4 h-4 border-gray-300 text-blue-600 
                                   focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-auto">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 
                             font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-xl mt-4"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameListing;