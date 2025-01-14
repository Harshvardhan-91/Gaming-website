// hooks/useAuth.js

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const response = await mockLoginAPI(email, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const response = await mockSignupAPI(userData);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // TODO: Replace with actual API call
        const response = await mockCheckAuthAPI(token);
        if (response.success) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
  }, [logout]);

  // Mock API functions - Replace these with actual API calls
  const mockLoginAPI = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        success: true,
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        },
        token: 'mock_token_123'
      };
    }
    
    if (email === 'user@example.com' && password === 'user123') {
      return {
        success: true,
        user: {
          id: '2',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user'
        },
        token: 'mock_token_456'
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };
  };

  const mockSignupAPI = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        ...userData,
        role: 'user'
      },
      token: `mock_token_${Date.now()}`
    };
  };

  const mockCheckAuthAPI = async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token) {
      return {
        success: true,
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'user'
        }
      };
    }
    
    return { success: false };
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    isAuthenticated: !!user
  };
};

export default useAuth;