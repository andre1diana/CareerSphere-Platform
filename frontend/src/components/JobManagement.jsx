import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const api_location = "http://localhost:8080/";

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/jobs', {
        withCredentials: true
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/jobs/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to delete this job.');
      } else {
        alert('Error deleting job. Please try again.');
      }
    }
  };

  const viewJobDetails = (id) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="container mt-5">
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>
                <button 
                  className="btn btn-info btn-sm mr-2" 
                  style={{width:'100px'}} 
                  onClick={() => viewJobDetails(job.id)}
                >
                  View
                </button>

                <button 
                  className="btn btn-danger btn-sm" 
                  style={{width:'100px'}} 
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobManagement;
