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
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

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
      const response = await api.post('/auth/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password
      });

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

  // New profile management functions
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put('/profile', profileData);
      if (response.data?.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        return { success: true, user: response.data.user };
      }
      throw new Error(response.data?.error || 'Failed to update profile');
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.success) {
        setUser(response.data.user);
        toast.success('Profile picture updated!');
        return { success: true, user: response.data.user };
      }
      throw new Error(response.data?.error || 'Failed to update profile picture');
    } catch (error) {
      console.error('Avatar update error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrivacySettings = useCallback(async (settings) => {
    setLoading(true);
    try {
      const response = await api.put('/profile/privacy', settings);
      if (response.data?.success) {
        setUser(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            privacy: settings
          }
        }));
        toast.success('Privacy settings updated!');
        return { success: true };
      }
      throw new Error(response.data?.error || 'Failed to update privacy settings');
    } catch (error) {
      console.error('Privacy settings update error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateProfileCompletion = useCallback(() => {
    if (!user) return 0;

    const requiredFields = [
      'name',
      'email',
      'avatar',
      'bio',
      'phone',
      'location.country',
      'socialLinks.discord',
      'socialLinks.steam'
    ];

    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const completedFields = requiredFields.filter(field => {
      const value = getNestedValue(user, field);
      return value && String(value).trim() !== '';
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    profileCompletion: calculateProfileCompletion(),
    login,
    signup,
    logout,
    checkAuth,
    updateProfile,
    updateAvatar,
    updatePrivacySettings
  };
};

export default useAuth;