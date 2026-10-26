import axios from 'axios';

/**
 * Centralized Axios HTTP Client
 *
 * Concepts explained:
 * - Base URL: Automatically prefixes all requests with the Spring Boot server address.
 * - Request Interceptors: Automatically attaches the JWT token from localStorage
 *   to every outgoing request, so the guard remains authenticated without manual headers.
 * - Response Interceptors: Normalizes backend error responses into human-readable strings.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Attach Authorization Bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected network error occurred.';
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    // Return custom enhanced Error object
    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response ? error.response.status : 0;
    enhancedError.data = error.response ? error.response.data : null;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
