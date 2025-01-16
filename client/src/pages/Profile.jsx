import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, History, Settings, Shield, User, 
  Camera, LogOut, Star, Edit3, Save, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import UserStats from '../components/profile/UserStats';
import LocationSelector from '../components/profile/LocationSelector';
import PhoneInput from '../components/profile/PhoneInput';
import SocialLinks from '../components/profile/SocialLinks';
import ProfileAvatar from '../components/common/ProfileAvatar';
import { Alert } from '../components/ui/alert';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updateAvatar, logout, profileCompletion } = useAuth();
  const { userListings } = useListings();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || { country: '', city: '' },
    socialLinks: user?.socialLinks || { discord: '', steam: '', twitter: '' }
  });

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || { country: '', city: '' },
      socialLinks: user?.socialLinks || { discord: '', steam: '', twitter: '' }
    });
  }, [user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'history', label: 'Purchase History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const { success, error } = await updateProfile(profileData);
      if (success) {
        setIsEditing(false);
      } else {
        setError(error);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (value, isValid) => {
    setProfileData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleLocationChange = (newLocation) => {
    setProfileData(prev => ({
      ...prev,
      location: newLocation
    }));
  };

  const handleSocialLinksChange = (newLinks) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: newLinks
    }));
  };

  const MyListings = ({ listings }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img 
            src={listing.image || '/api/placeholder/400/300'} 
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold mb-2">{listing.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-600">
                ${listing.price}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                listing.status === 'active' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
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
      {user?.purchases?.map(purchase => (
        <div key={purchase.id} className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={purchase.listing?.image || '/api/placeholder/64/64'} 
                alt={purchase.listing?.title} 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{purchase.listing?.title}</h3>
                <p className="text-sm text-gray-600">
                  Purchased on {new Date(purchase.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">${purchase.amount}</div>
              <div className="text-sm text-gray-600">Order #{purchase.orderId}</div>
            </div>
          </div>
        </div>
      ))}
      {(!user?.purchases || user.purchases.length === 0) && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Purchase History
          </h3>
          <p className="text-gray-500">
            You haven't made any purchases yet.
          </p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ProfileCompletion user={user} />
            <UserStats stats={user?.stats} />
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <ProfileAvatar
                    size="xl"
                    editable={isEditing}
                    showStatus
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h2>
                    <p className="text-gray-500">
                      Member since {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  {isEditing ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Edit3 className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  {error}
                </Alert>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        bio: e.target.value
                      }))}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.bio || 'No bio added yet.'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <>
                    <LocationSelector
                      location={profileData.location}
                      onChange={handleLocationChange}
                    />

                    <PhoneInput
                      value={profileData.phone}
                      onChange={handlePhoneChange}
                    />

                    <SocialLinks
                      socialLinks={profileData.socialLinks}
                      onChange={handleSocialLinksChange}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 
                                 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                                 hover:bg-blue-700 transition-colors disabled:opacity-50
                                 flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <span className="animate-spin">◌</span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case 'listings':
        return <MyListings listings={userListings} />;
      case 'history':
        return <PurchaseHistory />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Account Settings Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Settings
              </h3>
              <div className="space-y-4">
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Email Address"
                />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Settings
              </h3>
              {/* Add notification settings toggles here */}
            </div>

            {/* Privacy Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Privacy Settings
              </h3>
              {/* Add privacy settings toggles here */}
            </div>

            {/* Logout Button */}
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
                <ProfileAvatar
                  size="xl"
                  editable={false}
                  showStatus
                  className="mx-auto mb-4"
                />
                <h2 className="font-bold text-xl mb-1">{user?.name}</h2>
                <p className="text-gray-600 text-sm">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;