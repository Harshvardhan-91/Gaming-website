import React, { useState } from 'react';
import { 
  Users, Package, Flag, Settings, BarChart2, 
  Search, Filter, MoreVertical, AlertTriangle,
  Check, X, ExternalLink, TrendingUp, DollarSign,
  UserPlus
} from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data
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

  const recentReports = [
    {
      id: 1,
      type: 'listing',
      title: 'Suspicious Valorant Account',
      reporter: 'John Doe',
      date: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'user',
      title: 'Potential Scammer',
      reporter: 'Alice Smith',
      date: '5 hours ago',
      status: 'investigating'
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'James Wilson',
      email: 'james@example.com',
      joined: '2024-01-14',
      status: 'active',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      joined: '2024-01-13',
      status: 'pending',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const pendingListings = [
    {
      id: 1,
      title: 'CSGO Rare Skins Account',
      seller: 'Mark Thompson',
      price: 299.99,
      submitted: '2024-01-14',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Fortnite OG Account',
      seller: 'Lisa Anderson',
      price: 199.99,
      submitted: '2024-01-13',
      status: 'pending'
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

  const SideNav = () => (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 
                   fixed left-0 top-0 h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 
                      to-purple-600 bg-clip-text text-transparent">
          GameTrade Admin
        </h1>
      </div>
      
      <nav className="mt-6">
        <NavItem 
          section="overview" 
          icon={BarChart2} 
          label="Overview" 
        />
        <NavItem 
          section="users" 
          icon={Users} 
          label="Users" 
        />
        <NavItem 
          section="listings" 
          icon={Package} 
          label="Listings" 
        />
        <NavItem 
          section="reports" 
          icon={Flag} 
          label="Reports" 
        />
        <NavItem 
          section="settings" 
          icon={Settings} 
          label="Settings" 
        />
      </nav>
    </div>
  );

  const NavItem = ({ section, icon: Icon, label }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
        activeSection === section 
          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reports */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">Recent Reports</h2>
                  <button className="text-blue-600 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentReports.map(report => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-4 
                               bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium mb-1">{report.title}</h3>
                        <div className="text-sm text-gray-600">
                          Reported by {report.reporter} • {report.date}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm 
                                   font-medium ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">New Users</h2>
                  <button className="text-blue-600 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentUsers.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between p-4 
                               bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm 
                                   font-medium ${
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
            </div>

            {/* Pending Listings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Pending Listings</h2>
                <button className="text-blue-600 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-4 font-semibold text-gray-600">Title</th>
                      <th className="pb-4 font-semibold text-gray-600">Seller</th>
                      <th className="pb-4 font-semibold text-gray-600">Price</th>
                      <th className="pb-4 font-semibold text-gray-600">Date</th>
                      <th className="pb-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingListings.map(listing => (
                      <tr key={listing.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div className="font-medium">{listing.title}</div>
                        </td>
                        <td className="py-4 text-gray-600">{listing.seller}</td>
                        <td className="py-4 text-gray-600">
                          ${listing.price}
                        </td>
                        <td className="py-4 text-gray-600">
                          {listing.submitted}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-green-600 
                                           hover:bg-green-50 rounded">
                              <Check className="w-5 h-5" />
                            </button>
                            <button className="p-1 text-red-600 
                                           hover:bg-red-50 rounded">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // Add other section content here
      default:
        return (
          <div className="text-center text-gray-600">
            This section is under development
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="pl-64">
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;