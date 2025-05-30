import api from './api';
import { setAuthToken } from './api';
import { AxiosError } from 'axios';
import { User } from '@/types/models/GeneralModels';
import { encryptPassword } from '@/utils/encryptPassword';

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

export const loginService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);

    const encryptedPassword = encryptPassword(credentials.password);
    formData.append('password', encryptedPassword);

    try {
      const response = await api.post('/auth', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, user } = response.data;
      
      setAuthToken(access_token);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));


      return response.data;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        throw new Error(axiosError.response.data.detail);
      }
      console.log('Error en la autenticación');
      throw new Error('Error en la autenticación');
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error al parsear usuario del localStorage:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
};