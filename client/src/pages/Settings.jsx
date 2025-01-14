// pages/Settings.jsx
import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Save, Info } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'GameTrade',
      siteDescription: 'A marketplace for game accounts',
      maintenanceMode: false,
      allowNewRegistrations: true
    },
    listings: {
      requireApproval: true,
      maxImagesPerListing: 6,
      maxListingsPerUser: 10,
      platformFeePercentage: 5
    },
    security: {
      minimumPasswordLength: 8,
      requireEmailVerification: true,
      twoFactorAuthEnabled: false,
      sessionTimeout: 24 // hours
    }
  });

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Save settings to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => handleChange('general', 'siteName', e.target.value)}
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
                  onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                  rows={3}
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
                  type="button"
                  onClick={() => handleChange('general', 'maintenanceMode', 
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
            <h2 className="text-lg font-semibold mb-4">Listing Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Images per Listing
                </label>
                <input
                  type="number"
                  value={settings.listings.maxImagesPerListing}
                  onChange={(e) => handleChange('listings', 'maxImagesPerListing', 
                    parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                           focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Fee Percentage
                </label>
                <input
                  type="number"
                  value={settings.listings.platformFeePercentage}
                  onChange={(e) => handleChange('listings', 'platformFeePercentage', 
                    parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                           focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.security.minimumPasswordLength}
                  onChange={(e) => handleChange('security', 'minimumPasswordLength', 
                    parseInt(e.target.value))}
                  min="6"
                  max="32"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                           focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Two-Factor Authentication
                  </label>
                  <p className="text-sm text-gray-500">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('security', 'twoFactorAuthEnabled', 
                    !settings.security.twoFactorAuthEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full
                           transition-colors ${
                             settings.security.twoFactorAuthEnabled 
                               ? 'bg-blue-600' 
                               : 'bg-gray-200'
                           }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full 
                                bg-white transition-transform ${
                                  settings.security.twoFactorAuthEnabled 
                                    ? 'translate-x-6' 
                                    : 'translate-x-1'
                                }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;