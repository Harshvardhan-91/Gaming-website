import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ListingContext = createContext(null);

export const ListingProvider = ({ children }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/listings?${params}`);
      
      console.log('API Response:', response.data); // Debug log
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch listings');
      }

      setListings(response.data.listings);
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch listings';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Log the formData content for debugging
      console.log('Creating listing with formData:', {
        title: formData.get('title'),
        gameType: formData.get('gameType'),
        imagesCount: formData.getAll('images').length
      });

      const response = await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        },
      });

      console.log('Create listing response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create listing');
      }

      // Update listings state
      const newListing = response.data.listing;
      setListings(prev => [newListing, ...prev]);
      setUserListings(prev => [newListing, ...prev]);

      toast.success('Listing created successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create listing';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured listings
  const fetchFeaturedListings = async () => {
    try {
      const response = await api.get('/listings', {
        params: {
          verified: true,
          sort: '-rating',
          limit: 6
        }
      });
      
      if (response.data.success) {
        setFeaturedListings(response.data.listings);
      }
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    }
  };

  // Fetch user's listings when user is authenticated
  useEffect(() => {
    if (user) {
      fetchListings({ seller: user._id }).then(data => {
        if (data?.listings) {
          setUserListings(data.listings);
        }
      });
    }
  }, [user]);

  // Fetch all listings and featured listings on mount
  useEffect(() => {
    fetchListings();
    fetchFeaturedListings();
  }, []);

  const value = {
    listings,
    featuredListings,
    userListings,
    loading,
    error,
    fetchListings,
    createListing,
    fetchFeaturedListings
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