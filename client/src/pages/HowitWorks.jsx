import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Shield, Users, Gamepad2, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const buyerSteps = [
    {
      icon: <Gamepad2 size={24} className="text-blue-500" />,
      title: "Browse Game Accounts",
      description: "Explore our marketplace featuring various game accounts. Filter by game, price, or specific features to find what you're looking for."
    },
    {
      icon: <MessageCircle size={24} className="text-blue-500" />,
      title: "Contact Seller",
      description: "Found an account you like? Click 'Contact Seller' to discuss details. New users will need to create an account first."
    },
    {
      icon: <Shield size={24} className="text-blue-500" />,
      title: "Safe Transaction",
      description: "Once you agree on terms with the seller, proceed with the transaction through our secure platform."
    }
  ];

  const sellerSteps = [
    {
      icon: <CheckCircle size={24} className="text-purple-500" />,
      title: "Create Account",
      description: "Sign up for free and verify your account to start selling game accounts."
    },
    {
      icon: <ShoppingCart size={24} className="text-purple-500" />,
      title: "List Your Account",
      description: "Create a detailed listing with account information, screenshots, and your desired price."
    },
    {
      icon: <Users size={24} className="text-purple-500" />,
      title: "Connect with Buyers",
      description: "Receive and respond to buyer inquiries through our built-in chat system."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Hero Header Section with Background */}
      <div className="relative overflow-hidden bg-gray-900 py-24 mb-16">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="text-white">How </span>
            <span className="text-blue-400">Game</span>
            <span className="text-purple-400">Trade</span>
            <span className="text-white"> Works</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto font-medium">
            Your secure marketplace for buying and selling game accounts
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Buyers Section with Enhanced Header */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 relative group">
                For Buyers
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-blue-600 transform scale-x-0 transition-transform duration-300 ease-out"></div>
              </h2>
              <div className="h-1 w-1/3 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {buyerSteps.map((step, index) => (
              <div 
                key={`buyer-${index}`}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sellers Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl font-bold text-purple-600 relative group">
                For Sellers
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-purple-600 transform scale-x-0  transition-transform duration-300 ease-out"></div>
              </h2>
              <div className="h-1 w-1/3 bg-purple-600 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sellerSteps.map((step, index) => (
              <div 
                key={`seller-${index}`}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl p-12 shadow-lg transform hover:shadow-xl transition-all duration-300 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">Ready to Get Started?</h2>
          <div className="space-x-4 sm:space-x-6">
            <Link 
              to="/browse" 
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-medium text-lg"
            >
              Browse Accounts
            </Link>
            <Link 
              to="/signup" 
              className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-medium text-lg"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;