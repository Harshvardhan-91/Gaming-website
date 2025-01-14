// context/AdminContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action Types
const ACTIONS = {
  SET_USERS: 'SET_USERS',
  SET_LISTINGS: 'SET_LISTINGS',
  SET_REPORTS: 'SET_REPORTS',
  SET_STATS: 'SET_STATS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  UPDATE_LISTING: 'UPDATE_LISTING',
  DELETE_LISTING: 'DELETE_LISTING',
  RESOLVE_REPORT: 'RESOLVE_REPORT'
};

// Initial State
const initialState = {
  users: [],
  listings: [],
  reports: [],
  stats: {
    totalUsers: 0,
    totalListings: 0,
    totalRevenue: 0,
    activeUsers: 0
  },
  loading: false,
  error: null
};

// Reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload
      };
    
    case ACTIONS.SET_LISTINGS:
      return {
        ...state,
        listings: action.payload
      };
    
    case ACTIONS.SET_REPORTS:
      return {
        ...state,
        reports: action.payload
      };
    
    case ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    
    case ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    
    case ACTIONS.UPDATE_LISTING:
      return {
        ...state,
        listings: state.listings.map(listing =>
          listing.id === action.payload.id ? action.payload : listing
        )
      };
    
    case ACTIONS.DELETE_LISTING:
      return {
        ...state,
        listings: state.listings.filter(listing => listing.id !== action.payload)
      };
    
    case ACTIONS.RESOLVE_REPORT:
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id 
            ? { ...report, status: 'resolved', ...action.payload }
            : report
        )
      };
    
    default:
      return state;
  }
};

// Create Context
const AdminContext = createContext(null);

// Provider Component
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Actions
  const fetchUsers = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      const mockUsers = Array(8).fill(null).map((_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: index === 0 ? 'admin' : 'user',
        status: ['active', 'suspended', 'pending'][index % 3],
        joinedDate: '2024-01-15',
        listings: Math.floor(Math.random() * 10),
        sales: Math.floor(Math.random() * 20),
        avatar: '/api/placeholder/40/40'
      }));
      dispatch({ type: ACTIONS.SET_USERS, payload: mockUsers });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const fetchListings = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      const mockListings = Array(6).fill(null).map((_, index) => ({
        id: index + 1,
        title: `Game Account ${index + 1}`,
        price: Math.floor(Math.random() * 200) + 50,
        seller: `Seller ${index + 1}`,
        status: ['active', 'pending', 'reported'][index % 3],
        createdAt: '2024-01-15',
        image: '/api/placeholder/60/60'
      }));
      dispatch({ type: ACTIONS.SET_LISTINGS, payload: mockListings });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const fetchReports = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      const mockReports = Array(5).fill(null).map((_, index) => ({
        id: index + 1,
        type: ['listing', 'user', 'message'][index % 3],
        reason: ['Inappropriate content', 'Scam attempt', 'Harassment'][index % 3],
        reporter: `User ${index + 1}`,
        reported: `Subject ${index + 1}`,
        status: ['pending', 'resolved', 'investigating'][index % 3],
        createdAt: '2024-01-15'
      }));
      dispatch({ type: ACTIONS.SET_REPORTS, payload: mockReports });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateUser = async (userData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: ACTIONS.UPDATE_USER, payload: userData });
      return { success: true };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const deleteUser = async (userId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: ACTIONS.DELETE_USER, payload: userId });
      return { success: true };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateListing = async (listingData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: ACTIONS.UPDATE_LISTING, payload: listingData });
      return { success: true };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const deleteListing = async (listingId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: ACTIONS.DELETE_LISTING, payload: listingId });
      return { success: true };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const resolveReport = async (reportData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: ACTIONS.RESOLVE_REPORT, payload: reportData });
      return { success: true };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchListings();
    fetchReports();
  }, []);

  const value = {
    ...state,
    fetchUsers,
    fetchListings,
    fetchReports,
    updateUser,
    deleteUser,
    updateListing,
    deleteListing,
    resolveReport
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;