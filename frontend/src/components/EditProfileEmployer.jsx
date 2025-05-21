import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfileEmployer = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    createdAt: new Date().toISOString().split('T')[0],
    profileImage: user?.profileImage || '',
    profileImageFile: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Format the date properly if it exists
    const formatDate = (dateStr) => {
      if (!dateStr) return new Date().toISOString().split('T')[0];
      try {
        return new Date(dateStr).toISOString().split('T')[0];
      } catch (e) {
        return new Date().toISOString().split('T')[0];
      }
    };

    setFormData({
      companyName: user?.companyName || '',
      description: user?.description || '',
      website: user?.website || '',
      createdAt: formatDate(user?.createdAt),
      profileImage: user?.profileImage || '',
      profileImageFile: null,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      setFormData(prev => ({ 
        ...prev, 
        profileImage: imageURL,
        profileImageFile: files[0]
      }));
      console.log("Selected image file:", files[0].name);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!user || !user.userId) {
        console.error('No user ID available');
        alert('Please log in again to save your profile');
        setIsSubmitting(false);
        return;
      }

      console.log("Current user:", user);
      console.log("Current user ID:", user.userId);
      
      const profileData = new FormData();
      
      // Convert userId to number to ensure it's treated properly
      const userId = parseInt(user.userId, 10);
      profileData.append('userId', userId);
      profileData.append('companyName', formData.companyName);
      profileData.append('description', formData.description);
      profileData.append('createdAt', formData.createdAt || new Date().toISOString().split('T')[0]);

      // Add profile image if we have it in our state
      if (formData.profileImageFile) {
        console.log("Attaching image file from state:", formData.profileImageFile.name);
        profileData.append('profileImage', formData.profileImageFile);
      } else {
        // Check if there's a selected file in the input element as fallback
        const profileImageInput = document.querySelector('input[name="profileImage"]');
        if (profileImageInput && profileImageInput.files[0]) {
          console.log("Attaching image file from input:", profileImageInput.files[0].name);
          profileData.append('profileImage', profileImageInput.files[0]);
        }
      }

      // Log all form data entries
      for (let pair of profileData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Set timeout for the request
      const response = await axios.post(
        "http://localhost:8080/api/employer/profile",
        profileData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (response.data) {
        console.log('Profile saved successfully:', response.data);
        // Pass the file to the parent component
        onSave({
          ...response.data,
          profileImageFile: formData.profileImageFile
        });
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      setError(error);
      console.error("Error saving profile:", error);
      
      // Log detailed information about the error
      if (error.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
        console.error("Server response data:", error.response.data);
        alert(`Failed to save profile: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert('Server did not respond. Please try again later.');
      } else {
        console.error("Error message:", error.message);
        alert('Failed to save profile: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <h2>Edit Company Profile</h2>
        
        {error && (
          <div className="error-message">
            <p>Error: {error.message}</p>
          </div>
        )}

        <div className="profile-image-upload">
          <label>Company Logo</label>
          <div className="image-upload-container">
            <img 
              src={formData.profileImage || user?.profileImage} 
              alt="Company Logo Preview" 
              className="profile-image-preview"
            />
            <input 
              type="file" 
              name="profileImage" 
              accept="image/*" 
              onChange={handleChange}
              className="image-upload-input"
            />
            <div className="image-upload-overlay">
              <i className="fas fa-camera"></i>
              <span>Change Logo</span>
            </div>
          </div>
        </div>

        <label>Company Name</label>
        <input 
          type="text" 
          name="companyName" 
          value={formData.companyName} 
          onChange={handleChange}
          required 
          placeholder="Enter company name"
        />

        <label>Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          rows="3"
          required 
          placeholder="Enter company description"
        />

        <label>Website</label>
        <input 
          type="url" 
          name="website" 
          value={formData.website} 
          onChange={handleChange}
          placeholder="https://example.com" 
        />

        <label>Founded (Creation Date)</label>
        <input 
          type="date" 
          name="createdAt" 
          value={formData.createdAt} 
          onChange={handleChange}
          required 
        />

        <div className="modal-buttons">
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileEmployer;
