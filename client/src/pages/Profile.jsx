import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, User, Package, Star, History, Shield, 
  Edit3, Camera, LogOut, Bell, ChevronRight, ExternalLink
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Mock data for listings
  const myListings = [
    {
      id: 1,
      title: 'Valorant Account',
      price: 149.99,
      image: '/api/placeholder/200/200',
      status: 'active',
      views: 156,
      likes: 23,
      created: '2024-01-10'
    },
    {
      id: 2,
      title: 'CSGO Inventory',
      price: 299.99,
      image: '/api/placeholder/200/200',
      status: 'pending',
      views: 89,
      likes: 12,
      created: '2024-01-08'
    }
  ];

  // Mock data for purchase history
  const purchaseHistory = [
    {
      id: 1,
      title: 'PUBG Account',
      price: 89.99,
      date: '2024-01-05',
      status: 'completed',
      seller: 'GameMaster123'
    }
  ];

  const TabButton = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors
                ${activeTab === tab 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const ListingCard = ({ listing }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img 
        src={listing.image} 
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold mb-2">{listing.title}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-blue-600">
            ${listing.price}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium
                         ${listing.status === 'active' 
                           ? 'bg-green-100 text-green-600'
                           : 'bg-yellow-100 text-yellow-600'}`}>
            {listing.status === 'active' ? 'Active' : 'Pending'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{listing.views} views</span>
          <span>{listing.likes} likes</span>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'listings':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Listings</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                               hover:bg-blue-700 transition-colors">
                Create New Listing
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        );

      case 'purchases':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Purchase History</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {purchaseHistory.map(purchase => (
                <div 
                  key={purchase.id}
                  className="p-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{purchase.title}</h3>
                      <p className="text-sm text-gray-600">
                        Seller: {purchase.seller}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        ${purchase.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        {purchase.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Account Settings</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <img
                    src={user?.avatar || '/api/placeholder/80/80'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 
                                   text-white rounded-full">
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

              <div className="border-t border-gray-200 mt-8 pt-8">
                <h3 className="font-semibold mb-4">Account Security</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between 
                                   p-4 bg-gray-50 rounded-lg text-gray-700 
                                   hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <span>Change Password</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button className="w-full flex items-center justify-between 
                                   p-4 bg-gray-50 rounded-lg text-gray-700 
                                   hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      <span>Notification Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-8 pt-8">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2 
                           text-red-600 hover:bg-red-50 rounded-lg 
                           transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                <TabButton 
                  tab="listings" 
                  icon={Package} 
                  label="My Listings" 
                />
                <TabButton 
                  tab="purchases" 
                  icon={History} 
                  label="Purchase History" 
                />
                <TabButton 
                  tab="settings" 
                  icon={Settings} 
                  label="Settings" 
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;