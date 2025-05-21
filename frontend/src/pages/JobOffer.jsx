import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "../styles/joboffer.css";

const JobOffer = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    modality: 'On-site',
    salary: '',
    description: '',
  });

  useEffect(() => {
    if (user.role !== 'employer') {
      navigate('/dashboard');
      return;
    }

    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/employer/company/${user.userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch company");
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error("Company fetch error:", err);
        alert("Failed to load company information. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    if (user.userId) {
      fetchCompany();
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!company) {
      alert("Company information is missing. Please complete your company profile first.");
      return;
    }

    if (!user.userId) {
      alert("User information is missing. Please log in again.");
      return;
    }

    // Create the job offer object matching the backend model
    const jobOffer = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      type: formData.type,
      modality: formData.modality,
      salary: formData.salary,
      postedBy: user.name,
      companyId: {
        id: company.id
      }
    };
  
    try {
      console.log('Submitting job offer:', jobOffer);
      const response = await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jobOffer),
      });
  
      if (response.ok) {
        const savedJob = await response.json();
        console.log('Job offer saved:', savedJob);
        alert("Job offer posted successfully!");
        navigate("/dashboard");
      } else {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(errorData || "Failed to post job offer");
      }
    } catch (err) {
      console.error("Failed to post job offer:", err);
      alert(err.message || "Failed to post job offer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading company information...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Create a New Job Offer</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={company?.companyName || ''} 
                    disabled 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Bucharest, Romania"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Job Type</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Work Modality</label>
                  <select className="form-select" name="modality" value={formData.modality} onChange={handleChange}>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Salary (optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="salary" 
                    value={formData.salary} 
                    onChange={handleChange} 
                    placeholder="e.g. 7000 RON/month or Negotiable" 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Job Description</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="4" 
                    required 
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Publish Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOffer;
