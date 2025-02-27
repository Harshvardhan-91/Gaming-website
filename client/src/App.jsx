import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";
import { ListingProvider } from "./context/ListingContext";
import { AdminProvider } from "./context/AdminContext";
import useAuth from "./hooks/useAuth";

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import GameListing from "./pages/GameListing";
import ListingDetails from "./pages/ListingDetails";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import SellerProfile from "./pages/SellerProfile";
import Search from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
import Cart from "./pages/Cart";
import HowitWorks from "./pages/HowitWorks";
import UserManagement from "./pages/UserManagement";
import ReportManagement from "./pages/ReportManagement";
import ListingManagement from "./pages/ListingManagement";
import AdminSettings from "./pages/AdminSettings";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ListingProvider>
          <ChatProvider>
            <AdminProvider>
              <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/browse" element={<GameListing />} />
                    <Route path="/listing/:id" element={<ListingDetails />} />
                    <Route path="/seller/:id" element={<SellerProfile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/how-it-works" element={<HowitWorks />} />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route
                              path="/reports"
                              element={<ReportManagement />}
                            />
                            <Route
                              path="/listings"
                              element={<ListingManagement />}
                            />
                            <Route
                              path="/settings"
                              element={<AdminSettings />}
                            />
                          </Routes>
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
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
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
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
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      }
                    >
                      <Route path=":sellerId" element={<Chat />} />
                      <Route path=":sellerId/:listingId" element={<Chat />} />
                    </Route>
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      }
                    />

                    {/* Redirect /sell to /create-listing */}
                    <Route
                      path="/sell"
                      element={<Navigate to="/create-listing" replace />}
                    />


                    {/* 404 Route */}
                    <Route
                      path="*"
                      element={
                        <div className="min-h-screen flex items-center justify-center">
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

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    success: {
                      duration: 3000,
                      style: {
                        background: "#10B981",
                        color: "white",
                      },
                    },
                    error: {
                      duration: 4000,
                      style: {
                        background: "#EF4444",
                        color: "white",
                      },
                    },
                  }}
                />
              </div>
            </AdminProvider>
          </ChatProvider>
        </ListingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
