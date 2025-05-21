import React from 'react';
import '../styles/signup.css'; // asigură-te că ai acest fișier pentru styling

function Signup() {
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!name || !email || !password || !role) {
      alert('All fields are required!');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role,
    };

    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert('Signup failed: ' + errorText);
        return;
      }

      alert('Account created successfully!');
      window.location.href = '/login';
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card card">
        <div className="card-body">
          <h2 className="text-center mb-4">Create Account</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group mb-3">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="role">Select Role</label>
              <select className="form-control" id="role" required>
                <option value="">-- Choose a role --</option>
                <option value="USER">User</option>
                <option value="EMPLOYER">Employer</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <a href="/login">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
