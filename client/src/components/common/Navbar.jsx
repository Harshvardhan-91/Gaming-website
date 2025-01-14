import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Menu, X, MessageSquare, 
  Bell, User, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const NotificationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 
                         text-white text-xs rounded-full flex items-center 
                         justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isNotificationOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg 
                     border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <Link 
                to="/notifications"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 
                           cursor-pointer"
                >
                  <div className="text-sm font-medium mb-1">
                    {notification.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {notification.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

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
            <Link to="/" className="font-sans text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GameTrade
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block flex-1 max-w-3xl">
            <form onSubmit={handleSearch}>
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
            </form>
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
            {user ? (
              <>
                <NotificationDropdown />
                <Link to="/chat" className="relative">
                  <MessageSquare className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </Link>
                <Link
                  to="/sell"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium">
                  Sell Now
                </Link>
                <div className="relative">
                  <button className="flex items-center gap-2">
                    <img
                      src={user.avatar || '/api/placeholder/32/32'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl
                           hover:bg-gray-50 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 lg:hidden">
            {user && <NotificationDropdown />}
            <Link to="/chat">
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </Link>
            <Link to="/cart">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 lg:hidden">
          <form onSubmit={handleSearch}>
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
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user.avatar || '/api/placeholder/32/32'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </Link>
                  <Link
                    to="/sell"
                    className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium">
                    Sell Now
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl
                             hover:bg-gray-50 transition-colors duration-200 font-medium">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;