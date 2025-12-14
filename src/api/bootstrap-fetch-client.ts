import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const TOKEN_KEY = 'accessToken';

export const setAccessToken = (token: string | null) => {
  if (token) {
    return localStorage.setItem(TOKEN_KEY, token);
  }

  localStorage.removeItem(TOKEN_KEY);
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      setAccessToken(null);
    }

    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
