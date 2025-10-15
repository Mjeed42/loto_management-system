/**
 * Authentication Migration Utility
 * 
 * This utility helps migrate from the old localStorage-based authentication
 * to the new secure cookie-based authentication system.
 * 
 * Run this once on app initialization to clean up old tokens.
 */

export const migrateAuthSystem = () => {
  try {
    // Check if old token exists in localStorage
    const oldToken = localStorage.getItem('token');
    
    if (oldToken) {
      console.log('🔄 Migrating authentication system...');
      
      // Remove old token from localStorage
      localStorage.removeItem('token');
      
      // Clear any other auth-related items
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Clear sessionStorage as well
      sessionStorage.clear();
      
      console.log('✅ Old authentication data cleared');
      console.log('ℹ️  Please login again with the new secure system');
      
      return true; // Migration performed
    }
    
    return false; // No migration needed
  } catch (error) {
    console.error('❌ Error during auth migration:', error);
    return false;
  }
};

/**
 * Check if user needs to re-authenticate
 * This can be called to show a migration notice to users
 */
export const needsReAuthentication = () => {
  const oldToken = localStorage.getItem('token');
  return !!oldToken;
};

/**
 * Clear all authentication data (useful for debugging)
 */
export const clearAllAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear cookies (client-side accessible ones only)
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  
  console.log('🧹 All authentication data cleared');
};

export default {
  migrateAuthSystem,
  needsReAuthentication,
  clearAllAuthData,
};

