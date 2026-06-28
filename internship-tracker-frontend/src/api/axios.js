import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// REQUEST interceptor — runs before every single request leaves the browser
// Reads the token from localStorage and attaches it as a header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // must return config or the request never sends
});

// RESPONSE interceptor — runs on every response before it reaches your component
// If the server returns 401, clear the token and send the user back to login
api.interceptors.response.use(
  (response) => response, // successful response - just pass it through
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // hard redirect, clears all React state
    }
    return Promise.reject(error); // re-throw so catch blocks still work
  }
);

export default api;