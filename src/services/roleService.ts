// services/roleService.ts
import { handleApiError, ServiceError } from '@/utils/errorHandler';
import api from './api';
import { Role } from '@/types/models/GeneralModels';

// Error específico para el servicio de roles
export class RoleServiceError extends ServiceError {
  constructor(message: string) {
    super(message, 'RoleServiceError');
  }
}

export const roleService = {

  async fetchRoles(name: string): Promise<Role[]> {
    try {
      const response = await api.get<Role[]>(`/roles/${name}?with_inactives=true&all=true`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error, 
        RoleServiceError, 
        'Error al buscar roles. Por favor, intente nuevamente.'
      );
    }
  },

  async searchRoles(name: string): Promise<Role[]> {
    try {
      const response = await api.get<Role[]>(`/roles/${name}?with_inactives=true`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error, 
        RoleServiceError, 
        'Error al buscar roles. Por favor, intente nuevamente.'
      );
    }
  },

  async createRole(roleData: Omit<Role, 'id'>): Promise<Role> {
    try {
      const formattedData = {
        name: roleData.name,
        is_active: roleData.is_active,
        accesses: roleData.accesses.map(access => ({
          id: access.id,
          name: access.name
        })),
        accesses_ids: roleData.accesses.map(access => access.id)
      };

      const response = await api.post<Role>(`/roles`, formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        RoleServiceError,
        'Error al crear el rol. Por favor, intente nuevamente.'
      );
    }
  },

  async updateRole(id: number, roleData: Omit<Role, 'id'>): Promise<Role> {
    try {
      const formattedData = {
        name: roleData.name,
        is_active: roleData.is_active,
        accesses: roleData.accesses.map(access => ({
          id: access.id,
          name: access.name
        })),
        accesses_ids: roleData.accesses.map(access => access.id)
      };

      const response = await api.put<Role>(`/roles/${id}`, formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        RoleServiceError,
        'Error al actualizar el rol. Por favor, intente nuevamente.'
      );
    }
  },

  async changeIsActiveRole(id: number): Promise<string> {
    try {
      await api.patch(`/roles/${id}`);
      return 'Estado cambiado correctamente';
    } catch (error) {
      console.log(error)
      return handleApiError(
        error,
        RoleServiceError,
        'Error al cambiar el estado. Por favor, intente nuevamente.'
      );
    }
  },
};