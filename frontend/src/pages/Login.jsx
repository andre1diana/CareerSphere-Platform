import React, { useContext, useState } from 'react';
import '../styles/login.css';
import { AuthContext } from '../context/AuthContext';

const api_location = "http://localhost:8080/";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    await fetch("http://localhost:8080/authenticate/clear-cookie", {
      method: "POST",
      credentials: "include"
    });
  
    fetch(api_location + 'authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 403) {
            throw new Error('Your account has been deactivated by the administrator. Please contact support for assistance.');
          }
          throw new Error(errorText || 'Invalid credentials');
        }
        return fetch(api_location + 'current-user', {
          method: 'GET',
          credentials: 'include',
        });
      })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorMessage) => {
            throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((userData) => {
        console.log('Received user data from server:', userData);
        if (!userData.userId) {
          console.error('No user ID in response:', userData);
          throw new Error('Invalid user data received from server');
        }
        login(userData);
        window.location.href = '/dashboard';
      })
      .catch(error => {
        console.error('Login failed:', error.message);
        setError(error.message);
      });
  };
  
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="card-body">
          <h2 className="text-center">Login</h2>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6c757d'
                  }}
                >
                  <img
                    src={showPassword ? "/eye-empty.svg" : "/eye-password-hide.svg"}
                    alt="Toggle password visibility"
                  />

                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>

        </div>
        <p className="mt-3 text-center">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
      </div>

    </div>
  );
}

export default Login;
