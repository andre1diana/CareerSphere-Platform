import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useJobOffers } from '../context/JobOfferContext';
import '../styles/profile.css';
import avatarImg from '../assets/avatar.jpg';
import companyDefaultImg from '../assets/avatar.jpg';

const PublicProfile = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const { jobOffers, loading: jobsLoading } = useJobOffers();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [activeTab, setActiveTab] = useState('profil');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          withCredentials: true
        });
        console.log('User data received:', response.data);
        setUserData(response.data);
        
        // Store profile image URL
        if (response.data.profilePicture) {
          console.log('Profile image URL from API:', response.data.profilePicture);
          setProfileImageUrl(response.data.profilePicture);
        }

        // If the user is an employer, fetch their company profile
        if (response.data.role === 'employer') {
          const companyResponse = await axios.get(`http://localhost:8080/api/employer/company/${userId}`, {
            withCredentials: true
          });
          console.log('Company profile received:', companyResponse.data);
          setCompanyProfile(companyResponse.data);
        }

        setLoading(false);
        // Force image refresh
        setImageKey(Date.now());
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleReport = async () => {
    try {
      if (!user || !user.id) {
        alert('You must be logged in to submit a report');
        return;
      }

      if (!reportType || !reportDescription) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/reports/create',
        {
          reporterId: user.id,
          reportedId: parseInt(userId),
          reportType: reportType,
          description: reportDescription
        },
        { withCredentials: true }
      );

      alert('Report submitted successfully');
      setShowReportModal(false);
      setReportType('');
      setReportDescription('');
    } catch (error) {
      console.error('Error submitting report:', error.response?.data || error.message);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleMessage = () => {
    // Creăm un eveniment custom pentru a comunica cu componenta Messages
    const messageEvent = new CustomEvent('open-chat', { 
      detail: { 
        recipientId: userId,
        recipientName: userData.name,
        recipientRole: userData.role
      } 
    });
    document.dispatchEvent(messageEvent);
    
    // Forțăm deschiderea chat-ului fără a naviga către pagina de mesaje
    const chatButton = document.querySelector('.toggle-chat-btn');
    if (chatButton) chatButton.click();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userData) {
    return <div className="error">User not found</div>;
  }

  const renderProfileByRole = () => {
    const commonHeader = (
      <div className="profile-header">
        <div className="profile-pic-container">
          <img 
            key={imageKey}
            src={profileImageUrl 
              ? `http://localhost:8080${profileImageUrl}?v=${new Date().getTime()}` 
              : (userData?.role === 'employer' ? companyDefaultImg : avatarImg)} 
            alt="Profile" 
            className="profile-pic"
            onError={(e) => {
              console.error('Error loading image:', e);
              console.log('Failed image URL:', e.target.src);
              
              // Fallback to default image based on role
              e.target.src = userData?.role === 'employer' ? companyDefaultImg : avatarImg;
            }}
          />
        </div>
        <div className="profile-title">
          <h2>{userData.role === 'employer' ? (companyProfile?.companyName || userData.name) : userData.name}</h2>
          {userData.role !== 'employer' && (
            <>
              <p className="profile-subtitle">{userData.title || 'Professional'}</p>
              <p className="profile-location">{userData.location || 'Location not specified'}</p>
            </>
          )}
        </div>
      </div>
    );

    switch (userData.role) {
      case 'admin':
        return (
          <div className="profile-container">
            {commonHeader}
            <div className="profile-content">
              <div className="profile-section">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {userData.email}</p>
                {userData.phoneNumber && (
                  <p><strong>Phone:</strong> {userData.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'employer':
        return (
          <div className="profile-container">
            <div className="profile-card">
              {commonHeader}

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
                {activeTab === 'profil' && (
                  <div className="company-info">
                    {companyProfile?.description && (
                      <div className="info-section">
                        <h3>About Us</h3>
                        <p className="company-description">{companyProfile.description}</p>
                      </div>
                    )}
                    
                    <div className="info-section">
                      <h3>Company Details</h3>
                      <div className="company-details">
                        {companyProfile?.createdAt && (
                          <div className="detail-item">
                            <i className="fas fa-calendar"></i>
                            <span>Founded: {new Date(companyProfile.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {userData.email && (
                          <div className="detail-item">
                            <i className="fas fa-envelope"></i>
                            <span>{userData.email}</span>
                          </div>
                        )}
                        {userData.phoneNumber && (
                          <div className="detail-item">
                            <i className="fas fa-phone"></i>
                            <span>{userData.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {user && user.id !== parseInt(userId) && (
                      <div className="profile-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={handleMessage}
                        >
                          Message
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => setShowReportModal(true)}
                        >
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'joburi' && (
                  <div className="jobs-section">
                    <div className="section-header">
                      <h3>Posted Jobs</h3>
                    </div>

                    {jobsLoading ? (
                      <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading job offers...</p>
                      </div>
                    ) : (
                      <>
                        {jobOffers.filter(job => job.companyId?.id === companyProfile?.id).length > 0 ? (
                          <div className="job-listings">
                            {jobOffers
                              .filter(job => job.companyId?.id === companyProfile?.id)
                              .map((job) => (
                                <div 
                                  key={job.id} 
                                  className="job-card"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  style={{ cursor: 'pointer' }}
                                >
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
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="no-jobs">
                            <i className="fas fa-briefcase"></i>
                            <p>No job offers posted yet.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default: // user
        return (
          <div className="profile-container">
            <div className="profile-card">
              {commonHeader}
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
                {activeTab === 'profil' && (
                  <div className="company-info">
                    <div className="info-section">
                      <h3>About Me</h3>
                      <div className="company-details">
                        {userData.bio ? (
                          <p className="company-description">{userData.bio}</p>
                        ) : (
                          <p className="no-content">No information about me added yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Personal Information</h3>
                      <div className="company-details">
                        {userData.email && (
                          <div className="detail-item">
                            <i className="fas fa-envelope"></i>
                            <span>{userData.email}</span>
                          </div>
                        )}
                        {userData.phoneNumber && (
                          <div className="detail-item">
                            <i className="fas fa-phone"></i>
                            <span>{userData.phoneNumber}</span>
                          </div>
                        )}
                        {userData.location && (
                          <div className="detail-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{userData.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {userData.skills && userData.skills.length > 0 && (
                      <div className="info-section">
                        <h3>Skills</h3>
                        <div className="company-details">
                          {userData.skills.map((skill, index) => (
                            <div key={index} className="detail-item">
                              <i className="fas fa-check-circle"></i>
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'experienta' && (
                  <div className="company-info">
                    <div className="info-section">
                      <h3>Professional Experience</h3>
                      {userData.experience?.length > 0 ? (
                        userData.experience.map((job, index) => (
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
                )}

                {activeTab === 'educatie' && (
                  <div className="company-info">
                    <div className="info-section">
                      <h3>Education</h3>
                      {userData.education?.length > 0 ? (
                        userData.education.map((edu, index) => (
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
                )}
              </div>

              {user && user.id !== parseInt(userId) && (
                <div className="profile-actions" style={{ display: 'flex', gap: '10px' }}> 
                  <button 
                    className="btn btn-primary"
                    onClick={handleMessage}
                    style={{ margin: '10px' }}
                  >
                    Message
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowReportModal(true)}
                    style={{ margin: '10px' }}
                  >
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="main-container">
      {renderProfileByRole()}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Report User</h3>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="form-control"
            >
              <option value="">Select reason</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please provide details about your report"
              className="form-control"
              rows="4"
            />
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleReport}
                disabled={!reportType || !reportDescription}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile; 