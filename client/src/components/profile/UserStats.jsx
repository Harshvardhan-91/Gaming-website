import React from 'react';
import { 
  TrendingUp, ShoppingCart, Star, Package, 
  DollarSign, Clock 
} from 'lucide-react';

const UserStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Sales',
      value: stats?.totalSales || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Purchases',
      value: stats?.totalPurchases || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Active Listings',
      value: stats?.activeListings || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden"
          >
            <div className={`absolute right-0 top-0 w-24 h-24 -mr-8 -mt-8 
                         rounded-full opacity-10 ${stat.bgColor}`}
            />
            <div className="relative">
              <div className={`p-3 ${stat.bgColor} rounded-lg w-fit`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="mt-4 text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;