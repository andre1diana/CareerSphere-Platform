import React from 'react';
import UserManagement from '../components/UserManagement';
import JobManagement from '../components/JobManagement';

const AdminManagement = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Management Panel</h1>

      <div className="mb-5">
        <h3>Manage Users</h3>
        <UserManagement />
      </div>

      <div className="mb-5">
        <h3>Manage Job Listings</h3>
        <JobManagement />
      </div>
    </div>
  );
};

export default AdminManagement;
