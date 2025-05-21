import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/jobs.css';

const api_location = "http://localhost:8080/";

function Jobs() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('title-asc');
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(api_location + 'api/jobs', {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setAllJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching job offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const sortJobs = (jobs, order) => {
    const [key, direction] = order.split('-');
    return [...jobs].sort((a, b) => {
      const aVal = a[key]?.toLowerCase?.() || '';
      const bVal = b[key]?.toLowerCase?.() || '';
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filterJobs = () => {
    const filtered = allJobs.filter(job => {
      return (
        (location ? job.location.toLowerCase().includes(location.toLowerCase()) : true) &&
        (jobType !== 'All' ? job.type === jobType : true) &&
        (category !== 'All' ? job.category === category : true)
      );
    });
    const sorted = sortJobs(filtered, sortOrder);
    setFilteredJobs(sorted);
    setAppliedFilters(true);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setLocation('');
    setJobType('All');
    setCategory('All');
    setSortOrder('title-asc');
    setFilteredJobs(allJobs);
    setAppliedFilters(false);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    setFilteredJobs(prev => sortJobs(prev, order));
  };

  const openJobDetails = (job) => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  // Paginare
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h4>Filters</h4>
        <div className="filter-group">
          <label>Location</label>
          <input type="text" placeholder="Enter city" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Job Type</label>
          <select value={jobType} onChange={e => setJobType(e.target.value)}>
            <option>All</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Remote</option>
            <option>Internship</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>All</option>
            <option>IT</option>
            <option>Marketing</option>
            <option>Finance</option>
            <option>HR</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="company-asc">Company (A-Z)</option>
            <option value="location-asc">Location (A-Z)</option>
          </select>
        </div>
        <div className="filter-buttons">
          <button className="filter-btn" onClick={filterJobs}>Apply Filters</button>
          <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>

      <div className="job-list">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading job offers...</p>
          </div>
        ) : (
          <>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div className="job-card" key={job.id}>
                  <h5>{job.title}</h5>
                  <p>Company: {job.companyId?.companyName || 'Company not specified'}</p>
                  <p>Location: {job.location}</p>
                  <p>Type: {job.type}</p>
                  <button className="apply-btn" onClick={() => openJobDetails(job)}>View Details</button>
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <i className="fas fa-briefcase"></i>
                <p>No jobs found with the applied filters.</p>
              </div>
            )}
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Jobs;
