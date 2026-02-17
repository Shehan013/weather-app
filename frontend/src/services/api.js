import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const weatherAPI = {
  getCities: () => api.get('/weather/cities'),
  getCacheStatus: () => api.get('/weather/debug/cache'),
};

export const userAPI = {
  getAllPreferences: () => api.get('/user/preferences'),
  getPreference: (key) => api.get(`/user/preferences/${key}`),
  savePreference: (key, value) => api.post('/user/preferences', { key, value }),
};

export default api;