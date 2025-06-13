import { AxiosError } from 'axios';
import { User } from '@/types/models/GeneralModels';
import { encryptPassword } from '@/utils/encryptPassword';
import CookieService from './cookieService';
import { createApiInstance, setAuthTokenSSR } from './apiSSR';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ErrorResponse {
  detail: string;
}

/**
 * Servicio de autenticación optimizado para SSR
 * Utiliza cookies en lugar de localStorage
 */
export const loginServiceSSR = {
  /**
   * Inicia sesión y almacena el token y usuario en cookies
   * @param credentials - Credenciales de login
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async login(credentials: LoginCredentials, cookieHeader?: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);

    const encryptedPassword = encryptPassword(credentials.password);
    formData.append('password', encryptedPassword);

    try {
      const api = createApiInstance(cookieHeader);
      const response = await api.post('/auth', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, user } = response.data;
      
      // Guardar en cookies en lugar de localStorage
      CookieService.setAccessToken(access_token);
      CookieService.setUserData(user);
      setAuthTokenSSR(access_token);

      return response.data;
    } catch (error) {
      console.log('LoginServiceSSR - error:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        throw new Error(axiosError.response.data.detail);
      }
      console.log('Error en la autenticación');
      throw new Error('Error en la autenticación');
    }
  },

  /**
   * Cierra sesión y elimina las cookies de autenticación
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  async logout(cookieHeader?: string) {
    try {
      const api = createApiInstance(cookieHeader);
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      CookieService.clearAuthCookies();
      setAuthTokenSSR(null);
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  },

  /**
   * Obtiene el token desde las cookies
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  getToken(cookieHeader?: string): string | null {
    return CookieService.getAccessToken(cookieHeader);
  },

  /**
   * Obtiene el usuario desde las cookies
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  getUser(cookieHeader?: string): User | null {
    return CookieService.getUserData(cookieHeader);
  },

  /**
   * Verifica si el usuario está autenticado
   * @param cookieHeader - Header de cookies del servidor (opcional)
   */
  isAuthenticated(cookieHeader?: string): boolean {
    return CookieService.isAuthenticated(cookieHeader);
  }
}; 