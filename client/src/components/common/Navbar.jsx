// components/common/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  MessageSquare,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Home,
  Package,
  Shield,
  TrendingUp,
  MapPin,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useChat } from "../../context/ChatContext";
import ProfileAvatar from './ProfileAvatar';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout,  isAuthenticated } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const { unreadMessages } = useChat();

  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const searchPlaceholders = [
    "Search for PUBG accounts...",
    "Find Valorant rare skins...",
    "Looking for Minecraft worlds?",
    "Browse Fortnite accounts...",
  ];
  // Reset states when user changes
useEffect(() => {
  if (!user) {
    closeAllDropdowns();
    setIsMobileMenuOpen(false);
  }
}, [user]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    console.log('Auth state changed:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setIsMobileMenuOpen(false);
      closeAllDropdowns();
    }
  };

  const closeAllDropdowns = () => {
    setIsNotificationOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMoreMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      closeAllDropdowns();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NotificationBadge = ({ count }) =>
    count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
        {count}
      </span>
    );

  NotificationBadge.propTypes = {
    count: PropTypes.number.isRequired,
  };

  const DropdownButton = ({ children, onClick, className = "" }) => (
    <button
      onClick={() => {
        closeAllDropdowns();
        onClick?.();
      }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 
                transition-colors ${className}`}
    >
      {children}
    </button>
  );

  DropdownButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  const DropdownItem = ({ icon: Icon, label, onClick, dangerous }) => (
    <button
      onClick={() => {
        onClick?.();
        closeAllDropdowns();
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm 
                transition-colors ${
                  dangerous
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  DropdownItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    dangerous: PropTypes.bool,
  };

  const DropdownContainer = ({ children, className = "" }) => (
    <div
      className={`dropdown-container absolute top-full mt-2 bg-white rounded-xl 
                shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 
                ${className}`}
    >
      {children}
    </div>
  );

  DropdownContainer.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  const AdminMenu = () => (
    <DropdownContainer className="left-0 w-64">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-600">Admin Panel</h3>
        </div>
      </div>
      <div className="py-1">
        <DropdownItem
          icon={TrendingUp}
          label="Dashboard"
          onClick={() => navigate("/admin")}
        />
        <DropdownItem
          icon={User}
          label="User Management"
          onClick={() => navigate("/admin/users")}
        />
        <DropdownItem
          icon={Package}
          label="Listings"
          onClick={() => navigate("/admin/listings")}
        />
        <DropdownItem
          icon={Bell}
          label="Reports"
          onClick={() => navigate("/admin/reports")}
        />
        <DropdownItem
          icon={Settings}
          label="Settings"
          onClick={() => navigate("/admin/settings")}
        />
      </div>
    </DropdownContainer>
  );

  const ProfileDropdown = () => (
    <DropdownContainer className="right-0 w-64">
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
          <div className="relative">
                <ProfileAvatar
                  size="md"
                  showStatus={true}
                  className="w-12 h-12"
                />
                {user.role === "admin" && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-purple-600 
                               text-white text-xs rounded-full w-4 h-4 flex 
                               items-center justify-center"
                  >
                    A
                  </span>
                )}
              </div>
            <div className="overflow-hidden">
              <p className="font-semibold truncate">{user.name || "User"}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      <div className="py-1">
        <DropdownItem
          icon={User}
          label="Profile"
          onClick={() => navigate("/profile")}
        />
        <DropdownItem
          icon={TrendingUp}
          label="Dashboard"
          onClick={() => navigate("/dashboard")}
        />
        {user?.role === "admin" && (
          <>
            <DropdownItem
              icon={Shield}
              label="Admin Dashboard"
              onClick={() => navigate("/admin")}
            />
            <div className="border-t border-gray-200 my-1" />
          </>
        )}
        <DropdownItem
          icon={Settings}
          label="Settings"
          onClick={() => navigate("/settings")}
        />
        <div className="border-t border-gray-200 my-1" />
        <DropdownItem
          icon={LogOut}
          label="Logout"
          onClick={handleLogout}
          dangerous
        />
      </div>
    </DropdownContainer>
  );

  const NotificationDropdown = () => (
    <DropdownContainer className="right-0 w-96">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <Link
          to="/notifications"
          onClick={closeAllDropdowns}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="mt-1 flex-shrink-0">
                  {(() => {
                    const Icon =
                      {
                        message: MessageSquare,
                        listing: Package,
                        security: Shield,
                      }[notification.type] || Bell;
                    const color =
                      {
                        message: "text-blue-600",
                        listing: "text-green-600",
                        security: "text-red-600",
                      }[notification.type] || "text-gray-600";
                    return <Icon className={`w-5 h-5 ${color}`} />;
                  })()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium mb-1 truncate">
                    {notification.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {notification.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DropdownContainer>
  );

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-2 px-4">
        <p className="text-center text-sm text-white font-medium">
          🎮 New to GameTrade? Get 10% off on your first purchase!
        </p>
      </div>

      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section with Logo and Navigation */}
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                closeAllDropdowns();
              }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <Link to="/" className="text-2xl font-bold">
              <span
                className="bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent"
              >
                GameTrade
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/browse"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Browse
              </Link>

              {user?.role === "admin" && (
                <div className="relative">
                  <DropdownButton
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownButton>
                  {isAdminMenuOpen && <AdminMenu />}
                </div>
              )}

              <div className="relative">
                <DropdownButton
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                >
                  <span className="font-medium">More</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownButton>
                {isMoreMenuOpen && (
                  <DropdownContainer className="left-0 w-64">
                    {[
                      { icon: MapPin, label: "Locations", to: "/locations" },
                      { icon: CreditCard, label: "Pricing", to: "/pricing" },
                      { icon: HelpCircle, label: "Help Center", to: "/help" },
                    ].map((item) => (
                      <DropdownItem
                        key={item.to}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => navigate(item.to)}
                      />
                    ))}
                  </DropdownContainer>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-grow max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholders[placeholderIndex]}
                className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-full 
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-500 
                         transition-all duration-300"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </form>
          </div>

          {/* Right Section with User Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Link
                      to="/chat"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <NotificationBadge count={unreadMessages} />
                    </Link>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setIsNotificationOpen(!isNotificationOpen);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      <NotificationBadge count={unreadCount} />
                    </button>
                    {isNotificationOpen && <NotificationDropdown />}
                  </div>

                  <Link
                    to="/cart"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/sell"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-medium"
                  >
                    Sell Now
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      }}
                      className="flex items-center gap-2 p-1 hover:bg-gray-100 
                               rounded-full transition-colors"
                    >
                      <div className="w-8 h-8">
                        <ProfileAvatar
                          size="sm"
                          showStatus={true}
                          className="w-full h-full"
                        />
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                    {isProfileDropdownOpen && <ProfileDropdown />}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholders[placeholderIndex]}
              className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-full"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[calc(100%+1px)] bg-white shadow-lg z-50 max-h-[calc(100vh-100%)] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* User Info Section for Admin */}
              {user?.role === "admin" && (
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-600">
                      Admin Access
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      User Management
                    </Link>
                    <Link
                      to="/admin/listings"
                      className="block px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Listings
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              )}

              {/* Primary Navigation */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  to="/browse"
                  className="flex items-center gap-3 p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Browse</span>
                </Link>

                {/* Quick Actions Grid */}
                {user && (
                  <div className="grid grid-cols-3 gap-2 py-2">
                    <Link
                      to="/cart"
                      className="flex flex-col items-center gap-1 p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="text-xs">Cart</span>
                    </Link>
                    <Link
                      to="/chat"
                      className="flex flex-col items-center gap-1 p-3 text-gray-700 rounded-lg hover:bg-gray-100 relative"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs">Messages</span>
                      {unreadMessages > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/notifications"
                      className="flex flex-col items-center gap-1 p-3 text-gray-700 rounded-lg hover:bg-gray-100 relative"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bell className="w-5 h-5" />
                      <span className="text-xs">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </div>
                )}

                {/* More Menu Section */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className="w-full flex items-center justify-between p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5" />
                      <span className="font-medium">More</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMoreMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMoreMenuOpen && (
                    <div className="pl-8 space-y-2 mt-2">
                      {[
                        { icon: MapPin, label: "Locations", to: "/locations" },
                        { icon: CreditCard, label: "Pricing", to: "/pricing" },
                        { icon: HelpCircle, label: "Help Center", to: "/help" },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 p-3 text-gray-600 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Specific Links */}
                {user && (
                  <div className="border-t border-gray-100 pt-2">
                    <Link
                      to="/sell"
                      className="flex items-center gap-3 p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-medium">Sell Now</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Authentication Section */}
              <div className="border-t border-gray-200 pt-4">
                {!user ? (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full py-2.5 text-center border border-blue-600 
                               text-blue-600 rounded-lg hover:bg-blue-50 
                               transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full py-2.5 text-center bg-blue-600 
                               text-white rounded-lg hover:bg-blue-700 
                               transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 text-center text-red-600 
                               border border-red-600 rounded-lg 
                               hover:bg-red-50 transition-colors font-medium
                               flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Backdrop for dropdowns */}
        {(isNotificationOpen ||
          isProfileDropdownOpen ||
          isMoreMenuOpen ||
          isAdminMenuOpen) && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={closeAllDropdowns}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
