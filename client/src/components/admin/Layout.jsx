// components/admin/Layout.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Package, Flag, Settings, BarChart2, 
  LogOut, Search, Bell, User 
} from 'lucide-react';
import useAuth  from '../../hooks/useAuth';
import { useState } from 'react';

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





export { AdminLayout};