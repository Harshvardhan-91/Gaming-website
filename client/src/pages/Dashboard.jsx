import React, { useState } from 'react';
import { 
  Package, TrendingUp, MessageSquare, DollarSign, 
  Star, ChevronDown, RefreshCw 
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = [
    {
      label: 'Total Listings',
      value: '24',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'Total Revenue',
      value: '$4,567',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Messages',
      value: '12',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const recentListings = [
    {
      id: 1,
      title: 'Valorant Account - Immortal Rank',
      price: 299.99,
      status: 'Active',
      views: 456,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      title: 'CSGO Inventory - Rare Skins',
      price: 199.99,
      status: 'Pending',
      views: 234,
      image: '/api/placeholder/80/80'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: 'John Doe',
      message: 'Is this account still available?',
      time: '2h ago',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      sender: 'Jane Smith',
      message: 'Can you provide more details?',
      time: '5h ago',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-600 mb-2">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
          <div className={`p-3 bg-opacity-10 rounded-full ${stat.color} bg-current`}>
            <Icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Seller Dashboard</h2>
              </div>
              <nav className="p-2">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'listings', label: 'My Listings', icon: Package },
                  { id: 'messages', label: 'Messages', icon: MessageSquare }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg 
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
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                  ))}
                </div>

                {/* Recent Listings & Messages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Listings */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-lg">Recent Listings</h2>
                      <button className="text-blue-600 text-sm flex items-center gap-1">
                        View All
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    {recentListings.map(listing => (
                      <div 
                        key={listing.id} 
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4"
                      >
                        <img 
                          src={listing.image} 
                          alt={listing.title} 
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{listing.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>${listing.price}</span>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                listing.status === 'Active' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}
                            >
                              {listing.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Messages */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-lg">Recent Messages</h2>
                      <button className="text-blue-600 text-sm flex items-center gap-1">
                        View All
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    {recentMessages.map(message => (
                      <div 
                        key={message.id} 
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg mb-4"
                      >
                        <img 
                          src={message.avatar} 
                          alt={message.sender} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium">{message.sender}</h3>
                            <span className="text-sm text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">My Listings</h2>
                {/* Add listing management functionality */}
                <p className="text-gray-600">No listings found. Start selling!</p>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Messages</h2>
                {/* Add message management functionality */}
                <p className="text-gray-600">No messages found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;