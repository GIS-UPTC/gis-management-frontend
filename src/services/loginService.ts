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

    // Encriptar la contraseña antes de enviarla
    const encryptedPassword = encryptPassword(credentials.password);
    formData.append('password', encryptedPassword);

    console.log(formData);

    try {
      console.log("Iniciando solicitud de login");
      const response = await api.post('/auth', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(response.data);

      const { access_token, user } = response.data;
      
      // Guardar token y usuario en sessionStorage
      setAuthToken(access_token);
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('user', JSON.stringify(user));

      console.log("Usuario autenticado:", user);

      return response.data;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        console.log(axiosError.response.data.detail);
        throw new Error(axiosError.response.data.detail);
      }
      console.log('Error en la autenticación');
      throw new Error('Error en la autenticación');
    }
  },

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  },

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  },

  getUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error al parsear usuario del sessionStorage:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
};