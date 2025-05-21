import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© {new Date().getFullYear()} Career Sphere</p>
        <ul className="footer-links">
          <li>
            <a 
              href="https://www.linkedin.com/in/diana-andrei-07a0592b3/?trk=nav_responsive_tab_profile_pic&originalSubdomain=ro" 
              className="footer-link" 
              target="_blank" 
              rel="noopener noreferrer">
              Social Media
            </a>
          </li>
          <li>
            <a href="/contact" className="footer-link">Contact</a>
          </li>
          <li>
            <a href="/help" className="footer-link">Help</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
