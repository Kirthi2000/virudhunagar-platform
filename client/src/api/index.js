import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiBase = rawApiUrl
  ? `${rawApiUrl.replace(/\/+$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: normalizedApiBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

export const projectAPI = {
  getAll:   (params) => api.get('/projects', { params }),
  getOne:   (id)     => api.get(`/projects/${id}`),
  create:   (data)   => api.post('/projects', data),
  rate:     (id, stars) => api.post(`/projects/${id}/rate`, { stars }),
  comment:  (id, text)  => api.post(`/projects/${id}/comment`, { text }),
  bookmark: (id)        => api.post(`/projects/${id}/bookmark`),
};

export const datasetAPI = {
  getAll:   (params) => api.get('/datasets', { params }),
  create:   (data)   => api.post('/datasets', data),
  download: (id)     => api.get(`/datasets/${id}/download`),
};

export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getOne: (id)     => api.get(`/events/${id}`),
  create: (data)   => api.post('/events', data),
  delete: (id)     => api.delete(`/events/${id}`),
};

export const leaderboardAPI = {
  get: (type) => api.get('/leaderboard', { params: { type } }),
};

export default api;
