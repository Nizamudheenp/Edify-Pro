import axios from 'axios';
import { store } from '../features/app/store';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const { auth } = store.getState();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default api;
