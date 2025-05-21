import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useJobOffers } from '../context/JobOfferContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
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

const EmployerPanel = () => {
  const { jobOffers } = useJobOffers();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalApplications: 0,
    activeJobs: 0,
    totalJobsPosted: 0,
    totalApplicationsReceived: 0,
    averageApplicationsPerJob: 0,
    mostPopularJob: null,
    recentHires: 0
  });
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [imageKey, setImageKey] = useState(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [recentApplications, setRecentApplications] = useState([]);

  // Fetch company statistics from backend
  useEffect(() => {
    const fetchCompanyStats = async () => {
      if (!user || !user.userId) return;
      
      try {
        setStatsLoading(true);
        
        // Try fetching stats from different possible endpoints
        let statsData = null;
        
        try {
          // First attempt - specific company stats endpoint
          const response = await axios.get(`${api_location}api/employer/statistics/${user.userId}`, {
            withCredentials: true
          });
          console.log('Fetched employer statistics:', response.data);
          statsData = response.data;
        } catch (error) {
          console.log('First stats endpoint failed, trying alternative...');
          
          try {
            // Second attempt - try company ID based endpoint
            if (companyProfile && companyProfile.id) {
              const altResponse = await axios.get(`${api_location}api/company/statistics/${companyProfile.id}`, {
                withCredentials: true
              });
              console.log('Fetched company statistics from alternative endpoint:', altResponse.data);
              statsData = altResponse.data;
            }
          } catch (altError) {
            console.log('Alternative stats endpoint failed, trying applications count...');
            
            // Third attempt - get applications count directly
            try {
              if (companyProfile && companyProfile.id) {
                const applicationsResponse = await axios.get(`${api_location}api/applications/count/company/${companyProfile.id}`, {
                  withCredentials: true
                });
                console.log('Fetched applications count:', applicationsResponse.data);
                statsData = { totalApplicationsReceived: applicationsResponse.data };
              }
            } catch (appCountError) {
              console.error('Failed to fetch applications count:', appCountError);
            }
          }
        }
        
        // Get jobs posted count
        let jobsPosted = 0;
        try {
          const jobsResponse = await axios.get(`${api_location}api/jobs/count/company/${user.userId}`, {
            withCredentials: true
          });
          console.log('Fetched jobs count:', jobsResponse.data);
          jobsPosted = jobsResponse.data;
        } catch (jobsError) {
          console.log('Failed to fetch jobs count, using local data');
          // Count jobs from the jobOffers context as fallback
          jobsPosted = jobOffers.filter(job => 
            job.companyId?.id === companyProfile?.id || 
            job.userId?.id === user.userId
          ).length;
        }
        
        // Calculate the most popular job based on applications
        let mostPopularJob = null;
        if (jobOffers && jobOffers.length > 0) {
          const jobWithMostApplications = [...jobOffers].sort((a, b) => 
            (b.applications?.length || 0) - (a.applications?.length || 0)
          )[0];
          
          if (jobWithMostApplications && (jobWithMostApplications.applications?.length || 0) > 0) {
            mostPopularJob = {
              title: jobWithMostApplications.title,
              applications: jobWithMostApplications.applications?.length || 0
            };
          }
        }
        
        // Calculate statistics either from fetched data or locally
        const activeJobs = jobOffers.filter(job => job.status === 'Active').length;
        const totalViews = jobOffers.reduce((sum, job) => sum + (job.views || 0), 0);
        const totalApplications = jobOffers.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
        
        setStats({
          totalViews: statsData?.totalViews || totalViews,
          totalApplications: statsData?.totalApplications || totalApplications,
          activeJobs: statsData?.activeJobs || activeJobs,
          totalJobsPosted: statsData?.totalJobsPosted || jobsPosted,
          totalApplicationsReceived: statsData?.totalApplicationsReceived || totalApplications,
          averageApplicationsPerJob: statsData?.averageApplicationsPerJob || 
            (jobsPosted > 0 ? Math.round(totalApplications / jobsPosted) : 0),
          mostPopularJob: statsData?.mostPopularJob || mostPopularJob,
          recentHires: statsData?.recentHires || 0
        });
      } catch (error) {
        console.error("Error fetching company statistics:", error);
        
        // Fallback to local calculations if backend fails
        const activeJobs = jobOffers.filter(job => job.status === 'Active').length;
        const totalViews = jobOffers.reduce((sum, job) => sum + (job.views || 0), 0);
        const totalApplications = jobOffers.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
        
        setStats({
          totalViews,
          totalApplications,
          activeJobs,
          totalJobsPosted: jobOffers.length,
          totalApplicationsReceived: totalApplications,
          averageApplicationsPerJob: jobOffers.length > 0 ? Math.round(totalApplications / jobOffers.length) : 0,
          mostPopularJob: null,
          recentHires: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };
    
    if (user?.userId) {
      fetchCompanyStats();
    }
  }, [user?.userId, companyProfile?.id, jobOffers]);

  // Fetch company profile
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!user || !user.userId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${api_location}api/employer/company/${user.userId}`, {
          withCredentials: true
        });
        console.log('Fetched company profile:', response.data);
        setCompanyProfile(response.data);
        
        // Try to get profile image from user data in response
        if (user && user.profileImage) {
          console.log('Using profile image from user context:', user.profileImage);
          setProfileImageUrl(formatImageUrl(user.profileImage));
        } else {
          // Try to get the user data to find the profile image
          try {
            const userResponse = await axios.get(`${api_location}api/users/${user.userId}`, {
              withCredentials: true
            });
            if (userResponse.data && userResponse.data.profilePicture) {
              console.log('Found profile image in user API response:', userResponse.data.profilePicture);
              setProfileImageUrl(formatImageUrl(userResponse.data.profilePicture));
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }

        // Fetch recent applications for this employer's jobs
        try {
          const applicationsResponse = await axios.get(`${api_location}api/applications/company/${response.data.id}`, {
            withCredentials: true
          });
          if (applicationsResponse.data && Array.isArray(applicationsResponse.data)) {
            // Sort by date, newest first
            const sortedApplications = applicationsResponse.data.sort((a, b) => 
              new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt)
            );
            setRecentApplications(sortedApplications.slice(0, 5));
          }
        } catch (appError) {
          console.error('Error fetching applications:', appError);
        }
        
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
        setImageKey(Date.now()); // Force image refresh
      }
    };

    fetchCompanyProfile();
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

  return (
    <div className="container my-5">
      {/* Company Profile Card */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="section-card">
            <div className="company-profile-header">
              <div className="company-logo-container">
                <img 
                  key={imageKey}
                  src={profileImageUrl ? `${profileImageUrl}?v=${new Date().getTime()}` : companyDefaultImg} 
                  alt="Company Logo" 
                  className="company-logo"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    console.log('Failed image URL:', e.target.src);
                    e.target.src = companyDefaultImg;
                  }}
                />
              </div>
              <div className="company-info">
                <h3>{companyProfile?.companyName || user.name}</h3>
                <Link to="/profile" className="btn btn-sm btn-outline-primary">
                  <i className="fas fa-edit"></i> Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Statistics Cards */}
      <h4 className="section-title mb-3">
        <i className="fas fa-chart-bar"></i> Company Statistics
      </h4>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <i className="fas fa-eye"></i>
            <h3>{statsLoading ? <span className="loading-dots">...</span> : stats.totalViews}</h3>
            <p>Total Job Views</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <i className="fas fa-paper-plane"></i>
            <h3>{statsLoading ? <span className="loading-dots">...</span> : stats.totalApplicationsReceived}</h3>
            <p>Applications Received</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <i className="fas fa-briefcase"></i>
            <h3>{statsLoading ? <span className="loading-dots">...</span> : stats.totalJobsPosted}</h3>
            <p>Total Jobs Posted</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <h3>{statsLoading ? <span className="loading-dots">...</span> : stats.activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>
      </div>

      

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="section-card">
            <h4 className="section-title">
              <i className="fas fa-bolt"></i> Quick Actions
            </h4>
            <div className="quick-actions">
              <Link to="/joboffer" className="action-btn">
                <i className="fas fa-plus"></i>
                <span>Post New Job</span>
              </Link>
              <Link to="/applications" className="action-btn">
                <i className="fas fa-users"></i>
                <span>View Applications</span>
              </Link>
              <Link to="/profile" className="action-btn">
                <i className="fas fa-building"></i>
                <span>Edit Company Profile</span>
              </Link>
            </div>
          </div>
        </div>

        
      </div>

      {/* Recent Applications */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="section-card">
            <h4 className="section-title">
              <i className="fas fa-users"></i> Recent Applications
            </h4>
            {recentApplications.length > 0 ? (
              <div className="recent-applications">
                {recentApplications.map((application, index) => (
                  <div key={index} className="application-item">
                    <div className="application-content">
                      <h5>{application.user?.name || 'Applicant'}</h5>
                      <p>Applied for: {application.jobOffer?.title || application.job?.title || 'Job Position'}</p>
                      <p>Applied on: {formatDate(application.appliedAt || application.createdAt)}</p>
                    </div>
                    <Link to={`/applications/view/${application.id}`} className="btn btn-sm btn-outline-primary">
                      View Application
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-applications">
                <p>No recent applications to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-card">
        <h4 className="section-title">
          <i className="fas fa-history"></i> Recent Activity
        </h4>
        <div className="activity-list">
          {jobOffers.slice(0, 3).map(job => (
            <div key={job.id} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="activity-content">
                <h5>{job.title}</h5>
                <p>Posted on {formatDate(job.createdAt)}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerPanel;
