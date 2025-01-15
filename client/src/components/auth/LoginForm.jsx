import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setValidationErrors({});
    setFormData({ email: '', password: '' });
  }, [location.pathname]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo);
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during login');
    }
  };

  // Demo accounts
  const demoAccounts = [
    { type: 'Admin', email: 'admin@example.com', password: 'admin123' },
    { type: 'User', email: 'user@example.com', password: 'user123' }
  ];

  const setDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                  outline-none transition-all duration-200 pl-12`}
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                  outline-none transition-all duration-200 pl-12 pr-12`}
                  placeholder="Enter your password"
                />
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white rounded-xl hover:opacity-90 transition-all duration-200 
                       transform hover:scale-[1.02] active:scale-[0.98] 
                       disabled:opacity-70 disabled:cursor-not-allowed 
                       flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent 
                              rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Test Accounts</h3>
            <div className="space-y-2 text-sm">
              {demoAccounts.map((account, index) => (
                <div key={index} className="flex flex-col text-gray-600 p-2 hover:bg-blue-100 rounded-lg cursor-pointer"
                     onClick={() => setDemoAccount(account)}>
                  <span className="font-medium text-blue-600">{account.type} Account:</span>
                  <span>Email: {account.email}</span>
                  <span>Password: {account.password}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;