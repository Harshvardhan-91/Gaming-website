// client/src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import UserManagement from '../pages/UserManagement';
import ListingManagement from '../pages/ListingManagement';
import ReportManagement from '../pages/ReportManagement';
import AdminSettings from '../pages/AdminSettings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/listings" element={<ListingManagement />} />
      <Route path="/reports" element={<ReportManagement />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;