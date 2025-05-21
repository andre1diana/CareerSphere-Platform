// src/context/JobOfferContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const JobOfferContext = createContext();

export const JobOfferProvider = ({ children }) => {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/jobs', {
          withCredentials: true
        });
        setJobOffers(response.data);
      } catch (error) {
        console.error('Error fetching job offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  const addJobOffer = (newOffer) => {
    setJobOffers(prev => [...prev, newOffer]);
  };

  return (
    <JobOfferContext.Provider value={{ jobOffers, addJobOffer, loading }}>
      {children}
    </JobOfferContext.Provider>
  );
};

export const useJobOffers = () => useContext(JobOfferContext);
