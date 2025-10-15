// API Configuration for LOTO Management System
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://loto-backend-643788243736.europe-west1.run.app';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REFRESH: `${API_BASE_URL}/api/auth/refresh`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  LOGOUT_ALL: `${API_BASE_URL}/api/auth/logout-all`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/api/users`,
  SUPERVISORS: `${API_BASE_URL}/api/users/supervisors`,
  
  // Admin endpoints
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_RESET_PASSWORD: (userId) => `${API_BASE_URL}/api/admin/users/${userId}/reset-password`,
  ADMIN_TOGGLE_STATUS: (userId) => `${API_BASE_URL}/api/admin/users/${userId}/toggle-status`,
  ADMIN_DELETE_USER: (userId) => `${API_BASE_URL}/api/admin/users/${userId}`,
  
  // LOTO endpoints
  LOTOS: `${API_BASE_URL}/api/loto`,
  LOTO_BY_ID: (id) => `${API_BASE_URL}/api/loto/${id}`,
  LOTO_VERIFY: (id) => `${API_BASE_URL}/api/loto/${id}/verify`,
  LOTO_COMPLETE: (id) => `${API_BASE_URL}/api/loto/${id}/complete`,
  LOTO_HANDOVER: (id) => `${API_BASE_URL}/api/loto/${id}/handover`,
  LOTO_ACCEPT_HANDOVER: (id) => `${API_BASE_URL}/api/loto/${id}/accept-handover`,
  LOTO_REJECT_HANDOVER: (id) => `${API_BASE_URL}/api/loto/${id}/reject-handover`,
  LOTO_DELETE: (id) => `${API_BASE_URL}/api/loto/${id}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;


