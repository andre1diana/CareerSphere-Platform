import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import '../styles/jobdetails.css';
import { AuthContext } from '../context/AuthContext';

const api_location = "http://localhost:8080/";

function JobDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${api_location}api/jobs/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 403) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Listings
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error-container">
        <p>Job details not found. Please go back and try again.</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-header">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyId?.companyName || 'Company')}&background=random&size=150`}
          alt={job.companyId?.companyName}
        />

        <div>
          <h2>{job.title}</h2>
          <p><strong>Company:</strong> {job.companyId?.companyName}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Modality:</strong> {job.modality}</p>
        </div>
      </div>

      <div className="job-description">
        <h3>Job Description</h3>
        <div className="description-content">
          {job.description?.split('\n').map((paragraph, index) => (
            paragraph.trim() ? (
              <p key={index} className="description-paragraph">
                {paragraph}
              </p>
            ) : null
          ))}
        </div>

        <h4 className="mt-4">🏢 About the Company</h4>
        <p>{job.companyId?.description || 'No company description available.'}</p>
      </div>

      {user?.role === 'user' && (
        <button 
          className="apply-button" 
          onClick={async () => {
            try {
              const response = await fetch(`${api_location}api/applications/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: user.userId,
                  jobOfferId: parseInt(id)
                })
              });

              if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to apply for the job');
              }

              alert('Successfully applied for the job!');
              navigate('/applications');
            } catch (error) {
              console.error('Error applying for job:', error);
              alert(error.message || 'Failed to apply for the job. Please try again.');
            }
          }}
        >
          Apply Now
        </button>
      )}

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Listings
      </button>
    </div>
  );
}

export default JobDetails;
