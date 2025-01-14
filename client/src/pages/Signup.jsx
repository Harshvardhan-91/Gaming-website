import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // For multi-step form

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    if (step === 1) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card with subtle hover effect */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-2xl">
          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                  Step {step} of 2
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {step === 1 ? '50%' : '100%'}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-100">
              <div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {step === 1 ? 'Create Account' : 'Complete Profile'}
            </h1>
            <p className="text-gray-500">
              {step === 1 
                ? 'Enter your details to get started' 
                : 'Just a few more details to personalize your experience'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                               outline-none transition-all duration-200 pl-12 pr-12"
                      placeholder="Create a password"
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
              </>
            ) : (
              <>
                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Username
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                               outline-none transition-all duration-200 pl-12"
                      placeholder="Choose a username"
                      required
                    />
                    <User className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 
                                   group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                </div>

                {/* Additional profile fields can be added here */}
              </>
            )}

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
                  {step === 1 ? 'Continue' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="text-blue-600 hover:text-blue-700 
                         hover:underline transition-all duration-200 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="text-center text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;