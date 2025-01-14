import React, { useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import ListingCard from "../components/listings/ListingCard";

const GameListing = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gameType: [],
    priceRange: "",
    rating: null,
    sortBy: "newest",
  });

  // Mock data for listings
  const listings = Array(9)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: `${
        ["Valorant", "CSGO", "PUBG", "Fortnite"][index % 4]
      } Premium Account`,
      price: Math.floor(Math.random() * 200) + 50,
      image: `/api/placeholder/400/300`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      level: Math.floor(Math.random() * 100) + 50,
      verified: Math.random() > 0.3,
      type: ["Premium", "Standard", "Elite"][Math.floor(Math.random() * 3)],
      description:
        "High-level account with rare skins and exclusive items. Perfect for serious gamers looking for a competitive advantage.",
      features: ["Rare Skins", "Battle Pass Items", "Limited Edition Content"],
      seller: {
        name: `Seller ${index + 1}`,
        avatar: "/api/placeholder/32/32",
        ratings: Math.floor(Math.random() * 100) + 10,
      },
    }));

  const gameTypes = [
    "FPS",
    "Battle Royale",
    "MOBA",
    "RPG",
    "Sports",
    "Strategy",
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
    { label: "Most Popular", value: "popular" },
  ];

  const toggleFilter = (type, value) => {
    setSelectedFilters((prev) => {
      if (type === "gameType") {
        const newGameTypes = prev.gameType.includes(value)
          ? prev.gameType.filter((t) => t !== value)
          : [...prev.gameType, value];
        return { ...prev, gameType: newGameTypes };
      }
      return { ...prev, [type]: value };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header and Controls */}
        <div
          className="flex flex-col md:flex-row justify-between items-start 
                     md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold mb-2">Game Accounts</h1>
            <p className="text-gray-600">
              Browse through {listings.length} verified game accounts
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

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-white p-2 rounded-lg shadow-sm text-gray-600 
                       hover:text-gray-800"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Sort Dropdown */}
            <select
              value={selectedFilters.sortBy}
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
                      checked={selectedFilters.gameType.includes(type)}
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
                      checked={selectedFilters.priceRange === range.value}
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

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </h3>
              <div className="flex gap-2">
                {[4, 3, 2].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => toggleFilter("rating", rating)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium 
                             transition-colors ${
                               selectedFilters.rating === rating
                                 ? "bg-blue-100 text-blue-600"
                                 : "bg-gray-100 text-gray-600"
                             }`}
                  >
                    {rating}+★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {listings.map((listing) => (
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
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsFilterOpen(false)}
            />
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
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Game Type
                </h3>
                <div className="space-y-2">
                  {gameTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected}
                        type="checkbox"
                        checked={selectedFilters.gameType.includes(type)}
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
                    <label
                      key={range.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={selectedFilters.priceRange === range.value}
                        onChange={(e) =>
                          toggleFilter("priceRange", e.target.value)
                        }
                        className="w-4 h-4 border-gray-300 text-blue-600 
                                 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </h3>
                <div className="flex gap-2">
                  {[4, 3, 2].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => toggleFilter("rating", rating)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium 
                               transition-colors ${
                                 selectedFilters.rating === rating
                                   ? "bg-blue-100 text-blue-600"
                                   : "bg-gray-100 text-gray-600"
                               }`}
                    >
                      {rating}+★
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl 
                         hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 
                     rounded-xl hover:bg-gray-50 transition-colors inline-flex 
                     items-center gap-2"
          >
            Load More
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameListing;
