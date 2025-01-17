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

export default Settings;