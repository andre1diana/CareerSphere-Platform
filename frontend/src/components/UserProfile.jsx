import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';
import avatarImg from '../assets/avatar.jpg';
import EditProfileModal from './ProfileEdit';
import axios from 'axios';

const UserProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profil');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Function to format image URL correctly
  const formatImageUrl = useCallback((path) => {
    if (!path) return null;
    
    // If URL already starts with http, return as is
    if (path.startsWith('http')) return path;
    
    // Add domain prefix if path starts with /
    return `http://localhost:8080${path.startsWith('/') ? path : `/${path}`}`;
  }, []);

  // Function to refresh user data
  const fetchUserData = useCallback(async () => {
    if (dataFetched) return; // Prevent multiple fetches
    
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/current-user', {
        withCredentials: true
      });
      console.log('Fetched user data:', response.data);
      
      // Check for profile image in various fields
      let imageUrl = null;
      if (response.data.profilePicture) {
        console.log('Found profile image (profilePicture):', response.data.profilePicture);
        imageUrl = response.data.profilePicture;
      } else if (response.data.profilePictureUrl) {
        console.log('Found profile image (profilePictureUrl):', response.data.profilePictureUrl);
        imageUrl = response.data.profilePictureUrl;
      }
      
      // Format and set the image URL
      if (imageUrl) {
        const formattedUrl = formatImageUrl(imageUrl);
        console.log('Setting formatted image URL:', formattedUrl);
        setProfileImageUrl(formattedUrl);
        setImageError(false);
      }
      
      updateUser(response.data);
      setImageKey(Date.now()); // Force image refresh
      setDataFetched(true); // Mark data as fetched
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [updateUser, formatImageUrl, dataFetched]);

  // Initial load - only run once
  useEffect(() => {
    if (!dataFetched) {
      fetchUserData();
    }
  }, [fetchUserData, dataFetched]);
  
  // When user data changes - but only run when user ID changes to avoid loops
  useEffect(() => {
    if (!user) return;
    
    // Find and format the profile image URL
    let imageUrl = null;
    
    if (user.profilePicture) {
      imageUrl = user.profilePicture;
    } else if (user.profilePictureUrl) {
      imageUrl = user.profilePictureUrl;
    }
    
    if (imageUrl) {
      const formattedUrl = formatImageUrl(imageUrl);
      setProfileImageUrl(formattedUrl);
      // Don't update imageKey here to avoid re-renders
    }
  }, [user?.userId, formatImageUrl]); // Only depend on user ID, not the whole user object

  // Handle image load error
  const handleImageError = () => {
    console.error('Failed to load profile image:', profileImageUrl);
    setImageError(true);
    
    // Only force refresh once
    if (!imageError) {
      console.log('Setting image to default due to error');
      setProfileImageUrl(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Debug info
  console.log('Current profile image URL:', profileImageUrl);
  console.log('User object:', user);

  const renderTabContent = () => {
    console.log('Rendering with user data:', {
      experience: user.experience,
      education: user.education
    });

    switch (activeTab) {
      case 'profil':
        return (
          <div className="company-info">
            <div className="info-section">
              <h3>About Me</h3>
              <div className="company-details">
                {user.bio ? (
                  <p className="company-description">{user.bio}</p>
                ) : (
                  <p className="no-content">No information about me added yet.</p>
                )}
              </div>
            </div>

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
                {user.location && (
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {user.skills && user.skills.length > 0 && (
              <div className="info-section">
                <h3>Skills</h3>
                <div className="company-details">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="edit-profile-btn" 
              onClick={() => setIsEditModalOpen(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        );

      case 'experienta':
        return (
          <div className="company-info">
            <div className="info-section">
              <h3>Professional Experience</h3>
              {user.experience && user.experience.length > 0 ? (
                user.experience.map((job, index) => (
                  <div key={index} className="detail-item experience-item">
                    <div className="experience-header">
                      <i className="fas fa-briefcase"></i>
                      <div>
                        <strong>{job.position || job.role}</strong>
                        <span className="company-name">at {job.companyName || job.company}</span>
                      </div>
                    </div>
                    <div className="experience-period">
                      {job.startDate ? (
                        `${job.startDate} - ${job.endDate || 'Present'}`
                      ) : (
                        `${job.startMonth} ${job.startYear} - ${job.endMonth} ${job.endYear}`
                      )}
                    </div>
                    {job.description && (
                      <p className="experience-description">{job.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-content">No experience added yet.</p>
              )}
            </div>
          </div>
        );

      case 'educatie':
        return (
          <div className="company-info">
            <div className="info-section">
              <h3>Education</h3>
              {user.education && user.education.length > 0 ? (
                user.education.map((edu, index) => (
                  <div key={index} className="detail-item education-item">
                    <div className="education-header">
                      <i className="fas fa-graduation-cap"></i>
                      <div>
                        <strong>{edu.institutionName || edu.institution}</strong>
                        <span className="degree">{edu.degree}</span>
                      </div>
                    </div>
                    <div className="education-period">
                      {edu.startDate ? (
                        `${edu.startDate} - ${edu.endDate || 'Present'}`
                      ) : (
                        `${edu.startYear} - ${edu.endYear}`
                      )}
                    </div>
                    {edu.fieldOfStudy && (
                      <p className="field-of-study">{edu.fieldOfStudy}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-content">No education added yet.</p>
              )}
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
            <img 
              key={imageKey}
              src={profileImageUrl || avatarImg}
              alt="Profile" 
              className="profile-pic"
              onError={(e) => {
                console.error('Error loading image:', e);
                console.log('Failed image URL:', e.target.src);
                e.target.src = avatarImg;
                handleImageError();
              }}
            />
          </div>
          <div className="profile-title">
            <h2>{user.name}</h2>
            <p className="profile-subtitle">{user.title || 'Professional'}</p>
            <p className="profile-location">{user.location || 'Location not specified'}</p>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'profil' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profil')}
          >
            <i className="fas fa-user"></i> Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'experienta' ? 'active' : ''}`} 
            onClick={() => setActiveTab('experienta')}
          >
            <i className="fas fa-briefcase"></i> Experience
          </button>
          <button 
            className={`tab-btn ${activeTab === 'educatie' ? 'active' : ''}`} 
            onClick={() => setActiveTab('educatie')}
          >
            <i className="fas fa-graduation-cap"></i> Education
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={{
            ...user,
            id: user.userId
          }}
          onSave={(updatedUser) => {
            console.log('Profile updated, received data:', updatedUser);
            
            // Update profile image URL if it changed
            if (updatedUser.profilePicture || updatedUser.profilePictureUrl) {
              const newImageUrl = formatImageUrl(
                updatedUser.profilePicture || updatedUser.profilePictureUrl
              );
              console.log('Setting new profile image URL:', newImageUrl);
              setProfileImageUrl(newImageUrl);
              setImageError(false);
            }
            
            updateUser(updatedUser);
            setIsEditModalOpen(false);
            
            // Force image refresh
            setImageKey(Date.now());
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;