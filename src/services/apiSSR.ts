import axios, { AxiosError, AxiosResponse } from 'axios';
import { AUTH_ERROR_MESSAGES } from '@/utils/errorHandler';
import CookieService from './cookieService';

/**
 * Configuración de API para Server Side Rendering
 * Esta versión funciona tanto en cliente como en servidor usando cookies
 */

// Función para crear instancia de API que funcione en SSR
export const createApiInstance = (cookieHeader?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para agregar el token de autenticación
  api.interceptors.request.use(
    (config) => {
      const token = CookieService.getAccessToken(cookieHeader);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log("ApiSSR - Interceptor Error -> ", error);
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
          // En el servidor no podemos limpiar cookies directamente
          if (typeof window !== 'undefined') {
            CookieService.clearAuthCookies();
            window.location.href = '/login';
          }
        }
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};

// Función para establecer el token de autenticación en cookies
export const setAuthTokenSSR = (token: string | null) => {
  if (token) {
    CookieService.setAccessToken(token);
  } else {
    CookieService.clearAuthCookies();
  }
};

// Instancia por defecto para uso en cliente
const apiSSR = createApiInstance();

export default apiSSR; 