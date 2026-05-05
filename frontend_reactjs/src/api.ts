import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: any) => {
  const response = await api.post('/login', credentials);
  if (response.data.access_token) {
    localStorage.setItem('auth_token', response.data.access_token);
  }
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await api.post('/reset-password', data);
  return response.data;
};

export const verifyEmail = async (url: string) => {
  const response = await axios.get(url, {
    headers: {
      'Accept': 'application/json',
    }
  });
  return response.data;
};

export const logout = async () => {
  await api.post('/logout');
  localStorage.removeItem('auth_token');
};

export const getSecurityLevel = async () => {
  const response = await api.get('/security-level');
  return response.data;
};

export const setSecurityLevel = async (level: 'low' | 'normal') => {
  const response = await api.post('/security-level', { security_level: level });
  return response.data;
};

export const testSqlInjection = async (id: string) => {
  const response = await api.get(`/vulnerable/sql-injection?id=${id}`);
  return response.data;
};

export const testXss = async (name: string) => {
  const response = await api.get(`/vulnerable/xss?name=${name}`);
  return response.data;
};

export default api;
