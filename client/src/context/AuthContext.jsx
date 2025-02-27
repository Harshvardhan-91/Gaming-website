import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return false;
      }

      const response = await api.get('/auth/me');
      
      if (response.data?.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  };

  // Check auth status when the app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });
  
      if (response.data?.success) {
        localStorage.setItem('token', response.data.token);
        
        // Update state synchronously
        await Promise.all([
          new Promise(resolve => {
            setUser(response.data.user);
            setIsAuthenticated(true);
            resolve();
          })
        ]);

        // Verify the auth state was updated
        if (!user || !isAuthenticated) {
          await checkAuthStatus();
        }
        
        toast.success('Login successful!');
        return { success: true, user: response.data.user };
      }
  
      const errorMessage = response.data?.error || 'Invalid credentials';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.data?.success) {
        localStorage.setItem('token', response.data.token);
        
        // Update state synchronously
        await Promise.all([
          new Promise(resolve => {
            setUser(response.data.user);
            setIsAuthenticated(true);
            resolve();
          })
        ]);
        
        toast.success('Account created successfully!');
        return { success: true, user: response.data.user };
      }

      const errorMessage = response.data?.error || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      return { success: false, error: 'Logout failed' };
    }
  };

  const updateAvatar = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success) {
        setUser(response.data.user);
        toast.success('Profile picture updated successfully!');
        return { success: true, user: response.data.user };
      }

      throw new Error(response.data?.error || 'Failed to update profile picture');
    } catch (error) {
      console.error('Update avatar error:', error);
      toast.error(error.message || 'Failed to update profile picture');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
    updateAvatar,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;