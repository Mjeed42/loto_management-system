import React from 'react';
import Icon from './Icon';

const Footer = ({ showTerms = false }) => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Terms and Privacy - shown on login page */}
        {showTerms && (
          <div className="footer-terms">
            <span>Before using this app, you can review our </span>
            <a 
              href="/privacy-policy"
              className="footer-terms-link"
            >
              privacy policy
            </a>
            <span> and </span>
            <a 
              href="/terms-of-service"
              className="footer-terms-link"
            >
              terms of service
            </a>
            <span>.</span>
          </div>
        )}

        {/* Copyright */}
        <div className="footer-copyright">
          © Pepsico 2025
        </div>
        
        {/* Contact Links */}
        <div className="footer-links">
          {/* Email */}
          <a 
            href="mailto:alrashabdulmajeed@gmail.com"
            className="footer-link footer-link-email"
          >
            <Icon name="mail" size={16} />
            <span>alrashabdulmajeed@gmail.com</span>
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://linkedin.com/in/mjeed01"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link footer-link-linkedin"
          >
            <Icon name="linkedin" size={16} />
            <span>linkedin.com/in/mjeed01</span>
          </a>
        </div>
        
        {/* Powered By */}
        <div className="footer-powered">
          <span className="powered-text">Powered by</span>
          <a 
            href="https://github.com/Mjeed42"
            target="_blank"
            rel="noopener noreferrer"
            className="powered-name"
          >
            <Icon name="github" size={16} />
            <span>Abdulmajeed Alrashidi</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
