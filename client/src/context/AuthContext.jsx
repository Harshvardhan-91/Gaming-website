// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing auth session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login API - replace with actual API call
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          avatar: '/api/placeholder/48/48'
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true };
      } 
      else if (email === 'user@example.com' && password === 'user123') {
        const regularUser = {
          id: '2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
          avatar: '/api/placeholder/48/48'
        };
        localStorage.setItem('user', JSON.stringify(regularUser));
        setUser(regularUser);
        return { success: true };
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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