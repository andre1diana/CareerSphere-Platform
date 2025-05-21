// Profile.js - Main container component
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';
import CompanyEmployerProfile from '../components/EmployerProfile';
import AdminProfile from '../components/AdminProfile';
import '../styles/profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const renderProfileByRole = () => {
    switch (user.role) {
      case 'admin':
        return <AdminProfile />;
      case 'employer':
        return <CompanyEmployerProfile />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="main-container">
      {renderProfileByRole()}
    </div>
  );
};

export default Profile;