import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add access token to requests
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Always include credentials for cookies
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Check if it's a token expiration error
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          API_ENDPOINTS.REFRESH,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          const newToken = response.data.accessToken;
          setAccessToken(newToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        processQueue(refreshError, null);
        clearAccessToken();
        
        // Redirect to login page (except for public pages)
        const publicPages = ['/', '/privacy-policy', '/terms-of-service'];
        if (!publicPages.includes(window.location.pathname)) {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other 401 errors (invalid token, no token, etc.)
    if (error.response?.status === 401) {
      clearAccessToken();
      
      // Redirect to login page if not already there (except for public pages)
      const publicPages = ['/', '/privacy-policy', '/terms-of-service'];
      if (!publicPages.includes(window.location.pathname)) {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default axios;

