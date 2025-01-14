// routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin components
import AdminDashboard from '../components/admin/Dashboard';
import Settings from '../pages/Settings';
import UserManagement from '../pages/UserManagement';
import ListingManagement from '../pages/ListingManagement';
import ReportManagement from '../pages/ReportManagement';

const AdminRoutes = () => {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="listings" element={<ListingManagement />} />
      <Route path="reports" element={<ReportManagement />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;