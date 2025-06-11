import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
