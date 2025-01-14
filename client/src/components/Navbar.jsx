import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchPlaceholders = [
    "Search for PUBG accounts...",
    "Find Valorant rare skins...",
    "Looking for Minecraft worlds?",
    "Browse Fortnite accounts..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-blue-600 py-1 px-4 text-center text-sm text-white">
        🎮 New to GameTrade? Get 10% off on your first purchase!
      </div>
      
      {/* Main navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:justify-start lg:gap-6">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
            <div className="font-sans text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GameTrade
              </span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block flex-1 max-w-3xl">
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={searchPlaceholders[placeholderIndex]}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                          focus:border-blue-500 focus:outline-none transition-all duration-300
                          placeholder-gray-400"
              />
              <Search className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 
                                ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            {/* Popular tags */}
            <div className="flex gap-2 mt-2 text-sm">
              {['Popular', 'CSGO', 'Valorant', 'Fortnite', 'PUBG'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full 
                            hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right section - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <MessageSquare className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
            
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium">
              Sell Now
            </button>
            
            <button className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl
                             hover:bg-gray-50 transition-colors duration-200 font-medium">
              Login
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 lg:hidden">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <ShoppingCart className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Mobile Search - Shown below navbar */}
        <div className="mt-4 lg:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search games, accounts, items..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:border-blue-500 focus:outline-none"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                               text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium">
                Sell Now
              </button>
              <button className="w-full px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl
                               hover:bg-gray-50 transition-colors duration-200 font-medium">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;