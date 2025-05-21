import React, { useState, useEffect, useContext } from 'react';
import { useJobOffers } from '../context/JobOfferContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import avatarImg from '../assets/avatar.jpg';
import companyDefaultImg from '../assets/avatar.jpg';

const api_location = "http://localhost:8080/";

// Function to format image URL correctly
const formatImageUrl = (path) => {
  if (!path) return null;
  
  // If URL already starts with http, return as is
  if (path.startsWith('http')) return path;
  
  // Add domain prefix if path starts with /
  return `${api_location}${path.startsWith('/') ? path.substring(1) : path}`;
};

const UserPanel = () => {
  const { jobOffers, loading } = useJobOffers();
  const { user } = useContext(AuthContext);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [currentDateTime] = useState(new Date().getTime());
  const [userApplications, setUserApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    // Get 6 random jobs as suggestions
    if (jobOffers.length > 0) {
      const shuffled = [...jobOffers].sort(() => 0.5 - Math.random());
      setSuggestedJobs(shuffled.slice(0, 6));
    }
  }, [jobOffers]);

  useEffect(() => {
    // Fetch applications for the current user
    const fetchUserApplications = async () => {
      if (!user || !user.userId) return;
      
      setLoadingApplications(true);
      try {
        const response = await axios.get(`${api_location}api/applications/user/${user.userId}`, {
          withCredentials: true
        });
        console.log('Fetched user applications:', response.data);
        
        // If we have applications data
        if (response.data && Array.isArray(response.data)) {
          // Sort by date, newest first
          const sortedApplications = response.data.sort((a, b) => 
            new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt)
          );
          setUserApplications(sortedApplications);
        } else {
          setUserApplications([]);
        }
      } catch (error) {
        console.error('Error fetching user applications:', error);
        // Try fallback endpoint
        try {
          const fallbackResponse = await axios.get(`${api_location}api/job-applications/user/${user.userId}`, {
            withCredentials: true
          });
          console.log('Fetched user applications from fallback endpoint:', fallbackResponse.data);
          if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
            const sortedApplications = fallbackResponse.data.sort((a, b) => 
              new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt)
            );
            setUserApplications(sortedApplications);
          }
        } catch (fallbackError) {
          console.error('Error fetching user applications from fallback endpoint:', fallbackError);
          setUserApplications([]);
        }
      } finally {
        setLoadingApplications(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${api_location}api/users/other-users`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched other users:', data);
          
          // Filter out current user and get 4 random users
          const filteredUsers = data.filter(u => u.id !== user.userId);
          const shuffled = [...filteredUsers].sort(() => 0.5 - Math.random());
          setOtherUsers(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${api_location}api/employer/all`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched companies:', data);
          
          // Get 4 random companies
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setCompanies(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        // Try fallback endpoint if the first one fails
        try {
          const fallbackResponse = await fetch(`${api_location}api/companies/all`, {
            credentials: 'include'
          });
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Fetched companies from fallback endpoint:', fallbackData);
            const shuffled = [...fallbackData].sort(() => 0.5 - Math.random());
            setCompanies(shuffled.slice(0, 4));
          }
        } catch (fallbackError) {
          console.error('Error fetching companies from fallback endpoint:', fallbackError);
        }
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchUserApplications();
    fetchUsers();
    fetchCompanies();
  }, [user?.userId]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Function to get application status class
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': case 'accepted': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'under review': case 'reviewing': return 'status-reviewing';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="dashboard-stats mb-5">
        <div className="row">
          <div className="col-md-4">
            <div className="stat-card">
              <i className="fas fa-briefcase"></i>
              <h3>{jobOffers.length}</h3>
              <p>Available Jobs</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="fas fa-paper-plane"></i>
              <h3>{userApplications.length}</h3>
              <p>Applications Sent</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="fas fa-building"></i>
              <h3>{new Set(jobOffers.map(job => job.companyId?.companyName)).size}</h3>
              <p>Active Companies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="section-card">
            <h4 className="section-title">
              <i className="fas fa-briefcase"></i> Suggested Jobs
            </h4>
            <div className="suggested-jobs">
              {suggestedJobs.map((job, index) => (
                <div key={index} className="job-card">
                  <div className="job-header">
                    <h5>{job.title}</h5>
                    <span className="company-name">{job.companyId?.companyName}</span>
                  </div>
                  <div className="job-details">
                    <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                    <span><i className="fas fa-clock"></i> {job.type}</span>
                    <span><i className="fas fa-laptop-house"></i> {job.modality}</span>
                  </div>
                  <div className="job-footer">
                    <Link to={`/jobs/${job.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="section-card">
            <h4 className="section-title">
              <i className="fas fa-paper-plane"></i> Recent Applications
            </h4>
            <div className="applications-list">
              {loadingApplications ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading applications...</p>
                </div>
              ) : userApplications.length > 0 ? (
                <div className="applications-container">
                  {userApplications.slice(0, 5).map((application, index) => (
                    <div key={index} className="application-item">
                      <div className="application-header">
                        <h5>{application.jobOffer?.title || application.job?.title || 'Job Application'}</h5>
                        <span className={`application-status ${getStatusClass(application.status)}`}>
                          {application.status || 'Pending'}
                        </span>
                      </div>
                      <div className="application-company">
                        {application.jobOffer?.companyId?.companyName || 
                         application.job?.companyId?.companyName || 
                         application.company?.companyName || 
                         'Company'}
                      </div>
                      <div className="application-date">
                        Applied on: {formatDate(application.appliedAt || application.createdAt)}
                      </div>
                      <Link 
                        to={`/jobs/${application.jobOffer?.id || application.job?.id || application.jobId}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Job
                      </Link>
                    </div>
                  ))}
                  {userApplications.length > 5 && (
                    <Link to="/applications" className="btn btn-link view-all-link">
                      View all {userApplications.length} applications
                    </Link>
                  )}
                </div>
              ) : (
                <div className="no-applications">
                  <i className="fas fa-paper-plane"></i>
                  <p>You haven't applied to any jobs yet</p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="section-card mt-4">
            <h4 className="section-title">
              <i className="fas fa-bell"></i> Job Alerts
            </h4>
            <div className="job-alerts">
              <div className="alert-item">
                <i className="fas fa-bell"></i>
                <div className="alert-content">
                  <p>New jobs matching your profile</p>
                  <small>Updated 2 hours ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Sections for Users and Companies */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="section-card">
            <h4 className="section-title">
              <i className="fas fa-users"></i> Other Professionals
            </h4>
            {loadingUsers ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="users-grid">
                {otherUsers.map((otherUser) => (
                  <div key={otherUser.id} className="user-card">
                    <img
                      src={otherUser.profilePicture ? 
                        formatImageUrl(otherUser.profilePicture) + `?v=${currentDateTime}` : 
                        (otherUser.profilePictureUrl ? 
                          formatImageUrl(otherUser.profilePictureUrl) + `?v=${currentDateTime}` : 
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=random&size=64`)}
                      alt={otherUser.name}
                      className="user-avatar"
                      onError={(e) => {
                        console.log('Failed to load user image:', e.target.src);
                        e.target.src = avatarImg;
                      }}
                    />
                    <div className="user-info">
                      <h5>{otherUser.name}</h5>
                      <p>{otherUser.title || 'Professional'}</p>
                      <Link to={`/profile/${otherUser.id}`} className="btn btn-sm btn-outline-primary">
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="section-card">
            <h4 className="section-title">
              <i className="fas fa-building"></i> Featured Companies
            </h4>
            {loadingCompanies ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="companies-grid">
                {companies.map((company) => (
                  <div key={company.id} className="company-card">
                    {/* Try to use the company's actual profile image if available */}
                    <img
                      src={company.userId && company.userId.profilePicture ? 
                        formatImageUrl(company.userId.profilePicture) + `?v=${currentDateTime}` : 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=random&size=64`}
                      alt={company.companyName}
                      className="company-logo"
                      onError={(e) => {
                        console.log('Failed to load company image:', e.target.src);
                        e.target.src = companyDefaultImg;
                      }}
                    />
                    <div className="company-info">
                      <h5>{company.companyName}</h5>
                      <p>{company.industry || 'Business'}</p>
                      <Link to={`/profile/${company.userId ? company.userId.id : company.id}`} className="btn btn-sm btn-outline-primary">
                        View Company
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;