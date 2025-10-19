import React from 'react';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      padding: '2rem 1rem',
      marginTop: 'auto',
      borderTop: '1px solid #374151'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Copyright */}
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#d1d5db'
        }}>
          © Pepsico 2025
        </div>
        
        {/* Contact Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Email */}
          <a 
            href="mailto:alrashabdulmajeed@gmail.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#f9fafb',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.3s ease',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#3b82f6';
              e.target.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#f9fafb';
              e.target.style.borderColor = 'transparent';
            }}
          >
            <Icon name="mail" size={16} />
            <span>alrashabdulmajeed@gmail.com</span>
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://linkedin.com/in/mjeed01"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#f9fafb',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.3s ease',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#0077b5';
              e.target.style.borderColor = '#0077b5';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#f9fafb';
              e.target.style.borderColor = 'transparent';
            }}
          >
            <Icon name="linkedin" size={16} />
            <span>linkedin.com/in/mjeed01</span>
          </a>
        </div>
        
        {/* Additional Info */}
        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          LOTO Management System - Safety First
        </div>
      </div>
    </footer>
  );
};

export default Footer;
