import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

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
        return;
      }

      const response = await api.get('/auth/me');
      if (response?.data?.user) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting login with:', email);
      
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      console.log('Login response:', response);

      // If response is successful
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Login successful!');
        navigate('/');
        return { success: true };
      }

      // If response has an error
      const errorMessage = response?.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password
      });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Account created successfully!');
        navigate('/');
        return { success: true };
      }

      const errorMessage = response?.data?.error || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
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