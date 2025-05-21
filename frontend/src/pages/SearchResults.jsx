import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/search-results.css';
import avatarImg from '../assets/avatar.jpg';
import companyDefaultImg from '../assets/avatar.jpg';

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], companies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/search/${query}`, {
          withCredentials: true
        });
        setResults(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleProfileClick = (userId, role) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Searching...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!query) {
    return <div className="no-results">Please enter a search query</div>;
  }

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      
      {results.companies.length > 0 && (
        <div className="results-section">
          <h3>Companies</h3>
          <div className="results-grid">
            {results.companies.map((company) => (
              <div 
                key={company.id} 
                className="result-card"
                onClick={() => handleProfileClick(company.userId, 'employer')}
              >
                <div className="result-header">
                  <img 
                    src={company.profilePictureUrl || companyDefaultImg} 
                    alt={company.companyName} 
                    className="result-image"
                  />
                  <div className="result-info">
                    <h4>{company.companyName}</h4>
                    <p className="result-type">Company</p>
                  </div>
                </div>
                {company.description && (
                  <p className="result-description">
                    {company.description.length > 100 
                      ? `${company.description.substring(0, 100)}...` 
                      : company.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.users.length > 0 && (
        <div className="results-section">
          <h3>Users</h3>
          <div className="results-grid">
            {results.users.map((user) => (
              <div 
                key={user.id} 
                className="result-card"
                onClick={() => handleProfileClick(user.id, user.role)}
              >
                <div className="result-header">
                  <img 
                    src={user.profilePictureUrl || avatarImg} 
                    alt={user.name} 
                    className="result-image"
                  />
                  <div className="result-info">
                    <h4>{user.name}</h4>
                    <p className="result-type">
                      {user.role === 'employer' ? 'Company Representative' : 'Professional'}
                    </p>
                    {user.title && <p className="result-title">{user.title}</p>}
                  </div>
                </div>
                {user.bio && (
                  <p className="result-description">
                    {user.bio.length > 100 
                      ? `${user.bio.substring(0, 100)}...` 
                      : user.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.companies.length === 0 && results.users.length === 0 && (
        <div className="no-results">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchResults; 