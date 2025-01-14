import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="font-sans text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GameTrade
              </span>
            </div>
            <p className="text-gray-600">
              Your trusted marketplace for gaming accounts, items, and digital assets.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-600 cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-600 hover:text-red-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'How It Works', 'Pricing', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Games */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular Games</h3>
            <ul className="space-y-3">
              {['CSGO', 'Valorant', 'PUBG', 'Fortnite', 'Minecraft'].map((game) => (
                <li key={game}>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {game} Accounts
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">support@gametrade.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">1-800-GAME-TRADE</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">123 Gaming Street, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 GameTrade. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;