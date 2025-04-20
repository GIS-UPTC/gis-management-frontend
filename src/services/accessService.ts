import { handleApiError } from '@/utils/errorHandler';
import api from './api';
import { Access, Role } from '@/types/models/GeneralModels';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail: string;
}

export class AccessServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessServiceError';
  }
}

export const accessService = {
  async searchAccesses(name: string): Promise<Access[]> {
    try {
      const response = await api.get<Role[]>(`/accesses/${name}`);
      console.log(response);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
            sessionStorage.removeItem('access_token');
          }
        throw new AccessServiceError(axiosError.response.data.detail);
      }
      throw new AccessServiceError('Error al buscar accesos. Por favor, intente nuevamente.');
    }
  }
};