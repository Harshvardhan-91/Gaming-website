import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
        setLoading(false);
        return true;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []);

  // Check auth status when component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Login attempt:', { email });
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      console.log('Login response:', response);

      if (response.data?.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Login successful!');

        // Navigate to the intended page or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
        
        return { success: true };
      }

      const errorMessage = response.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate, location]);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Signup attempt:', { email: userData.email });
      const response = await api.post('/auth/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password
      });

      console.log('Signup response:', response);

      if (response.data?.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Account created successfully!');
        navigate('/');
        return { success: true };
      }

      const errorMessage = response.data?.error || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };

    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed';
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
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkAuth
  };
};

export default useAuth;