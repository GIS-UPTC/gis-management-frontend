import axios, { AxiosError, AxiosResponse } from 'axios';
import { AUTH_ERROR_MESSAGES } from '@/utils/errorHandler';
import CookieService from './cookieService';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    // Priorizar cookies sobre localStorage para SSR compatibility
    let token = null;
    
    if (typeof window !== 'undefined') {
      // Cliente: intentar cookies primero, luego localStorage
      token = CookieService.getAccessToken() || localStorage.getItem('access_token');
    } else {
      // Servidor: solo cookies están disponibles
      token = CookieService.getAccessToken();
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Api - Interceptor Error -> ", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ detail: string }>) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      
      if (AUTH_ERROR_MESSAGES.includes(detail)) {
        // Limpiar tanto localStorage como cookies
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          CookieService.clearAuthCookies();
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // También actualizar cookies cuando se establece el token
    if (typeof window !== 'undefined') {
      CookieService.setAccessToken(token);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    // También limpiar cookies cuando se remueve el token
    if (typeof window !== 'undefined') {
      CookieService.clearAuthCookies();
    }
  }
};

export default api; 