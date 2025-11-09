import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('artist');
      window.location.href = '/artist/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Artists API
export const artistsAPI = {
  getProfile: (username) => api.get(`/api/artists/${username}`),
  checkExists: (username) => api.get(`/api/artists/${username}/exists`),
};

// Requests API
export const requestsAPI = {
  create: (data) => api.post('/api/requests', data),
  getByArtist: (username, status = 'pending') =>
    api.get(`/api/requests/${username}?status_filter=${status}`),
  update: (requestId, data) => api.put(`/api/requests/${requestId}`, data),
  delete: (requestId) => api.delete(`/api/requests/${requestId}`),
  reorder: (reorderData) => api.put('/api/requests/reorder', reorderData),
};

// Spotify API
export const spotifyAPI = {
  searchTracks: (query, limit = 20) =>
    api.get(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`),
  getTrack: (trackId) => api.get(`/api/spotify/track/${trackId}`),
};

export default api;