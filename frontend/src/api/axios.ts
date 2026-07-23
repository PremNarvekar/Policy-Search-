import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60_000, // 60s — RAG queries can take time
});

// Request interceptor — inject auth token in the future
apiClient.interceptors.request.use(
  (config) => {
    // e.g. const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — extract readable error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    // Pull structured error from backend if available
    const apiMessage = error.response?.data?.error?.message;

    if (apiMessage) {
      // Replace axios generic message with API-provided message
      const enriched = new Error(apiMessage);
      enriched.name = 'ApiError';
      return Promise.reject(enriched);
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      return Promise.reject(
        new Error('Cannot reach the server. Please check your connection and try again.')
      );
    }

    if (error.response?.status === 422) {
      return Promise.reject(new Error('Your request was invalid. Please check your input.'));
    }

    if (error.response?.status === 500) {
      return Promise.reject(
        new Error('The server encountered an error. Please try again in a moment.')
      );
    }

    return Promise.reject(error);
  }
);
