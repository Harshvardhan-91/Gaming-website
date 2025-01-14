import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import GameListing from './pages/GameListing';
import ListingDetails from './pages/ListingDetails';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/browse" element={<GameListing />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected Routes - Require Authentication */}
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-listing"
                  element={
                    <ProtectedRoute>
                      <CreateListing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[70vh] flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                          404 - Page Not Found
                        </h1>
                        <p className="text-gray-600 mb-8">
                          The page you're looking for doesn't exist.
                        </p>
                        <button
                          onClick={() => window.history.back()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                                   hover:bg-blue-700 transition-colors"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;