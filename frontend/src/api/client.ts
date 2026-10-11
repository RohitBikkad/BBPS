import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bbps_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Do not clear if on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('bbps_token');
        localStorage.removeItem('bbps_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
