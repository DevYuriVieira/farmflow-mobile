import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { sessionStorage } from '../storage/session.storage';
import { normalizeError } from './apiError';

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.apiUrl,
  timeout: ENV.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await sessionStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(normalizeError(error));
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    return Promise.reject(normalizeError(error));
  }
);
