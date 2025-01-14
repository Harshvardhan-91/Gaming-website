import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';

const Cart = () => {
  // Mock cart items
  const cartItems = [
    {
      id: 1,
      title: 'Valorant Account - Immortal Rank',
      price: 299.99,
      image: '/api/placeholder/80/80',
      seller: 'ProGamer123'
    },
    {
      id: 2,
      title: 'CSGO Inventory - Rare Skins',
      price: 199.99,
      image: '/api/placeholder/80/80',
      seller: 'SkinMaster'
    }
  ];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-full">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => window.location.href = '/browse'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white rounded-xl hover:opacity-90 transition-colors"
            >
              Browse Accounts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        Seller: {item.seller}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-blue-600">${item.price}</span>
                    <button 
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">$4.99</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-blue-600">
                    ${(parseFloat(calculateTotal()) + 4.99).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-xl hover:opacity-90 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;