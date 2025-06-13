import Cookies from 'js-cookie';
import { User } from '@/types/models/GeneralModels';

// Constantes para nombres de cookies
const TOKENS = {
  ACCESS_TOKEN: 'access_token',
  USER_DATA: 'user_data',
} as const;

/**
 * Servicio para manejar cookies de autenticación
 * Funciona tanto en cliente como en servidor
 */
export class CookieService {
  /**
   * Establece el token de acceso en las cookies
   * @param token - Token de acceso
   * @param options - Opciones adicionales para la cookie
   */
  static setAccessToken(token: string, options?: { 
    expires?: number; 
    secure?: boolean; 
    sameSite?: 'strict' | 'lax' | 'none' 
  }): void {
    const defaultOptions = {
      expires: 7, // 7 días por defecto
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      ...options
    };

    Cookies.set(TOKENS.ACCESS_TOKEN, token, defaultOptions);
  }

  /**
   * Obtiene el token de acceso desde las cookies
   * @param cookieHeader - Headers de cookies del servidor (opcional)
   */
  static getAccessToken(cookieHeader?: string): string | null {
    if (typeof window === 'undefined' && cookieHeader) {
      // Entorno servidor
      const cookies = this.parseCookieHeader(cookieHeader);
      return cookies[TOKENS.ACCESS_TOKEN] || null;
    }
    
    // Entorno cliente
    return Cookies.get(TOKENS.ACCESS_TOKEN) || null;
  }

  /**
   * Establece los datos del usuario en las cookies
   * @param user - Datos del usuario
   * @param options - Opciones adicionales para la cookie
   */
  static setUserData(user: User, options?: { 
    expires?: number; 
    secure?: boolean; 
    sameSite?: 'strict' | 'lax' | 'none' 
  }): void {
    const defaultOptions = {
      expires: 7, // 7 días por defecto
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      ...options
    };

    // Convertimos el usuario a JSON y lo guardamos en cookie
    const userData = JSON.stringify(user);
    Cookies.set(TOKENS.USER_DATA, userData, defaultOptions);
  }

  /**
   * Obtiene los datos del usuario desde las cookies
   * @param cookieHeader - Headers de cookies del servidor (opcional)
   */
  static getUserData(cookieHeader?: string): User | null {
    try {
      let userData: string | undefined;

      if (typeof window === 'undefined' && cookieHeader) {
        // Entorno servidor
        const cookies = this.parseCookieHeader(cookieHeader);
        userData = cookies[TOKENS.USER_DATA];
      } else {
        // Entorno cliente
        userData = Cookies.get(TOKENS.USER_DATA);
      }

      if (!userData) return null;

      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error al parsear datos de usuario de cookies:', error);
      return null;
    }
  }

  /**
   * Elimina todas las cookies de autenticación
   */
  static clearAuthCookies(): void {
    Cookies.remove(TOKENS.ACCESS_TOKEN, { path: '/' });
    Cookies.remove(TOKENS.USER_DATA, { path: '/' });
  }

  /**
   * Verifica si el usuario está autenticado
   * @param cookieHeader - Headers de cookies del servidor (opcional)
   */
  static isAuthenticated(cookieHeader?: string): boolean {
    const token = this.getAccessToken(cookieHeader);
    const user = this.getUserData(cookieHeader);
    return !!(token && user);
  }

  /**
   * Parsea el header de cookies del servidor
   * @param cookieHeader - String de cookies del servidor
   */
  private static parseCookieHeader(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      const value = rest.join('=');
      if (name && value) {
        cookies[name.trim()] = decodeURIComponent(value.trim());
      }
    });

    return cookies;
  }

  /**
   * Serializa cookies para uso en el servidor
   * @param name - Nombre de la cookie
   * @param value - Valor de la cookie
   * @param options - Opciones de la cookie
   */
  static serializeCookie(
    name: string, 
    value: string, 
    options: {
      expires?: Date;
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): string {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookie += `; Expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookie += `; Max-Age=${options.maxAge}`;
    }

    if (options.path) {
      cookie += `; Path=${options.path}`;
    }

    if (options.domain) {
      cookie += `; Domain=${options.domain}`;
    }

    if (options.secure) {
      cookie += '; Secure';
    }

    if (options.httpOnly) {
      cookie += '; HttpOnly';
    }

    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite}`;
    }

    return cookie;
  }
}

export default CookieService; 