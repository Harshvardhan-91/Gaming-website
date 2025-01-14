import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      if (result.success) {
        navigate('/'); // Redirect to home after successful signup
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-500">
              Join our community of gamers and traders
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
                <User className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              </div>
            </div>

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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              </div>
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
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all"
                  placeholder="Create a password"
                  required
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
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white rounded-xl hover:opacity-90 transition-all duration-200 
                       flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent 
                              rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms and Privacy */}
            <div className="text-center text-sm text-gray-500">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;