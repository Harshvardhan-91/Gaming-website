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

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const api = {
  auth: {
    register: async (userData) => {
      try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw error.response.data;
        }
        throw error;
      }
    },

    login: async (credentials) => {
      try {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw error.response.data;
        }
        throw error;
      }
    },

    verifyToken: async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
      } catch (error) {
        if (error.response) {
          throw error.response.data;
        }
        throw error;
      }
    }
  },

  get: async (endpoint) => {
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }
};

export default api;