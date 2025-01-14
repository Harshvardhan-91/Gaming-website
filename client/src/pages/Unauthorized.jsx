import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, you don't have permission to access this page. Please contact an 
          administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                   from-blue-600 to-purple-600 text-white rounded-xl 
                   hover:opacity-90 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;