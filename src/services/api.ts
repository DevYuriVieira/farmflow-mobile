import { AxiosInstance, InternalAxiosRequestConfig, create } from 'axios';
import { ENV } from '../config/env';
import { sessionStorage } from '../storage/session.storage';
import { normalizeError } from './apiError';
import { observabilityService } from './observability/observability.service';

export const apiClient: AxiosInstance = create({
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

    observabilityService.addBreadcrumb('http', `${(config.method || 'GET').toUpperCase()} ${config.url || ''}`);

    return config;
  },
  (error: unknown) => {
    const normalized = normalizeError(error);
    observabilityService.addBreadcrumb('http', `REQUEST_ERROR: ${normalized.message}`, undefined, 'warning');
    return Promise.reject(normalized);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    observabilityService.addBreadcrumb('http', `HTTP ${response.status} ${(response.config.method || 'GET').toUpperCase()} ${response.config.url || ''}`);
    return response;
  },
  (error: unknown) => {
    const normalized = normalizeError(error);
    observabilityService.addBreadcrumb('http', `HTTP ${normalized.status || 'ERROR'} ${normalized.code}: ${normalized.message}`, undefined, 'warning');

    if (normalized.status && normalized.status >= 500) {
      void observabilityService.captureException(normalized, { level: 'error' });
    }

    return Promise.reject(normalized);
  }
);
