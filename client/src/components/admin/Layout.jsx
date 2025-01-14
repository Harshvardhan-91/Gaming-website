// components/admin/Layout.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Package, Flag, Settings, BarChart2, 
  LogOut, Search, Bell, User 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: BarChart2,
      path: '/admin'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users,
      path: '/admin/users'
    },
    { 
      id: 'listings', 
      label: 'Listings', 
      icon: Package,
      path: '/admin/listings'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: Flag,
      path: '/admin/reports'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 
                      to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        <nav className="mt-6 px-3">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                       transition-colors mb-1 ${
                isActivePath(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.avatar || '/api/placeholder/32/32'}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium text-sm">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 
                     hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 
                               rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 
                               rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// components/admin/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'GameTrade',
      siteDescription: 'A marketplace for game accounts',
      contactEmail: 'support@gametrade.com',
      maintenanceMode: false
    },
    listings: {
      requireApproval: true,
      maxImagesPerListing: 6,
      maxListingsPerUser: 10,
      allowedGameTypes: ['Valorant', 'CSGO', 'PUBG', 'Fortnite']
    },
    users: {
      allowRegistration: true,
      requireEmailVerification: true,
      defaultUserRole: 'user'
    },
    security: {
      twoFactorAuth: false,
      passwordMinLength: 8,
      sessionTimeout: 24
    },
    fees: {
      platformFee: 5,
      minimumListingPrice: 10,
      maximumListingPrice: 1000
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    // TODO: Implement API call to save settings
    console.log('Saving settings:', settings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Description
            </label>
            <textarea
              value={settings.general.siteDescription}
              onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.general.contactEmail}
              onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500">
                Temporarily disable the site for maintenance
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('general', 'maintenanceMode', 
                !settings.general.maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full
                       transition-colors ${
                         settings.general.maintenanceMode 
                           ? 'bg-blue-600' 
                           : 'bg-gray-200'
                       }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full 
                            bg-white transition-transform ${
                              settings.general.maintenanceMode 
                                ? 'translate-x-6' 
                                : 'translate-x-1'
                            }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Listing Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Listing Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Require Approval
              </label>
              <p className="text-sm text-gray-500">
                Manually approve listings before they go live
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('listings', 'requireApproval',
                !settings.listings.requireApproval)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full
                       transition-colors ${
                         settings.listings.requireApproval 
                           ? 'bg-blue-600' 
                           : 'bg-gray-200'
                       }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full 
                            bg-white transition-transform ${
                              settings.listings.requireApproval 
                                ? 'translate-x-6' 
                                : 'translate-x-1'
                            }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Images per Listing
            </label>
            <input
              type="number"
              value={settings.listings.maxImagesPerListing}
              onChange={(e) => handleSettingChange('listings', 'maxImagesPerListing', 
                parseInt(e.target.value))}
              min="1"
              max="10"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Listings per User
            </label>
            <input
              type="number"
              value={settings.listings.maxListingsPerUser}
              onChange={(e) => handleSettingChange('listings', 'maxListingsPerUser', 
                parseInt(e.target.value))}
              min="1"
              max="50"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export { AdminLayout, Settings };