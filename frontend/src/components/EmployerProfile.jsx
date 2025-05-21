import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';
import { useJobOffers } from '../context/JobOfferContext';
import EditProfileEmployer from './EditProfileEmployer';
import '../styles/profile.css';
import companyDefaultImg from '../assets/avatar.jpg';

const EmployerProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { jobOffers, loading: jobsLoading } = useJobOffers();
  const [activeTab, setActiveTab] = useState('profil');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageKey, setImageKey] = useState(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const printUserData = (user) => {
    console.log('User ID:', user.userId);
    console.log('Role:', user.role);
    console.log('Name:', user.name);
    console.log('Profile Image:', user.profileImage);
  }

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/employer/company/${user.userId}`, {
          withCredentials: true
        });
        setCompanyProfile(response.data);
        // If this is a new profile, automatically open the edit form
        if (!response.data.companyName) {
          setIsEditingProfile(true);
        }
        // Update image key to force refresh
        setImageKey(Date.now());
        
        // Debug information
        console.log('User profile from context:', user);
        console.log('Company profile from API:', response.data);
        
        // Try to get profile image from user data in response
        if (user && user.profileImage) {
          console.log('Using profile image from user context:', user.profileImage);
          setProfileImageUrl(user.profileImage);
        } else {
          // Try to get the user data to find the profile image
          try {
            const userResponse = await axios.get(`http://localhost:8080/api/users/${user.userId}`, {
              withCredentials: true
            });
            if (userResponse.data && userResponse.data.profilePicture) {
              console.log('Found profile image in user API response:', userResponse.data.profilePicture);
              setProfileImageUrl(userResponse.data.profilePicture);
              // Update the user context
              updateUser({ profileImage: userResponse.data.profilePicture });
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
        alert('Error loading company profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userId) {
      fetchCompanyProfile();
    }
  }, [user, updateUser]);

  const handleSaveProfile = async (updatedProfile) => {
    try {
      if (!user || !user.userId || user.userId <= 0) {
        console.error('Invalid user ID:', user);
        alert('Please log in again to save your profile');
        return;
      }

      console.log('Saving profile with data:', updatedProfile);
      
      // Create FormData object to correctly handle multipart/form-data
      const formData = new FormData();
      formData.append('userId', parseInt(user.userId, 10));
      formData.append('companyName', updatedProfile.companyName || '');
      formData.append('description', updatedProfile.description || '');
      
      const createdAt = updatedProfile.createdAt 
        ? new Date(updatedProfile.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      formData.append('createdAt', createdAt);

      // If updatedProfile has a profileImage file, append it
      if (updatedProfile.profileImageFile) {
        formData.append('profileImage', updatedProfile.profileImageFile);
        console.log("Added profile image file to FormData:", updatedProfile.profileImageFile.name);
      }
      
      // Log all form data entries
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await axios.post(
        "http://localhost:8080/api/employer/profile",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('Profile saved, response data:', response.data);
      setCompanyProfile(response.data);
      setIsEditingProfile(false);
      
      // Update image key to force refresh the image
      setImageKey(Date.now());
      
      // Try to get the updated user profile to get the image URL
      try {
        const userResponse = await axios.get(`http://localhost:8080/api/users/${user.userId}`, {
          withCredentials: true
        });
        
        if (userResponse.data && userResponse.data.profilePicture) {
          console.log('Updated profile image URL:', userResponse.data.profilePicture);
          setProfileImageUrl(userResponse.data.profilePicture);
          // Update the user context
          updateUser({ profileImage: userResponse.data.profilePicture });
        }
      } catch (error) {
        console.error('Error fetching updated user profile:', error);
        // Force page reload as fallback
        window.location.reload();
      }
      
    } catch (error) {
      console.error("Error saving profile:", error);
      if (error.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response data:", error.response.data);
        alert(`Failed to save profile: ${error.response.status} ${error.response.statusText}`);
      } else {
        alert('Failed to save profile. Please try again.');
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':
        return isEditingProfile ? (
          <EditProfileEmployer
            user={{ ...user, ...companyProfile }}
            onSave={handleSaveProfile}
            onClose={() => setIsEditingProfile(false)}
          />
        ) : (
          companyProfile ? (
            <div className="company-info">
              {companyProfile.description && (
                <div className="info-section">
                  <h3>About Us</h3>
                  <p className="company-description">{companyProfile.description}</p>
                </div>
              )}
              
              <div className="info-section">
                <h3>Company Details</h3>
                <div className="company-details">
                  {companyProfile.createdAt && (
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>Founded: {new Date(companyProfile.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                className="edit-profile-btn" 
                onClick={() => setIsEditingProfile(true)}
              >
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            </div>
          ) : (
            <div className="no-profile">
              <i className="fas fa-building"></i>
              <p>No company profile found. Please create your company profile.</p>
              <button 
                className="create-profile-btn" 
                onClick={() => setIsEditingProfile(true)}
              >
                Create Company Profile
              </button>
            </div>
          )
        );

      case 'joburi':
        if (jobsLoading) {
          return (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading job offers...</p>
            </div>
          );
        }

        // Filter jobs by company ID
        const companyJobOffers = jobOffers.filter(job => {
          console.log('Job company ID:', job.companyId?.id);
          console.log('Company profile ID:', companyProfile?.id);
          return job.companyId?.id === companyProfile?.id;
        });
        
        console.log('Filtered job offers:', companyJobOffers);
        
        return (
          <div className="jobs-section">
            <div className="section-header">
              <h3>Posted Jobs</h3>
              <Link to="/joboffer" className="post-job-btn">
                <i className="fas fa-plus"></i> Post New Job
              </Link>
            </div>

            {companyJobOffers.length > 0 ? (
              <div className="job-listings">
                {companyJobOffers.map((job) => (
                  <div key={job.id} className="job-card">
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      {job.location && <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>}
                      {job.type && <span><i className="fas fa-briefcase"></i> {job.type}</span>}
                      {job.modality && <span><i className="fas fa-laptop-house"></i> {job.modality}</span>}
                      {job.salary && <span><i className="fas fa-money-bill-wave"></i> {job.salary}</span>}
                    </div>
                    <div className="job-description">
                      <p>{job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}</p>
                    </div>
                    <div className="job-footer">
                      <span className="posted-date">
                        <i className="fas fa-clock"></i> Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <button 
                        className="delete-job-btn"
                        onClick={async (e) => {
                          e.preventDefault();
                          if (window.confirm('Are you sure you want to delete this job offer?')) {
                            try {
                              await axios.delete(`http://localhost:8080/api/jobs/${job.id}`, {
                                withCredentials: true
                              });
                              // Refresh the job offers list
                              window.location.reload();
                            } catch (error) {
                              console.error('Error deleting job:', error);
                              alert('Failed to delete job offer. Please try again.');
                            }
                          }
                        }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-jobs">
                <i className="fas fa-briefcase"></i>
                <p>No job offers posted yet.</p>
                <Link to="/joboffer" className="post-job-btn">
                  Post Your First Job
                </Link>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Debug profile image URL
  console.log('Current profile image URL state:', profileImageUrl);
  console.log('User profile image from context:', user.profileImage);
  
  return (
    //printUserData(user),
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic-container">
            <img 
              key={imageKey} 
              src={profileImageUrl 
                ? `http://localhost:8080${profileImageUrl}?v=${new Date().getTime()}` 
                : (user?.profileImage 
                  ? `http://localhost:8080${user.profileImage}?v=${new Date().getTime()}`
                  : companyDefaultImg)} 
              alt="Company Logo" 
              className="profile-pic" 
              onError={(e) => {
                console.error('Error loading image:', e);
                // Log the attempted URL
                console.log('Failed image URL:', e.target.src);
                
                // Try a potential backup URL
                if (user?.profileImage && e.target.src.includes(profileImageUrl)) {
                  console.log('Trying backup URL with user.profileImage');
                  e.target.src = `http://localhost:8080${user.profileImage}?nocache=${Math.random()}`;
                } else if (profileImageUrl && e.target.src.includes(user.profileImage)) {
                  console.log('Trying backup URL with profileImageUrl');
                  e.target.src = `http://localhost:8080${profileImageUrl}?nocache=${Math.random()}`;
                } else {
                  console.log('Falling back to default image');
                  e.target.src = companyDefaultImg;
                }
              }}
            />
          </div>
          <div className="profile-title">
            <h2>{companyProfile?.companyName || user.name}</h2>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'profil' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profil')}
          >
            <i className="fas fa-building"></i> Company Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'joburi' ? 'active' : ''}`} 
            onClick={() => setActiveTab('joburi')}
          >
            <i className="fas fa-briefcase"></i> Jobs
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
