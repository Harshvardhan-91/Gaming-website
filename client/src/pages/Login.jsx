import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all duration-200 pl-12"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 
                               group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative group">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all duration-200 pl-12 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 
                               group-focus-within:text-blue-500 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 
                           transition-colors duration-200"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 
                                   hover:underline transition-all duration-200">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white rounded-xl hover:opacity-90 transition-all duration-200 
                       transform hover:scale-[1.02] active:scale-[0.98] 
                       disabled:opacity-70 disabled:cursor-not-allowed 
                       flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 
                             transition-colors duration-200 flex items-center justify-center gap-2">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 
                             transition-colors duration-200 flex items-center justify-center gap-2">
              <img src="https://www.facebook.com/favicon.ico" className="w-5 h-5" alt="Facebook" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 
                                         hover:underline transition-all duration-200 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;