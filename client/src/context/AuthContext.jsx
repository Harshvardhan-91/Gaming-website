import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const checkAuth = async () => {
      const token = localStorage.getItem('gametradeToken');
      if (token) {
        // TODO: Validate token with backend
        // For now, we'll simulate a logged-in user
        setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/api/placeholder/40/40',
          role: 'user'
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Implement real API call
      // Simulated login response
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: '/api/placeholder/40/40',
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('gametradeToken', mockToken);
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const signup = async (userData) => {
    try {
      // TODO: Implement real API call
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        avatar: '/api/placeholder/40/40',
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('gametradeToken', mockToken);
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('gametradeToken');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      // TODO: Implement real API call
      setUser(prev => ({ ...prev, ...userData }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Update failed' };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;