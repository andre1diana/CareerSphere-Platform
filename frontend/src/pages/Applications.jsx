import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/applications.css';

const Applications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || user.role === 'guest') {
            navigate('/login');
            return;
        }

        const fetchApplications = async () => {
            try {
                const endpoint = user.role === 'employer' 
                    ? `/api/applications/employer/${user.userId}`
                    : `/api/applications/user/${user.userId}`;

                const response = await axios.get(`http://localhost:8080${endpoint}`, {
                    withCredentials: true
                });
                setApplications(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load applications');
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user, navigate]);

    if (loading) {
        return <div className="loading">Loading applications...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const renderApplicationStatus = (status) => {
        const statusClasses = {
            'pending': 'status-pending',
            'accepted': 'status-accepted',
            'rejected': 'status-rejected',
            'withdrawn': 'status-withdrawn'
        };

        return (
            <span className={`status-badge ${statusClasses[status] || ''}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="applications-container">
            <h2>{user.role === 'employer' ? 'Received Applications' : 'My Applications'}</h2>
            <div className="applications-list">
                {applications.length === 0 ? (
                    <p className="no-applications">No applications found.</p>
                ) : (
                    applications.map(application => (
                        <div key={application.id} className="application-card">
                            {user.role === 'employer' ? (
                                // Employer view
                                <>
                                    <div className="application-header">
                                        <h3>{application.jobOffer.title}</h3>
                                        {renderApplicationStatus(application.status)}
                                    </div>
                                    <div className="application-details">
                                        <p><strong>Applicant:</strong> {application.user.name}</p>
                                        <p><strong>Email:</strong> {application.user.email}</p>
                                        <p><strong>Applied for:</strong> {application.jobOffer.title}</p>
                                        <p><strong>Location:</strong> {application.jobOffer.location}</p>
                                    </div>
                                    <div className="application-actions">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/profile/${application.user.id}`)}
                                        >
                                            View Profile
                                        </button>
                                        {application.status === 'pending' && (
                                            <div className="status-actions">
                                                <button 
                                                    className="btn btn-success"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await axios.put(
                                                                `http://localhost:8080/api/applications/${application.id}/status`,
                                                                { status: 'accepted' },
                                                                { withCredentials: true }
                                                            );
                                                            if (response.status === 200) {
                                                                // Refresh applications
                                                                window.location.reload();
                                                            }
                                                        } catch (error) {
                                                            console.error('Error updating application status:', error);
                                                            alert('Failed to update application status');
                                                        }
                                                    }}
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    className="btn btn-danger"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await axios.put(
                                                                `http://localhost:8080/api/applications/${application.id}/status`,
                                                                { status: 'rejected' },
                                                                { withCredentials: true }
                                                            );
                                                            if (response.status === 200) {
                                                                // Refresh applications
                                                                window.location.reload();
                                                            }
                                                        } catch (error) {
                                                            console.error('Error updating application status:', error);
                                                            alert('Failed to update application status');
                                                        }
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // User view
                                <>
                                    <div className="application-header">
                                        <h3>{application.jobOffer.title}</h3>
                                        {renderApplicationStatus(application.status)}
                                    </div>
                                    <div className="application-details">
                                        <p><strong>Company:</strong> {application.jobOffer.companyId.companyName}</p>
                                        <p><strong>Location:</strong> {application.jobOffer.location}</p>
                                        <p><strong>Type:</strong> {application.jobOffer.type}</p>
                                        <p><strong>Applied on:</strong> {new Date(application.jobOffer.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="application-actions">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/jobs/${application.jobOffer.id}`)}
                                        >
                                            View Job
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Applications;
