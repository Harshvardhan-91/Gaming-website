import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Log the error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });
    return Promise.reject(error.response?.data || error);
  }
);

// Auth endpoints
const auth = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return {
        success: true,
        ...response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  },

  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/auth/profile', userData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

const api = {
  auth,
  axiosInstance
};

export default api;