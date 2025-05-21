import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/helppage.css';

const HelpPage = () => {
  return (
    <Container className="mt-5 p-4 rounded shadow-lg bg-white">
      <h1 className="mb-4 text-success text-center">Help Center</h1>
      <p className="text-center">Find answers to common questions and learn how to use CareerSphere</p>

      

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I create an account?</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Click on the "Sign Up" button on the homepage</li>
              <li>Fill out the registration form with your details</li>
              <li>Verify your email address</li>
              <li>Complete your profile to get started</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>How can I apply for a job?</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Browse available jobs in the "Job Listings" section</li>
              <li>Click on a job to view details</li>
              <li>Click the "Apply" button</li>
              <li>Upload your resume and cover letter if required</li>
              <li>Submit your application</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I post a job as an employer?</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Log in to your employer account</li>
              <li>Go to the "Post Job" section</li>
              <li>Fill in the job details and requirements</li>
              <li>Set application deadline and other preferences</li>
              <li>Review and publish your job posting</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>How do I update my profile?</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Log in to your CareerSphere account</li>
              <li>Navigate to the "Profile" section in your dashboard</li>
              <li>Click "Edit Profile" to update personal details, skills, or work experience</li>
              <li>Upload a new profile picture or resume if needed</li>
              <li>Save changes to update your profile</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>What should I do if I forgot my password?</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Click on the "Login" button and select "Forgot Password"</li>
              <li>Enter the email address associated with your account</li>
              <li>Check your inbox for a password reset email</li>
              <li>Click the link in the email and set a new password</li>
              <li>Log in with your new password</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>How can I contact an employer about my application?</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>Go to the "My Applications" section in your dashboard</li>
              <li>Find the job application you want to inquire about</li>
              <li>Click "View Details" to see contact information or messaging options</li>
              <li>Send a polite message to the employer through the platform</li>
              <li>Wait for a response, typically within 3-5 business days</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="contact-section text-center mt-4">
        <h2>Need More Help?</h2>
        <div className="contact-options d-flex justify-content-center">
          <div className="contact-card m-3">
            <i className="fas fa-envelope"></i>
            <h4>Email Support</h4>
            <p>support@careersphere.com</p>
          </div>
          <div className="contact-card m-3">
            <i className="fas fa-comments"></i>
            <h4>Live Chat</h4>
            <p>Available 24/7</p>
          </div>
          <div className="contact-card m-3">
            <i className="fas fa-phone"></i>
            <h4>Phone Support</h4>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HelpPage;