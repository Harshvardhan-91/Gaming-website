import React, { useState } from 'react';
import { 
  Package, History, Settings, Shield, User, 
  Camera, LogOut, Star, Edit3 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { userListings } = useListings();
  const [activeTab, setActiveTab] = useState('listings');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || ''
  });

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'history', label: 'Purchase History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const MyListings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userListings.map(listing => (
        <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img 
            src={listing.image} 
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold mb-2">{listing.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-600">
                ${listing.price}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${listing.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'}`}>
                {listing.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span>{listing.views} views</span>
              <span>{listing.likes} likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const PurchaseHistory = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(item => (
        <div key={item} className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/api/placeholder/64/64" 
                alt="Game" 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">Valorant Account Premium</h3>
                <p className="text-sm text-gray-600">Purchased on Jan 15, 2024</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">$199.99</div>
              <div className="text-sm text-gray-600">Order #123456</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const Settings = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={user?.avatar || '/api/placeholder/80/80'}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Profile Picture</h3>
          <p className="text-sm text-gray-600">
            Upload a new profile picture
          </p>
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({
              ...prev,
              email: e.target.value
            }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({
              ...prev,
              bio: e.target.value
            }))}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({
              ...prev,
              phone: e.target.value
            }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 
                   text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="inline-block relative mb-4">
                  <img
                    src={user?.avatar || '/api/placeholder/80/80'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 
                               border-2 border-white rounded-full"></span>
                </div>
                <h2 className="font-bold text-xl mb-1">{user?.name}</h2>
                <p className="text-gray-600 text-sm">Member since Jan 2024</p>
              </div>

              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg 
                             transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'listings' && <MyListings />}
            {activeTab === 'history' && <PurchaseHistory />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;