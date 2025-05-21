import React, { useState } from 'react';
import axios from 'axios';

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    title: user.title || '',
    location: user.location || '',
    bio: user.bio || '',
    skills: user.skills?.join(', ') || '',
    profilePictureUrl: user.profilePictureUrl || user.profilePicture || '',
    profileImageFile: null,
    experience: user.experience || [],
    education: user.education || []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePictureUrl' && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      setFormData(prev => ({ 
        ...prev, 
        profilePictureUrl: imageURL,
        profileImageFile: files[0]
      }));
      console.log('Selected new profile image:', files[0].name);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: '',
          company: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          description: ''
        }
      ]
    }));
  };

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institutionName: '',
          degree: '',
          startDate: '',
          endDate: '',
          fieldOfStudy: ''
        }
      ]
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleDeleteExperience = (index) => {
    const updatedExperience = formData.experience.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!user || !user.id) {
        console.error('User ID is missing:', user);
        alert('Error: User ID is missing. Please try logging in again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Starting profile update with user ID:', user.id);

      // Handle profile image upload first if we have a new image
      let updatedProfileImageUrl = formData.profilePictureUrl;
      
      if (formData.profileImageFile) {
        console.log('Uploading new profile image:', formData.profileImageFile.name);
        
        try {
          // Create a FormData object for the profile image upload
          const imageFormData = new FormData();
          imageFormData.append('userId', user.id);
          imageFormData.append('profileImage', formData.profileImageFile);
          
          console.log('Sending image upload request for user ID:', user.id);
          
          // Upload profile image - note the URL format
          const imageResponse = await axios.post(
            "http://localhost:8080/api/users/upload-profile-image",
            imageFormData,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
          );
          
          console.log('Profile image upload response:', imageResponse.data);
          
          // If image upload was successful, use the returned image URL
          if (imageResponse.data && imageResponse.data.profileImageUrl) {
            updatedProfileImageUrl = imageResponse.data.profileImageUrl;
            console.log('Received new profile image URL:', updatedProfileImageUrl);
          }
        } catch (imageError) {
          console.error('Error uploading profile image:', imageError);
          if (imageError.response) {
            console.error('Server response:', imageError.response.status, imageError.response.data);
          }
          // Continue with profile update even if image upload fails
        }
      }

      // Format experience and education data
      const formattedExperience = formData.experience.map(exp => ({
        companyName: exp.company,
        position: exp.role,
        startDate: `${exp.startMonth} ${exp.startYear}`,
        endDate: exp.endMonth && exp.endYear ? `${exp.endMonth} ${exp.endYear}` : 'Present'
      }));

      const formattedEducation = formData.education.map(edu => ({
        institutionName: edu.institutionName || edu.institution,
        degree: edu.degree,
        startDate: edu.startDate || edu.startYear,
        endDate: edu.endDate || edu.endYear || 'Present',
        fieldOfStudy: edu.fieldOfStudy || edu.degree
      }));

      // Create updated user object with all profile fields
      const updatedUser = {
        ...user,
        name: formData.name,
        title: formData.title,
        location: formData.location,
        bio: formData.bio,
        profilePicture: updatedProfileImageUrl, // Use the updated image URL
        profilePictureUrl: updatedProfileImageUrl, // Include both formats for compatibility
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: formattedExperience,
        education: formattedEducation
      };

      console.log('Sending updated user profile with image URL:', updatedProfileImageUrl);
      
      // Send to backend
      const response = await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        updatedUser,
        { withCredentials: true }
      );

      console.log('Profile update response:', response.data);

      if (response.status === 200) {
        // Add the image URL explicitly for the parent component
        response.data.profilePicture = updatedProfileImageUrl;
        response.data.profilePictureUrl = updatedProfileImageUrl;
        
        onSave(response.data);
      }
    } catch (error) {
      setError(error);
      console.error('Error saving profile:', error);
      
      if (error.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response data:", error.response.data);
        alert(`Failed to save profile: ${error.response.status} ${error.response.statusText}`);
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <h2>Edit Profile</h2>
        
        {error && (
          <div className="error-message">
            <p>Error: {error.message}</p>
          </div>
        )}

        <div className="profile-image-upload">
          <div className="image-upload-container">
            <img 
              src={formData.profilePictureUrl || user.profilePictureUrl || user.profilePicture} 
              alt="Profile Preview" 
              className="profile-image-preview"
            />
            <input
              type="file"
              name="profilePictureUrl"
              onChange={handleInputChange}
              className="image-upload-input"
              accept="image/*"
            />
            <div className="image-upload-overlay">
              <i className="fas fa-camera"></i>
              <span>Change Photo</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange}
            placeholder="Your full name"
          />

          <label>Professional Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange}
            placeholder="e.g. Software Engineer"
          />

          <label>Location</label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleInputChange}
            placeholder="e.g. Cluj-Napoca, Romania"
          />

          <label>About Me</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
          />

          <label>Skills (comma-separated)</label>
          <input 
            type="text" 
            name="skills" 
            value={formData.skills} 
            onChange={handleInputChange}
            placeholder="e.g. JavaScript, React, HTML, CSS"
          />
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Experience</h3>
            <button className="add-btn" onClick={handleAddExperience}>
              <i className="fas fa-plus"></i> Add Experience
            </button>
          </div>

          {formData.experience.map((exp, index) => (
            <div key={index} className="experience-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    placeholder="e.g. Tech Solutions"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <div className="date-inputs">
                    <input
                      type="text"
                      value={exp.startMonth}
                      onChange={(e) => handleExperienceChange(index, 'startMonth', e.target.value)}
                      placeholder="Month"
                    />
                    <input
                      type="text"
                      value={exp.startYear}
                      onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
                      placeholder="Year"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <div className="date-inputs">
                    <input
                      type="text"
                      value={exp.endMonth}
                      onChange={(e) => handleExperienceChange(index, 'endMonth', e.target.value)}
                      placeholder="Month"
                    />
                    <input
                      type="text"
                      value={exp.endYear}
                      onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
                      placeholder="Year"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>

              <button 
                className="delete-btn"
                onClick={() => handleDeleteExperience(index)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          ))}
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Education</h3>
            <button className="add-btn" onClick={handleAddEducation}>
              <i className="fas fa-plus"></i> Add Education
            </button>
          </div>

          {formData.education.map((edu, index) => (
            <div key={index} className="education-form">
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institutionName || edu.institution || ''}
                  onChange={(e) => handleEducationChange(index, 'institutionName', e.target.value)}
                  placeholder="e.g. University of Cluj-Napoca"
                />
              </div>

              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor in Computer Science"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Year</label>
                  <input
                    type="text"
                    value={edu.startDate || edu.startYear || ''}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                    placeholder="e.g. 2018"
                  />
                </div>
                <div className="form-group">
                  <label>End Year</label>
                  <input
                    type="text"
                    value={edu.endDate || edu.endYear || ''}
                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                    placeholder="e.g. 2022"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Field of Study</label>
                <input
                  type="text"
                  value={edu.fieldOfStudy || edu.degree || ''}
                  onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>

              <button 
                className="delete-btn"
                onClick={() => handleDeleteEducation(index)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <i className="fas fa-save"></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
