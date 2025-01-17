// client/src/pages/AdminDashboard.jsx
import React from 'react';
import { AdminLayout } from '../components/admin/Layout';
import DashboardContent from '../components/admin/Dashboard';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;