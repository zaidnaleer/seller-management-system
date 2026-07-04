import axios from 'axios';

// Central place for the API base URL. When we deploy to AWS later,
// this is the ONE line that changes — nothing else in the app needs updating.
const API_BASE_URL = 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Runs before every single outgoing request. If we have a token stored,
// attach it as the Authorization header automatically — so individual
// API calls never need to remember to do this themselves.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Runs after every response. If the backend ever says 401 (token expired
// or invalid), automatically clear the stored token and redirect to login,
// rather than leaving the user stuck with a dead session.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;