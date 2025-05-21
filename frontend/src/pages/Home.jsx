import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/Logo3_0.png';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (user && user.role !== 'guest') {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="jumbotron mt-5 text-center home-jumbotron">
      <div>
        <img src={logo} alt="Logo" width="300" height="300" />
      </div>
      <h1 className="display-4">Welcome to CareerSphere</h1>
      <hr className="my-4" />
      <p>
        Join millions of people using CareerSphere to find connections, discover
        opportunities, and be more productive.
      </p>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary btn-lg d-block mx-auto text-center"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
