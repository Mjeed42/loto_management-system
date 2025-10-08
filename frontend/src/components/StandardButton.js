import React from 'react';

const StandardButton = ({ 
  variant = 'secondary', 
  size = 'md',
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
    )
  };

  // Size classes
  const sizeClasses = {
    sm: 'cf-btn-sm',
    md: '',
    lg: 'cf-btn-lg'
  };

  // Variant classes for standard buttons
  const variantClasses = {
    primary: 'cf-btn-primary',
    secondary: 'cf-btn-secondary', 
    success: 'cf-btn-success',
    danger: 'cf-btn-danger',
    warning: 'cf-btn-warning',
    info: 'cf-btn-info',
    outline: 'cf-btn-outline-secondary'
  };

  const buttonClasses = `cf-btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();

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

export default StandardButton;
