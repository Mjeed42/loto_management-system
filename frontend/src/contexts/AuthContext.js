import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { migrateAuthSystem } from '../utils/authMigration';

const AuthContext = createContext(null);

// In-memory token storage (not persisted)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Idle timeout tracking (30 minutes)
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());

  // Update last activity time
  const updateActivity = useCallback(() => {
    setLastActivityTime(Date.now());
  }, []);

  // Check for timeouts
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTimeouts = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;
      const timeSinceSessionStart = now - sessionStartTime;

      // Check idle timeout
      if (timeSinceLastActivity > IDLE_TIMEOUT) {
        console.log('Session expired due to inactivity');
        logout('Session expired due to inactivity. Please login again.');
        return;
      }

      // Check absolute timeout
      if (timeSinceSessionStart > ABSOLUTE_TIMEOUT) {
        console.log('Session expired. Maximum session duration reached');
        logout('Session expired. Please login again.');
        return;
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTimeouts);
  }, [isAuthenticated, lastActivityTime, sessionStartTime]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated, updateActivity]);

  // Refresh access token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.REFRESH,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        updateActivity();
        return response.data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }, [updateActivity]);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.ME, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        updateActivity();
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      // Try to refresh token if access token expired
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        const newToken = await refreshToken();
        if (newToken) {
          // Retry fetching user with new token
          try {
            const response = await axios.get(API_ENDPOINTS.ME, {
              headers: { Authorization: `Bearer ${newToken}` },
              withCredentials: true,
            });
            if (response.data.success) {
              setUser(response.data.user);
              setIsAuthenticated(true);
              updateActivity();
              return;
            }
          } catch (retryError) {
            console.error('Retry failed:', retryError);
          }
        }
      }
      
      // If all fails, clear authentication
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken, updateActivity]);

  // Login
  const login = useCallback(async (username, password, rememberMe = false) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        { username, password, rememberMe },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        updateActivity();
        return { success: true, user: response.data.user };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }, [updateActivity]);

  // Logout
  const logout = useCallback(async (message) => {
    try {
      await axios.post(
        API_ENDPOINTS.LOGOUT,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      
      // Show message if provided
      if (message) {
        // You can integrate with toast notifications here
        console.log(message);
      }
    }
  }, []);

  // Logout from all devices
  const logoutAll = useCallback(async () => {
    try {
      const token = getAccessToken();
      await axios.post(
        API_ENDPOINTS.LOGOUT_ALL,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Initialize authentication on mount
  useEffect(() => {
    // Migrate from old auth system if needed
    const migrated = migrateAuthSystem();
    
    // Try to refresh token on mount (in case of page reload)
    const initAuth = async () => {
      if (migrated) {
        // If migration occurred, don't try to refresh (old token was cleared)
        setIsLoading(false);
        return;
      }
      
      const newToken = await refreshToken();
      if (newToken) {
        await fetchCurrentUser();
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    logoutAll,
    refreshToken,
    fetchCurrentUser,
    updateActivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

