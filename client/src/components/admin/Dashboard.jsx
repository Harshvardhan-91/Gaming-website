// components/admin/Dashboard.jsx
import React, { useState } from 'react';
import { 
  Users, Package, Flag, Settings, BarChart2, Search, Filter,
  DollarSign, UserPlus, TrendingUp 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    {
      label: 'Total Users',
      value: '12,345',
      trend: '+12%',
      icon: Users,
      trendUp: true
    },
    {
      label: 'Active Listings',
      value: '1,234',
      trend: '+8%',
      icon: Package,
      trendUp: true
    },
    {
      label: 'Reported Items',
      value: '23',
      trend: '-5%',
      icon: Flag,
      trendUp: false
    },
    {
      label: 'Total Revenue',
      value: '$45,678',
      trend: '+15%',
      icon: DollarSign,
      trendUp: true
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      joined: '2024-01-14',
      status: 'active',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Alice Smith',
      email: 'alice@example.com',
      joined: '2024-01-13',
      status: 'pending',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
          <div className={`p-3 rounded-lg ${
            stat.trendUp ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              stat.trendUp ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-4 text-sm">
          <TrendingUp className={`w-4 h-4 ${
            stat.trendUp ? 'text-green-600' : 'text-red-600'
          }`} />
          <span className={stat.trendUp ? 'text-green-600' : 'text-red-600'}>
            {stat.trend}
          </span>
          <span className="text-gray-600">vs last month</span>
        </div>
      </div>
    );
  };

  const Overview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Recent Users</h2>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentUsers.map(user => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Recent Reports</h2>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          {/* Add reports content here */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:border-blue-500 
                         focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <Overview />
      </div>
    </div>
  );
};

export default AdminDashboard;