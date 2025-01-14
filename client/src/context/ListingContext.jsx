import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ListingContext = createContext(null);

export const ListingProvider = ({ children }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings when component mounts
  useEffect(() => {
    fetchListings();
  }, []);

  // Fetch user's listings when user is authenticated
  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      // TODO: Replace with actual API call
      const mockListings = Array(12).fill(null).map((_, index) => ({
        id: index + 1,
        title: `${['Valorant', 'CSGO', 'PUBG', 'Fortnite'][index % 4]} Premium Account`,
        price: Math.floor(Math.random() * 200) + 50,
        image: `/api/placeholder/400/300`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        level: Math.floor(Math.random() * 100) + 50,
        verified: Math.random() > 0.3,
        type: ['Premium', 'Standard', 'Elite'][Math.floor(Math.random() * 3)],
        description: "High-level account with rare skins and exclusive items.",
        features: ['Rare Skins', 'Battle Pass Items', 'Limited Edition Content'],
        seller: {
          name: `Seller ${index + 1}`,
          avatar: '/api/placeholder/32/32',
          ratings: Math.floor(Math.random() * 100) + 10
        }
      }));

      setListings(mockListings);
      setFeaturedListings(mockListings.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      // TODO: Replace with actual API call
      const mockUserListings = Array(4).fill(null).map((_, index) => ({
        id: `user-${index + 1}`,
        title: `My ${['Valorant', 'CSGO', 'PUBG', 'Fortnite'][index % 4]} Account`,
        price: Math.floor(Math.random() * 200) + 50,
        image: `/api/placeholder/400/300`,
        status: ['active', 'pending', 'sold'][Math.floor(Math.random() * 3)],
        views: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));

      setUserListings(mockUserListings);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  const createListing = async (listingData) => {
    try {
      // TODO: Replace with actual API call
      const newListing = {
        id: Date.now(),
        ...listingData,
        seller: {
          name: user.name,
          avatar: user.avatar,
          ratings: 0
        },
        createdAt: new Date().toISOString()
      };

      setListings(prev => [newListing, ...prev]);
      setUserListings(prev => [newListing, ...prev]);

      return { success: true, listing: newListing };
    } catch (error) {
      console.error('Error creating listing:', error);
      return { success: false, error: 'Failed to create listing' };
    }
  };

  const updateListing = async (id, listingData) => {
    try {
      // TODO: Replace with actual API call
      setListings(prev =>
        prev.map(listing =>
          listing.id === id ? { ...listing, ...listingData } : listing
        )
      );

      setUserListings(prev =>
        prev.map(listing =>
          listing.id === id ? { ...listing, ...listingData } : listing
        )
      );

      return { success: true };
    } catch (error) {
      console.error('Error updating listing:', error);
      return { success: false, error: 'Failed to update listing' };
    }
  };

  const deleteListing = async (id) => {
    try {
      // TODO: Replace with actual API call
      setListings(prev => prev.filter(listing => listing.id !== id));
      setUserListings(prev => prev.filter(listing => listing.id !== id));

      return { success: true };
    } catch (error) {
      console.error('Error deleting listing:', error);
      return { success: false, error: 'Failed to delete listing' };
    }
  };

  const value = {
    listings,
    featuredListings,
    userListings,
    loading,
    createListing,
    updateListing,
    deleteListing
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingProvider');
  }
  return context;
};

export default ListingContext;