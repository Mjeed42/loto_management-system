import React from 'react';

const ActionButton = ({ 
  variant = 'secondary', 
  onClick, 
  children, 
  icon, 
  disabled = false,
  className = '',
  title = '',
  type = 'button'
}) => {
  // Icon mapping for common actions
  const iconMap = {
    refresh: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    back: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    home: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    save: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    edit: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    delete: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    add: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    check: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    cancel: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    settings: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    users: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    list: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    chart: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    download: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    eye: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    "eye-off": (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    zap: (
      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  const buttonClasses = `action-btn ${variant} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon && iconMap[icon] ? iconMap[icon] : icon}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;
