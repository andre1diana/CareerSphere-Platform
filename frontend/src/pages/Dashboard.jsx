import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import '../styles/dashboard.css';

import AdminPanel from '../components/AdminPanel';
import UserPanel from '../components/UserPanel';
import EmployerPanel from '../components/EmployerPanel';
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

const allPopularCompanies = [
  { name: 'Adobe', logo: '/companies/Adobe Photoshop CC Rounded.png', },
  { name: 'Colégio Brasil', logo: '/companies/CBR Colégio Brasil SP.png', },
  { name: 'Meta (Facebook)', logo: '/companies/Facebook Icon.png', },
  { name: 'Google', logo: '/companies/Google Trends.png',  },
  { name: 'Hulu', logo: '/companies/Hulu Black.png', },
  { name: 'NAF Technologies', logo: '/companies/NAF Technologies.png',  },
  { name: 'Paul Scherrer Institute', logo: '/companies/PSI Paul Scherrer Institute NEw 2024.png', },
  { name: 'SMK Bukit High School', logo: '/companies/Sekolah Menengah Kebangsaan Bukit.png', },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [visibleCompanies, setVisibleCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allShown, setAllShown] = useState(false);
  const [currentDateTime] = useState(new Date().getTime());
  const observer = useRef();

  const BATCH_SIZE = 3;

  const loadMoreCompanies = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const next = allPopularCompanies.slice(visibleCompanies.length, visibleCompanies.length + BATCH_SIZE);
      setVisibleCompanies((prev) => [...prev, ...next]);
      setIsLoading(false);
      if (visibleCompanies.length + BATCH_SIZE >= allPopularCompanies.length) {
        setAllShown(true);
      }
    }, 800); // simulate loading delay
  }, [visibleCompanies]);

  useEffect(() => {
    loadMoreCompanies();
  }, [loadMoreCompanies]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !allShown) {
          loadMoreCompanies();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.querySelector('#scroll-sentinel');
    if (sentinel) observer.current.observe(sentinel);
    return () => observer.current?.disconnect();
  }, [loadMoreCompanies, isLoading, allShown]);


  return (
    <div className="dashboard-fullscreen">
      <div className="dashboard-wallpaper">
        <div className="panel-user p-4 rounded shadow text-black bg-light">
          <h2 className="mb-2">Welcome back, {user.name || 'Utilizator'}!</h2>
          <p className="mb-1">{}</p>
        </div>
      </div>

      <div className="container mt-4">
      <h4 className="mt-5 mb-3">Most Popular Companies This Week</h4>
      <div className="popular-companies-slider d-flex overflow-auto gap-3 pb-3">
        {allPopularCompanies.map((company, index) => (
          <div
            key={index}
            className="card"
            style={{
              minWidth: '220px',
              backgroundColor: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              margin : '0 10px',
            }}
          >
            <img
              src={company.logo}
              alt={company.name}
              className="card-img-top"
              style={{
                height: '140px',
                objectFit: 'contain',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              }}
              onError={(e) => {
                console.log('Failed to load company logo:', e.target.src);
                e.target.src = companyDefaultImg;
              }}
            />
            <div className="card-body text-center">
              <h6 className="card-title mb-0">{company.name}</h6>
            </div>
          </div>
        ))}
      </div>
        {user.role === 'admin' && <AdminPanel />}
        {user.role === 'user' && <UserPanel />}
        {user.role === 'employer' && <EmployerPanel />}
      </div>
    </div>
  );
};

export default Dashboard;
