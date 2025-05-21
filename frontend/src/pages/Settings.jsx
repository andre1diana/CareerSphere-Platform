import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/settings.css';

const api_location = "http://localhost:8080/";

function Settings() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    feedback: ''
  });

  // Fetch current user data
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const updateEmail = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setMessage({ text: 'Please enter an email address', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${api_location}api/users/${user.userId}/email`, 
        { email: formData.email },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        setMessage({ text: 'Email updated successfully!', type: 'success' });
        updateUser({ ...user, email: formData.email });
      }
    } catch (error) {
      console.error('Error updating email:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update email. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!formData.currentPassword) {
      setMessage({ text: 'Please enter your current password', type: 'error' });
      return;
    }
    
    if (!formData.newPassword) {
      setMessage({ text: 'Please enter a new password', type: 'error' });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put(
        `${api_location}api/users/${user.userId}/password`, 
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        setMessage({ text: 'Password updated successfully!', type: 'success' });
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update password. Please check your current password.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    
    if (!formData.feedback) {
      setMessage({ text: 'Please enter your feedback', type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${api_location}api/feedback`, 
        {
          userId: user.userId,
          message: formData.feedback
        },
        { withCredentials: true }
      );
      
      if (response.status === 200 || response.status === 201) {
        setMessage({ text: 'Feedback submitted successfully!', type: 'success' });
        setFormData(prev => ({ ...prev, feedback: '' }));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to submit feedback. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      <section className="settings-section">
        <h4>Account & Security</h4>
        <form onSubmit={updateEmail}>
          <div className="settings-item">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <input 
                type="email" 
                id="email"
                name="email"
                placeholder="your@email.com" 
                value={formData.email}
                onChange={handleChange}
              />
              <button 
                type="submit" 
                className="save-btn" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update Email'}
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={updatePassword}>
          <div className="settings-item">
            <label htmlFor="currentPassword">Current Password</label>
            <input 
              type="password" 
              id="currentPassword"
              name="currentPassword"
              placeholder="••••••••" 
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div className="settings-item">
            <label htmlFor="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword"
              name="newPassword"
              placeholder="••••••••" 
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="settings-item">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="settings-action">
            <button 
              type="submit" 
              className="save-btn" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

        <div className="settings-item">
          <label htmlFor="twoFactorEnabled">Two-Factor Authentication</label>
          <select 
            id="twoFactorEnabled"
            name="twoFactorEnabled"
            value={formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            onChange={(e) => setFormData({...formData, twoFactorEnabled: e.target.value === 'Enabled'})}
            disabled={true} // Currently disabled as not implemented
          >
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
          <small className="text-muted">This feature is coming soon!</small>
        </div>
      </section>

      <section className="settings-section">
        <h4>Feedback & Support</h4>
        <form onSubmit={submitFeedback}>
          <div className="settings-item">
            <label htmlFor="feedback">Message</label>
            <textarea 
              id="feedback"
              name="feedback"
              rows="4" 
              placeholder="Let us know what you think..." 
              value={formData.feedback}
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="save-btn" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Settings;
