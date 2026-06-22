import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Request endpoints
export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getMyRequests: (filters = {}, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    params.append('page', page);
    params.append('limit', limit);
    return api.get(`/requests/my-requests?${params}`);
  },
  getAllRequests: (filters = {}, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    params.append('page', page);
    params.append('limit', limit);
    return api.get(`/requests?${params}`);
  },
  getById: (id) => api.get(`/requests/${id}`),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  changeStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
  getHistory: (id) => api.get(`/requests/${id}/history`),
  getStatistics: () => api.get('/requests/statistics')
};

// Category endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getAll: () => api.get('/users')
};
