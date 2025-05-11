import api from '../api';
import { Access, Role } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';

export class AccessServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessServiceError';
  }
}

export const accessService = {
  async searchAccesses(name: string): Promise<Access[]> {
    try {
      const response = await api.get<Role[]>(`/accesses/${name}/`);
      return response.data;
    } catch (error) {
      console.log(error);
      return handleApiError(
        error,
        AccessServiceError,
        'Error al buscar accesos. Por favor, intente nuevamente.'
      );
    }
  },

  async fetchAccesses(name: string): Promise<Access[]> {
    try {
      const response = await api.get<Role[]>(`/accesses/${name}?all=true/`);
      return response.data;
    } catch (error) {
      console.log(error);
      return handleApiError(
        error,
        AccessServiceError,
        'Error al obtener accesos. Por favor, intente nuevamente.'
      );
    }
  }
};