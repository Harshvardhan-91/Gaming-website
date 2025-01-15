import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return false;
      }

      const response = await api.get('/auth/me');
      if (response?.data?.user) {
        setUser(response.data.user);
        return true;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      if (response?.data?.token && response?.data?.user) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        await checkAuth(); // Verify and get full user data
        return { success: true };
      }

      const errorMessage = response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Invalid credentials';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password
      });

      if (response?.data?.token && response?.data?.user) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        await checkAuth(); // Verify and get full user data
        return { success: true };
      }

      const errorMessage = response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

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