import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';
import avatarImg from '../assets/avatar.jpg';
import EditProfileModal from './ProfileEdit';
import axios from 'axios';

const AdminProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profil');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobPostings: 0,
    reportsHandled: 0
  });

  const profileImage = user.profileImage || avatarImg;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/statistics', {
          withCredentials: true, // Include cookies for session-based auth or CSRF
        });
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
      }
    };
  
    fetchStatistics();
  }, []);
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="company-info">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="company-details">
                {user.email && (
                  <div className="detail-item">
                    <i className="fas fa-envelope"></i>
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user.department && (
                  <div className="detail-item">
                    <i className="fas fa-building"></i>
                    <span>{user.department}</span>
                  </div>
                )}
                {user.joinDate && (
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Admin since {user.joinDate}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3>Administration Statistics</h3>
              <div className="company-details">
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>Total Users: {statistics.totalUsers}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-building"></i>
                  <span>Companies: {statistics.totalCompanies}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-briefcase"></i>
                  <span>Job Postings: {statistics.totalJobPostings}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-flag"></i>
                  <span>Reports Handled: {statistics.reportsHandled}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic-container">
            <img src={profileImage} alt="Profile" className="profile-pic" />
          </div>
          <div className="profile-title">
            <h2>{user.name}</h2>
            <p className="profile-subtitle">Administrator</p>
            <p className="profile-location">{user.department || 'Administration'}</p>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'profil' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profil')}
          >
            <i className="fas fa-user"></i> Profile
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

    </div>
  );
};

export default AdminProfile;
