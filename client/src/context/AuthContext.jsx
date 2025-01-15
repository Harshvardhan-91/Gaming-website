import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.auth.verifyToken();
      if (response.success) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      const response = await api.auth.register(formData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return {
        success: false,
        error: response.error || 'Registration failed'
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.auth.login({ 
        email: email.trim(), 
        password: password.trim() 
      });
      
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
  
      return {
        success: false,
        error: response.error || 'Invalid credentials'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.auth.updateProfile(userData);
      
      if (response.success) {
        setCurrentUser(response.user);
        return { success: true };
      }

      return {
        success: false,
        error: response.error || 'Profile update failed'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Profile update failed'
      };
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;