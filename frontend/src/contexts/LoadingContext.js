import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage('Loading...');
  };

  const LoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div className="global-loading-overlay">
        <div className="loading-content">
          <img 
            src="../components/PEP_logo.png"
            alt="PepsiCo Logo"
            className="loading-logo"
          />
          <div className="loading-spinner"></div>
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <LoadingOverlay />
    </LoadingContext.Provider>
  );
};












