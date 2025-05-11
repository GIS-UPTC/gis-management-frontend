import api from '../api';
import { Permission } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';

export class PermissionServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionServiceError';
  }
}

export const permissionService = {
  async searchPermissions(name: string): Promise<Permission[]> {
    try {
      const response = await api.get<Permission[]>(`/permissions/${name}/`);
      return response.data;
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        PermissionServiceError,
        'Error al buscar permisos. Por favor, intente nuevamente.'
      );
    }
  },
  async fetchPermissions(name: string): Promise<Permission[]> {
    try {
      const response = await api.get<Permission[]>(`/permissions/${name}?all=true/`);
      return response.data;
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        PermissionServiceError,
        'Error al obtener permisos. Por favor, intente nuevamente.'
      );
    }
  }
};
